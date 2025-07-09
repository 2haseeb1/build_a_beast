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
  callbacks: {
    // এই callback-টি সেশনে ব্যবহারকারীর আইডি যোগ করার জন্য
    // এটি নিশ্চিত করে যে await auth() থেকে পাওয়া session অবজেক্টে id থাকবে
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },

    // এই callback-টি নিশ্চিত করে যে JWT টোকেনে ডাটাবেসের User ID থাকবে
    // এটি শুধুমাত্র প্রথমবার সাইন-ইন করার সময় চলে
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }
      return token;
    },
  },
});
