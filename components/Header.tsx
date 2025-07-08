// components/Header.tsx

import { auth } from "@/auth";

import { MainNav } from "./MainNav"; // A new component for main navigation links
import { MobileNav } from "./MobileNav"; // A new component for the mobile hamburger menu
import { UserNav } from "./UserNav"; // A new component to handle user-specific actions

export default async function Header() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto flex h-14 items-center justify-between px-4">
        {/* Main Navigation for Desktop */}
        <div className="hidden md:flex">
          <MainNav />
        </div>
        
        {/* Mobile Navigation (Hamburger Menu) */}
        <div className="md:hidden">
          <MobileNav />
        </div>

        {/* User-specific buttons (Sign In/Out, Dashboard) */}
        <div className="flex items-center justify-end space-x-4">
          <UserNav session={session} />
        </div>
      </div>
    </header>
  );
}