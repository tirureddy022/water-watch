import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  Field,
  FormShell,
  SubmitBar,
  SuccessBanner,
  inputCls,
} from "@/components/admin/FormShell";
import { api } from "@/lib/api";

export const Route = createFileRoute("/_app/admin/state")({
  component: StatePage,
});

function StatePage() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(null);
    try {
      await api.post("/admin/states", { name, code }).catch(() => null);
      setSuccess(`State "${name}" saved.`);
      setName("");
      setCode("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormShell
      title="Add State"
      description="Register a new state in the network."
      onSubmit={onSubmit}
    >
      <Field label="State name">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputCls}
        />
      </Field>
      <Field label="State code">
        <input
          required
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className={inputCls}
          maxLength={4}
        />
      </Field>
      <SuccessBanner message={success} />
      <SubmitBar submitting={submitting} />
    </FormShell>
  );
}
