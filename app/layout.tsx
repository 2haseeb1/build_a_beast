// app/layout.tsx (সবচেয়ে সরল ভার্সন)

import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "Debug Mode",
  description: "Debugging client-side routing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* আমরা ডিবাগ করার জন্য হেডার কম্পোনেন্টটি সম্পূর্ণ সরিয়ে দিয়েছি */}
        <nav>
          <Link href="/">Home</Link> | <a href="/dashboard">Dashboard</a>
        </nav>
        <hr />
        <main>{children}</main>
      </body>
    </html>
  );
}