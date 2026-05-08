import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { getR2, makeKey } from "@/lib/r2";

export const runtime = "nodejs";

const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]);
const MAX_BYTES = 10 * 1024 * 1024; // 10 MB

export async function POST(req: Request) {
  const r2 = getR2();
  if (!r2) {
    return NextResponse.json({ error: "r2_not_configured" }, { status: 500 });
  }

  const body = await req.json().catch(() => ({}));
  const contentType = String(body.contentType || "").toLowerCase();
  const filename = String(body.filename || "upload");
  const size = Number(body.size);

  if (!ALLOWED.has(contentType)) {
    return NextResponse.json({ error: "unsupported_type" }, { status: 400 });
  }
  if (Number.isFinite(size) && size > MAX_BYTES) {
    return NextResponse.json({ error: "too_large" }, { status: 400 });
  }

  const key = makeKey("photos", filename);
  const cmd = new PutObjectCommand({
    Bucket: r2.bucket,
    Key: key,
    ContentType: contentType,
  });
  const uploadUrl = await getSignedUrl(r2.client, cmd, { expiresIn: 60 * 5 });
  const publicUrl = `${r2.publicBase}/${key}`;

  return NextResponse.json({ uploadUrl, publicUrl, key });
}
