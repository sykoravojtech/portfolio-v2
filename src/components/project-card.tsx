import type { Project } from "@/content/types";
import { TagPill } from "./tag-pill";

export function ProjectCard({ item }: { item: Project }) {
  const primaryLink = item.webapp ?? item.github ?? item.paper;
  const primaryLabel = item.webapp
    ? "Live →"
    : item.github
    ? "GitHub →"
    : item.paper
    ? "Paper →"
    : null;

  return (
    <div className="bg-bg2 border border-border rounded-xl p-5 flex flex-col gap-3 shadow-[0_2px_16px_rgba(18,54,36,0.06)] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(18,54,36,0.14)] hover:border-green/25 transition-all duration-[400ms]">
      <TagPill>{item.category}</TagPill>
      <h3 className="text-[18px] font-black tracking-[-0.02em] text-ink">
        {item.title}
      </h3>
      <p className="text-[12px] text-muted leading-relaxed flex-1">
        {item.description}
      </p>
      {item.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {item.tags.map((t) => (
            <TagPill key={t} tone="neutral">
              {t}
            </TagPill>
          ))}
        </div>
      )}
      {primaryLink && primaryLabel && (
        <a
          href={primaryLink}
          target="_blank"
          rel="noreferrer"
          className="text-[12px] font-bold text-green-mid hover:text-bordeaux mt-auto"
        >
          {primaryLabel}
        </a>
      )}
    </div>
  );
}
