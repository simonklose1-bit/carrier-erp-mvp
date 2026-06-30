import Link from "next/link";

const stats = [
  { label: "Active Vessels", value: "50", sub: "in fleet", color: "text-navy" },
  { label: "Open Bookings", value: "124", sub: "this month", color: "text-navy" },
  { label: "Pending Rollovers", value: "3", sub: "require action", color: "text-warning" },
  { label: "B/L in Review", value: "8", sub: "awaiting release", color: "text-danger" },
];

const recentBookings = [
  { ref: "BKG-001", customer: "Maersk Line", pol: "DEHAM", pod: "CNSHA", vessel: "MSC Aurora", status: "CONFIRMED" },
  { ref: "BKG-002", customer: "Hapag-Lloyd", pol: "NLRTM", pod: "SGSIN", vessel: "Ever Given", status: "PENDING" },
  { ref: "BKG-003", customer: "CMA CGM", pol: "BEANR", pod: "AEJEA", vessel: "CMA Titan", status: "ROLLED_OVER" },
  { ref: "BKG-004", customer: "COSCO", pol: "DEHAM", pod: "USNYC", vessel: "COSCO Pacific", status: "CONFIRMED" },
  { ref: "BKG-005", customer: "ONE Line", pol: "GBFXT", pod: "JPYOK", vessel: "ONE Harmony", status: "CANCELLED" },
];

const statusBadge: Record<string, string> = {
  CONFIRMED: "badge-confirmed",
  PENDING: "badge-pending",
  ROLLED_OVER: "badge-rollover",
  CANCELLED: "badge-cancelled",
  DRAFT: "badge-draft",
};

const statusLabel: Record<string, string> = {
  CONFIRMED: "Confirmed",
  PENDING: "Pending",
  ROLLED_OVER: "Rolled Over",
  CANCELLED: "Cancelled",
  DRAFT: "Draft",
};

const modules = [
  { label: "Vessels", href: "/vessels", icon: "🚢", desc: "Fleet management & maintenance" },
  { label: "Schedules", href: "/schedules", icon: "📅", desc: "Voyage & port rotation" },
  { label: "Bookings", href: "/bookings", icon: "📋", desc: "Booking creation & rollover" },
  { label: "Documentation", href: "/documentation", icon: "📄", desc: "Bill of Lading lifecycle" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">

      {/* Hero bar */}
      <div className="rounded-2xl overflow-hidden bg-navy relative">
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy to-skyblue opacity-90" />
        <div className="relative px-8 py-8 flex items-center justify-between">
          <div>
            <p className="text-white/60 text-sm font-medium uppercase tracking-wider mb-1">Carrier ERP — Operations Center</p>
            <h1 className="text-white text-2xl font-bold">Good morning, Simon</h1>
            <p className="text-white/70 text-sm mt-1">3 rollovers pending · 8 B/Ls in review</p>
          </div>
          <Link href="/bookings" className="btn-primary">
            + New Booking
          </Link>
        </div>
        <div className="h-1 bg-gradient-to-r from-skyblue via-yellow to-yellow/50" />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="card px-5 py-4">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{s.label}</p>
            <p className={`text-3xl font-bold mt-1 ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Recent bookings */}
      <div className="card overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-semibold text-navy text-base">Recent Bookings</h2>
          <Link href="/bookings" className="text-sm text-skyblue hover:text-navy font-medium transition-colors">
            View all →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ref</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Customer</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">POL → POD</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Vessel</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {recentBookings.map((b) => (
                <tr key={b.ref} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-3.5 font-mono text-navy font-medium">{b.ref}</td>
                  <td className="px-6 py-3.5 text-gray-700">{b.customer}</td>
                  <td className="px-6 py-3.5 text-gray-600 font-mono text-xs">{b.pol} → {b.pod}</td>
                  <td className="px-6 py-3.5 text-gray-600">{b.vessel}</td>
                  <td className="px-6 py-3.5">
                    <span className={statusBadge[b.status]}>{statusLabel[b.status]}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Module nav */}
      <div>
        <h2 className="font-semibold text-navy text-base mb-3">Modules</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((m) => (
            <Link
              key={m.href}
              href={m.href}
              className="card px-5 py-4 hover:border-navy/30 hover:shadow-md transition-all group"
            >
              <div className="text-2xl mb-2">{m.icon}</div>
              <h3 className="font-semibold text-navy text-sm group-hover:text-skyblue transition-colors">{m.label}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{m.desc}</p>
            </Link>
          ))}
        </div>
      </div>

    </div>
  );
}
