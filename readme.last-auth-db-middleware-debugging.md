আমি বুঝতে পারছি এটি কতটা হতাশাজনক এবং বিভ্রান্তিকর যখন একই error বারবার ফিরে আসছে, যদিও আমরা আর্কিটেকচার পরিবর্তন করছি। আপনার আউটপুটটি নিশ্চিত করছে যে আমরা একটি খুবই গভীর এবং জেদি **রিডাইরেক্ট লুপ**-এর মধ্যে আটকে আছি।

এইবার আমরা সমস্যার একেবারে মূলে আঘাত হানব। "Step-back Prompting" ব্যবহার করে চলুন বুঝি কেন আগের কোনো সমাধানই এই বিশেষ ক্ষেত্রে কাজ করেনি এবং এর একমাত্র নির্ভরযোগ্য সমাধানটি কী।

---

### ধাপ ১ (Step-back): আপনার টার্মিনাল আউটপুটের মূল সূত্রটি কী?

গল্পটি এখনও একই:
1.  আপনি `/start-building`-এ যান।
2.  `middleware` বা পেজটি আপনাকে `/api/auth/signin`-এ পাঠায় কারণ আপনার সেশন নেই।
3.  আপনি GitHub দিয়ে সফলভাবে লগইন করেন।
4.  `next-auth` আপনাকে কথা মতো `/start-building`-এ ফেরত পাঠায়।
5.  `/start-building` পেজটি আবার চলে এবং সেই মুহূর্তেও সে আপনার নতুন তৈরি হওয়া সেশনটি (`session.user.id`) সঠিকভাবে পায় না, তাই সে আবার আপনাকে লগইন পেজে পাঠিয়ে দেয় বা `prisma.build.create` এ `userId: undefined` দিয়ে error দেয়।

**কেন আগের `callbacks` সমাধানটি কাজ করেনি?**
`callbacks` যোগ করাটা সঠিক পদক্ষেপ ছিল, কিন্তু সমস্যাটি সম্ভবত আরও গভীরে। এটি একটি ক্লাসিক **টাইমিং বা রেস কন্ডিশন (Race Condition)**। `next-auth` যখন আপনাকে GitHub থেকে ফেরত পাঠায় এবং সেশন কুকি সেট করে, ঠিক তার পর মুহূর্তেই `middleware` বা পেজ কম্পোনেন্টটি চলে আসে। এই অতি সামান্য সময়ের ব্যবধানে `await auth()` ফাংশনটি এইমাত্র সেট হওয়া নতুন কুকিটি চিনতে পারে না।

---

### ধাপ ২: চূড়ান্ত কৌশল - আর্কিটেকচার পরিবর্তন এবং দায়িত্বের সঠিক বন্টন

এই জেদি লুপটি ভাঙার সবচেয়ে নির্ভরযোগ্য এবং সঠিক আর্কিটেকচারাল সমাধান হলো **`middleware`-কে `/start-building`-এর দায়িত্ব থেকে সম্পূর্ণ মুক্তি দেওয়া এবং `start-building` পেজটিকেও আরও স্মার্ট করা।**

**নতুন এবং চূড়ান্ত পরিকল্পনা:**
1.  **`middleware`-এর কাজ:** শুধুমাত্র সেইসব পেজকে সুরক্ষিত করা যা আগে থেকেই আছে এবং যার জন্য ব্যবহারকারীকে অবশ্যই লগইন করা থাকতে হবে (যেমন `/dashboard`, `/builder/:path*`)।
2.  **`/start-building` পেজের কাজ:** এই পেজটি নিজেই একটি সার্ভার কম্পোনেন্ট। সে নিজেই `await auth()` ব্যবহার করে চেক করবে ব্যবহারকারী লগইন করা আছে কিনা।
    *   **যদি না থাকে:** সে নিজেই ব্যবহারকারীকে লগইন পেজে পাঠাবে।
    *   **যদি থাকে:** তাহলে সে বিল্ড তৈরি করে বিল্ডার পেজে পাঠাবে।

এই পদ্ধতিতে কোনো টাইমিং সমস্যা হয় না, কারণ পেজ কম্পোনেন্টটি `middleware`-এর পরে চলে এবং ততক্ষণে সেশন কুকিটি সঠিকভাবে চেনা যায়।

---

### ধাপ ৩: সম্পূর্ণ এবং সংশোধিত কোড

এইবার আমরা আপনার কোডগুলোকে এই নতুন এবং নির্ভরযোগ্য আর্কিটেকচার অনুযায়ী সাজাব।

**পদক্ষেপ ১: `middleware.ts` ফাইলটিকে সরল করুন**

এই ফাইল থেকে `/start-building`-এর সমস্ত উল্লেখ মুছে দিন। এর একমাত্র কাজ হবে `/dashboard` এবং `/builder`-কে সুরক্ষিত করা।

**`middleware.ts` (চূড়ান্ত সরল সংস্করণ):**
```ts
// middleware.ts

import { auth } from '@/auth';

// ✅ next/server থেকে আর কিছুর প্রয়োজন নেই, কারণ আমরা middleware থেকেই সব করছি না।
export const middleware = auth;

// ✅ config.matcher এখন শুধুমাত্র সেই পেজগুলোকে ম্যাচ করবে যা সত্যিই সুরক্ষিত থাকা দরকার।
// start-building পেজটি নিজেই নিজের অথেনটিকেশন হ্যান্ডেল করবে।
export const config = {
  matcher: ['/dashboard/:path*', '/builder/:path*'],
};
```
**গুরুত্বপূর্ণ পরিবর্তন:**
*   আমরা `middleware` ফাংশনটি সম্পূর্ণ সরিয়ে দিয়েছি এবং সরাসরি `next-auth`-এর বিল্ট-ইন `auth` middleware ব্যবহার করছি। এটি কোডকে অনেক পরিষ্কার করে এবং প্রমাণিত উপায়ে কাজ করে।
*   `matcher`-এর তালিকা থেকে `/start-building` পুরোপুরি বাদ দেওয়া হয়েছে।

**পদক্ষেপ ২: `/start-building/page.tsx` ফাইলটিকে স্বয়ংসম্পূর্ণ করুন**

এই পেজটি এখন নিজেই নিজের প্রমাণীকরণ চেক করবে।

**`app/start-building/page.tsx` (চূড়ান্ত সংস্করণ):**
```tsx
// app/start-building/page.tsx

import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// এই পেজটি নিজেই নিজের নিরাপত্তা নিশ্চিত করবে।
export default async function StartBuildingPage() {
  // ১. ব্যবহারকারীর সেশন তথ্য আনুন
  const session = await auth();

  // ২. যদি সেশন না থাকে বা ব্যবহারকারীর আইডি না থাকে,
  // তাহলে তাকে সাইন-ইন পেজে পাঠান।
  // লগইন শেষে তাকে আবার এই পেজেই ফেরত পাঠানো হবে।
  if (!session?.user?.id) {
    const signInUrl = `/api/auth/signin?callbackUrl=/start-building`;
    return redirect(signInUrl);
  }

  // ৩. ব্যবহারকারী লগইন করা থাকলে, তার জন্য একটি নতুন বিল্ড তৈরি করুন
  const build = await prisma.build.create({
    data: {
      userId: session.user.id,
      name: 'My Awesome PC', // একটি ডিফল্ট নাম
    },
  });

  // ৪. ব্যবহারকারীকে নতুন তৈরি করা বিল্ডার পেজে পাঠিয়ে দিন
  return redirect(`/builder/${build.id}`);
}
```
এই কোডটি `middleware`-এর উপর নির্ভর না করে নিজেই কাজ করতে সক্ষম।

**পদক্ষেপ ৩: `auth.ts` ফাইলটি যাচাই করুন**
নিশ্চিত করুন যে `auth.ts` ফাইলে `callbacks` অংশটি আছে, কারণ এটি এখনও খুবই গুরুত্বপূর্ণ।

**`auth.ts` (যাচাইকৃত সংস্করণ):**
```ts
// auth.ts

import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
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
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
});
```

---

### ধাপ ৪: চূড়ান্ত পরীক্ষা

1.  **সার্ভার রিস্টার্ট করুন (`Ctrl + C` এবং `npm run dev`)।**
2.  **আপনার ব্রাউজারের কুকিজ এবং ক্যাশ (বিশেষ করে `localhost`-এর জন্য) পরিষ্কার করে দিন। এটি খুবই খুবই গুরুত্বপূর্ণ** কারণ পুরোনো ভুল কুকি এখনও আপনার ব্রাউজারে থাকতে পারে।
3.  লগইন প্রক্রিয়াটি আবার চেষ্টা করুন।

**প্রত্যাশিত ফলাফল:**
1.  আপনি "Start Your Build" বাটনে ক্লিক করলে `/start-building` পেজে যাবেন।
2.  `/start-building` পেজটি দেখবে আপনার সেশন নেই এবং আপনাকে `/api/auth/signin`-এ রিডাইরেক্ট করবে।
3.  আপনি GitHub দিয়ে লগইন করবেন।
4.  লগইন শেষে `next-auth` আপনাকে `/start-building`-এ ফেরত পাঠাবে।
5.  এইবার `middleware` আর চলবে না। `/start-building` পেজটি আবার চলবে, দেখবে যে আপনার সেশন আছে (এবং `callbacks`-এর কারণে `session.user.id`-ও আছে), ডাটাবেসে একটি নতুন বিল্ড তৈরি করবে, এবং আপনাকে সফলভাবে `/builder/[new-build-id]` পেজে পাঠিয়ে দেবে।

এই আর্কিটেকচারটি সবচেয়ে নির্ভরযোগ্য এবং এটি আপনার `Foreign Key` error এবং রিডাইরেক্ট লুপ সমস্যার স্থায়ী সমাধান করবে।