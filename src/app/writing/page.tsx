import { Hero } from "@/components/hero";
import { SectionHeader } from "@/components/section-header";
import { WritingRow } from "@/components/writing-row";
import { getPublishedWritingMeta } from "@/lib/mdx";

export default function WritingPage() {
  const posts = getPublishedWritingMeta();

  return (
    <>
      <Hero
        compact
        kicker="Writing"
        headline={
          <>
            Long-form <em className="font-light italic text-cedar ml-[-0.02em] mr-[0.1em]">notes</em>
          </>
        }
        tagline="Occasional essays on AI, product, and personal projects."
      />
      <div className="max-w-[760px] mx-auto px-6 py-12">
        <SectionHeader kicker="All posts" />
        {posts.length === 0 ? (
          <p className="text-[13px] italic text-muted">First post coming soon.</p>
        ) : (
          <div>
            {posts.map((p) => (
              <WritingRow key={p.slug} meta={p} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
