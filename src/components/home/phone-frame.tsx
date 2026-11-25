/* eslint-disable @next/next/no-img-element -- static export */
import { cn } from "@/lib/utils";

/**
 * A phone drawn in CSS around a 390 × 844 screenshot: dark bezel, rounded screen,
 * a status bar with the camera island, side buttons. Width sets the scale.
 */
export function PhoneFrame({ src, alt, dark, className, style }: { src?: string; alt: string; dark?: boolean; className?: string; style?: React.CSSProperties }) {
  const bar = dark ? "bg-[#101113] text-[#ECE9E2]" : "bg-[#F6F5F0] text-ink";
  return (
    <figure className={cn("relative m-0 shrink-0", className)} style={style}>
      {/* side buttons */}
      <span className="absolute -left-[3px] top-[18%] h-[7%] w-[3px] rounded-l bg-[#2a2d31]" aria-hidden="true" />
      <span className="absolute -left-[3px] top-[28%] h-[11%] w-[3px] rounded-l bg-[#2a2d31]" aria-hidden="true" />
      <span className="absolute -right-[3px] top-[24%] h-[14%] w-[3px] rounded-r bg-[#2a2d31]" aria-hidden="true" />
      <div className="rounded-[13%/6%] bg-[#0d0e10] p-[3.2%] shadow-[0_30px_60px_-24px_#15171A66,0_0_0_1px_#3a3d42_inset]">
        <div className={cn("relative overflow-hidden rounded-[10%/4.6%]", dark ? "bg-[#101113]" : "bg-[#F6F5F0]")}>
          {/* status bar */}
          <div className={`relative flex items-center justify-between px-[7%] aspect-[390/30] text-[10px] font-semibold ${bar}`}>
            <span>9:41</span>
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[62%] w-[30%] rounded-full bg-[#0d0e10]" aria-hidden="true" />
            <span className="flex items-center gap-1" aria-hidden="true">
              <svg width="14" height="9" viewBox="0 0 14 9" fill="currentColor"><rect x="0" y="6" width="2.5" height="3" rx=".5" /><rect x="3.8" y="4" width="2.5" height="5" rx=".5" /><rect x="7.6" y="2" width="2.5" height="7" rx=".5" /><rect x="11.4" y="0" width="2.5" height="9" rx=".5" /></svg>
              <svg width="20" height="9" viewBox="0 0 20 9" fill="none"><rect x=".5" y=".5" width="16" height="8" rx="2" stroke="currentColor" opacity=".5" /><rect x="2" y="2" width="11" height="5" rx="1" fill="currentColor" /><rect x="17.5" y="3" width="1.5" height="3" rx=".5" fill="currentColor" opacity=".5" /></svg>
            </span>
          </div>
          {src ? (
            <img src={src} alt={alt} className="block w-full aspect-[390/844] object-cover object-top" loading="lazy" />
          ) : (
            <div className="grid-paper aspect-[390/844] grid place-items-center p-4 text-center kicker text-muted">{alt}</div>
          )}
          {/* home indicator */}
          <span className={`absolute bottom-[1.2%] left-1/2 -translate-x-1/2 h-[4px] w-[34%] rounded-full ${dark ? "bg-white/70" : "bg-ink/70"}`} aria-hidden="true" />
        </div>
      </div>
    </figure>
  );
}
