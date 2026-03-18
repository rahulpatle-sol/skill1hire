import { NextResponse } from "next/server";

const PUBLIC = ["/", "/login", "/register", "/jobs", "/forgot-password"];

export function middleware(req) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("accessToken")?.value;
  const isPublic = PUBLIC.some(p => pathname === p || pathname.startsWith("/jobs/") || pathname.startsWith("/forgot-password"));
  if (isPublic) return NextResponse.next();
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"] };
