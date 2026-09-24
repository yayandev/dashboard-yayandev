import { NextResponse } from "next/server";

const LOGIN_PATH = "/auth/login";

export function proxy(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname, search } = request.nextUrl;
  const isAuthPage = pathname.startsWith("/auth");

  // belum login dan membuka halaman dashboard
  if (!token && !isAuthPage) {
    const url = new URL(LOGIN_PATH, request.url);
    if (pathname !== "/") url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  // sudah login tapi membuka halaman login lagi
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // semua halaman kecuali asset statis & file internal Next.js
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)"],
};
