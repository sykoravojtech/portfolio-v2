import { projects } from "@/content/projects";
import { Hero } from "@/components/hero";
import { SectionHeader } from "@/components/section-header";
import { ProjectCard } from "@/components/project-card";

export default function ProjectsPage() {
  return (
    <>
      <Hero
        compact
        headline="Projects"
        tagline="Research and university projects."
      />
      <div className="max-w-[1120px] mx-auto px-6 py-12 space-y-6">
        <SectionHeader kicker="All projects" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((p) => (
            <ProjectCard key={p.id} item={p} />
          ))}
        </div>
      </div>
    </>
  );
}
