import Link from "next/link";

const modules = [
  { label: "Vessels", href: "/vessels", desc: "50 vessels — creation & maintenance" },
  { label: "Schedules", href: "/schedules", desc: "Voyages, port rotation, ETA management" },
  { label: "Bookings", href: "/bookings", desc: "Booking creation & rollover management" },
  { label: "Documentation", href: "/documentation", desc: "Bill of Lading lifecycle & amendments" },
];

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">Carrier ERP</h1>
      <p className="text-gray-500 mb-8">Reederei Operations — Modular ERP System (MVP v0.1)</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {modules.map((m) => (
          <Link
            key={m.href}
            href={m.href}
            className="block rounded-xl border border-gray-200 bg-white p-6 hover:border-brand-500 hover:shadow-sm transition-all"
          >
            <h2 className="font-semibold text-gray-900 mb-1">{m.label}</h2>
            <p className="text-sm text-gray-500">{m.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
