// app/actions/dashboardActions.ts
"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

/**
 * Securely deletes a PC build.
 * It takes FormData as an argument because it's called from a standard HTML form.
 * @param formData - The form data, which must contain a 'buildId' field.
 */
export async function deleteBuildAction(formData: FormData) {
  // 1. Get the current user's session to identify the user.
  const session = await auth();
  const userId = session?.user?.id;

  // 2. Security: Throw an error if no user is logged in.
  if (!userId) {
    throw new Error("You must be logged in to delete a build.");
  }

  // 3. Get the buildId from the form's hidden input field.
  const buildId = formData.get("buildId") as string;

  if (!buildId) {
    throw new Error("Build ID is required.");
  }

  // 4. Delete the build from the database.
  //    The `where` clause includes a `userId` check. This is a critical security
  //    measure to ensure a user can ONLY delete builds that they own.
  await prisma.build.delete({
    where: {
      id: buildId,
      userId: userId, // This prevents users from deleting others' builds.
    },
  });

  // 5. Revalidate the dashboard path. This tells Next.js to refresh the list
  //    of builds on the dashboard page so the deleted one disappears.
  revalidatePath("/dashboard");
}
