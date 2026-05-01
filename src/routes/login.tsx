import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Droplet } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      navigate({ to: "/dashboard" });
    } catch {
      setError("Login failed. Check your credentials and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="data-grid min-h-dvh bg-steel-50 px-4 py-12">
      <div className="mx-auto flex max-w-md flex-col items-center">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-sm bg-steel-900 text-primary">
            <Droplet className="size-5" />
          </div>
          <div className="font-mono text-sm font-semibold uppercase tracking-tighter">
            HydroMetric OS
          </div>
        </div>

        <div className="w-full border border-steel-300 bg-card p-8 shadow-sm">
          <div className="mb-6 border-b border-steel-200 pb-4">
            <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary">
              SECURE_TERMINAL
            </div>
            <h1 className="mt-1 text-xl font-semibold text-steel-900">
              Operator Sign In
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Enter your credentials to access the monitoring console.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Email" htmlFor="email">
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-steel-300 bg-white px-3 py-2 font-mono text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </Field>

            <Field label="Password" htmlFor="password">
              <input
                id="password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-steel-300 bg-white px-3 py-2 font-mono text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </Field>

            {error && (
              <div className="border border-destructive/30 bg-destructive/5 px-3 py-2 text-xs font-semibold uppercase text-destructive">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-steel-900 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-steel-800 disabled:opacity-50"
            >
              {submitting ? "Authenticating…" : "Sign In"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            No account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-primary hover:underline"
            >
              Request access
            </Link>
          </p>
        </div>

        <p className="mt-6 text-center font-mono text-[10px] uppercase tracking-widest text-steel-500">
          Tip: emails starting with <span className="text-primary">admin</span>{" "}
          get the Admin role in preview mode.
        </p>
      </div>
    </div>
  );
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label htmlFor={htmlFor} className="block">
      <span className="mb-1 block font-mono text-[10px] font-bold uppercase tracking-widest text-steel-500">
        {label}
      </span>
      {children}
    </label>
  );
}
