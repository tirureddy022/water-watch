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
import { DESIGNATIONS } from "@/lib/reference-data";

export const Route = createFileRoute("/_app/admin/technician")({
  component: TechnicianPage,
});

function TechnicianPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [designation, setDesignation] = useState<string>(DESIGNATIONS[0]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess(null);
    try {
      await api
        .post("/admin/technicians", { name, phone, email, designation })
        .catch(() => null);
      setSuccess(`Technician ${name} added.`);
      setName("");
      setPhone("");
      setEmail("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <FormShell
      title="Add Technician"
      description="Register field staff who service devices on the ground."
      onSubmit={onSubmit}
    >
      <Field label="Full name">
        <input required value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
      </Field>
      <Field label="Phone number">
        <input required value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} />
      </Field>
      <Field label="Email">
        <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} />
      </Field>
      <Field label="Designation">
        <select value={designation} onChange={(e) => setDesignation(e.target.value)} className={inputCls}>
          {DESIGNATIONS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </Field>
      <SuccessBanner message={success} />
      <SubmitBar submitting={submitting} />
    </FormShell>
  );
}
