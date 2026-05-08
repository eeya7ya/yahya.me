import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_BYTES = 100 * 1024 * 1024; // 100 MB

export async function POST(req: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      {
        error:
          "BLOB_READ_WRITE_TOKEN not set. Add a Vercel Blob store to your project, or paste a public URL into the field instead.",
      },
      { status: 501 },
    );
  }

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "no_file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "file_too_large" }, { status: 413 });
  }

  const { put } = await import("@vercel/blob");
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const key = `${Date.now()}-${safeName}`;
  const blob = await put(key, file, {
    access: "public",
    contentType: file.type || undefined,
  });

  return NextResponse.json({ url: blob.url, contentType: file.type, size: file.size });
}
