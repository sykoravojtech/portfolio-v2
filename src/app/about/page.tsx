import Image from "next/image";
import { bio } from "@/content/bio";
import { testimonials } from "@/content/testimonials";
import { Hero } from "@/components/hero";
import { SectionHeader } from "@/components/section-header";
import { Testimonial } from "@/components/testimonial";

export default function AboutPage() {
  return (
    <>
      <Hero
        compact
        kicker="About"
        headline={
          <>
            The <em className="font-light italic text-green-mid">long</em> version.
          </>
        }
      />
      <div className="max-w-[760px] mx-auto px-6 py-12 space-y-10">
        <section className="flex flex-col sm:flex-row gap-6 items-start">
          {bio.avatar && (
            <Image
              src={bio.avatar}
              alt={bio.name}
              width={120}
              height={120}
              className="rounded-xl border border-border bg-bg2"
            />
          )}
          <div>
            <h2 className="text-[22px] font-black text-ink tracking-[-0.02em]">
              {bio.name}
            </h2>
            <p className="text-[12px] text-muted mb-3">
              {bio.role} · {bio.location}
            </p>
            <p className="text-[14px] leading-relaxed text-muted">{bio.description}</p>
          </div>
        </section>

        <section>
          <SectionHeader kicker="Languages" />
          <ul className="text-[13px] text-muted space-y-1">
            {bio.spokenLanguages.map((l) => (
              <li key={l.name}>
                <span className="font-semibold text-ink">{l.name}</span> — {l.proficiency}
              </li>
            ))}
          </ul>
        </section>

        {testimonials.length > 0 && (
          <section>
            <SectionHeader kicker="What people say" />
            <div className="space-y-8">
              {testimonials.map((t) => (
                <Testimonial key={t.id} item={t} />
              ))}
            </div>
          </section>
        )}

        <section>
          <SectionHeader kicker="Outside the screen" />
          <p className="text-[13px] text-muted leading-relaxed">
            I travel, play sports, and cook a lot. In 2019 I spent a weekend helping renovate an old castle in eastern Czechia — the kind of hands-on work that makes you appreciate a good desk again.
          </p>
        </section>
      </div>
    </>
  );
}
