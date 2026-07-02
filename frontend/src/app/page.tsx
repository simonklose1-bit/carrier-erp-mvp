"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { fetchVessels, fetchBookings, fetchBillsOfLading } from "../lib/api";

const statusBadge: Record<string, string> = {
  CONFIRMED: "badge-confirmed",
  PENDING: "badge-pending",
  ROLLED_OVER: "badge-rollover",
  CANCELLED: "badge-cancelled",
  COMPLETED: "badge-confirmed",
  DRAFT: "badge-draft",
};

const statusLabel: Record<string, string> = {
  CONFIRMED: "Confirmed",
  PENDING: "Pending",
  ROLLED_OVER: "Rolled Over",
  CANCELLED: "Cancelled",
  COMPLETED: "Completed",
  DRAFT: "Draft",
};

const modules = [
  { label: "Vessels", href: "/vessels", icon: "🚢", desc: "Fleet management & maintenance" },
  { label: "Schedules", href: "/schedules", icon: "📅", desc: "Voyage & port rotation" },
  { label: "Bookings", href: "/bookings", icon: "📋", desc: "Booking creation & rollover" },
  { label: "Documentation", href: "/documentation", icon: "📄", desc: "Bill of Lading lifecycle" },
];

function StatCard({
  label,
  value,
  sub,
  valueColor,
  loading,
}: {
  label: string;
  value: number | string;
  sub: string;
  valueColor: string;
  loading: boolean;
}) {
  return (
    <div className="card px-5 py-4">
      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">{label}</p>
      {loading ? (
        <div className="h-9 mt-1 flex items-center">
          <div className="h-6 w-12 bg-gray-100 rounded animate-pulse" />
        </div>
      ) : (
        <p className={`text-3xl font-bold mt-1 ${valueColor}`}>{value}</p>
      )}
      <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
    </div>
  );
}

export default function DashboardPage() {
  const vesselsQ = useQuery({ queryKey: ["vessels"], queryFn: fetchVessels });
  const bookingsQ = useQuery({ queryKey: ["bookings"], queryFn: fetchBookings });
  const blQ = useQuery({ queryKey: ["bills-of-lading"], queryFn: fetchBillsOfLading });

  const bookings = bookingsQ.data?.data ?? [];
  const activeVessels = vesselsQ.data?.data.filter((v) => v.status === "ACTIVE").length ?? 0;
  const openBookings = bookings.filter(
    (b) => b.status === "PENDING" || b.status === "CONFIRMED",
  ).length;
  const pendingRollovers = bookings.filter((b) => b.status === "ROLLED_OVER").length;
  const blInReview =
    blQ.data?.data.filter((bl) => bl.status === "DRAFT" || bl.status === "ISSUED").length ?? 0;

  const anyError = vesselsQ.isError || bookingsQ.isError;
  const recent = [...bookings]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  return (
    <div className="space-y-8">

      {/* Hero */}
      <div className="rounded-2xl bg-erp-navy overflow-hidden relative">
        <div
          className="absolute inset-0 opacity-30"
          style={{ background: "linear-gradient(135deg, #0B1F6B 0%, #4F8FE8 100%)" }}
        />
        <div className="relative px-8 py-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-white/60 text-xs font-semibold uppercase tracking-widest mb-1">
              Carrier ERP — Operations Center
            </p>
            <h1 className="text-white text-2xl font-bold">Good morning, Simon</h1>
            <p className="text-white/70 text-sm mt-1">
              {pendingRollovers} rollover{pendingRollovers === 1 ? "" : "s"} pending · {blInReview} B/L
              {blInReview === 1 ? "" : "s"} in review
            </p>
          </div>
          <Link href="/bookings" className="btn-primary self-start sm:self-auto">
            + New Booking
          </Link>
        </div>
        <div className="h-1 bg-gradient-to-r from-erp-skyblue via-accent to-accent/60" />
      </div>

      {/* Connection error banner */}
      {anyError && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
          <span className="font-semibold">Backend nicht erreichbar.</span> Die API antwortet gerade
          nicht (Render Free-Tier braucht nach Inaktivität ~30&nbsp;s zum Aufwachen). Lade die Seite
          in einem Moment neu.
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Vessels" value={activeVessels} sub="in fleet" valueColor="text-erp-navy" loading={vesselsQ.isLoading} />
        <StatCard label="Open Bookings" value={openBookings} sub="pending or confirmed" valueColor="text-erp-navy" loading={bookingsQ.isLoading} />
        <StatCard label="Pending Rollovers" value={pendingRollovers} sub="require action" valueColor="text-amber-600" loading={bookingsQ.isLoading} />
        <StatCard label="B/L in Review" value={blInReview} sub="awaiting release" valueColor="text-red-500" loading={blQ.isLoading} />
      </div>

      {/* Recent Bookings */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-erp-navy text-base">Recent Bookings</h2>
          <Link href="/bookings" className="text-sm text-erp-skyblue hover:text-erp-navy font-medium transition-colors">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {["Ref", "Customer", "POL → POD", "Vessel", "Status"].map((h) => (
                  <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {bookingsQ.isLoading && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-sm">
                    Loading bookings…
                  </td>
                </tr>
              )}
              {!bookingsQ.isLoading && recent.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400 text-sm">
                    No bookings yet.
                  </td>
                </tr>
              )}
              {recent.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-3.5 font-mono text-erp-navy font-semibold text-xs">{b.bookingRef}</td>
                  <td className="px-6 py-3.5 text-gray-700">{b.customer?.name ?? "—"}</td>
                  <td className="px-6 py-3.5 text-gray-500 font-mono text-xs">{b.pol} → {b.pod}</td>
                  <td className="px-6 py-3.5 text-gray-600 text-xs">{b.voyage?.vessel?.name ?? "—"}</td>
                  <td className="px-6 py-3.5">
                    <span className={statusBadge[b.status] ?? "badge-draft"}>
                      {statusLabel[b.status] ?? b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modules */}
      <div>
        <h2 className="font-semibold text-erp-navy text-base mb-3">Modules</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="card px-5 py-4 hover:border-erp-navy/20 hover:shadow-md transition-all group"
            >
              <div className="text-2xl mb-2">{m.icon}</div>
              <h3 className="font-semibold text-erp-navy text-sm group-hover:text-erp-skyblue transition-colors">
                {m.label}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">{m.desc}</p>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
