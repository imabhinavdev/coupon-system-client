import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export function middleware(request) {
  const token = request.cookies?.get("token")?.value;
  let decodedToken = null;
  let role = null;

  if (token) {
    decodedToken = jwt.decode(token);
    role = decodedToken.role;
  }

  const path = request.nextUrl.pathname;

  if (path.startsWith("/admin")) {
    if (!token || !decodedToken || !(role === "admin")) {
      return NextResponse.redirect(new URL("/user/orders", request.url));
    }
    return NextResponse.next();
  }

  if (path.startsWith("/staff")) {
    if (!token || !decodedToken || !role === "staff") {
      return NextResponse.redirect(new URL("/user/orders", request.url));
    }
    return NextResponse.next();
  }

  if (path.startsWith("/user")) {;
    console.log(!(role === "admin"));
    if (token && decodedToken && !(role === "staff") && !(role === "admin")) {
      return NextResponse.next();
    } else if (role === "admin") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    } else if (role === "staff") {
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
