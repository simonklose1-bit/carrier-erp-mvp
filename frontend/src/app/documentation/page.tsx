"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchBillsOfLading } from "../../lib/api";
import { PageHeader, TableCard, StatusPill, td, tdMono, tr } from "../../components/ui";

export default function DocumentationPage() {
  const q = useQuery({ queryKey: ["bills-of-lading"], queryFn: fetchBillsOfLading });
  const bls = q.data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Documentation" subtitle="Bill of Lading lifecycle" count={q.data?.meta.total} />
      <TableCard
        headers={["B/L Number", "Booking", "Vessel", "Voyage", "Seq", "Status"]}
        isLoading={q.isLoading}
        isError={q.isError}
        isEmpty={bls.length === 0}
        emptyText="Noch keine Bills of Lading. Diese entstehen aus bestätigten Bookings."
      >
        {bls.map((bl) => (
          <tr key={bl.id} className={tr}>
            <td className={`${tdMono} font-semibold text-erp-navy`}>{bl.blNumber}</td>
            <td className={tdMono + " text-gray-500"}>{bl.booking?.bookingRef ?? "—"}</td>
            <td className={td + " text-gray-700"}>{bl.vesselName ?? "—"}</td>
            <td className={tdMono + " text-gray-500"}>{bl.voyageNo ?? "—"}</td>
            <td className={td + " text-gray-600 tabular-nums"}>{bl.amendmentSeq > 0 ? `A${bl.amendmentSeq}` : "—"}</td>
            <td className={td}><StatusPill status={bl.status} /></td>
          </tr>
        ))}
      </TableCard>
    </div>
  );
}
