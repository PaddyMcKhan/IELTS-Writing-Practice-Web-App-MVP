import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "IELTS Writing Practice",
  description: "MVP practice app for IELTS Writing Tasks 1 & 2"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="container py-6">
          <header className="mb-6">
            <h1 className="text-2xl font-bold">IELTS Writing Practice</h1>
            <p className="text-sm opacity-80">Academic & General • Tasks 1 & 2</p>
          </header>
          {children}
          <footer className="mt-12 text-xs opacity-70">
            Built for learners. Drafts auto‑save locally. No account needed.
          </footer>
        </div>
      </body>
    </html>
  );
}
