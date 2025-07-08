// app/start-building/page.tsx

import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// এই পেজটি এখন ধরে নেবে যে ব্যবহারকারী লগইন করা আছে, কারণ middleware তাকে সুরক্ষিত রেখেছে।
export default async function StartBuildingPage() {
  const session = await auth();

  // একটি অতিরিক্ত নিরাপত্তা চেক। যদি কোনো কারণে সেশন না পাওয়া যায়, হোমপেজে পাঠিয়ে দিন।
  if (!session?.user?.id) {
    console.error('User not authenticated in StartBuildingPage, redirecting home.');
    return redirect('/');
  }

  // সরাসরি বিল্ড তৈরি করুন
  const build = await prisma.build.create({
    data: {
      userId: session.user.id,
      name: 'My Final PC Build',
    },
  });

  // বিল্ডার পেজে রিডাইরেক্ট করুন
  return redirect(`/builder/${build.id}`);
}