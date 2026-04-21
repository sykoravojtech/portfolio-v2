import Link from "next/link";
import { bio } from "@/content/bio";
import { Hero } from "@/components/hero";
import { Button } from "@/components/ui/button";
import { ContactMenu } from "@/components/contact-menu";
import { SectionHeader } from "@/components/section-header";
import { ExperienceItem } from "@/components/experience-item";
import { EducationItem } from "@/components/education-item";
import { ProjectCard } from "@/components/project-card";
import { WritingRow } from "@/components/writing-row";
import {
  getLatestExperiences,
  getLatestEducation,
  getFeaturedProjects,
} from "@/lib/content";
import { getPublishedWritingMeta } from "@/lib/mdx";

export default function Home() {
  const experiences = getLatestExperiences(3);
  const education = getLatestEducation(2);
  const featured = getFeaturedProjects().slice(0, 3);
  const posts = getPublishedWritingMeta().slice(0, 3);

  return (
    <>
      <Hero
        kicker={`${bio.location} · ${bio.role}`}
        headline={bio.name}
        tagline={
          <>
            <em className="font-light italic text-cedar">Taste</em> in what to build. <em className="font-light italic text-cedar">Agency</em> in shipping it.
          </>
        }
        ctas={
          <>
            <ContactMenu>
              <Button>Get in touch</Button>
            </ContactMenu>
            <Button asChild variant="outline" className="bg-transparent border-green-mid text-green-mid hover:bg-green-mid/10">
              <Link href="/VojtechSykora_CV_2026.pdf" target="_blank">Download CV ↓</Link>
            </Button>
          </>
        }
      />

      <div className="max-w-[1120px] mx-auto px-6 py-12 space-y-14">
        {/* About teaser */}
        <section>
          <SectionHeader kicker="About · teaser" />
          <p className="text-[14px] text-muted leading-relaxed max-w-2xl">
            {bio.description.split(". ").slice(0, 2).join(". ")}.
          </p>
          <Link href="/about" className="inline-block mt-3 text-green-mid font-bold text-[12px]">
            Read more →
          </Link>
        </section>

        {/* Experience teaser */}
        <section>
          <SectionHeader kicker="Experience · latest three" />
          <div>
            {experiences.map((e) => (
              <ExperienceItem key={e.id} item={e} showSkills={false} />
            ))}
          </div>
          <Link href="/experience" className="inline-block mt-4 text-green-mid font-bold text-[12px]">
            Full timeline →
          </Link>
        </section>

        {/* Education teaser */}
        <section>
          <SectionHeader kicker="Education · latest two" />
          <div>
            {education.map((e) => (
              <EducationItem key={e.id} item={e} />
            ))}
          </div>
          <Link href="/education" className="inline-block mt-4 text-green-mid font-bold text-[12px]">
            All education →
          </Link>
        </section>

        {/* Featured projects */}
        <section>
          <SectionHeader kicker="Featured projects" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {featured.map((p) => (
              <ProjectCard key={p.id} item={p} />
            ))}
          </div>
          <Link href="/projects" className="inline-block mt-4 text-green-mid font-bold text-[12px]">
            All projects →
          </Link>
        </section>

        {/* Languages & tech stack */}
        <section>
          <SectionHeader kicker="Languages & stack" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink mb-2">Languages</div>
              <ul className="text-[12px] text-muted space-y-1">
                {bio.spokenLanguages.map((l) => (
                  <li key={l.name}>
                    <span className="font-semibold text-ink">{l.name}</span> · {l.proficiency}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.12em] text-ink mb-2">Tech I reach for</div>
              <div className="flex flex-wrap gap-1.5">
                {bio.techStack.map((t) => (
                  <span key={t} className="text-[11px] px-2 py-0.5 rounded bg-bg3 text-ink border border-border">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Latest writing (hide when empty) */}
        {posts.length > 0 && (
          <section>
            <SectionHeader kicker="Latest writing" />
            <div>
              {posts.map((p) => (
                <WritingRow key={p.slug} meta={p} />
              ))}
            </div>
            <Link href="/writing" className="inline-block mt-4 text-green-mid font-bold text-[12px]">
              All posts →
            </Link>
          </section>
        )}
      </div>
    </>
  );
}
