/* eslint-disable @next/next/no-img-element -- static export */
import Link from "next/link";
import { selectedWork } from "@/content/home";
import { Reveal } from "@/components/reveal";
import { SectionLabel } from "@/components/section-label";
import { OpenDetailsButton } from "./open-details-button";

export function SelectedWork() {
  return (
    <section id="work" className="pt-16 scroll-mt-16">
      <SectionLabel>Selected work</SectionLabel>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {selectedWork.map((w, i) => (
          <Reveal index={i} key={w.title} className="flex">
            <article className="lift group flex-1 bg-card border border-line flex flex-col overflow-hidden">
              <div className="aspect-[16/10] border-b border-line overflow-hidden bg-paper">
                {w.image ? (
                  <img
                    src={w.image}
                    alt={w.imageAlt ?? ""}
                    loading="lazy"
                    className="size-full object-cover object-top transition-transform duration-500 ease-[cubic-bezier(.2,.8,.2,1)] group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="grid-paper size-full grid place-items-center">
                    {w.logo && <img src={w.logo} alt="" className="size-16 border border-line" />}
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col gap-2.5 flex-1">
                <p className="kicker text-[10.5px] text-accent-text">{w.kicker}</p>
                <h3 className="text-[21px] font-semibold tracking-[-0.015em] leading-snug">{w.title}</h3>
                <p className="text-[14px] leading-relaxed text-muted">{w.text}</p>
                <p className="mt-auto pt-3 border-t border-line font-mono text-[12px]">
                  {w.stats.map((s) => `${s.value} ${s.label}`).join(" · ")}
                </p>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-1">
                  <OpenDetailsButton id={w.experienceId} />
                  {w.links.map((l) =>
                    l.href.startsWith("/") ? (
                      <Link key={l.href} href={l.href} className="text-[13px] font-semibold text-accent-text hover:underline">
                        {l.label}
                      </Link>
                    ) : (
                      <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="text-[13px] font-semibold text-accent-text hover:underline">
                        {l.label}
                      </a>
                    ),
                  )}
                </div>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
