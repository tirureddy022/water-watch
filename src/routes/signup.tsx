import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useMemo, useState, type FormEvent } from "react";
import { useAuth, type SignUpPayload } from "@/lib/auth";
import {
  DESIGNATIONS,
  DISTRICTS_BY_STATE,
  ROLES,
  STATES,
} from "@/lib/reference-data";

export const Route = createFileRoute("/signup")({
  component: SignUpPage,
});

function SignUpPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<SignUpPayload>({
    name: "",
    email: "",
    phone: "",
    password: "",
    role: ROLES[0],
    designation: DESIGNATIONS[0],
    state: STATES[0],
    district: DISTRICTS_BY_STATE[STATES[0]][0],
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const districts = useMemo(
    () => DISTRICTS_BY_STATE[form.state] ?? [],
    [form.state],
  );

  const update = <K extends keyof SignUpPayload>(
    key: K,
    value: SignUpPayload[K],
  ) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await signup(form);
      navigate({ to: "/dashboard" });
    } catch {
      setError("Sign up failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="data-grid min-h-dvh bg-steel-50 px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <div className="border border-steel-300 bg-card p-8 shadow-sm">
          <div className="mb-6 border-b border-steel-200 pb-4">
            <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
              ACCESS_REQUEST
            </div>
            <h1 className="mt-1 text-xl font-semibold">Create Operator Account</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Provide your details to register on the monitoring network.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field label="Full name">
              <input
                required
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Email">
              <input
                required
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Phone number">
              <input
                required
                value={form.phone}
                onChange={(e) => update("phone", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Password">
              <input
                required
                type="password"
                minLength={6}
                value={form.password}
                onChange={(e) => update("password", e.target.value)}
                className={inputCls}
              />
            </Field>
            <Field label="Role">
              <select
                value={form.role}
                onChange={(e) => update("role", e.target.value)}
                className={inputCls}
              >
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Designation">
              <select
                value={form.designation}
                onChange={(e) => update("designation", e.target.value)}
                className={inputCls}
              >
                {DESIGNATIONS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="State">
              <select
                value={form.state}
                onChange={(e) => {
                  const next = e.target.value;
                  update("state", next);
                  update("district", DISTRICTS_BY_STATE[next]?.[0] ?? "");
                }}
                className={inputCls}
              >
                {STATES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="District">
              <select
                value={form.district}
                onChange={(e) => update("district", e.target.value)}
                className={inputCls}
              >
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </Field>

            {error && (
              <div className="md:col-span-2 border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs font-semibold uppercase text-destructive">
                {error}
              </div>
            )}

            <div className="md:col-span-2 flex items-center justify-between gap-4 pt-2">
              <Link
                to="/login"
                className="font-mono text-[11px] uppercase tracking-widest text-muted-foreground hover:text-foreground"
              >
                ← Back to sign in
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="bg-steel-900 px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-steel-800 disabled:opacity-50"
              >
                {submitting ? "Submitting…" : "Create account"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const inputCls =
  "w-full border border-steel-300 bg-white px-3 py-2 font-mono text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring";

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
