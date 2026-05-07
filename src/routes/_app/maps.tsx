import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { LeafletMap } from "@/components/maps/LeafletMap";
import {
  DEVICES,
  filterDevices,
  type DeviceFilterKey,
  type DeviceStatus,
} from "@/lib/mock-devices";

export const Route = createFileRoute("/_app/maps")({
  component: MapsPage,
});

const FILTERS: Array<{ key: DeviceFilterKey; label: string; tone: string }> = [
  { key: "all", label: "All Devices", tone: "bg-steel-900 text-white" },
  { key: "online", label: "Online", tone: "bg-[color:var(--success)] text-white" },
  { key: "offline", label: "Offline", tone: "bg-destructive text-white" },
  { key: "notInUse", label: "Not in Use", tone: "bg-steel-500 text-white" },
  { key: "powerOn", label: "Power ON", tone: "bg-primary text-white" },
  { key: "powerOff", label: "Power OFF", tone: "bg-steel-700 text-white" },
  { key: "motorOn", label: "Motor ON", tone: "bg-[color:var(--warning)] text-steel-900" },
  { key: "motorOff", label: "Motor OFF", tone: "bg-steel-300 text-steel-900" },
];

function counts(devices: DeviceStatus[]) {
  return {
    all: devices.length,
    online: devices.filter((d) => d.online).length,
    offline: devices.filter((d) => !d.online).length,
    notInUse: devices.filter((d) => !d.inUse).length,
    powerOn: devices.filter((d) => d.powerOn).length,
    powerOff: devices.filter((d) => !d.powerOn).length,
    motorOn: devices.filter((d) => d.motorOn).length,
    motorOff: devices.filter((d) => !d.motorOn).length,
  };
}

function MapsPage() {
  const [active, setActive] = useState<DeviceFilterKey>("all");
  const c = useMemo(() => counts(DEVICES), []);
  const visible = useMemo(() => filterDevices(DEVICES, active), [active]);

  return (
    <AppShell subtitle="Geographic Distribution">
      <div className="mb-6">
        <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-steel-500">
          Maps
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">Device locations</h2>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8">
        {FILTERS.map((f) => {
          const value = c[f.key];
          const isActive = active === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setActive(f.key)}
              className={
                "flex flex-col items-start gap-1 border p-3 text-left transition-all " +
                (isActive
                  ? "border-steel-900 ring-2 ring-primary"
                  : "border-steel-300 bg-card hover:border-steel-500")
              }
            >
              <span className={"px-2 py-0.5 font-mono text-[9px] font-bold uppercase tracking-widest " + f.tone}>
                {f.label}
              </span>
              <span className="font-mono text-2xl font-bold tabular-nums text-steel-900">
                {value}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative border border-steel-300 bg-card">
        <div className="border-b border-steel-200 bg-steel-100/60 px-6 py-3">
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-steel-600">
            {FILTERS.find((f) => f.key === active)?.label} — {visible.length} devices
          </h3>
        </div>
        <LeafletMap devices={visible} />
      </div>
    </AppShell>
  );
}
