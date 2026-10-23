import { cn } from "@/lib/utils";

export function FilterChips<T extends string>({
  options,
  value,
  onChange,
  size = "md",
}: {
  options: { value: T; label: string; count?: number }[];
  value: T;
  onChange: (value: T) => void;
  size?: "sm" | "md";
}) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
      <div className="flex gap-1.5 sm:flex-wrap">
        {options.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              aria-pressed={active}
              onClick={() => onChange(o.value)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1 rounded-full border font-medium transition",
                size === "md" ? "px-3.5 py-1.5 text-sm" : "px-3 py-1 text-xs",
                active
                  ? "border-foreground bg-foreground text-white"
                  : "border-line bg-card text-foreground/70 hover:border-foreground/30",
              )}
            >
              {o.label}
              {o.count !== undefined && <span className={active ? "text-white/60" : "text-muted"}>{o.count}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
