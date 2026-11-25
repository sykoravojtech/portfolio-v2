import { now } from "@/content/home";
import { Reveal } from "@/components/reveal";
import { SectionLabel } from "@/components/section-label";
import { OpenDetailsButton } from "./open-details-button";

export function NowBlock() {
  return (
    <section id="now" className="pt-16 scroll-mt-16">
      <SectionLabel no="01">Now</SectionLabel>
      <Reveal className="mt-4 bg-night text-night-ink p-7 sm:p-10 flex flex-wrap gap-10">
        <div className="flex-[999_1_480px] min-w-0">
          <p className="kicker text-night-accent">{now.kicker}</p>
          <h2 className="mt-3 mb-4 text-[30px] sm:text-[38px] leading-[1.08] font-semibold tracking-[-0.03em]">{now.title}</h2>
          {now.body.map((p) => (
            <p key={p} className="mb-3 text-[16px] leading-[1.65] text-night-ink/80">
              {p}
            </p>
          ))}
          <OpenDetailsButton
            id="rapidsos"
            className="mt-3 border-night-ink/70 text-night-ink hover:bg-night-ink hover:text-ink"
          />
        </div>
        <ol className="flex-[1_1_280px] flex flex-col gap-1.5" aria-label="Layers of the platform">
          {now.layers.map((l, i) => (
            <Reveal as="li" index={i + 1} key={l.label}>
              <div className={`border px-3.5 py-3 text-[14px] ${l.hot ? "border-night-accent" : "border-night-ink/25"}`}>
                <span className={`kicker block text-[10px] ${l.hot ? "text-night-accent" : "text-night-muted"}`}>{l.label}</span>
                {l.text}
              </div>
            </Reveal>
          ))}
        </ol>
        <div className="basis-full grid grid-cols-1 sm:grid-cols-3 gap-px bg-night-line border border-night-line">
          {now.pillars.map((p) => (
            <div key={p.label} className="bg-night px-5 py-4">
              <p className="kicker text-night-accent">{p.label}</p>
              <p className="mt-2 text-[14px] leading-relaxed">{p.text}</p>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
