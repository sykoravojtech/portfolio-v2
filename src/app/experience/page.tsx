import { getLatestExperiences } from "@/lib/content";
import { Hero } from "@/components/hero";
import { SectionHeader } from "@/components/section-header";
import { ExperienceItem } from "@/components/experience-item";
import { Button } from "@/components/ui/button";
import { ContactMenu } from "@/components/contact-menu";

export default function ExperiencePage() {
  const items = getLatestExperiences();

  return (
    <>
      <Hero
        compact
        kicker="Experience"
        headline={
          <>
            The full <em className="font-light italic text-cedar ml-[-0.02em] mr-[0.1em]">timeline</em>
          </>
        }
        tagline="Every role, every stack. Newest first."
      />
      <div className="max-w-[900px] mx-auto px-6 py-12 space-y-10">
        <section>
          {items.map((e) => (
            <ExperienceItem key={e.id} item={e} />
          ))}
        </section>
        <section className="bg-bg2 border border-border rounded-xl p-6">
          <SectionHeader kicker="What I'm looking for" title="Teams, problems, technologies" />
          <p className="text-[13px] text-muted leading-relaxed mb-4">
            I'm most energized when engineering meets product: shipping AI-powered tools that real people use, with a small team that ships fast and cares about craft. Open to senior engineering and AI-focused founding roles.
          </p>
          <ContactMenu>
            <Button>Get in touch</Button>
          </ContactMenu>
        </section>
      </div>
    </>
  );
}
