// auth.ts

import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// --- ডিবাগিং লগ শুরু ---
// এই লগগুলো Vercel ফাংশনের ভেতরে সার্ভারে চলবে
console.log("--- [auth.ts] NextAuth চালু হচ্ছে ---");
console.log(
  "Client ID খোঁজা হচ্ছে (process.env.AUTH_GITHUB_ID):",
  process.env.AUTH_GITHUB_ID
);
// !! ব্যবহার করে আমরা গোপন কোড প্রিন্ট না করে শুধু তার অস্তিত্ব পরীক্ষা করছি
console.log(
  "Client Secret কি আছে (process.env.AUTH_GITHUB_SECRET)?:",
  !!process.env.AUTH_GITHUB_SECRET
);
console.log("--- [auth.ts] ডিবাগিং লগ শেষ ---");
// --- ডিবাগিং লগ শেষ ---

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }
      return token;
    },
  },
});
