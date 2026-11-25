"use client";

import { useRef, useState } from "react";
import { labApps } from "@/content/home";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/reveal";
import { SectionLabel } from "@/components/section-label";
import { PhoneFrame } from "./phone-frame";

export function LabWorkspace({ available }: { available: string[] }) {
  const [active, setActive] = useState(labApps[0].id);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const app = labApps.find((a) => a.id === active) ?? labApps[0];
  const has = (src: string) => available.includes(src);

  const onKey = (e: React.KeyboardEvent, i: number) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = (i + d + labApps.length) % labApps.length;
    setActive(labApps[next].id);
    tabs.current[next]?.focus();
  };

  return (
    <section id="lab" className="pt-16 scroll-mt-16">
      <SectionLabel no="03">The Lab</SectionLabel>
      <div className="mt-4 flex flex-wrap gap-8 items-start">
        <Reveal className="flex-[1_1_280px]">
          <h2 className="text-[28px] font-semibold tracking-[-0.02em] leading-tight">My personal workspace</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-muted">
            Where I try ideas before I use them at work. Six apps for web and Android, a news briefing, a second brain and a set of AI
            tools, all behind one login on my own server.
          </p>
          <p className="mt-4 font-mono text-[12px] leading-[1.8] text-muted">
            Next.js · FastAPI · Flutter
            <br />
            Postgres · Docker · Cloudflare
          </p>
          <p className="mt-4 text-[12px] text-muted">Screens show demo data.</p>
        </Reveal>

        <Reveal index={1} className="flex-[999_1_560px] min-w-0 border border-rule bg-card">
          <div role="tablist" aria-label="Lab apps" className="flex flex-wrap gap-1 p-2 border-b border-line">
            {labApps.map((a, i) => {
              const on = a.id === active;
              return (
                <button
                  key={a.id}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`lab-tab-${a.id}`}
                  aria-selected={on}
                  aria-controls="lab-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(a.id)}
                  onKeyDown={(e) => onKey(e, i)}
                  className={cn("press h-11 px-4 text-[13px] font-medium border", on ? "bg-ink text-paper border-ink" : "border-line hover:border-rule")}
                >
                  {a.name}
                </button>
              );
            })}
          </div>

          <div id="lab-panel" role="tabpanel" aria-labelledby={`lab-tab-${app.id}`} className="grid-paper overflow-hidden">
            <div key={app.id} className="flex flex-wrap items-end justify-center gap-x-8 gap-y-6 px-6 pt-10 pb-8 sm:px-10">
              {app.shots.map((src, i) => (
                <div
                  key={src}
                  className={cn("phone-in group flex flex-col items-center gap-3", i === 1 && "max-sm:hidden sm:mb-10")}
                  style={{ "--i": i } as React.CSSProperties}
                >
                  <PhoneFrame
                    src={has(src) ? src : undefined}
                    alt={`${app.name}: ${app.captions[i]}`}
                    className="w-[220px] sm:w-[230px] transition-transform duration-300 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:-translate-y-1.5"
                  />
                  <figcaption className="kicker text-muted">{app.captions[i]}</figcaption>
                </div>
              ))}
            </div>
            <div key={`${app.id}-meta`} className="swap flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3 border-t border-line bg-card">
              <span className="text-[14px] font-medium">{app.text}</span>
              <span className="font-mono text-[11px] text-muted">{app.stack}</span>
              {app.url && (
                <a href={app.url} target="_blank" rel="noreferrer" className="ml-auto text-[13px] font-semibold text-accent-text hover:underline">
                  Open {app.name} ↗
                </a>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
