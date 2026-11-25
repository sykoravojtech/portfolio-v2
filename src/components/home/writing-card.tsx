import Link from "next/link";
import { Reveal } from "@/components/reveal";
import { SectionLabel } from "@/components/section-label";

export function WritingCard() {
  return (
    <section id="writing" className="pt-16 scroll-mt-16">
      <SectionLabel no="05">Writing</SectionLabel>
      <Reveal className="mt-4">
        <Link href="/writing/" className="lift group flex flex-wrap items-center gap-x-8 gap-y-4 bg-card border border-line px-7 py-6">
          <span className="flex-[999_1_420px]">
            <b className="block text-[22px] font-semibold tracking-[-0.015em]">My thoughts, on anything</b>
            <span className="block mt-1.5 text-[14px] leading-relaxed text-muted">
              Work, tech, books, travel, whatever I keep thinking about.
            </span>
          </span>
          <span className="inline-flex items-center gap-2 h-11 px-4 bg-ink text-paper font-semibold text-[14px] group-hover:bg-accent group-hover:text-on-accent transition-colors">
            Read the writing <span className="lift-arrow" aria-hidden="true">→</span>
          </span>
        </Link>
      </Reveal>
    </section>
  );
}
