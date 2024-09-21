import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies?.get("token");
  const path = request.nextUrl.pathname;
  if (path.startsWith("/user") && token) {
    return NextResponse.next();
  }
  if (path.startsWith("/auth") && !token) {
    return NextResponse.next();
  }

  if (path.startsWith("/auth") && token) {
    return NextResponse.redirect(new URL("/user/orders", request.url));
  }

  return NextResponse.redirect(new URL("/auth/login", request.url));
}

export const config = {
  matcher: ["/user/:path*", "/auth/:path*"],
};
