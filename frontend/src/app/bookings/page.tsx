"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchBookings } from "../../lib/api";
import { PageHeader, TableCard, StatusPill, td, tdMono, tr } from "../../components/ui";

export default function BookingsPage() {
  const q = useQuery({ queryKey: ["bookings"], queryFn: fetchBookings });
  const bookings = q.data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Bookings" subtitle="Booking creation & rollover" count={q.data?.meta.total} />
      <TableCard
        headers={["Ref", "Customer", "POL → POD", "Vessel", "TEU", "Status"]}
        isLoading={q.isLoading}
        isError={q.isError}
        isEmpty={bookings.length === 0}
      >
        {bookings.map((b) => (
          <tr key={b.id} className={tr}>
            <td className={`${tdMono} font-semibold text-erp-navy`}>{b.bookingRef}</td>
            <td className={td + " text-gray-700"}>{b.customer?.name ?? "—"}</td>
            <td className={tdMono + " text-gray-500"}>{b.pol} → {b.pod}</td>
            <td className={td + " text-gray-600 text-xs"}>{b.voyage?.vessel?.name ?? "—"}</td>
            <td className={td + " text-gray-600 tabular-nums"}>{b.teu}</td>
            <td className={td}><StatusPill status={b.status} /></td>
          </tr>
        ))}
      </TableCard>
    </div>
  );
}
