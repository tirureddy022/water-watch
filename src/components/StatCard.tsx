import type { ReactNode } from "react";

type Tone = "neutral" | "primary" | "danger" | "success";

const toneBar: Record<Tone, string> = {
  neutral: "bg-steel-200",
  primary: "bg-primary",
  danger: "bg-destructive",
  success: "bg-[color:var(--success)]",
};

const toneNumber: Record<Tone, string> = {
  neutral: "text-steel-900",
  primary: "text-primary",
  danger: "text-destructive",
  success: "text-[color:var(--success)]",
};

export function StatCard({
  label,
  value,
  unit,
  footer,
  tone = "neutral",
}: {
  label: string;
  value: string | number;
  unit?: string;
  footer?: ReactNode;
  tone?: Tone;
}) {
  return (
    <div className="relative overflow-hidden border border-steel-300 bg-card p-6">
      <div className={`absolute left-0 top-0 h-1 w-full ${toneBar[tone]}`} />
      <span className="mb-4 block font-mono text-[10px] font-bold uppercase tracking-widest text-steel-500">
        {label}
      </span>
      <div className="flex items-baseline gap-2">
        <span
          className={`font-mono text-5xl font-medium tabular-nums tracking-tighter ${toneNumber[tone]}`}
        >
          {value}
        </span>
        {unit && (
          <span className="text-xs font-bold uppercase text-steel-500">
            {unit}
          </span>
        )}
      </div>
      {footer && (
        <div className="mt-4 border-t border-steel-100 pt-4 text-[11px] font-semibold uppercase tracking-wide text-steel-600">
          {footer}
        </div>
      )}
    </div>
  );
}
