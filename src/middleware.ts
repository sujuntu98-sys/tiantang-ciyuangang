import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

// 需要登录才能访问的路由
const protectedRoutes = ["/post/create", "/settings"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 检查是否为受保护路由
  const isProtected = protectedRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );

  if (isProtected) {
    const session = await auth();
    if (!session?.user) {
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
