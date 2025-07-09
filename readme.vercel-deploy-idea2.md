now tell me what should be build command for vercel here is my package json code {
  "name": "build_a_beast",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate",
    "db:seed": "tsx prisma/seed.ts",
    "db:prod:seed": "npx prisma db seed",
    "seed": "tsx prisma/seed.ts"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "@auth/prisma-adapter": "^2.10.0",
    "geist": "^1.4.2",
    "lucide-react": "^0.525.0",
    "next": "^14.2.3",
    "next-auth": "^5.0.0-beta.29",
    "react": "^18",
    "react-dom": "^18",
    "tsx": "^4.20.3"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.4.19",
    "eslint": "^8",
    "eslint-config-next": "^14.2.3",
    "postcss": "^8",
    "prisma": "^6.11.1",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
চমৎকার প্রশ্ন! আপনার `package.json` ফাইলটি দেখে Vercel-এর জন্য সঠিক বিল্ড কমান্ডটি নির্ণয় করা খুবই সহজ।

চলুন, "Step-back Prompting" ব্যবহার করে সেরা উপায়টি খুঁজে বের করি।

---

### ধাপ ১ (Step-back): Vercel ডিফল্টভাবে কী করে?

যখন আপনি Vercel-এ একটি Next.js প্রজেক্ট ডিফল্ট করেন, তখন সে নিজে থেকেই কিছু কাজ করে:
1.  সে সনাক্ত করে যে এটি একটি Next.js প্রজেক্ট।
2.  সে আপনার `package.json` ফাইলের `"build"` স্ক্রিপ্টটি খুঁজে বের করে এবং সেটি চালায়।

আপনার `package.json`-এ `"build"` স্ক্রিপ্টটি হলো:
```json
"scripts": {
  "build": "next build"
}
```
এর মানে হলো, Vercel ডিফল্টভাবে শুধুমাত্র `next build` কমান্ডটি চালাবে।

---

### ধাপ ২: `next build` কি যথেষ্ট? Prisma-র কী হবে?

`next build` কমান্ডটি শুধুমাত্র আপনার Next.js অ্যাপ্লিকেশনকে বিল্ড করে। কিন্তু এটি আপনার ডাটাবেসের স্কিমা (schema) আপডেট করে না। আপনার `postinstall` স্ক্রিপ্টে `prisma generate` আছে, যা `npm install`-এর পর Prisma Client তৈরি করবে, কিন্তু এটি ডাটাবেসে টেবিল তৈরি বা পরিবর্তন করবে না।

**সমস্যা:** যদি আপনি ভবিষ্যতে আপনার `schema.prisma` ফাইলে কোনো পরিবর্তন আনেন (যেমন একটি নতুন কলাম যোগ করেন), তাহলে শুধুমাত্র `next build` চালালে আপনার লাইভ অ্যাপ্লিকেশনটি নতুন কোডের সাথে চলবে, কিন্তু আপনার Neon ডাটাবেসটি পুরোনো স্ট্রাকচারেই থেকে যাবে। এর ফলে error দেখা দেবে।

---

### ধাপ ৩: সমাধান - একটি শক্তিশালী এবং নির্ভরযোগ্য বিল্ড কমান্ড তৈরি করা

এই সমস্যার সমাধান হলো Vercel-কে এমন একটি বিল্ড কমান্ড দেওয়া যা দুটি কাজই করবে:
1.  **ডাটাবেস মাইগ্রেশন:** প্রথমে ডাটাবেসকে সর্বশেষ স্কিমার সাথে সিঙ্ক (sync) করবে।
2.  **অ্যাপ্লিকেশন বিল্ড:** এরপর Next.js অ্যাপ্লিকেশনটিকে বিল্ড করবে।

এই কাজটি করার জন্য আমরা আপনার `package.json` ফাইলে একটি নতুন স্ক্রিপ্ট যোগ করব এবং Vercel-কে সেই স্ক্রিপ্টটি ব্যবহার করতে বলব।

---

### ধাপ ৪: সম্পূর্ণ প্রক্রিয়া এবং কোড

**পদক্ষেপ ১: `package.json` ফাইলটি আপডেট করুন**

আপনার `package.json` ফাইলের `scripts` সেকশনে `vercel-build` নামে একটি নতুন স্ক্রিপ্ট যোগ করুন।

**`package.json` (সংশোধিত):**
```json
{
  "name": "build_a_beast",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "vercel-build": "prisma generate && prisma migrate deploy && next build",
    "start": "next start",
    "lint": "next lint",
    "postinstall": "prisma generate",
    "db:seed": "tsx prisma/seed.ts",
    "db:prod:seed": "npx prisma db seed",
    "seed": "tsx prisma/seed.ts"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  },
  "dependencies": {
    "@auth/prisma-adapter": "^2.10.0",
    "geist": "^1.4.2",
    "lucide-react": "^0.525.0",
    "next": "^14.2.3",
    "next-auth": "^5.0.0-beta.29",
    "react": "^18",
    "react-dom": "^18",
    "tsx": "^4.20.3"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "autoprefixer": "^10.4.19",
    "eslint": "^8",
    "eslint-config-next": "^14.2.3",
    "postcss": "^8",
    "prisma": "^6.11.1",
    "tailwindcss": "^3.4.1",
    "typescript": "^5"
  }
}
```

**`vercel-build` স্ক্রিপ্টটির ব্যাখ্যা:**
*   **`prisma generate`**: এটি নিশ্চিত করে যে `@prisma/client` সর্বশেষ স্কিমার সাথে আপ-টু-ডেট আছে।
*   **`prisma migrate deploy`**: এটি হলো প্রোডাকশন এনভায়রনমেন্টের জন্য সঠিক মাইগ্রেশন কমান্ড। এটি আপনার `prisma/migrations` ফোল্ডারে থাকা সমস্ত মাইগ্রেশন ফাইলগুলো আপনার Neon ডাটাবেসে প্রয়োগ করবে। এটি `prisma db push`-এর চেয়ে নিরাপদ এবং প্রোডাকশনের জন্য প্রস্তাবিত।
*   **`next build`**: সবশেষে, এটি আপনার Next.js অ্যাপ্লিকেশনটিকে বিল্ড করবে।

**পদক্ষেপ ২: Vercel-এ বিল্ড কমান্ড সেট করুন**

1.  আপনার Vercel প্রজেক্টের ড্যাশবোর্ডে যান।
2.  "Settings" ট্যাবে ক্লিক করুন।
3.  বাম পাশের মেনু থেকে "General" সিলেক্ট করুন।
4.  "Build & Development Settings" সেকশনটি খুঁজুন।
5.  **"Build Command"**-এর পাশে থাকা "Override" টগলটি অন করুন।
6.  ইনপুট বক্সে নিচের কমান্ডটি লিখুন:
    ```bash
    npm run vercel-build
    ```
7.  "Save" বাটনে ক্লিক করুন।

**ফলাফল:**
এখন থেকে, যখনই আপনি GitHub-এ নতুন কোড পুশ করবেন, Vercel স্বয়ংক্রিয়ভাবে `npm run vercel-build` কমান্ডটি চালাবে। এটি নিশ্চিত করবে যে আপনার ডাটাবেস এবং অ্যাপ্লিকেশন কোড সবসময় একে অপরের সাথে সামঞ্জস্যপূর্ণ থাকবে।

**আপনার প্রশ্নের সরাসরি উত্তর:** Vercel-এর জন্য আপনার বিল্ড কমান্ড হওয়া উচিত `npm run vercel-build`।