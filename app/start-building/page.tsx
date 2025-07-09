// app/start-building/page.tsx

import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// একটি সাধারণ লোডিং UI কম্পোনেন্ট
function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
    </div>
  );
}

export default async function StartBuildingPage() {
  // ১. সেশন তথ্য আনুন
  const session = await auth();

  // ২. যদি ব্যবহারকারী লগইন করা না থাকে, তাহলে তাকে সাইন-ইন পেজে পাঠান।
  // redirect() ফাংশনটি একটি error থ্রো করে এবং রেন্ডারিং থামিয়ে দেয়।
  if (!session?.user?.id) {
    redirect('/api/auth/signin?callbackUrl=/start-building');
  }

  // ৩. ডাটাবেসে একটি নতুন বিল্ড তৈরি করুন
  const build = await prisma.build.create({
    data: {
      userId: session.user.id,
      name: 'My New PC Build', // একটি ডিফল্ট নাম
    },
  });

  // ৪. ব্যবহারকারীকে নতুন তৈরি করা বিল্ডার পেজে পাঠিয়ে দিন।
  // redirect() ফাংশনটি এখানেও রেন্ডারিং থামিয়ে দেবে।
  redirect(`/builder/${build.id}`);

  // ✅ ফলব্যাক UI:
  // উপরের redirect() গুলো কাজ করলে এই কোডটি কখনোই রান হবে না।
  // কিন্তু এটি Next.js এবং TypeScript-কে সন্তুষ্ট করার জন্য প্রয়োজন,
  // কারণ প্রতিটি পেজকে অবশ্যই একটি ভ্যালিড React কম্পোনেন্ট রিটার্ন করতে হয়।
  return <LoadingSpinner />;
}