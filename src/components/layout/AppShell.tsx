import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";

export function AppShell({
  children,
  subtitle,
}: {
  children: ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="min-h-dvh bg-steel-50 text-steel-900">
      <Sidebar />
      <div className="md:pl-64">
        <Topbar subtitle={subtitle} />
        <main className="data-grid min-h-[calc(100dvh-4rem)] p-8">{children}</main>
      </div>
    </div>
  );
}
