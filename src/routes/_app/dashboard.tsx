import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import {
  Activity,
  CircuitBoard,
  Cpu,
  Gauge,
  PlugZap,
  PowerOff,
  Radio,
  Server,
  WifiOff,
  Workflow,
  Zap,
  ZapOff,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { StatCard } from "@/components/StatCard";
import { api } from "@/lib/api";
import { DEVICES } from "@/lib/mock-devices";

export const Route = createFileRoute("/_app/dashboard")({
  component: DashboardPage,
});

type DeviceStats = { total: number; active: number; inactive: number };
const FALLBACK: DeviceStats = { total: 1248, active: 1244, inactive: 4 };

function DashboardPage() {
  const [, setStats] = useState<DeviceStats>(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .get<DeviceStats>("/devices/stats")
      .then((res) => {
        if (!cancelled) setStats(res.data);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const counts = useMemo(() => {
    const total = DEVICES.length;
    const online = DEVICES.filter((d) => d.online).length;
    const offline = total - online;
    const inUse = DEVICES.filter((d) => d.inUse).length;
    const notInUse = total - inUse;
    const powerOn = DEVICES.filter((d) => d.powerOn).length;
    const powerOff = total - powerOn;
    const motorOn = DEVICES.filter((d) => d.motorOn).length;
    const motorOff = total - motorOn;
    const schemesRunning = DEVICES.filter((d) => d.powerOn && d.online).length;
    return {
      total,
      online,
      offline,
      inUse,
      notInUse,
      powerOn,
      powerOff,
      motorOn,
      motorOff,
      schemesRunning,
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

      {/* Pie charts */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <PieCard
          title="Power status"
          on={counts.powerOn}
          off={counts.powerOff}
          onLabel="Power On"
          offLabel="Power Off"
          onColor="oklch(0.62 0.19 250)"
          offColor="oklch(0.55 0.22 25)"
        />
        <PieCard
          title="GPS connectivity"
          on={counts.online}
          off={counts.offline}
          onLabel="Online"
          offLabel="Offline"
          onColor="oklch(0.7 0.17 160)"
          offColor="oklch(0.6 0.04 260)"
        />
        <PieCard
          title="Motor status"
          on={counts.motorOn}
          off={counts.motorOff}
          onLabel="Motor On"
          offLabel="Motor Off"
          onColor="oklch(0.68 0.16 70)"
          offColor="oklch(0.55 0.22 25)"
        />
      </div>

      {/* Stat cards with icons */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
        <IconStat icon={Server} label="Total Devices" value={counts.total} tone="neutral" />
        <IconStat icon={Workflow} label="Total Schemes Running" value={counts.schemesRunning} tone="primary" />
        <IconStat icon={Radio} label="Online Schemes" value={counts.online} tone="success" />
        <IconStat icon={WifiOff} label="Offline Schemes" value={counts.offline} tone="danger" />
        <IconStat icon={CircuitBoard} label="Not In Use" value={counts.notInUse} tone="neutral" />
        <IconStat icon={Zap} label="Power On" value={counts.powerOn} tone="primary" />
        <IconStat icon={ZapOff} label="Power Off" value={counts.powerOff} tone="danger" />
        <IconStat icon={PlugZap} label="Motor On" value={counts.motorOn} tone="success" />
        <IconStat icon={PowerOff} label="Motor Off" value={counts.motorOff} tone="danger" />
      </div>

      <div className="mt-8 border border-steel-300 bg-card">
        <div className="flex items-center justify-between border-b border-steel-200 bg-steel-100/60 px-6 py-4">
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-steel-600">
            Real-time telemetry log
          </h3>
          <div className="flex items-center gap-2">
            <span className="size-2 animate-pulse rounded-full bg-primary" />
            <span className="font-mono text-[10px] font-bold text-primary">LIVE_FEED</span>
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

function PieCard({
  title,
  on,
  off,
  onLabel,
  offLabel,
  onColor,
  offColor,
}: {
  title: string;
  on: number;
  off: number;
  onLabel: string;
  offLabel: string;
  onColor: string;
  offColor: string;
}) {
  const total = on + off;
  const data = [
    { name: onLabel, value: on, color: onColor },
    { name: offLabel, value: off, color: offColor },
  ];
  return (
    <div className="relative overflow-hidden border border-steel-300 bg-card p-5">
      <div className="absolute left-0 top-0 h-1 w-full bg-steel-200" />
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-steel-500">
          {title}
        </span>
        <Gauge className="size-4 text-steel-400" />
      </div>
      <div className="flex items-center gap-4">
        <div className="relative h-36 w-36 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                innerRadius={42}
                outerRadius={62}
                paddingAngle={2}
                stroke="none"
              >
                {data.map((d) => (
                  <Cell key={d.name} fill={d.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 11,
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 0,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-col gap-3 text-xs">
          <Legend color={onColor} label={onLabel} value={on} />
          <Legend color={offColor} label={offLabel} value={off} />
          <div className="border-t border-steel-100 pt-2 font-mono text-[10px] uppercase tracking-widest text-steel-500">
            Total {total}
          </div>
        </div>
      </div>
    </div>
  );
}

function Legend({ color, label, value }: { color: string; label: string; value: number }) {
  return (
    <div className="flex items-center gap-2">
      <span className="size-2.5" style={{ backgroundColor: color }} />
      <span className="font-mono text-[11px] uppercase tracking-wide text-steel-600">{label}</span>
      <span className="ml-auto font-mono text-sm font-medium tabular-nums text-steel-900">
        {value}
      </span>
    </div>
  );
}

function IconStat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Activity;
  label: string;
  value: number;
  tone: "neutral" | "primary" | "danger" | "success";
}) {
  const toneRing: Record<string, string> = {
    neutral: "text-steel-700 bg-steel-100",
    primary: "text-primary bg-primary/10",
    danger: "text-destructive bg-destructive/10",
    success: "text-[color:var(--success)] bg-[color:var(--success)]/10",
  };
  return (
    <div className="relative flex items-center gap-4 overflow-hidden border border-steel-300 bg-card p-4">
      <div className={`flex size-11 items-center justify-center ${toneRing[tone]}`}>
        <Icon className="size-5" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-steel-500">
          {label}
        </div>
        <div className="font-mono text-2xl font-medium tabular-nums text-steel-900">
          {value.toLocaleString()}
        </div>
      </div>
      <Cpu className="size-4 text-steel-300" />
    </div>
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
