import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

export const runtime = "nodejs";

const MAX_BYTES = 100 * 1024 * 1024; // 100 MB

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
  });
  return _client;
}

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

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_") || "upload";
  const key = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
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

  const base = cfg.publicBase.replace(/\/+$/, "");
  const url = `${base}/${key}`;
  return NextResponse.json({ url, contentType: file.type, size: file.size });
}
