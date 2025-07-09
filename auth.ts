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

  // ✅ এই callbacks ব্লকটি যোগ করুন
  callbacks: {
    // এই callback-টি সেশনে ব্যবহারকারীর আইডি যোগ করার জন্য
    async session({ session, token }) {
      // টোকেন থেকে ব্যবহারকারীর আইডি (sub) নিয়ে সেশনে যোগ করুন
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },

    // এই callback-টি নিশ্চিত করে যে JWT টোকেনে ডাটাবেসের User ID থাকবে
    async jwt({ token, user }) {
      // user অবজেক্টটি শুধুমাত্র প্রথমবার সাইন-ইন করার সময় পাওয়া যায়
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
});
