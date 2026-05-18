import { NextResponse } from "next/server";

export function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const pathname = request.nextUrl.pathname;

  // kalau belum login dan akses homepage
  if (!token && pathname === "/") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  // kalau sudah login tapi buka login lagi
  if (token && pathname === "/auth/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/auth/login"],
};
