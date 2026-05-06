import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import {
  Activity,
  AlertTriangle,
  Droplet,
  FileBarChart,
  LayoutDashboard,
  LogOut,
  Map,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "@/lib/auth";

type Item = {
  label: string;
  to: string;
  icon: typeof LayoutDashboard;
  adminOnly?: boolean;
  matchPrefix?: boolean;
};

const ITEMS: readonly Item[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Status", to: "/status", icon: Activity },
  { label: "Alerts", to: "/alerts", icon: AlertTriangle },
  { label: "Reports", to: "/reports", icon: FileBarChart, matchPrefix: true },
  { label: "Maps", to: "/maps", icon: Map },
  { label: "Admin", to: "/admin", icon: ShieldCheck, adminOnly: true, matchPrefix: true },
];

export function Sidebar() {
  const { isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const visible = ITEMS.filter((i) => !i.adminOnly || isAdmin);

  const handleLogout = () => {
    logout();
    navigate({ to: "/login" });
  };

  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-steel-800 bg-steel-900 text-steel-100 md:flex">
      <div className="flex h-16 items-center gap-3 border-b border-steel-800 px-6">
        <div className="flex size-7 items-center justify-center rounded-sm bg-primary text-primary-foreground">
          <Droplet className="size-4" />
        </div>
        <div className="flex flex-col leading-tight">
          <span className="font-mono text-xs font-semibold uppercase tracking-tighter text-white">
            HydroMetric OS
          </span>
          <span className="font-mono text-[10px] uppercase tracking-widest text-steel-500">
            v1.0
          </span>
        </div>
      </div>

      <nav className="flex-1 py-6">
        <div className="px-6 pb-3 font-mono text-[10px] font-bold uppercase tracking-widest text-steel-500">
          Navigation
        </div>
        {visible.map((item) => {
          const active = item.matchPrefix
            ? pathname.startsWith(item.to)
            : pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={
                "flex items-center gap-4 px-6 py-3 text-sm font-medium transition-colors " +
                (active
                  ? "border-r-2 border-primary bg-steel-800 text-white"
                  : "text-steel-400 hover:bg-steel-800/60 hover:text-white")
              }
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-steel-800 p-4">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-4 rounded-sm px-4 py-3 text-sm font-medium uppercase tracking-wider text-steel-400 transition-colors hover:bg-steel-800 hover:text-destructive"
        >
          <LogOut className="size-4" />
          <span>System Logout</span>
        </button>
      </div>
    </aside>
  );
}
