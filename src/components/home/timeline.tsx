"use client";

import Link from "next/link";
import { experiences } from "@/content/experiences";
import { compareByStartDesc } from "@/lib/dates";
import { Reveal } from "@/components/reveal";
import { SectionLabel } from "@/components/section-label";
import { CompanyLogo } from "./company-logo";
import { useOpenDetails } from "./details";

const SHOW = 8;

function short(d: string) {
  // "Oct 2025 - Present" → ["Oct 2025", "now"]
  const [a, b] = d.split(/\s+-\s+/);
  return [a, b === "Present" ? "now" : b];
}

export function Timeline() {
  const open = useOpenDetails();
  const jobs = [...experiences].sort(compareByStartDesc).slice(0, SHOW);

  return (
    <section id="timeline" className="pt-16 scroll-mt-16">
      <SectionLabel no="04">Timeline</SectionLabel>
      <ol className="relative mt-5">
        <span className="absolute left-[25px] sm:left-[155px] top-3 bottom-3 w-px bg-line" aria-hidden="true" />
        {jobs.map((j, i) => {
          const [from, to] = short(j.dateDisplay);
          return (
            <Reveal as="li" index={Math.min(i, 5)} key={j.id} className="mb-2">
              <div className="flex items-center gap-4 sm:gap-5">
                <span className="hidden sm:block w-[110px] shrink-0 text-right font-mono text-[12px] leading-snug text-muted">
                  {from}
                  <br />
                  {to}
                </span>
                <button
                  type="button"
                  onClick={() => open(j.id)}
                  className="lift lift-sm group flex-1 min-w-0 flex items-center gap-4 text-left -ml-[1px] sm:ml-0 py-0 pr-4 border border-transparent hover:bg-card"
                  aria-label={`${j.role}, ${j.company}: details`}
                >
                  <CompanyLogo src={j.logo} name={j.company} size={52} className="lift-logo relative z-[1]" />
                  <span className="flex-1 min-w-0 py-3">
                    <b className="block font-semibold text-[16px]">{j.role}</b>
                    <span className="block text-[13px] text-muted truncate">{j.company}</span>
                    <span className="sm:hidden block font-mono text-[11px] text-muted">
                      {from} – {to}
                    </span>
                  </span>
                  <span className="hidden sm:inline font-mono text-[11px] text-accent-text">
                    Details <span className="lift-arrow inline-block">→</span>
                  </span>
                </button>
              </div>
            </Reveal>
          );
        })}
      </ol>
      <Link href="/experience/" className="group inline-flex items-center gap-1 mt-3 font-semibold text-[14px] text-accent-text">
        Full CV and education <span className="transition-transform duration-200 group-hover:translate-x-1">→</span>
      </Link>
    </section>
  );
}
