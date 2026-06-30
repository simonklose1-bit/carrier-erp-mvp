import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Carrier ERP",
  description: "Shipping ERP System for Reederei Operations",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-brand-900 text-white px-6 py-4 flex items-center gap-6">
            <span className="font-bold text-lg tracking-tight">Carrier ERP</span>
            <a href="/dashboard" className="text-sm hover:text-brand-50 transition-colors">Dashboard</a>
            <a href="/vessels" className="text-sm hover:text-brand-50 transition-colors">Vessels</a>
            <a href="/schedules" className="text-sm hover:text-brand-50 transition-colors">Schedules</a>
            <a href="/bookings" className="text-sm hover:text-brand-50 transition-colors">Bookings</a>
            <a href="/documentation" className="text-sm hover:text-brand-50 transition-colors">Documentation</a>
          </nav>
          <main className="px-6 py-8">{children}</main>
        </div>
      </body>
    </html>
  );
}
