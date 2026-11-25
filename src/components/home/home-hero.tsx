import Link from "next/link";
import { ContactMenu } from "@/components/contact-menu";
import { Orb } from "./orb";

export function HomeHero() {
  return (
    <section className="grid-paper border-b border-line overflow-hidden">
      <div className="max-w-[1120px] mx-auto px-6 pt-14 pb-16 sm:pt-20 sm:pb-24 flex flex-wrap items-center gap-x-10 gap-y-12">
        <div className="flex-[999_1_560px] min-w-0">
          <div className="ruler rule-in max-w-[520px] mb-7" aria-hidden="true" />
          <h1
            className="text-[42px] sm:text-[64px] leading-[1.02] font-semibold tracking-[-0.035em] max-w-[880px] hero-rise"
            style={{ "--i": 0 } as React.CSSProperties}
          >
            I lead AI transformation, from the platform to the product.
          </h1>
          <p
            className="mt-6 text-[17px] sm:text-[18px] leading-relaxed text-muted max-w-[640px] hero-rise"
            style={{ "--i": 2 } as React.CSSProperties}
          >
            Senior Software Engineer, AI at RapidSOS, in Prague. I design the systems, write the code and help leadership decide what to build next.
          </p>
          <div className="mt-8 flex flex-wrap gap-2.5 hero-rise" style={{ "--i": 3 } as React.CSSProperties}>
            <ContactMenu>
              <button
                type="button"
                className="press inline-flex items-center h-12 px-5 bg-ink text-paper font-semibold text-[14px] hover:bg-accent hover:text-on-accent"
              >
                Get in touch
              </button>
            </ContactMenu>
            <Link
              href="/VojtechSykora_CV_2026.pdf"
              target="_blank"
              className="press inline-flex items-center h-12 px-5 border border-ink font-semibold text-[14px] hover:bg-ink hover:text-paper"
            >
              Download CV ↓
            </Link>
          </div>
        </div>
        <div className="flex-[1_1_240px] flex justify-center hero-rise" style={{ "--i": 2 } as React.CSSProperties}>
          <Orb />
        </div>
      </div>
    </section>
  );
}
