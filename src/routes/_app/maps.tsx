import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
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

// Bounding box for the demo states (covers Southern + Western India)
const BOUNDS = { minLat: 8, maxLat: 22, minLng: 73, maxLng: 84 };

function project(lat: number, lng: number, w: number, h: number) {
  const x = ((lng - BOUNDS.minLng) / (BOUNDS.maxLng - BOUNDS.minLng)) * w;
  const y = h - ((lat - BOUNDS.minLat) / (BOUNDS.maxLat - BOUNDS.minLat)) * h;
  return { x, y };
}

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
  const [hover, setHover] = useState<DeviceStatus | null>(null);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const c = useMemo(() => counts(DEVICES), []);
  const visible = useMemo(() => filterDevices(DEVICES, active), [active]);

  const W = 1000;
  const H = 600;

  const colorFor = (d: DeviceStatus): string => {
    if (active === "online") return "var(--success)";
    if (active === "offline") return "var(--destructive)";
    if (active === "powerOn") return "var(--primary)";
    if (active === "powerOff") return "var(--steel-700)";
    if (active === "motorOn") return "var(--warning)";
    if (active === "motorOff") return "var(--steel-500)";
    if (active === "notInUse") return "var(--steel-500)";
    if (!d.online) return "var(--destructive)";
    if (d.motorOn) return "var(--warning)";
    if (d.powerOn) return "var(--primary)";
    return "var(--steel-500)";
  };

  return (
    <AppShell subtitle="Geographic Distribution">
      <div className="mb-6">
        <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-steel-500">
          Maps
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Device locations
        </h2>
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

        <div className="data-grid relative">
          <svg
            viewBox={`0 0 ${W} ${H}`}
            className="h-[60vh] w-full"
            onMouseLeave={() => {
              setHover(null);
              setPos(null);
            }}
          >
            {/* faint grid */}
            {[...Array(11)].map((_, i) => (
              <line
                key={`v${i}`}
                x1={(i * W) / 10}
                y1={0}
                x2={(i * W) / 10}
                y2={H}
                stroke="var(--steel-200)"
                strokeWidth={1}
              />
            ))}
            {[...Array(7)].map((_, i) => (
              <line
                key={`h${i}`}
                x1={0}
                y1={(i * H) / 6}
                x2={W}
                y2={(i * H) / 6}
                stroke="var(--steel-200)"
                strokeWidth={1}
              />
            ))}

            {visible.map((d) => {
              const { x, y } = project(d.lat, d.lng, W, H);
              return (
                <circle
                  key={d.id}
                  cx={x}
                  cy={y}
                  r={hover?.id === d.id ? 9 : 6}
                  fill={colorFor(d)}
                  fillOpacity={0.85}
                  stroke="white"
                  strokeWidth={1.5}
                  className="cursor-pointer transition-all"
                  onMouseEnter={(e) => {
                    const rect = (e.currentTarget.ownerSVGElement as SVGSVGElement).getBoundingClientRect();
                    setHover(d);
                    setPos({
                      x: ((x / W) * rect.width),
                      y: ((y / H) * rect.height),
                    });
                  }}
                />
              );
            })}
          </svg>

          {hover && pos && (
            <div
              className="pointer-events-none absolute z-10 w-64 -translate-x-1/2 -translate-y-full border border-steel-900 bg-steel-900 p-3 text-xs text-white shadow-xl"
              style={{ left: pos.x, top: pos.y - 12 }}
            >
              <div className="mb-1 font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
                {hover.id}
              </div>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px]">
                <span className="text-steel-500">State</span>
                <span>{hover.state}</span>
                <span className="text-steel-500">District</span>
                <span>{hover.district}</span>
                <span className="text-steel-500">Lat</span>
                <span>{hover.lat.toFixed(4)}</span>
                <span className="text-steel-500">Lng</span>
                <span>{hover.lng.toFixed(4)}</span>
                <span className="text-steel-500">Status</span>
                <span className={hover.online ? "text-[color:var(--success)]" : "text-destructive"}>
                  {hover.online ? "ONLINE" : "OFFLINE"}
                </span>
                <span className="text-steel-500">Power</span>
                <span>{hover.powerOn ? "ON" : "OFF"}</span>
                <span className="text-steel-500">Motor</span>
                <span>{hover.motorOn ? "ON" : "OFF"}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
