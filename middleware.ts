// middleware.ts

import { auth } from "@/auth";

export const middleware = auth;

export const config = {
  // middleware এখন শুধুমাত্র এই দুটি পেজকে সুরক্ষিত করবে
  matcher: ["/dashboard/:path*", "/builder/:path*"],
};
