import { cn } from "@/lib/utils";

export function TagPill({
  children,
  className,
  tone = "bordeaux",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "bordeaux" | "neutral";
}) {
  return (
    <span
      className={cn(
        "inline-block text-[10px] font-semibold tracking-[0.06em] uppercase px-2 py-1 rounded border",
        tone === "bordeaux"
          ? "text-bordeaux bg-bordeaux/10 border-bordeaux/30"
          : "text-ink bg-bg3 border-border",
        className
      )}
    >
      {children}
    </span>
  );
}
