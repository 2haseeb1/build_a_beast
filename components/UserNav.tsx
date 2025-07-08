// components/UserNav.tsx

'use client';

import Link from 'next/link';
import { signIn, signOut } from 'next-auth/react';
import type { Session } from 'next-auth';

export function UserNav({ session }: { session: Session | null }) {
  if (session?.user) {
    // User is logged in
    return (
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard"
          className="hidden text-sm font-medium text-foreground/70 transition-colors hover:text-foreground sm:block"
        >
          Dashboard
        </Link>
        <button
          onClick={() => signOut()}
          className="rounded-md bg-card px-3 py-1.5 text-sm font-medium text-foreground/80 transition-colors hover:bg-border"
        >
          Sign Out
        </button>
      </div>
    );
  }

  // User is logged out
  return (
    <button
      onClick={() => signIn('github')}
      className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
    >
      Sign In
    </button>
  );
}