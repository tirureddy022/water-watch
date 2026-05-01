import { createFileRoute } from "@tanstack/react-router";
import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/_app/alerts")({
  component: AlertsPage,
});

const ALERTS = [
  {
    id: "ALT-2031",
    severity: "critical",
    node: "SCH-0104-A",
    message: "Pressure below operational threshold (4.1 PSI).",
    time: "08:43:55",
  },
  {
    id: "ALT-2030",
    severity: "warning",
    node: "SCH-0512-F",
    message: "No telemetry received in last 5 minutes.",
    time: "08:39:12",
  },
  {
    id: "ALT-2029",
    severity: "info",
    node: "SCH-0421-B",
    message: "Routine maintenance window scheduled for 22:00.",
    time: "07:55:01",
  },
] as const;

function AlertsPage() {
  return (
    <AppShell subtitle="Critical Alerts">
      <div className="mb-6">
        <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-steel-500">
          Incident feed
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">Active alerts</h2>
      </div>

      <div className="space-y-3">
        {ALERTS.map((a) => {
          const Icon =
            a.severity === "critical"
              ? AlertTriangle
              : a.severity === "warning"
                ? Info
                : CheckCircle2;
          const tone =
            a.severity === "critical"
              ? "border-l-destructive bg-destructive/5"
              : a.severity === "warning"
                ? "border-l-[color:var(--warning)] bg-[color:var(--warning)]/10"
                : "border-l-primary bg-primary/5";
          const iconCls =
            a.severity === "critical"
              ? "text-destructive"
              : a.severity === "warning"
                ? "text-[color:var(--warning-foreground)]"
                : "text-primary";
          return (
            <div
              key={a.id}
              className={`flex items-start gap-4 border border-steel-300 border-l-4 bg-card p-5 ${tone}`}
            >
              <Icon className={`mt-0.5 size-5 ${iconCls}`} />
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-steel-500">
                    {a.id} · {a.severity}
                  </span>
                  <span className="font-mono text-[10px] tabular-nums text-steel-400">
                    {a.time}
                  </span>
                </div>
                <div className="mt-1 font-semibold text-steel-900">{a.node}</div>
                <p className="mt-1 text-sm text-steel-700">{a.message}</p>
              </div>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
