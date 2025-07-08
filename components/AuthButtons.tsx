// components/AuthButtons.tsx

'use client';

import { signIn, signOut } from "next-auth/react";
import type { Session } from "next-auth";

export default function AuthButtons({ session }: { session: Session | null }) {
  
  // If a session exists, show the Sign Out button
  if (session?.user) {
    return (
      <button 
        onClick={() => signOut()} 
        className="rounded-md bg-card px-4 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-border"
      >
        Sign Out
      </button>
    );
  }

  // If no session exists, show the Sign In button
  return (
    <button 
      // We specify 'github' as the provider to sign in with.
      onClick={() => signIn('github')} 
      className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
    >
      Sign In
    </button>
  );
}