import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FiltersBar, todayISO, type ReportFilters } from "@/components/reports/Filters";
import { DEVICES } from "@/lib/mock-devices";

export const Route = createFileRoute("/_app/reports/summary")({
  component: SummaryReport,
});

function SummaryReport() {
  const [filters, setFilters] = useState<ReportFilters>({
    state: "",
    district: "",
    fromDate: todayISO(-7),
    toDate: todayISO(),
  });

  const rows = useMemo(() => {
    const filtered = DEVICES.filter(
      (d) =>
        (!filters.state || d.state === filters.state) &&
        (!filters.district || d.district === filters.district),
    );
    // group by state+district
    const map = new Map<string, { state: string; district: string; motorOn: number; motorOff: number; powerOn: number; powerOff: number }>();
    for (const d of filtered) {
      const key = `${d.state}|${d.district}`;
      const r = map.get(key) ?? {
        state: d.state,
        district: d.district,
        motorOn: 0,
        motorOff: 0,
        powerOn: 0,
        powerOff: 0,
      };
      if (d.motorOn) r.motorOn++;
      else r.motorOff++;
      if (d.powerOn) r.powerOn++;
      else r.powerOff++;
      map.set(key, r);
    }
    return Array.from(map.values());
  }, [filters]);

  const totals = rows.reduce(
    (acc, r) => ({
      motorOn: acc.motorOn + r.motorOn,
      motorOff: acc.motorOff + r.motorOff,
      powerOn: acc.powerOn + r.powerOn,
      powerOff: acc.powerOff + r.powerOff,
    }),
    { motorOn: 0, motorOff: 0, powerOn: 0, powerOff: 0 },
  );

  return (
    <>
      <FiltersBar value={filters} onChange={setFilters} />

      <div className="border border-steel-300 bg-card">
        <div className="border-b border-steel-200 bg-steel-100/60 px-6 py-3">
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-steel-600">
            Summary report — {filters.fromDate} to {filters.toDate}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-steel-50">
              <tr className="border-b border-steel-200 text-[10px] font-bold uppercase tracking-widest text-steel-500">
                <Th>State</Th>
                <Th>District</Th>
                <Th className="text-right">Motor ON</Th>
                <Th className="text-right">Motor OFF</Th>
                <Th className="text-right">Power ON</Th>
                <Th className="text-right">Power OFF</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-100 font-mono tabular-nums text-steel-700">
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-steel-500">
                    No data for the selected filter.
                  </td>
                </tr>
              )}
              {rows.map((r) => (
                <tr key={`${r.state}-${r.district}`} className="hover:bg-steel-50">
                  <td className="px-6 py-3 font-sans text-steel-900">{r.state}</td>
                  <td className="px-6 py-3 font-sans">{r.district}</td>
                  <Td>{r.motorOn}</Td>
                  <Td>{r.motorOff}</Td>
                  <Td>{r.powerOn}</Td>
                  <Td>{r.powerOff}</Td>
                </tr>
              ))}
            </tbody>
            {rows.length > 0 && (
              <tfoot>
                <tr className="border-t-2 border-steel-300 bg-steel-50 font-mono text-[11px] font-bold uppercase tracking-widest text-steel-700">
                  <td colSpan={2} className="px-6 py-3">Total</td>
                  <Td>{totals.motorOn}</Td>
                  <Td>{totals.motorOff}</Td>
                  <Td>{totals.powerOn}</Td>
                  <Td>{totals.powerOff}</Td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>
    </>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-6 py-3 ${className}`}>{children}</th>;
}
function Td({ children }: { children: React.ReactNode }) {
  return <td className="px-6 py-3 text-right">{children}</td>;
}
