// app/actions/buildActions.ts

"use server"; // ✅ এটি একটি সার্ভার অ্যাকশন ফাইল

import { auth, signIn } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ComponentType } from "@prisma/client";

// ✅ হোমপেজের জন্য সার্ভার অ্যাকশন
export async function createBuild() {
  const session = await auth();

  if (!session?.user?.id) {
    // ব্যবহারকারীকে লগইন করতে বাধ্য করুন
    await signIn("github");
    return;
  }

  const build = await prisma.build.create({
    data: {
      userId: session.user.id,
      name: "My New PC Build",
    },
  });

  redirect(`/builder/${build.id}`);
}

// ✅ কম্পোনেন্ট সিলেক্ট করার জন্য নতুন সার্ভার অ্যাকশন
export async function selectComponentAction(formData: FormData) {
  const buildId = formData.get("buildId") as string;
  const partId = formData.get("partId") as string;
  const type = formData.get("type") as ComponentType;

  if (!buildId || !type) {
    throw new Error("Build ID and component type are required.");
  }

  // এই টাইপের কম্পোনেন্ট আগে থেকেই বিল্ডে আছে কিনা তা খুঁজুন
  const existingLink = await prisma.buildComponent.findFirst({
    where: {
      buildId: buildId,
      component: {
        type: type,
      },
    },
  });

  // যদি একটি নতুন পার্ট সিলেক্ট করা হয় (partId খালি নয়)
  if (partId) {
    if (existingLink) {
      // যদি আগে থেকেই থাকে, তাহলে সেটিকে নতুন পার্ট দিয়ে আপডেট করুন
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
    // যদি partId খালি থাকে (অর্থাৎ রিমুভ করা হয়েছে), তাহলে existingLink টি ডিলিট করুন
    if (existingLink) {
      await prisma.buildComponent.delete({
        where: { id: existingLink.id },
      });
    }
  }

  // বিল্ডার পেজটি রিভ্যালিডেট করুন যাতে UI তাৎক্ষণিকভাবে আপডেট হয়
  revalidatePath(`/builder/${buildId}`);
}
