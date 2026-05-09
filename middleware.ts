import { NextResponse, type NextRequest } from "next/server";
import { verifySessionToken, COOKIE } from "@/lib/auth";

export const config = {
  matcher: [
    // Run on every route except Next internals and asset extensions.
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico|gif|woff2?)$).*)",
  ],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Forward the pathname so server components (root layout) can derive the locale.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);

  const isAdminRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/api/admin");

  if (!isAdminRoute) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  // /admin/login is public
  if (pathname === "/admin/login" || pathname === "/api/admin/login") {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  const token = req.cookies.get(COOKIE)?.value;
  if (await verifySessionToken(token)) {
    return NextResponse.next({ request: { headers: requestHeaders } });
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}
