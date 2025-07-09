// middleware.ts

import { auth } from '@/auth';

// ✅ next/server থেকে আর কিছুর প্রয়োজন নেই, কারণ আমরা middleware থেকেই সব করছি না।
export const middleware = auth;

// ✅ config.matcher এখন শুধুমাত্র সেই পেজগুলোকে ম্যাচ করবে যা সত্যিই সুরক্ষিত থাকা দরকার।
// start-building পেজটি নিজেই নিজের অথেনটিকেশন হ্যান্ডেল করবে।
export const config = {
  matcher: ['/dashboard/:path*', '/builder/:path*'],
};