import { DISTRICTS_BY_STATE, STATES } from "@/lib/reference-data";
import { inputCls } from "@/components/admin/FormShell";

export type ReportFilters = {
  state: string;
  district: string;
  fromDate: string;
  toDate: string;
};

export function FiltersBar({
  value,
  onChange,
}: {
  value: ReportFilters;
  onChange: (next: ReportFilters) => void;
}) {
  const districts = value.state ? DISTRICTS_BY_STATE[value.state] ?? [] : [];
  return (
    <div className="mb-6 grid grid-cols-1 gap-3 border border-steel-300 bg-card p-4 md:grid-cols-4">
      <Field label="State">
        <select
          className={inputCls}
          value={value.state}
          onChange={(e) =>
            onChange({ ...value, state: e.target.value, district: "" })
          }
        >
          <option value="">All</option>
          {STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </Field>
      <Field label="District">
        <select
          className={inputCls}
          value={value.district}
          onChange={(e) => onChange({ ...value, district: e.target.value })}
          disabled={!value.state}
        >
          <option value="">All</option>
          {districts.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>
      </Field>
      <Field label="From date">
        <input
          type="date"
          className={inputCls}
          value={value.fromDate}
          onChange={(e) => onChange({ ...value, fromDate: e.target.value })}
        />
      </Field>
      <Field label="To date">
        <input
          type="date"
          className={inputCls}
          value={value.toDate}
          onChange={(e) => onChange({ ...value, toDate: e.target.value })}
        />
      </Field>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-steel-500">
        {label}
      </span>
      {children}
    </label>
  );
}

export function todayISO(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}
