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
          <article className="lift flex-1 bg-card border border-line p-6 flex flex-col gap-2.5">
            <p className="kicker text-[10.5px] text-accent-text">{w.kicker}</p>
            <h3 className="text-[21px] font-semibold tracking-[-0.015em] leading-snug">{w.title}</h3>
            <p className="text-[14px] leading-relaxed text-muted">{w.text}</p>
            <p className="mt-auto pt-3 border-t border-line font-mono text-[12px]">
              {w.stats.map((s) => `${s.value} ${s.label}`).join(" · ")}
            </p>
            <OpenDetailsButton id={w.experienceId} className="self-start mt-1" />
          </article>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
