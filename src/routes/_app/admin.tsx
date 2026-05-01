import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useLocation,
} from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";
import { getStoredUser } from "@/lib/api";

export const Route = createFileRoute("/_app/admin")({
  beforeLoad: () => {
    if (typeof window === "undefined") return;
    const u = getStoredUser();
    if (!u) throw redirect({ to: "/login" });
    if ((u.role ?? "").toUpperCase() !== "ADMIN") {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: AdminLayout,
});

const TABS = [
  { to: "/admin/state", label: "State" },
  { to: "/admin/district", label: "District" },
  { to: "/admin/signup", label: "SignUp" },
  { to: "/admin/device", label: "Device Registration" },
  { to: "/admin/technician", label: "Technician" },
] as const;

function AdminLayout() {
  const { pathname } = useLocation();
  return (
    <AppShell subtitle="Admin Console">
      <div className="mb-6">
        <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-steel-500">
          Administration
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Network configuration
        </h2>
      </div>

      <div className="mb-6 flex flex-wrap gap-1 border border-steel-300 bg-white p-1">
        {TABS.map((t) => {
          const active =
            pathname === t.to ||
            (t.to === "/admin/state" && pathname === "/admin");
          return (
            <Link
              key={t.to}
              to={t.to}
              className={
                "px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-widest transition-colors " +
                (active
                  ? "bg-steel-900 text-white"
                  : "text-steel-600 hover:bg-steel-100")
              }
            >
              {t.label}
            </Link>
          );
        })}
      </div>

      <Outlet />
    </AppShell>
  );
}
