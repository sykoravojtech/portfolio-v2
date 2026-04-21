import { notFound } from "next/navigation";
import Link from "next/link";
import { FileCode2, FileText, Globe } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { projects } from "@/content/projects";
import { getProjectContent } from "@/lib/projects-mdx";
import { TagPill } from "@/components/tag-pill";

export function generateStaticParams() {
  return projects
    .filter((p) => p.hasDetail)
    .map((p) => ({ slug: p.slug }));
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug && p.hasDetail);
  if (!project) notFound();

  const loaded = getProjectContent(slug);
  if (!loaded) notFound();

  return (
    <article className="mx-auto max-w-[860px] px-6 py-12">
      <div className="mb-8">
        <p className="text-[10px] uppercase tracking-[0.12em] text-muted mb-2">
          {project.category}
          {project.date ? ` · ${project.date}` : ""}
        </p>
        <h1 className="text-[32px] sm:text-[40px] font-black tracking-[-0.035em] text-ink mb-3">
          {project.title}
        </h1>
        <p className="text-[15px] text-muted leading-relaxed max-w-2xl">
          {project.description}
        </p>

        {project.tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mt-4">
            {project.tags.map((t) => (
              <TagPill key={t}>{t}</TagPill>
            ))}
          </div>
        )}

        {project.techStack && project.techStack.length > 0 && (
          <div className="flex gap-1.5 flex-wrap mt-3">
            {project.techStack.map((kw) => (
              <span
                key={kw}
                className="text-[11px] text-muted bg-bg3 border border-border px-2 py-0.5 rounded-md"
              >
                {kw}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-5">
          {project.github && (
            <LinkButton href={project.github} icon={<FileCode2 className="w-3.5 h-3.5" />} label="GitHub" />
          )}
          {project.paper && (
            <LinkButton href={project.paper} icon={<FileText className="w-3.5 h-3.5" />} label="Paper" />
          )}
          {project.webapp && (
            <LinkButton href={project.webapp} icon={<Globe className="w-3.5 h-3.5" />} label="Live site" />
          )}
        </div>
      </div>

      {project.heroImage && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={project.heroImage}
          alt={project.title}
          className="w-full rounded-xl border border-border mb-8"
        />
      )}

      <div className="prose-showcase">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{loaded.content}</ReactMarkdown>
      </div>

      <div className="mt-12">
        <Link href="/projects" className="text-green-mid font-bold text-[12px]">
          ← All projects
        </Link>
      </div>
    </article>
  );
}

function LinkButton({
  href,
  icon,
  label,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex items-center gap-1.5 text-xs font-medium text-bone bg-bordeaux px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity"
    >
      {icon}
      {label}
    </a>
  );
}
