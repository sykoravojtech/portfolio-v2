import { education } from "@/content/education";
import { certifications } from "@/content/certifications";
import { Hero } from "@/components/hero";
import { SectionHeader } from "@/components/section-header";
import { EducationItem } from "@/components/education-item";
import { CertificationCard } from "@/components/certification-card";
import { compareByStartDesc } from "@/lib/dates";

export default function EducationPage() {
  const sorted = [...education].sort(compareByStartDesc);

  return (
    <>
      <Hero
        compact
        kicker="Education"
        headline={
          <>
            Where I <em className="font-light italic text-green-mid">studied</em>.
          </>
        }
        tagline="Degrees and certifications, newest first."
      />
      <div className="max-w-[900px] mx-auto px-6 py-12 space-y-14">
        <section>
          <SectionHeader kicker="Degrees" />
          <div>
            {sorted.map((e) => (
              <EducationItem key={e.id} item={e} />
            ))}
          </div>
          <div className="mt-6 bg-bg2 border border-border rounded-xl p-4 text-[12px] text-muted">
            <span className="font-semibold text-ink">Honor:</span> DAAD Full Scholarship for Master Studies (2023) — full funding for the 2-year MSc at Tübingen, including community events across Germany.
          </div>
        </section>

        <section>
          <SectionHeader kicker="Certifications" subtitle="Coursework, bootcamps, language." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {certifications.map((c) => (
              <CertificationCard key={c.id} item={c} />
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
