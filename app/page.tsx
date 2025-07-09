// app/page.tsx

import { createBuild } from '@/app/actions/buildActions';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] text-center">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground">
        Welcome to <span className="text-primary">Build-a-Beast</span>
      </h1>
      <p className="mt-4 max-w-xl text-lg text-foreground/80">
        The most intuitive way to design and visualize your dream PC setup.
      </p>
      <div className="mt-8">
        {/* ✅ লিঙ্ক-এর পরিবর্তে এখন একটি ফর্ম ব্যবহার করা হচ্ছে */}
        <form action={createBuild}>
          <button
            type="submit"
            className="rounded-md bg-primary px-8 py-4 text-lg font-bold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start Your Build
          </button>
        </form>
      </div>
    </div>
  );
}