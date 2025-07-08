// app/api/build/create/route.ts

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

/**
 * Handles GET requests to the /api/build/create endpoint.
 * This route's primary purpose is to create a new PC build for the
 * currently authenticated user and then redirect them to the builder page.
 */
export async function GET() {
  // 1. Get the session on the server. Our middleware ensures this is populated
  //    for authenticated users accessing this route.
  const session = await auth();

  // 2. Security Check: If for any reason the middleware check was bypassed or
  //    failed, this provides a final layer of protection. If there is no
  //    valid user session, return a 401 Unauthorized error.
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // 3. The user is authenticated. Create a new build in the database.
  //    The new build is automatically associated with the logged-in user's ID.
  const build = await prisma.build.create({
    data: {
      userId: session.user.id,
      name: `${session.user.name || "User"}'s New Build`, // A default name for the build
    },
  });

  // 4. After the build is successfully created, redirect the user to the
  //    dynamic page for their new build, using its unique ID.
  //    This redirect will cause the browser's URL to change and load the new page.
  redirect(`/builder/${build.id}`);
}
