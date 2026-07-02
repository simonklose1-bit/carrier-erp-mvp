"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchVoyages } from "../../lib/api";
import { PageHeader, TableCard, StatusPill, td, tdMono, tr } from "../../components/ui";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("de-DE", { day: "2-digit", month: "short", year: "numeric" });
}

export default function SchedulesPage() {
  const q = useQuery({ queryKey: ["voyages"], queryFn: fetchVoyages });
  const voyages = q.data?.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Schedules" subtitle="Voyage & port rotation" count={q.data?.meta.total} />
      <TableCard
        headers={["Voyage", "Service", "Vessel", "Ports", "ETD", "ETA", "Status"]}
        isLoading={q.isLoading}
        isError={q.isError}
        isEmpty={voyages.length === 0}
      >
        {voyages.map((v) => (
          <tr key={v.id} className={tr}>
            <td className={`${tdMono} font-semibold text-erp-navy`}>{v.voyageNo}</td>
            <td className={td + " text-gray-600"}>{v.service?.code ?? "—"}</td>
            <td className={td + " text-gray-700"}>{v.vessel?.name ?? "—"}</td>
            <td className={tdMono + " text-gray-500"}>{Array.isArray(v.portCalls) ? v.portCalls.join(" → ") : "—"}</td>
            <td className={td + " text-gray-600 text-xs"}>{fmtDate(v.etd)}</td>
            <td className={td + " text-gray-600 text-xs"}>{fmtDate(v.eta)}</td>
            <td className={td}><StatusPill status={v.status} /></td>
          </tr>
        ))}
      </TableCard>
    </div>
  );
}
