// components/MobileNav.tsx
'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';

export function MobileNav() {
  // We are temporarily removing the useState and the overlay logic.
  // We will just render a link to the dashboard directly to test.
  return (
    <div className="md:hidden">
      <Link 
        href="/dashboard" 
        className="flex items-center space-x-2 rounded-md p-2 text-foreground/70 hover:bg-border"
      >
        <Menu className="h-6 w-6" />
        <span className="font-bold">Dashboard</span>
      </Link>
    </div>
  );
}