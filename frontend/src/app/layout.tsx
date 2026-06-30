import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Carrier ERP",
  description: "Shipping ERP System — Reederei Operations",
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
        <header className="bg-erp-navy sticky top-0 z-50 shadow-lg">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3">
              <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#0B1F6B">
                  <path d="M20 21H4L2 9h20l-2 12zM12 3L4 9h16L12 3z"/>
                </svg>
              </div>
              <span className="text-white font-bold text-lg tracking-widest uppercase">
                Carrier <span className="text-accent">ERP</span>
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
              <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-erp-navy font-bold text-sm">
                SK
              </div>
            </div>
          </div>
          {/* Gradient bar */}
          <div className="h-0.5 bg-gradient-to-r from-erp-navy via-erp-skyblue to-accent" />
        </header>

        <main className="max-w-7xl mx-auto px-6 py-8">
          {children}
        </main>
      </body>
    </html>
  );
}
