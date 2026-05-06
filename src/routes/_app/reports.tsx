import {
  createFileRoute,
  Link,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { AppShell } from "@/components/layout/AppShell";

export const Route = createFileRoute("/_app/reports")({
  component: ReportsLayout,
});

const TABS = [
  { to: "/reports/summary", label: "Summary" },
  { to: "/reports/water-monitor", label: "Water Monitor" },
  { to: "/reports/power-utilization", label: "Power Utilization" },
] as const;

function ReportsLayout() {
  const { pathname } = useLocation();
  return (
    <AppShell subtitle="Reports">
      <div className="mb-6">
        <div className="font-mono text-[10px] font-bold uppercase tracking-widest text-steel-500">
          Reporting
        </div>
        <h2 className="text-2xl font-semibold tracking-tight">
          Operational reports
        </h2>
      </div>

      <div className="mb-6 flex flex-wrap gap-1 border border-steel-300 bg-white p-1">
        {TABS.map((t) => {
          const active =
            pathname === t.to ||
            (t.to === "/reports/summary" && pathname === "/reports");
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
