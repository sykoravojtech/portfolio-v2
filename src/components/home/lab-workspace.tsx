"use client";
/* eslint-disable @next/next/no-img-element -- static export */

import { useRef, useState } from "react";
import { labApps } from "@/content/home";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/reveal";
import { SectionLabel } from "@/components/section-label";

export function LabWorkspace() {
  const [active, setActive] = useState(labApps[0].id);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const app = labApps.find((a) => a.id === active) ?? labApps[0];

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
        </Reveal>

        <Reveal index={1} className="flex-[999_1_560px] min-w-0 border border-rule bg-card">
          <div className="flex items-center gap-1.5 px-3 py-2 border-b border-line" aria-hidden="true">
            <span className="size-2 rounded-full border border-ink/40" />
            <span className="size-2 rounded-full border border-ink/40" />
            <span className="size-2 rounded-full border border-ink/40" />
            <span key={app.host} className="swap ml-3 font-mono text-[11px] text-muted truncate">
              {app.host}
            </span>
          </div>
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
                  className={cn(
                    "press h-11 px-4 text-[13px] font-medium border",
                    on ? "bg-ink text-paper border-ink" : "border-line hover:border-rule",
                  )}
                >
                  {a.name}
                </button>
              );
            })}
          </div>
          <div id="lab-panel" role="tabpanel" aria-labelledby={`lab-tab-${app.id}`} className="relative">
            <div key={app.id} className="swap">
              {app.shot ? (
                <img src={app.shot} alt={`${app.name}: ${app.text}`} className="block w-full aspect-video object-cover object-top" />
              ) : (
                <div className="grid-paper aspect-video grid place-items-center p-6 text-center">
                  <div>
                    <p className="kicker text-muted">Screenshot: {app.name}</p>
                    <p className="mt-3 text-[15px] font-medium max-w-[420px]">{app.text}</p>
                  </div>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-t border-line">
                <span className="font-mono text-[11px] text-muted">{app.stack}</span>
                {app.url && (
                  <a href={app.url} target="_blank" rel="noreferrer" className="ml-auto text-[13px] font-semibold text-accent-text hover:underline">
                    Open {app.name} ↗
                  </a>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
