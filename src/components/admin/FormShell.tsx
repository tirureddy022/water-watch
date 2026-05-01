import type { ReactNode } from "react";

export const inputCls =
  "w-full border border-steel-300 bg-white px-3 py-2 font-mono text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring";

export function FormShell({
  title,
  description,
  onSubmit,
  children,
}: {
  title: string;
  description?: string;
  onSubmit: (e: React.FormEvent) => void;
  children: ReactNode;
}) {
  return (
    <form
      onSubmit={onSubmit}
      className="border border-steel-300 bg-card p-8 shadow-sm"
    >
      <div className="mb-6 border-b border-steel-200 pb-4">
        <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
          FORM
        </div>
        <h3 className="mt-1 text-lg font-semibold">{title}</h3>
        {description && (
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">{children}</div>
    </form>
  );
}

export function Field({
  label,
  children,
  full,
}: {
  label: string;
  children: ReactNode;
  full?: boolean;
}) {
  return (
    <label className={`block ${full ? "md:col-span-2" : ""}`}>
      <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-steel-500">
        {label}
      </span>
      {children}
    </label>
  );
}

export function SubmitBar({ submitting }: { submitting: boolean }) {
  return (
    <div className="md:col-span-2 flex justify-end pt-2">
      <button
        type="submit"
        disabled={submitting}
        className="bg-steel-900 px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-steel-800 disabled:opacity-50"
      >
        {submitting ? "Saving…" : "Save"}
      </button>
    </div>
  );
}

export function SuccessBanner({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="md:col-span-2 border border-[color:var(--success)]/40 bg-[color:var(--success)]/10 px-3 py-2 text-xs font-semibold uppercase text-[color:var(--success)]">
      {message}
    </div>
  );
}
