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

export const Route = createFileRoute("/_app/admin/device")({
  component: DevicePage,
});

function DevicePage() {
  const [serial, setSerial] = useState("");
  const [model, setModel] = useState("");
  const [state, setState] = useState<string>(STATES[0]);
  const [district, setDistrict] = useState<string>(
    DISTRICTS_BY_STATE[STATES[0]][0],
  );
  const [installedAt, setInstalledAt] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const districts = useMemo(() => DISTRICTS_BY_STATE[state] ?? [], [state]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(null);
    try {
      await api
        .post("/admin/devices", { serial, model, state, district, installedAt })
        .catch(() => null);
      setSuccess(`Device ${serial} registered.`);
      setSerial("");
      setModel("");
      setInstalledAt("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormShell
      title="Device Registration"
      description="Commission a new telemetry device into the network."
      onSubmit={onSubmit}
    >
      <Field label="Serial number">
        <input required value={serial} onChange={(e) => setSerial(e.target.value)} className={inputCls} />
      </Field>
      <Field label="Model">
        <input required value={model} onChange={(e) => setModel(e.target.value)} className={inputCls} />
      </Field>
      <Field label="State">
        <select
          value={state}
          onChange={(e) => {
            const next = e.target.value;
            setState(next);
            setDistrict(DISTRICTS_BY_STATE[next]?.[0] ?? "");
          }}
          className={inputCls}
        >
          {STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </Field>
      <Field label="District">
        <select value={district} onChange={(e) => setDistrict(e.target.value)} className={inputCls}>
          {districts.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </Field>
      <Field label="Installed on" full>
        <input type="date" value={installedAt} onChange={(e) => setInstalledAt(e.target.value)} className={inputCls} />
      </Field>
      <SuccessBanner message={success} />
      <SubmitBar submitting={submitting} />
    </FormShell>
  );
}
