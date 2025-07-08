// components/MainNav.tsx

import Link from "next/link";
import { Bot } from "lucide-react"; // A robot icon for our logo

export function MainNav() {
  return (
    <nav className="flex items-center space-x-6">
      <Link href="/" className="flex items-center space-x-2">
        <Bot className="h-6 w-6" />
        <span className="hidden font-bold sm:inline-block">
          Build-a-Beast
        </span>
      </Link>
      {/* You can add more primary links here if needed */}
      {/* <Link href="/guides" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">
        Guides
      </Link> */}
    </nav>
  );
}