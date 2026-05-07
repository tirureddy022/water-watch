import { Moon, Sun } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { useTheme } from "@/lib/theme";

export function Topbar({ subtitle }: { subtitle?: string }) {
  const { user } = useAuth();
  const { theme, toggle } = useTheme();
  const initials = (user?.name ?? "U")
    .split(" ")
    .map((s) => s[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/85 px-8 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <div className="rounded border border-border bg-muted px-3 py-1 font-mono text-[10px] font-bold uppercase text-muted-foreground">
          TERMINAL_01A
        </div>
        <h1 className="text-lg font-semibold tracking-tight text-foreground">
          {subtitle ?? "Water Schemes Monitoring System"}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          aria-label="Toggle theme"
          title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          className="flex size-9 items-center justify-center rounded border border-border bg-muted text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          {theme === "dark" ? <Sun className="size-4" /> : <Moon className="size-4" />}
        </button>
        <div className="text-right">
          <div className="text-xs font-bold uppercase text-foreground">
            {user?.name ?? "Guest"}
          </div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {user?.role ?? "—"}
          </div>
        </div>
        <div className="flex size-10 items-center justify-center rounded-full border border-border bg-muted font-mono text-xs font-semibold text-foreground">
          {initials}
        </div>
      </div>
    </header>
  );
}
