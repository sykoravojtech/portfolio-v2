import Image from "next/image";
import type { Education } from "@/content/types";
import { TagPill } from "./tag-pill";

export function EducationItem({ item }: { item: Education }) {
  return (
    <div className="grid grid-cols-[90px_1fr] gap-4 py-4 border-b border-border last:border-b-0">
      <div className="text-[11px] font-semibold text-muted pt-1 leading-tight space-y-0.5">
        {item.dateDisplay.split(/\s+-\s+/).map((part, i) => (
          <div key={i}>{part}</div>
        ))}
      </div>
      <div>
        <div className="flex items-start gap-3">
          {item.logo && (
            <Image
              src={item.logo}
              alt={item.school}
              width={36}
              height={36}
              className="rounded border border-border bg-bg2 shrink-0"
            />
          )}
          <div>
            <h3 className="text-[15px] font-bold text-ink tracking-[-0.015em]">
              {item.degree}
              {item.field && <span className="text-muted font-normal"> · {item.field}</span>}
            </h3>
            <p className="text-[12px] text-muted mt-0.5">
              {item.link ? (
                <a href={item.link} target="_blank" rel="noreferrer" className="hover:text-bordeaux">
                  {item.school}
                </a>
              ) : (
                item.school
              )}
              {" · "}
              {item.location}
              {item.grade && ` · Grade: ${item.grade}`}
            </p>
          </div>
        </div>
        <ul className="mt-2 list-disc pl-5 marker:text-cedar text-[12px] text-muted space-y-1">
          {item.description.map((line, i) => (
            <li key={i}>{line}</li>
          ))}
        </ul>
        {item.thesis && (
          <p className="mt-2 text-[11px] italic text-muted">
            Thesis:{" "}
            {item.thesisLink ? (
              <a
                href={item.thesisLink}
                target="_blank"
                rel="noreferrer"
                className="text-ink not-italic font-semibold hover:text-bordeaux"
              >
                {item.thesis}
              </a>
            ) : (
              <span className="text-ink not-italic font-semibold">{item.thesis}</span>
            )}
          </p>
        )}
        {item.skills.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {item.skills.map((s) => (
              <TagPill key={s}>{s}</TagPill>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
