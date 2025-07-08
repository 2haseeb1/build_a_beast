// auth.ts

import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  // ✅ callbacks যোগ করুন
  callbacks: {
    // এই callback টি সেশনে ব্যবহারকারীর আইডি যোগ করার জন্য
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub; // token.sub হলো ব্যবহারকারীর আইডি
      }
      return session;
    },
    // এই callback টি নিশ্চিত করে যে JWT টোকেনে আইডি থাকবে
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
});
