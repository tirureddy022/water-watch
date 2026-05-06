import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp } from "lucide-react";
import { FiltersBar, todayISO, type ReportFilters } from "@/components/reports/Filters";
import { DEVICES } from "@/lib/mock-devices";

export const Route = createFileRoute("/_app/reports/power-utilization")({
  component: PowerUtilizationReport,
});

type Row = {
  id: string;
  state: string;
  district: string;
  powerStart: string;
  powerEnd: string;
  powerMinutes: number;
  motorStart: string;
  motorEnd: string;
  motorMinutes: number;
  volumeToday: number;
  volumeYesterday: number;
};

function seed(id: string): Row {
  const base = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  let s = base;
  const r = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const powerMinutes = 600 + Math.floor(r() * 300);
  const motorMinutes = Math.floor(powerMinutes * (0.5 + r() * 0.35));
  const volumeToday = motorMinutes * (180 + Math.floor(r() * 80));
  const volumeYesterday = Math.floor(volumeToday * (0.7 + r() * 0.6));
  return {
    id,
    state: "",
    district: "",
    powerStart: "06:12",
    powerEnd: "21:" + String(10 + Math.floor(r() * 49)).padStart(2, "0"),
    powerMinutes,
    motorStart: "07:05",
    motorEnd: "20:" + String(10 + Math.floor(r() * 49)).padStart(2, "0"),
    motorMinutes,
    volumeToday,
    volumeYesterday,
  };
}

function PowerUtilizationReport() {
  const [filters, setFilters] = useState<ReportFilters>({
    state: "",
    district: "",
    fromDate: todayISO(),
    toDate: todayISO(),
  });

  const rows: Row[] = useMemo(() => {
    return DEVICES.filter(
      (d) =>
        (!filters.state || d.state === filters.state) &&
        (!filters.district || d.district === filters.district),
    )
      .slice(0, 20)
      .map((d) => ({ ...seed(d.id), state: d.state, district: d.district }));
  }, [filters]);

  return (
    <>
      <FiltersBar value={filters} onChange={setFilters} />

      <div className="border border-steel-300 bg-card">
        <div className="border-b border-steel-200 bg-steel-100/60 px-6 py-3">
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-steel-600">
            Power utilization — {filters.fromDate}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-steel-50">
              <tr className="border-b border-steel-200 text-[10px] font-bold uppercase tracking-widest text-steel-500">
                <Th>Device</Th>
                <Th>District</Th>
                <Th>Pwr Start</Th>
                <Th>Pwr End</Th>
                <Th className="text-right">Pwr Min</Th>
                <Th>Motor Start</Th>
                <Th>Motor End</Th>
                <Th className="text-right">Motor Min</Th>
                <Th className="text-right">Volume Today (L)</Th>
                <Th className="text-right">Yesterday (L)</Th>
                <Th className="text-right">Δ vs prev</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-100 font-mono tabular-nums text-steel-700">
              {rows.length === 0 && (
                <tr>
                  <td colSpan={11} className="px-6 py-8 text-center text-steel-500">
                    No devices for this filter.
                  </td>
                </tr>
              )}
              {rows.map((r) => {
                const diff = r.volumeToday - r.volumeYesterday;
                const pct = r.volumeYesterday
                  ? (diff / r.volumeYesterday) * 100
                  : 0;
                const up = diff >= 0;
                return (
                  <tr key={r.id} className="hover:bg-steel-50">
                    <td className="px-4 py-3 font-sans font-semibold text-steel-900">{r.id}</td>
                    <td className="px-4 py-3 font-sans">{r.district}</td>
                    <td className="px-4 py-3">{r.powerStart}</td>
                    <td className="px-4 py-3">{r.powerEnd}</td>
                    <td className="px-4 py-3 text-right">{r.powerMinutes}</td>
                    <td className="px-4 py-3">{r.motorStart}</td>
                    <td className="px-4 py-3">{r.motorEnd}</td>
                    <td className="px-4 py-3 text-right">{r.motorMinutes}</td>
                    <td className="px-4 py-3 text-right">{r.volumeToday.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right text-steel-500">{r.volumeYesterday.toLocaleString()}</td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={
                          "inline-flex items-center gap-1 font-bold " +
                          (up ? "text-[color:var(--success)]" : "text-destructive")
                        }
                      >
                        {up ? <ArrowUp className="size-3" /> : <ArrowDown className="size-3" />}
                        {Math.abs(pct).toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-3 ${className}`}>{children}</th>;
}
