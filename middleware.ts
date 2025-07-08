// middleware.ts

import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  const isAuthenticated = !!session?.user;

  // সুরক্ষিত পেজগুলোর তালিকা
  const protectedPaths = ["/dashboard", "/builder", "/start-building"];
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // ব্যবহারকারী যদি সুরক্ষিত পেজে যাওয়ার চেষ্টা করে কিন্তু লগইন করা না থাকে
  if (isProtectedPath && !isAuthenticated) {
    const signInUrl = new URL("/api/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // যদি ব্যবহারকারী লগইন পেজে যাওয়ার চেষ্টা করে কিন্তু সে অলরেডি লগইন করা থাকে
  if (pathname.startsWith("/api/auth/signin") && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

// middleware টি প্রায় সব রুটে চলবে যাতে আমরা সঠিক সিদ্ধান্ত নিতে পারি
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
