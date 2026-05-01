import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/StatCard";
import { api } from "@/lib/api";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
});

type DeviceStats = { total: number; active: number; inactive: number };

const FALLBACK: DeviceStats = { total: 1248, active: 1244, inactive: 4 };

function DashboardPage() {
  const [stats, setStats] = useState<DeviceStats>(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .get<DeviceStats>("/devices/stats")
      .then((res) => {
        if (!cancelled) setStats(res.data);
      })
      .catch(() => {
        /* keep fallback */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AppShell subtitle="Regional Water Scheme Monitor">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-steel-500">
            Overview
          </div>
          <h2 className="text-2xl font-semibold tracking-tight">Device fleet status</h2>
        </div>
        <div className="rounded border border-steel-200 bg-white px-3 py-1.5 font-mono text-[11px] uppercase tracking-widest text-steel-500">
          {loading ? "Syncing…" : "Live"}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <StatCard
          label="Total devices"
          value={stats.total.toLocaleString()}
          unit="UNITS"
          tone="neutral"
          footer={<span>Across all districts</span>}
        />
        <StatCard
          label="Active devices"
          value={stats.active.toLocaleString()}
          unit="ONLINE"
          tone="primary"
          footer={
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-[color:var(--success)]" />
              Nominal performance
            </span>
          }
        />
        <StatCard
          label="Inactive devices"
          value={stats.inactive.toString().padStart(3, "0")}
          unit="OFFLINE"
          tone="danger"
          footer={
            <span className="text-destructive">
              Action required for maintenance
            </span>
          }
        />
      </div>

      <div className="mt-8 border border-steel-300 bg-card">
        <div className="flex items-center justify-between border-b border-steel-200 bg-steel-100/60 px-6 py-4">
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-steel-600">
            Real-time telemetry log
          </h3>
          <div className="flex items-center gap-2">
            <span className="size-2 animate-pulse rounded-full bg-primary" />
            <span className="font-mono text-[10px] font-bold text-primary">
              LIVE_FEED
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-steel-50">
              <tr className="border-b border-steel-200 text-[10px] font-bold uppercase tracking-widest text-steel-500">
                <Th>Node ID</Th>
                <Th>Flow rate</Th>
                <Th>Pressure</Th>
                <Th>Turbidity</Th>
                <Th className="text-right">Last check</Th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-100 font-mono text-sm tabular-nums">
              <Row id="SCH-0421-B" flow="412.8 L/m" pressure="64.2 PSI" turbidity="0.08 NTU" time="08:44:12" />
              <Row id="SCH-0422-C" flow="389.1 L/m" pressure="61.8 PSI" turbidity="0.09 NTU" time="08:44:09" />
              <Row id="SCH-0104-A" flow="000.0 L/m" pressure="04.1 PSI" turbidity="--.- NTU" time="08:43:55" alert />
              <Row id="SCH-0423-D" flow="445.6 L/m" pressure="68.0 PSI" turbidity="0.11 NTU" time="08:43:32" />
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  );
}

function Th({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <th className={`px-6 py-3 ${className}`}>{children}</th>;
}

function Row({
  id,
  flow,
  pressure,
  turbidity,
  time,
  alert,
}: {
  id: string;
  flow: string;
  pressure: string;
  turbidity: string;
  time: string;
  alert?: boolean;
}) {
  const cls = alert ? "bg-destructive/5 text-destructive" : "text-steel-700";
  return (
    <tr className={`transition-colors hover:bg-steel-50/80 ${alert ? "bg-destructive/5" : ""}`}>
      <td className={`px-6 py-4 font-semibold ${alert ? "text-destructive" : "text-steel-900"}`}>{id}</td>
      <td className={`px-6 py-4 ${cls}`}>{flow}</td>
      <td className={`px-6 py-4 ${cls}`}>{pressure}</td>
      <td className={`px-6 py-4 ${cls}`}>{turbidity}</td>
      <td className={`px-6 py-4 text-right ${alert ? "text-destructive" : "text-steel-500"}`}>{time}</td>
    </tr>
  );
}
