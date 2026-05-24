import { NextResponse } from "next/server";

export const runtime = "nodejs";

// Streams a remote PDF back through the same origin so the browser can fetch
// its bytes without CORS headers on the R2 bucket. Used for client-side
// first-page thumbnail rendering (PDF.js) on both the public site and admin.
// Locked to the configured R2 public host(s); those files are already public.

function isAllowedHost(host: string): boolean {
  const publicBase = process.env.R2_PUBLIC_URL;
  if (publicBase) {
    try {
      const allowed = new URL(publicBase).host;
      if (host === allowed) return true;
    } catch {
      // ignore malformed env
    }
  }
  // also accept any *.r2.dev / *.r2.cloudflarestorage.com used by R2 public urls
  return /\.r2\.dev$/i.test(host) || /\.r2\.cloudflarestorage\.com$/i.test(host);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("url");
  if (!target) return NextResponse.json({ error: "missing_url" }, { status: 400 });

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return NextResponse.json({ error: "bad_url" }, { status: 400 });
  }
  if (parsed.protocol !== "https:") {
    return NextResponse.json({ error: "https_required" }, { status: 400 });
  }
  if (!isAllowedHost(parsed.host)) {
    return NextResponse.json({ error: "host_not_allowed" }, { status: 403 });
  }

  // Forward the browser's Range header so PDF.js can fetch only the bytes it
  // needs for the first page instead of downloading the whole file.
  const range = req.headers.get("range");

  let upstream: Response;
  try {
    upstream = await fetch(parsed.toString(), {
      headers: range ? { Range: range } : undefined,
    });
  } catch (err) {
    return NextResponse.json({ error: `fetch_failed: ${err instanceof Error ? err.message : String(err)}` }, { status: 502 });
  }
  if (!upstream.ok || !upstream.body) {
    return NextResponse.json({ error: `upstream_${upstream.status}` }, { status: 502 });
  }

  const headers: Record<string, string> = {
    "Content-Type": upstream.headers.get("content-type") ?? "application/pdf",
    // Allow the browser/CDN to cache the proxied PDF so repeat thumbnail
    // renders don't re-download the same bytes.
    "Cache-Control": "public, max-age=86400, immutable",
    "Accept-Ranges": upstream.headers.get("accept-ranges") ?? "bytes",
  };
  // Pass through range metadata so PDF.js sees a real 206 partial response.
  for (const h of ["content-range", "content-length", "etag"]) {
    const v = upstream.headers.get(h);
    if (v) headers[h] = v;
  }

  return new Response(upstream.body, { status: upstream.status, headers });
}
