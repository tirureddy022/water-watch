import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  Field,
  FormShell,
  SubmitBar,
  SuccessBanner,
  inputCls,
} from "@/components/admin/FormShell";
import { api } from "@/lib/api";
import { DISTRICTS_BY_STATE, STATES } from "@/lib/reference-data";

export const Route = createFileRoute("/_app/admin/district")({
  component: DistrictPage,
});

function DistrictPage() {
  const [state, setState] = useState<string>(STATES[0]);
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const existing = useMemo(() => DISTRICTS_BY_STATE[state] ?? [], [state]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(null);
    try {
      await api.post("/admin/districts", { state, name }).catch(() => null);
      setSuccess(`District "${name}" added to ${state}.`);
      setName("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormShell title="Add District" description="Link a district to an existing state." onSubmit={onSubmit}>
      <Field label="State">
        <select value={state} onChange={(e) => setState(e.target.value)} className={inputCls}>
          {STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </Field>
      <Field label="District name">
        <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
      </Field>
      <Field label="Existing districts" full>
        <div className="rounded border border-steel-200 bg-steel-50 px-3 py-2 font-mono text-xs text-steel-600">
          {existing.length ? existing.join(" · ") : "None"}
        </div>
      </Field>
      <SuccessBanner message={success} />
      <SubmitBar submitting={submitting} />
    </FormShell>
  );
}
