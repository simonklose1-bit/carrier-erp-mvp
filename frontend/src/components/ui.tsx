import type { ReactNode } from "react";

// ─── Status → badge class + label ─────────────────────────────────────────────

const BADGE: Record<string, string> = {
  // Bookings
  CONFIRMED: "badge-confirmed",
  PENDING: "badge-pending",
  ROLLED_OVER: "badge-rollover",
  CANCELLED: "badge-cancelled",
  COMPLETED: "badge-draft",
  // Voyages
  PLANNED: "badge-pending",
  ACTIVE: "badge-confirmed",
  // Vessels
  IN_MAINTENANCE: "badge-rollover",
  RETIRED: "badge-cancelled",
  // Bill of Lading
  DRAFT: "badge-draft",
  ISSUED: "badge-confirmed",
  SURRENDERED: "badge-rollover",
  AMENDED: "badge-pending",
};

function humanize(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function StatusPill({ status }: { status: string }) {
  return <span className={BADGE[status] ?? "badge-draft"}>{humanize(status)}</span>;
}

// ─── Page header ──────────────────────────────────────────────────────────────

export function PageHeader({
  title,
  subtitle,
  count,
}: {
  title: string;
  subtitle: string;
  count?: number;
}) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <h1 className="text-2xl font-bold text-erp-navy">{title}</h1>
        <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>
      </div>
      {count !== undefined && (
        <span className="text-sm text-gray-400">
          {count} {count === 1 ? "entry" : "entries"}
        </span>
      )}
    </div>
  );
}

// ─── Table card with loading / error / empty states ───────────────────────────

export function TableCard({
  headers,
  isLoading,
  isError,
  isEmpty,
  emptyText = "No records yet.",
  children,
}: {
  headers: string[];
  isLoading: boolean;
  isError: boolean;
  isEmpty: boolean;
  emptyText?: string;
  children: ReactNode;
}) {
  return (
    <div className="card overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {headers.map((h) => (
                <th
                  key={h}
                  className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading && (
              <tr>
                <td colSpan={headers.length} className="px-6 py-10 text-center text-gray-400 text-sm">
                  Loading…
                </td>
              </tr>
            )}
            {!isLoading && isError && (
              <tr>
                <td colSpan={headers.length} className="px-6 py-10 text-center text-red-500 text-sm">
                  Backend nicht erreichbar. Bitte in einem Moment neu laden (Render Free-Tier wacht ~30&nbsp;s auf).
                </td>
              </tr>
            )}
            {!isLoading && !isError && isEmpty && (
              <tr>
                <td colSpan={headers.length} className="px-6 py-10 text-center text-gray-400 text-sm">
                  {emptyText}
                </td>
              </tr>
            )}
            {!isLoading && !isError && !isEmpty && children}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Shared cell classNames
export const td = "px-6 py-3.5";
export const tdMono = "px-6 py-3.5 font-mono text-xs";
export const tr = "hover:bg-gray-50/50 transition-colors";
