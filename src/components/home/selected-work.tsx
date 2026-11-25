import { selectedWork } from "@/content/home";
import { Reveal } from "@/components/reveal";
import { SectionLabel } from "@/components/section-label";
import { OpenDetailsButton } from "./open-details-button";

export function SelectedWork() {
  return (
    <section id="work" className="pt-16 scroll-mt-16">
      <SectionLabel no="02">Selected work</SectionLabel>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        {selectedWork.map((w, i) => (
          <Reveal index={i} key={w.title} className="flex">
          <article className="lift flex-1 bg-card border border-line p-6 flex flex-col gap-2.5">
            <p className="kicker text-[10.5px] text-accent-text">{w.kicker}</p>
            <h3 className="text-[21px] font-semibold tracking-[-0.015em] leading-snug">{w.title}</h3>
            <p className="text-[14px] leading-relaxed text-muted">{w.text}</p>
            <div className="mt-auto pt-4 border-t border-line flex gap-6">
              {w.stats.map((s) => (
                <div key={s.label}>
                  <div className="font-mono text-[24px] font-semibold">{s.value}</div>
                  <div className="text-[12px] text-muted">{s.label}</div>
                </div>
              ))}
            </div>
            <OpenDetailsButton id={w.experienceId} className="self-start mt-1" />
          </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
