import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const protectedRoutes = ["/post/create", "/settings"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isProtected) {
    const sessionToken =
      request.cookies.get("__Secure-authjs.session-token")?.value ||
      request.cookies.get("authjs.session-token")?.value;

    if (!sessionToken) {
      const loginUrl = new URL("/auth/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/post/create", "/settings"],
};
