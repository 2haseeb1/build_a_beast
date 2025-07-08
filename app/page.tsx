// app/page.tsx

import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="container mx-auto text-center py-24">
      <h1 className="text-5xl font-extrabold tracking-tight">
        Welcome to Build-a-Beast
      </h1>
      <p className="mt-4 text-lg text-foreground/80">
        The most intuitive way to design your dream PC.
      </p>
      <div className="mt-8">
        {/* ✅ পরিবর্তন: লিঙ্কটি এখন /start-building পেজে যাবে */}
        <Link
          href="/start-building"
          className="rounded-md bg-primary px-6 py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
        >
          Start Your Build
        </Link>
      </div>
    </div>
  );
}