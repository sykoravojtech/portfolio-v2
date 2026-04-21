import Link from "next/link";
import type { Project } from "@/content/types";
import { TagPill } from "./tag-pill";

export function ProjectCard({ item }: { item: Project }) {
  // Resolve primary href + CTA label
  const externalPrimary = item.webapp ?? item.github ?? item.paper;
  const externalLabel = item.webapp
    ? "Live →"
    : item.github
    ? "GitHub →"
    : item.paper
    ? "Paper →"
    : null;

  const useInternal = item.hasDetail;
  const href = useInternal ? `/projects/${item.slug}` : externalPrimary;
  const ctaLabel = useInternal ? "View project →" : externalLabel;
  const isExternal = !useInternal && externalPrimary != null;

  // Card body (reused whether the card is a link or a plain div)
  const body = (
    <div className="flex flex-col h-full">
      {/* Hero thumbnail */}
      <div className="aspect-[16/9] overflow-hidden rounded-t-xl bg-gradient-to-br from-bg3 to-bg2 border-b border-border">
        {item.heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.heroImage}
            alt={item.title}
            className="w-full h-full object-cover transition-transform duration-[400ms] group-hover:scale-[1.05]"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[10px] uppercase tracking-[0.12em] text-muted">
              {item.category}
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-3 flex-1">
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
        {ctaLabel && (
          <span className="text-[12px] font-bold text-green-mid group-hover:text-bordeaux mt-auto transition-colors">
            {ctaLabel}
          </span>
        )}
      </div>
    </div>
  );

  const cardClass =
    "group block bg-bg2 border border-border rounded-xl overflow-hidden shadow-[0_2px_16px_rgba(18,54,36,0.06)] hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(18,54,36,0.14)] hover:border-green/25 transition-all duration-[400ms]";

  // No link at all (Black Forest Hackathon has no external primary + no detail page)
  if (!href) {
    return <div className={cardClass}>{body}</div>;
  }

  // Internal link
  if (!isExternal) {
    return (
      <Link href={href} className={cardClass}>
        {body}
      </Link>
    );
  }

  // External link
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={cardClass}
    >
      {body}
    </a>
  );
}
