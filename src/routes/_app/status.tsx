import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Eye,
  MoreHorizontal,
  PlugZap,
  PowerOff,
  Server,
  User,
  Zap,
  ZapOff,
  X,
} from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { inputCls } from "@/components/admin/FormShell";
import { DEVICES, type DeviceStatus } from "@/lib/mock-devices";
import { DISTRICTS_BY_STATE, STATES } from "@/lib/reference-data";

export const Route = createFileRoute("/_app/status")({
  component: StatusPage,
});

type StatusKey = "" | "online" | "offline" | "powerOn" | "powerOff" | "motorOn" | "motorOff";

type Filters = {
  state: string;
  district: string;
  status: StatusKey;
  date: string;
};

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function applyStatus(d: DeviceStatus, status: StatusKey): boolean {
  switch (status) {
    case "online":
      return d.online;
    case "offline":
      return !d.online;
    case "powerOn":
      return d.powerOn;
    case "powerOff":
      return !d.powerOn;
    case "motorOn":
      return d.motorOn;
    case "motorOff":
      return !d.motorOn;
    default:
      return true;
  }
}

function StatusPage() {
  const [draft, setDraft] = useState<Filters>({
    state: "",
    district: "",
    status: "",
    date: todayISO(),
  });
  const [applied, setApplied] = useState<Filters>(draft);
  const [cardKey, setCardKey] = useState<StatusKey>("");
  const [modal, setModal] = useState<{ kind: "view" | "operator"; device: DeviceStatus } | null>(null);

  const districts = draft.state ? DISTRICTS_BY_STATE[draft.state] ?? [] : [];

  const baseList = useMemo(() => {
    return DEVICES.filter((d) => {
      if (applied.state && d.state !== applied.state) return false;
      if (applied.district && d.district !== applied.district) return false;
      if (!applyStatus(d, applied.status)) return false;
      return true;
    });
  }, [applied]);

  const list = useMemo(
    () => baseList.filter((d) => applyStatus(d, cardKey)),
    [baseList, cardKey],
  );

  const counts = useMemo(
    () => ({
      total: baseList.length,
      powerOn: baseList.filter((d) => d.powerOn).length,
      powerOff: baseList.filter((d) => !d.powerOn).length,
      motorOn: baseList.filter((d) => d.motorOn).length,
      motorOff: baseList.filter((d) => !d.motorOn).length,
    }),
    [baseList],
  );

  return (
    <AppShell subtitle="Network Status">
      <div className="mb-6">
        <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-steel-500">
          Telemetry
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">Status Dashboard</h2>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-3 border border-steel-300 bg-card p-4 md:grid-cols-5">
        <Field label="State">
          <select
            className={inputCls}
            value={draft.state}
            onChange={(e) => setDraft({ ...draft, state: e.target.value, district: "" })}
          >
            <option value="">All</option>
            {STATES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </Field>
        <Field label="District">
          <select
            className={inputCls}
            value={draft.district}
            onChange={(e) => setDraft({ ...draft, district: e.target.value })}
            disabled={!draft.state}
          >
            <option value="">All</option>
            {districts.map((d) => (
              <option key={d}>{d}</option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select
            className={inputCls}
            value={draft.status}
            onChange={(e) => setDraft({ ...draft, status: e.target.value as StatusKey })}
          >
            <option value="">All</option>
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="powerOn">Power On</option>
            <option value="powerOff">Power Off</option>
            <option value="motorOn">Motor On</option>
            <option value="motorOff">Motor Off</option>
          </select>
        </Field>
        <Field label="Current Date">
          <input type="date" className={inputCls} value={draft.date} readOnly />
        </Field>
        <div className="flex items-end">
          <button
            onClick={() => {
              setApplied(draft);
              setCardKey("");
            }}
            className="h-10 w-full bg-steel-900 px-4 font-mono text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-primary"
          >
            Get
          </button>
        </div>
      </div>

      {/* Cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-5">
        <StatCard icon={Server} label="Total Devices" value={counts.total} active={cardKey === ""} onClick={() => setCardKey("")} tone="neutral" />
        <StatCard icon={Zap} label="Power On" value={counts.powerOn} active={cardKey === "powerOn"} onClick={() => setCardKey("powerOn")} tone="primary" />
        <StatCard icon={ZapOff} label="Power Off" value={counts.powerOff} active={cardKey === "powerOff"} onClick={() => setCardKey("powerOff")} tone="danger" />
        <StatCard icon={PlugZap} label="Motor On" value={counts.motorOn} active={cardKey === "motorOn"} onClick={() => setCardKey("motorOn")} tone="success" />
        <StatCard icon={PowerOff} label="Motor Off" value={counts.motorOff} active={cardKey === "motorOff"} onClick={() => setCardKey("motorOff")} tone="danger" />
      </div>

      {/* Table */}
      <div className="border border-steel-300 bg-card">
        <div className="border-b border-steel-200 bg-steel-100/60 px-6 py-3">
          <h3 className="font-mono text-xs font-bold uppercase tracking-widest text-steel-600">
            Schemes — {list.length} results
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-steel-50">
              <tr className="border-b border-steel-200 text-[10px] font-bold uppercase tracking-widest text-steel-500">
                <th className="px-6 py-3">Schema Name</th>
                <th className="px-6 py-3">State</th>
                <th className="px-6 py-3">District</th>
                <th className="px-6 py-3">Power Status</th>
                <th className="px-6 py-3">Motor Status</th>
                <th className="px-6 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-100 font-mono text-sm">
              {list.slice(0, 50).map((d) => (
                <tr key={d.id} className="hover:bg-steel-50/60">
                  <td className="px-6 py-3 font-semibold text-steel-900">{d.id}</td>
                  <td className="px-6 py-3 text-steel-700">{d.state}</td>
                  <td className="px-6 py-3 text-steel-700">{d.district}</td>
                  <td className="px-6 py-3"><Pill on={d.powerOn} /></td>
                  <td className="px-6 py-3"><Pill on={d.motorOn} /></td>
                  <td className="px-6 py-3 text-right">
                    <ActionMenu
                      onView={() => setModal({ kind: "view", device: d })}
                      onOperator={() => setModal({ kind: "operator", device: d })}
                    />
                  </td>
                </tr>
              ))}
              {list.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-10 text-center font-mono text-sm text-steel-500">
                    No devices match the filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <Modal onClose={() => setModal(null)}>
          {modal.kind === "view" ? (
            <ShiftReport device={modal.device} date={applied.date} />
          ) : (
            <OperatorDetails device={modal.device} />
          )}
        </Modal>
      )}
    </AppShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-steel-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function Pill({ on }: { on: boolean }) {
  return (
    <span
      className={
        "inline-flex items-center gap-1.5 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-widest " +
        (on
          ? "bg-[color:var(--success)]/15 text-[color:var(--success)]"
          : "bg-destructive/10 text-destructive")
      }
    >
      <span className={"size-1.5 rounded-full " + (on ? "bg-[color:var(--success)]" : "bg-destructive")} />
      {on ? "ON" : "OFF"}
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  active,
  onClick,
  tone,
}: {
  icon: typeof Server;
  label: string;
  value: number;
  active: boolean;
  onClick: () => void;
  tone: "neutral" | "primary" | "danger" | "success";
}) {
  const toneRing: Record<string, string> = {
    neutral: "text-steel-700 bg-steel-100",
    primary: "text-primary bg-primary/10",
    danger: "text-destructive bg-destructive/10",
    success: "text-[color:var(--success)] bg-[color:var(--success)]/10",
  };
  return (
    <button
      onClick={onClick}
      className={
        "flex items-center gap-3 border p-3 text-left transition-all " +
        (active
          ? "border-steel-900 bg-card ring-2 ring-primary"
          : "border-steel-300 bg-card hover:border-steel-500")
      }
    >
      <div className={`flex size-10 items-center justify-center ${toneRing[tone]}`}>
        <Icon className="size-5" />
      </div>
      <div className="min-w-0">
        <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-steel-500">
          {label}
        </div>
        <div className="font-mono text-xl font-medium tabular-nums text-steel-900">
          {value.toLocaleString()}
        </div>
      </div>
    </button>
  );
}

function ActionMenu({ onView, onOperator }: { onView: () => void; onOperator: () => void }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        className="inline-flex items-center gap-1 border border-steel-300 bg-white px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-widest text-steel-700 hover:border-steel-500"
      >
        Action <MoreHorizontal className="size-3" />
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-1 w-40 border border-steel-300 bg-white shadow-lg">
          <button
            className="flex w-full items-center gap-2 px-3 py-2 text-left font-mono text-xs hover:bg-steel-50"
            onMouseDown={(e) => {
              e.preventDefault();
              setOpen(false);
              onView();
            }}
          >
            <Eye className="size-3.5" /> View
          </button>
          <button
            className="flex w-full items-center gap-2 px-3 py-2 text-left font-mono text-xs hover:bg-steel-50"
            onMouseDown={(e) => {
              e.preventDefault();
              setOpen(false);
              onOperator();
            }}
          >
            <User className="size-3.5" /> Operator
          </button>
        </div>
      )}
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-steel-900/60 p-4" onClick={onClose}>
      <div
        className="relative max-h-[85vh] w-full max-w-4xl overflow-auto border border-steel-300 bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded p-1 text-steel-500 hover:bg-steel-100"
        >
          <X className="size-4" />
        </button>
        {children}
      </div>
    </div>
  );
}

// Deterministic shift data per device
function shiftsFor(device: DeviceStatus, date: string) {
  let s = 0;
  for (const ch of device.id + date) s = (s * 31 + ch.charCodeAt(0)) % 99991;
  const next = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  const shifts = [
    { name: "Shift 1", pStart: "06:00", pEnd: "14:00" },
    { name: "Shift 2", pStart: "14:00", pEnd: "22:00" },
    { name: "Shift 3", pStart: "22:00", pEnd: "06:00" },
  ];
  return shifts.map((sh) => {
    const powerMin = 420 + Math.floor(next() * 60);
    const motorMin = Math.floor(powerMin * (0.55 + next() * 0.3));
    const flowLpm = 380 + Math.floor(next() * 80);
    const volume = motorMin * flowLpm;
    const mStartH = parseInt(sh.pStart.slice(0, 2), 10);
    const mStart = `${String(mStartH).padStart(2, "0")}:${String(15 + Math.floor(next() * 20)).padStart(2, "0")}`;
    const mEndH = (mStartH + Math.floor(motorMin / 60)) % 24;
    const mEnd = `${String(mEndH).padStart(2, "0")}:${String(Math.floor(next() * 59)).padStart(2, "0")}`;
    return { ...sh, powerMin, motorMin, mStart, mEnd, volume };
  });
}

function ShiftReport({ device, date }: { device: DeviceStatus; date: string }) {
  const shifts = shiftsFor(device, date);
  const total = shifts.reduce((a, s) => a + s.volume, 0);
  return (
    <div className="p-6">
      <div className="mb-4">
        <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
          Schema Report
        </div>
        <h3 className="text-lg font-semibold">
          {device.id} — {device.district}, {device.state}
        </h3>
        <p className="font-mono text-xs text-steel-500">Date: {date}</p>
      </div>
      <div className="overflow-x-auto border border-steel-300">
        <table className="w-full text-left font-mono text-xs">
          <thead className="bg-steel-100/60">
            <tr className="text-[10px] font-bold uppercase tracking-widest text-steel-500">
              <th className="px-3 py-2">Shift</th>
              <th className="px-3 py-2">Power Start</th>
              <th className="px-3 py-2">Power End</th>
              <th className="px-3 py-2">Power (min)</th>
              <th className="px-3 py-2">Motor Start</th>
              <th className="px-3 py-2">Motor End</th>
              <th className="px-3 py-2">Motor (min)</th>
              <th className="px-3 py-2 text-right">Volume (L)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-steel-100 tabular-nums">
            {shifts.map((s) => (
              <tr key={s.name}>
                <td className="px-3 py-2 font-semibold text-steel-900">{s.name}</td>
                <td className="px-3 py-2">{s.pStart}</td>
                <td className="px-3 py-2">{s.pEnd}</td>
                <td className="px-3 py-2">{s.powerMin}</td>
                <td className="px-3 py-2">{s.mStart}</td>
                <td className="px-3 py-2">{s.mEnd}</td>
                <td className="px-3 py-2">{s.motorMin}</td>
                <td className="px-3 py-2 text-right">{s.volume.toLocaleString()}</td>
              </tr>
            ))}
            <tr className="bg-steel-100/60 font-semibold">
              <td className="px-3 py-2 uppercase tracking-widest text-steel-700" colSpan={7}>
                Total Volume Pumped (Day)
              </td>
              <td className="px-3 py-2 text-right text-steel-900">{total.toLocaleString()} L</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function OperatorDetails({ device }: { device: DeviceStatus }) {
  // Deterministic operator
  const NAMES = ["Ravi Kumar", "Suresh Patil", "Anil Reddy", "Mahesh Iyer", "Vikram Naidu", "Pradeep Rao"];
  let s = 0;
  for (const ch of device.id) s = (s * 31 + ch.charCodeAt(0)) % 9999;
  const name = NAMES[s % NAMES.length];
  const phone = `+91 9${String(100000000 + (s * 7919) % 899999999)}`;
  const empId = `EMP-${String(1000 + (s % 9000))}`;
  return (
    <div className="p-6">
      <div className="mb-4">
        <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
          Operator Details
        </div>
        <h3 className="text-lg font-semibold">{device.id}</h3>
      </div>
      <dl className="grid grid-cols-2 gap-x-6 gap-y-3 border border-steel-300 bg-white p-5 font-mono text-sm">
        <Detail label="Operator Name" value={name} />
        <Detail label="Employee ID" value={empId} />
        <Detail label="Phone" value={phone} />
        <Detail label="Shift" value="06:00 — 14:00" />
        <Detail label="State" value={device.state} />
        <Detail label="District" value={device.district} />
        <Detail label="Schema" value={device.id} />
        <Detail label="Status" value={device.online ? "ON DUTY" : "OFF DUTY"} />
      </dl>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-mono text-[10px] font-bold uppercase tracking-widest text-steel-500">
        {label}
      </dt>
      <dd className="mt-0.5 text-steel-900">{value}</dd>
    </div>
  );
}
