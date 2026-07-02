"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchVessels } from "../../lib/api";
import { PageHeader, TableCard, StatusPill, td, tdMono, tr } from "../../components/ui";

export default function VesselsPage() {
  const q = useQuery({ queryKey: ["vessels"], queryFn: fetchVessels });
  const vessels = q.data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Vessels" subtitle="Fleet management & maintenance" count={q.data?.meta.total} />
      <TableCard
        headers={["Name", "IMO", "Flag", "Type", "TEU", "Status"]}
        isLoading={q.isLoading}
        isError={q.isError}
        isEmpty={vessels.length === 0}
      >
        {vessels.map((v) => (
          <tr key={v.id} className={tr}>
            <td className={`${td} font-semibold text-erp-navy`}>{v.name}</td>
            <td className={tdMono + " text-gray-500"}>{v.imo}</td>
            <td className={td + " text-gray-600"}>{v.flagState}</td>
            <td className={td + " text-gray-600"}>{v.vesselType}</td>
            <td className={td + " text-gray-600 tabular-nums"}>{v.teuCapacity.toLocaleString()}</td>
            <td className={td}><StatusPill status={v.status} /></td>
          </tr>
        ))}
      </TableCard>
    </div>
  );
}
