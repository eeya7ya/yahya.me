import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const runtime = "nodejs";

const MAX_BYTES = 500 * 1024 * 1024; // 500 MB

function r2Config() {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;
  const publicBase = process.env.R2_PUBLIC_URL;
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicBase) {
    return null;
  }
  return { accountId, accessKeyId, secretAccessKey, bucket, publicBase };
}

let _client: S3Client | null = null;
function getClient(cfg: NonNullable<ReturnType<typeof r2Config>>) {
  if (_client) return _client;
  _client = new S3Client({
    region: "auto",
    endpoint: `https://${cfg.accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: cfg.accessKeyId,
      secretAccessKey: cfg.secretAccessKey,
    },
    // R2 does not implement the new default flexible-checksum flow; the SDK
    // would otherwise sign x-amz-sdk-checksum-algorithm into the URL and the
    // browser PUT would fail integrity validation.
    requestChecksumCalculation: "WHEN_REQUIRED",
    responseChecksumValidation: "WHEN_REQUIRED",
  });
  return _client;
}

function buildKey(name: string) {
  const safeName = name.replace(/[^a-zA-Z0-9._-]/g, "_") || "upload";
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
}

function publicUrl(cfg: NonNullable<ReturnType<typeof r2Config>>, key: string) {
  const base = cfg.publicBase.replace(/\/+$/, "");
  return `${base}/${key}`;
}

// GET /api/admin/upload?name=foo.png&type=image/png&size=12345
// Returns a presigned PUT URL so the browser uploads directly to R2,
// bypassing the Vercel serverless 4.5MB request-body limit.
export async function GET(req: Request) {
  const cfg = r2Config();
  if (!cfg) {
    return NextResponse.json(
      {
        error:
          "Cloudflare R2 not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL.",
      },
      { status: 501 },
    );
  }

  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name") || "upload";
  const type = searchParams.get("type") || "application/octet-stream";
  const sizeStr = searchParams.get("size");
  const size = sizeStr ? Number(sizeStr) : NaN;

  if (Number.isFinite(size) && size > MAX_BYTES) {
    return NextResponse.json({ error: "file_too_large" }, { status: 413 });
  }

  const key = buildKey(name);

  let uploadUrl: string;
  try {
    uploadUrl = await getSignedUrl(
      getClient(cfg),
      new PutObjectCommand({
        Bucket: cfg.bucket,
        Key: key,
        ContentType: type,
      }),
      { expiresIn: 600 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: `presign_failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 502 },
    );
  }

  return NextResponse.json({
    uploadUrl,
    url: publicUrl(cfg, key),
    key,
    contentType: type,
    headers: { "Content-Type": type },
  });
}

// Legacy: POST multipart/form-data. Kept for small files / fallback,
// but the client now prefers presigned uploads to avoid the platform body limit.
export async function POST(req: Request) {
  const cfg = r2Config();
  if (!cfg) {
    return NextResponse.json(
      {
        error:
          "Cloudflare R2 not configured. Set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_BUCKET, R2_PUBLIC_URL.",
      },
      { status: 501 },
    );
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch (err) {
    return NextResponse.json({ error: `bad_form: ${err instanceof Error ? err.message : String(err)}` }, { status: 400 });
  }
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "no_file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "file_too_large" }, { status: 413 });
  }

  const key = buildKey(file.name);
  const buf = Buffer.from(await file.arrayBuffer());

  try {
    await getClient(cfg).send(
      new PutObjectCommand({
        Bucket: cfg.bucket,
        Key: key,
        Body: buf,
        ContentType: file.type || "application/octet-stream",
        ContentLength: buf.byteLength,
      }),
    );
  } catch (err) {
    return NextResponse.json(
      { error: `r2_put_failed: ${err instanceof Error ? err.message : String(err)}` },
      { status: 502 },
    );
  }

  return NextResponse.json({ url: publicUrl(cfg, key), contentType: file.type, size: file.size });
}
