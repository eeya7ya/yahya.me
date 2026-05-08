import { S3Client } from "@aws-sdk/client-s3";

export type R2Config = {
  client: S3Client;
  bucket: string;
  publicBase: string;
};

export function getR2(): R2Config | null {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;
  const bucket = process.env.R2_BUCKET;
  const publicBase = (process.env.R2_PUBLIC_URL || "").replace(/\/$/, "");
  if (!accountId || !accessKeyId || !secretAccessKey || !bucket || !publicBase) return null;

  const client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
  return { client, bucket, publicBase };
}

export function safeExt(filename: string): string {
  const m = /\.([a-z0-9]{1,6})$/i.exec(filename);
  return m ? `.${m[1].toLowerCase()}` : "";
}

export function makeKey(prefix: string, filename: string): string {
  const ext = safeExt(filename);
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}/${ts}-${rand}${ext}`;
}
