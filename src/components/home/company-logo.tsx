/* eslint-disable @next/next/no-img-element -- static export, images are unoptimized anyway */
import { cn } from "@/lib/utils";

export function CompanyLogo({ src, name, size = 52, className }: { src?: string; name: string; size?: number; className?: string }) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <span
      className={cn("relative grid place-items-center shrink-0 overflow-hidden border border-line bg-card", className)}
      style={{ width: size, height: size }}
    >
      {src ? (
        <img src={src} alt="" className="size-full object-contain" />
      ) : (
        <span className="size-full grid place-items-center bg-ink text-paper font-mono text-[13px] font-semibold">{initials}</span>
      )}
    </span>
  );
}
