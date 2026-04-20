import Link from "next/link";
import type { WritingMeta } from "@/content/types";

function shortDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", year: "numeric" }).toUpperCase();
}

export function WritingRow({ meta }: { meta: WritingMeta }) {
  return (
    <Link
      href={`/writing/${meta.slug}`}
      className="grid grid-cols-[90px_1fr_auto] gap-4 py-3 border-b border-border hover:bg-bg2 transition-colors -mx-2 px-2 rounded"
    >
      <div className="text-[10px] font-semibold text-muted uppercase tracking-[0.08em] pt-1">
        {shortDate(meta.date)}
      </div>
      <div>
        <div className="text-[13px] font-semibold text-ink">{meta.title}</div>
        {meta.excerpt && <div className="text-[11px] text-muted mt-0.5">{meta.excerpt}</div>}
      </div>
      <div className="text-[10px] text-muted pt-1 whitespace-nowrap">
        {meta.readingMinutes} min
      </div>
    </Link>
  );
}
