import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/_app/status")({
  component: StatusPage,
});

const NODES = [
  { id: "SCH-0421-B", region: "Pune", uptime: 99.8, status: "OPERATIONAL" },
  { id: "SCH-0422-C", region: "Pune", uptime: 99.4, status: "OPERATIONAL" },
  { id: "SCH-0104-A", region: "Nashik", uptime: 64.2, status: "DEGRADED" },
  { id: "SCH-0423-D", region: "Mumbai", uptime: 99.9, status: "OPERATIONAL" },
  { id: "SCH-0512-F", region: "Nagpur", uptime: 0, status: "OFFLINE" },
] as const;

function StatusPage() {
  return (
    <AppShell subtitle="Network Status">
      <div className="mb-6">
        <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-steel-500">
          Telemetry
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">Per-node operational status</h2>
      </div>

      <div className="border border-steel-300 bg-card">
        <table className="w-full text-left">
          <thead className="bg-steel-100/60">
            <tr className="border-b border-steel-200 text-[10px] font-bold uppercase tracking-widest text-steel-500">
              <th className="px-6 py-3">Node ID</th>
              <th className="px-6 py-3">Region</th>
              <th className="px-6 py-3">Uptime</th>
              <th className="px-6 py-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-steel-100 font-mono text-sm tabular-nums">
            {NODES.map((n) => {
              const tone =
                n.status === "OPERATIONAL"
                  ? "text-[color:var(--success)]"
                  : n.status === "DEGRADED"
                    ? "text-[color:var(--warning-foreground)] bg-[color:var(--warning)]/15"
                    : "text-destructive";
              return (
                <tr key={n.id} className="hover:bg-steel-50/60">
                  <td className="px-6 py-4 font-semibold text-steel-900">{n.id}</td>
                  <td className="px-6 py-4 text-steel-700">{n.region}</td>
                  <td className="px-6 py-4 text-steel-700">{n.uptime.toFixed(1)}%</td>
                  <td className="px-6 py-4 text-right">
                    <span className={`px-2 py-1 text-[10px] font-bold uppercase tracking-widest ${tone}`}>
                      {n.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
