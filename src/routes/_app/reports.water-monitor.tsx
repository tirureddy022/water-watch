import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { FiltersBar, todayISO, type ReportFilters } from "@/components/reports/Filters";
import { DEVICES } from "@/lib/mock-devices";

export const Route = createFileRoute("/_app/reports/water-monitor")({
  component: WaterMonitorReport,
});

type ShiftRow = {
  shift: string;
  powerStart: string;
  powerEnd: string;
  powerMinutes: number;
  motorStart: string;
  motorEnd: string;
  motorMinutes: number;
  volume: number; // litres
};

const SHIFTS: Array<{ name: string; ps: string; pe: string }> = [
  { name: "Shift 1 (06:00–14:00)", ps: "06:00", pe: "14:00" },
  { name: "Shift 2 (14:00–22:00)", ps: "14:00", pe: "22:00" },
  { name: "Shift 3 (22:00–06:00)", ps: "22:00", pe: "06:00" },
];

function seedRows(deviceId: string): ShiftRow[] {
  // deterministic per-device shifts
  const seed = deviceId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  let s = seed;
  const r = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  return SHIFTS.map((sh) => {
    const powerMinutes = 360 + Math.floor(r() * 120);
    const motorMinutes = Math.floor(powerMinutes * (0.55 + r() * 0.35));
    const volume = motorMinutes * (180 + Math.floor(r() * 80)); // L/min
    return {
      shift: sh.name,
      powerStart: sh.ps,
      powerEnd: sh.pe,
      powerMinutes,
      motorStart: sh.ps,
      motorEnd: addMinutes(sh.ps, motorMinutes),
      motorMinutes,
      volume,
    };
  });
}

function addMinutes(hhmm: string, mins: number): string {
  const [h, m] = hhmm.split(":").map(Number);
  const total = h * 60 + m + mins;
  const nh = Math.floor((total / 60) % 24);
  const nm = total % 60;
  return `${String(nh).padStart(2, "0")}:${String(nm).padStart(2, "0")}`;
}

function WaterMonitorReport() {
  const [filters, setFilters] = useState<ReportFilters>({
    state: "",
    district: "",
    fromDate: todayISO(),
    toDate: todayISO(),
  });

  const devices = useMemo(
    () =>
      DEVICES.filter(
        (d) =>
          (!filters.state || d.state === filters.state) &&
          (!filters.district || d.district === filters.district),
      ).slice(0, 8),
    [filters],
  );

  return (
    <>
      <FiltersBar value={filters} onChange={setFilters} />

      <div className="space-y-6">
        {devices.length === 0 && (
          <div className="border border-steel-300 bg-card p-8 text-center text-sm text-steel-500">
            No devices match the selected filter.
          </div>
        )}
        {devices.map((dev) => {
          const rows = seedRows(dev.id);
          const totalVolume = rows.reduce((a, r) => a + r.volume, 0);
          return (
            <div key={dev.id} className="border border-steel-300 bg-card">
              <div className="flex items-center justify-between border-b border-steel-200 bg-steel-100/60 px-6 py-3">
                <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-steel-700">
                  {dev.id} — {dev.district}, {dev.state}
                </h3>
                <span className="font-mono text-[11px] uppercase tracking-widest text-primary">
                  Day total: {totalVolume.toLocaleString()} L
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-steel-50">
                    <tr className="border-b border-steel-200 text-[10px] font-bold uppercase tracking-widest text-steel-500">
                      <Th>Shift</Th>
                      <Th>Pwr Start</Th>
                      <Th>Pwr End</Th>
                      <Th className="text-right">Pwr Min</Th>
                      <Th>Motor Start</Th>
                      <Th>Motor End</Th>
                      <Th className="text-right">Motor Min</Th>
                      <Th className="text-right">Volume (L)</Th>
                      <Th className="text-right">Day Total (L)</Th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-steel-100 font-mono tabular-nums text-steel-700">
                    {rows.map((r, idx) => (
                      <tr key={r.shift} className="hover:bg-steel-50">
                        <td className="px-4 py-3 font-sans">{r.shift}</td>
                        <td className="px-4 py-3">{r.powerStart}</td>
                        <td className="px-4 py-3">{r.powerEnd}</td>
                        <td className="px-4 py-3 text-right">{r.powerMinutes}</td>
                        <td className="px-4 py-3">{r.motorStart}</td>
                        <td className="px-4 py-3">{r.motorEnd}</td>
                        <td className="px-4 py-3 text-right">{r.motorMinutes}</td>
                        <td className="px-4 py-3 text-right">{r.volume.toLocaleString()}</td>
                        <td className="px-4 py-3 text-right font-bold text-primary">
                          {idx === rows.length - 1 ? totalVolume.toLocaleString() : "—"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-4 py-3 ${className}`}>{children}</th>;
}
