import { cn } from "@/lib/utils";

export function SectionHeader({
  kicker,
  title,
  subtitle,
  className,
}: {
  kicker?: string;
  title?: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <header className={cn("mb-6", className)}>
      {kicker && (
        <div className="text-[10px] uppercase tracking-[0.14em] text-muted mb-2">
          {kicker}
        </div>
      )}
      {title && (
        <h2 className="text-[22px] sm:text-[28px] font-black tracking-[-0.025em] text-ink">
          {title}
        </h2>
      )}
      {subtitle && <p className="mt-2 text-muted max-w-2xl">{subtitle}</p>}
    </header>
  );
}
