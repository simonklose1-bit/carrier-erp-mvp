import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Carrier ERP",
  description: "Shipping ERP System — Reederei Operations",
  manifest: "/manifest.json",
};

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Vessels", href: "/vessels" },
  { label: "Schedules", href: "/schedules" },
  { label: "Bookings", href: "/bookings" },
  { label: "Documentation", href: "/documentation" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body>
        {/* Navy Header */}
        <header className="bg-navy shadow-md sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-yellow rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-navy">
                  <path d="M20 21H4L2 9h20l-2 12zM12 3L4 9h16L12 3z"/>
                </svg>
              </div>
              <span className="text-white font-bold text-lg tracking-widest uppercase">
                Carrier <span className="text-yellow">ERP</span>
              </span>
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-white/70 hover:text-white hover:bg-white/10 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* User */}
            <div className="flex items-center gap-3">
              <span className="text-white/60 text-sm hidden md:block">Operations</span>
              <div className="w-8 h-8 rounded-full bg-yellow flex items-center justify-center text-navy font-bold text-sm">
                SK
              </div>
            </div>
          </div>

          {/* Decorative gradient bar */}
          <div className="h-0.5 bg-gradient-to-r from-navy via-skyblue to-yellow" />
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
