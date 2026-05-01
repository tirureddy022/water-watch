import { useAuth } from "@/lib/auth";

export function Topbar({ subtitle }: { subtitle?: string }) {
  const { user } = useAuth();
  const initials = (user?.name ?? "U")
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-steel-200 bg-white/85 px-8 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="rounded border border-steel-200 bg-steel-100 px-3 py-1 font-mono text-[10px] font-bold uppercase text-steel-500">
          TERMINAL_01A
        </div>
        <h1 className="text-lg font-semibold tracking-tight text-steel-900">
          {subtitle ?? "Water Schemes Monitoring System"}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-right">
          <div className="text-xs font-bold uppercase text-steel-900">
            {user?.name ?? "Guest"}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-steel-500">
            {user?.role ?? "—"}
          </div>
        </div>
        <div className="flex size-10 items-center justify-center rounded-full border border-steel-300 bg-steel-200 font-mono text-xs font-semibold text-steel-700">
          {initials}
        </div>
      </div>
    </header>
  );
}
