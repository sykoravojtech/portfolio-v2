import type { Testimonial as T } from "@/content/types";

export function Testimonial({ item }: { item: T }) {
  return (
    <figure className="border-l-[3px] border-cedar pl-6 py-2">
      <blockquote className="text-[14px] italic text-muted leading-relaxed">
        &ldquo;{item.excerpt}&rdquo;
      </blockquote>
      <figcaption className="mt-3 text-[11px]">
        <span className="font-semibold text-ink">{item.author}</span>
        <span className="text-muted"> · {item.authorRole}</span>
      </figcaption>
    </figure>
  );
}
