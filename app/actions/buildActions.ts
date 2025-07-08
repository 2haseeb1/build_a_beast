// app/actions/buildActions.ts

"use server"; // ✅ এটি একটি সার্ভার অ্যাকশন ফাইল

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ComponentType } from "@prisma/client";

// এই ফাংশনটি এখন সরাসরি FormData গ্রহণ করবে
export async function selectComponentAction(formData: FormData) {
  // FormData থেকে ভ্যালুগুলো পড়ুন
  const buildId = formData.get("buildId") as string;
  const partId = formData.get("partId") as string | null; // এটি খালি স্ট্রিং বা null হতে পারে
  const type = formData.get("type") as ComponentType;

  if (!buildId || !type) {
    throw new Error("Build ID and component type are required.");
  }

  // প্রথমে এই টাইপের কোনো কম্পোনেন্ট বিল্ডে আছে কিনা তা খুঁজুন
  const existingLink = await prisma.buildComponent.findFirst({
    where: {
      buildId: buildId,
      component: {
        type: type,
      },
    },
  });

  // যদি একটি নতুন পার্ট সিলেক্ট করা হয় (partId আছে)
  if (partId) {
    if (existingLink) {
      // যদি এই টাইপের পার্ট আগে থেকেই থাকে, তাহলে সেটিকে নতুন পার্ট দিয়ে আপডেট করুন
      await prisma.buildComponent.update({
        where: { id: existingLink.id },
        data: { componentId: partId },
      });
    } else {
      // যদি না থাকে, তাহলে নতুন করে যোগ করুন
      await prisma.buildComponent.create({
        data: {
          buildId: buildId,
          componentId: partId,
        },
      });
    }
  } else {
    // যদি partId না থাকে (অর্থাৎ রিমুভ করা হয়েছে), তাহলে existingLink টি ডিলিট করুন
    if (existingLink) {
      await prisma.buildComponent.delete({
        where: { id: existingLink.id },
      });
    }
  }

  // বিল্ডার পেজটি রিভ্যালিডেট করুন যাতে নতুন ডাটা দেখানো হয়
  revalidatePath(`/builder/${buildId}`);
}
