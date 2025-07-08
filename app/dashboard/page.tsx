// app/dashboard/page.tsx

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { deleteBuildAction } from "@/app/actions/dashboardActions";

export default async function DashboardPage() {
  // 1. Get the current user's session on the server.
  const session = await auth();

  // Middleware will likely handle this, but it's good practice for security.
  if (!session?.user?.id) {
    redirect('/');
  }

  // 2. Fetch all builds from the database that belong to this specific user.
  const userBuilds = await prisma.build.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      updatedAt: 'desc', // Show the most recently worked-on builds first.
    },
  });

  return (
    <div className="container mx-auto max-w-4xl p-4 md:p-8">
      <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-3xl font-bold">My Builds</h1>

        {/* This <Link> points to our stable API route to create a new build. */}
        <Link
          href="/api/build/create"
          className="w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 sm:w-auto"
        >
          Create New Build
        </Link>
      </div>

      {/* 3. Conditionally render either the list of builds or a placeholder message. */}
      {userBuilds.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-card/50 p-12 text-center">
          <h3 className="text-xl font-semibold">You have no saved builds yet.</h3>
          <p className="mt-2 text-sm text-foreground/70">
            {`Click "Create New Build" to get started!`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Map over the fetched builds and render a row for each one. */}
          {userBuilds.map((build) => (
            <div
              key={build.id}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/50"
            >
              <div className="flex-1 overflow-hidden">
                {/* Link to the specific builder page for this build. */}
                <Link
                  href={`/builder/${build.id}`}
                  className="truncate font-semibold text-card-foreground hover:underline"
                >
                  {build.name}
                </Link>
                <p className="text-sm text-foreground/70">
                  Last updated: {build.updatedAt.toLocaleDateString()}
                </p>
              </div>

              {/* The form for deleting a specific build, calling the server action. */}
              <form action={deleteBuildAction} className="ml-4 flex-shrink-0">
                {/* This hidden input passes the buildId to the server action. */}
                <input type="hidden" name="buildId" value={build.id} />
                <button
                  type="submit"
                  className="rounded-md bg-red-600/10 px-3 py-1.5 text-sm font-medium text-red-500 transition-colors hover:bg-red-600/20"
                >
                  Delete
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}