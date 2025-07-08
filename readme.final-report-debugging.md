চমৎকার! **অভিনন্দন! আপনি সফলভাবে এই জটিল সমস্যাটি সমাধান করেছেন!**

আপনার শেয়ার করা আউটপুটটি নিখুঁত এবং এটি প্রমাণ করে যে আপনার অ্যাপ্লিকেশন এখন ঠিক যেমনটি আমরা চেয়েছিলাম, সেভাবেই কাজ করছে।

চলুন, "Step-back Prompting" ব্যবহার করে এই সফল আউটপুটের গল্পটি শেষবারের মতো বিশ্লেষণ করি।

---

### ধাপ ১ (Step-back): আপনার টার্মিনাল আউটপুট এখন কীসের গল্প বলছে?

আসুন, আপনার টার্মিনালের লগটিকে একটি সফলতার কাহিনী হিসেবে পড়ি:

1.  **`GET /`**: আপনি হোমপেজে (`http://localhost:3000`) প্রবেশ করেছেন।
2.  **`GET /start-building 307`**: আপনি "Start Your Build" লিঙ্কে ক্লিক করেছেন। `307` স্ট্যাটাস কোডটি একটি **Temporary Redirect** বা অস্থায়ী রিডাইরেকশন। এর মানে হলো, আপনার `middleware` সফলভাবে ধরে ফেলেছে যে আপনি `/start-building`-এ যাওয়ার চেষ্টা করছেন কিন্তু লগইন করা নেই। তাই সে আপনাকে লগইন পেজে পাঠিয়ে দিয়েছে। **(প্রথম ধাপ সফল!)**
    *   *(এখানে আপনি GitHub দিয়ে লগইন করার ধাপগুলো সম্পন্ন করেছেন, যা টার্মিনালে দেখানো হয়নি কারণ সেগুলো ব্রাউজার এবং GitHub-এর মধ্যে ঘটেছে)*
3.  **`GET /builder/cmcur9w6i0001ucq8zavq47va 200`**: **এটাই মূল সফলতা!**
    *   লগইন করার পর, `next-auth` আপনাকে কথা মতো `/start-building` পেজে ফেরত পাঠিয়েছে।
    *   এইবার `middleware` দেখেছে যে আপনার সেশন আছে, তাই সে আপনাকে আটকায়নি।
    *   `/start-building` পেজটি চলেছে, `await auth()` ব্যবহার করে আপনার সেশন পেয়েছে, ডাটাবেসে আপনার জন্য একটি নতুন বিল্ড তৈরি করেছে (যার আইডি হলো `cmcur9w6i0001ucq8zavq47va`) এবং সবশেষে আপনাকে সেই নতুন বিল্ডের পেজে (`/builder/[buildId]`) **সফলভাবে রিডাইরেক্ট করেছে**।
    *   `200` স্ট্যাটাস কোড মানে হলো বিল্ডার পেজটি সফলভাবে লোড হয়েছে।

**আপনার রিডাইরেক্ট লুপটি সম্পূর্ণভাবে ভেঙে গেছে!** আপনার অ্যাপ্লিকেশন এখন একটি শক্তিশালী এবং নির্ভরযোগ্য আর্কিটেকচারের উপর দাঁড়িয়ে আছে।

---

### ধাপ ২: কেন এইবারের সমাধানটি কাজ করল?

এইবারের সমাধানটি কাজ করার মূল কারণ হলো আমরা দায়িত্বের সঠিক বন্টন করেছি এবং `next-auth`-এর ক্ষমতাকে পুরোপুরি ব্যবহার করেছি:
*   **`callbacks` in `auth.ts`:** এটি নিশ্চিত করেছে যে আপনার সেশন অবজেক্টে সবসময় ব্যবহারকারীর আইডি (`user.id`) থাকবে, যা পেজের ভেতরে ব্যবহার করার জন্য খুবই জরুরি।
*   **শক্তিশালী `middleware.ts`:** আপনার `middleware` এখন একটি বুদ্ধিমান গেটকিপার। সে সেশন কুকি সেট হওয়া পর্যন্ত অপেক্ষা করার মতো জটিলতায় না গিয়ে, প্রতিটি অনুরোধের সময় সেশন চেক করে এবং পেজ রেন্ডার হওয়ার আগেই সঠিক সিদ্ধান্ত নেয়।
*   **সরল `start-building` পেজ:** এই পেজটির উপর থেকে নিরাপত্তা নিশ্চিত করার দায়িত্ব সরিয়ে নেওয়ায়, এটি এখন শুধুমাত্র তার মূল কাজ (বিল্ড তৈরি করা) করতে পারছে, যা কোডকে পরিষ্কার এবং নির্ভরযোগ্য করেছে।

---

### ধাপ ৩: সম্পূর্ণ এবং কার্যকরী কোডের চূড়ান্ত সংগ্রহ

আপনার প্রজেক্ট এখন সম্পূর্ণ কার্যকরী। ভবিষ্যৎ রেফারেন্সের জন্য, নিচে সেই মূল ফাইলগুলোর চূড়ান্ত এবং সঠিক কোডগুলো আবার দেওয়া হলো যা এই সফলতা এনে দিয়েছে।

#### `auth.ts` (চূড়ান্ত সংস্করণ)
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

#### `middleware.ts` (চূড়ান্ত নির্ভরযোগ্য সংস্করণ)
```ts
// middleware.ts

import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  const isAuthenticated = !!session?.user;

  // সুরক্ষিত পেজগুলোর তালিকা
  const protectedPaths = ['/dashboard', '/builder', '/start-building'];
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // ব্যবহারকারী যদি সুরক্ষিত পেজে যাওয়ার চেষ্টা করে কিন্তু লগইন করা না থাকে
  if (isProtectedPath && !isAuthenticated) {
    const signInUrl = new URL('/api/auth/signin', request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  // যদি ব্যবহারকারী লগইন পেজে যাওয়ার চেষ্টা করে কিন্তু সে অলরেডি লগইন করা থাকে
  if (pathname.startsWith('/api/auth/signin') && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// middleware টি প্রায় সব রুটে চলবে যাতে আমরা সঠিক সিদ্ধান্ত নিতে পারি
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

#### `app/start-building/page.tsx` (চূড়ান্ত সরল সংস্করণ)
```tsx
// app/start-building/page.tsx

import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export default async function StartBuildingPage() {
  const session = await auth();

  // middleware দ্বারা সুরক্ষিত, তবুও একটি অতিরিক্ত নিরাপত্তা চেক
  if (!session?.user?.id) {
    console.error('Error: User session not found in a protected route. Redirecting to home.');
    return redirect('/');
  }

  // সরাসরি বিল্ড তৈরি করুন
  const build = await prisma.build.create({
    data: {
      userId: session.user.id,
      name: 'My New PC Build', // ডিফল্ট নাম
    },
  });

  // বিল্ডার পেজে রিডাইরেক্ট করুন
  return redirect(`/builder/${build.id}`);
}
```

আপনি একটি অত্যন্ত জটিল এবং শিক্ষণীয় ডিবাগিং প্রক্রিয়া সফলভাবে সম্পন্ন করেছেন। এই অভিজ্ঞতা আপনাকে ভবিষ্যতে আরও বড় এবং জটিল সমস্যা সমাধানে সাহায্য করবে। **Happy Coding!**