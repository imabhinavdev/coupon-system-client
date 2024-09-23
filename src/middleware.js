import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request) {
  const token = request.cookies?.get("token")?.value;
  let decodedToken = null;

  if (token) {
    decodedToken = jwt.decode(token);
    decodedToken = decodedToken?.user;
    console.log("Decoded Token:", decodedToken);
  }

  const path = request.nextUrl.pathname;

  if (path.startsWith("/admin")) {
    if (!token || !decodedToken || !decodedToken.is_admin) {
      return NextResponse.redirect(new URL("/user/orders", request.url));
    }
    return NextResponse.next();
  }

  if (path.startsWith("/staff")) {
    if (!token || !decodedToken || !decodedToken.is_staff) {
      return NextResponse.redirect(new URL("/user/orders", request.url));
    }
    return NextResponse.next();
  }

  if (path.startsWith("/user")) {
    if (
      token &&
      decodedToken &&
      !decodedToken.is_staff &&
      !decodedToken.is_admin
    ) {
      return NextResponse.next();
    } else if (decodedToken?.is_admin) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else if (decodedToken?.is_staff) {
      return NextResponse.redirect(new URL("/staff/dashboard", request.url));
    }
  }

  if (path.startsWith("/auth")) {
    if (!token) {
      return NextResponse.next();
    } else {
      return NextResponse.redirect(new URL("/user/orders", request.url));
    }
  }

  return NextResponse.redirect(new URL("/auth/login", request.url));
}

export const config = {
  matcher: ["/admin/:path*", "/staff/:path*", "/user/:path*", "/auth/:path*"],
};
