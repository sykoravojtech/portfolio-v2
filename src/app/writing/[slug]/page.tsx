import { notFound } from "next/navigation";
import { Hero } from "@/components/hero";
import fs from "node:fs";
import path from "node:path";
import { getWritingBySlug, getPublishedWritingMeta } from "@/lib/mdx";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function generateStaticParams() {
  return getPublishedWritingMeta().map((p) => ({ slug: p.slug }));
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getWritingBySlug(slug);
  if (!post || !post.meta.published) notFound();

  return (
    <>
      <Hero
        compact
        kicker={`Writing · ${post.meta.readingMinutes} min read`}
        headline={post.meta.title}
        tagline={new Date(post.meta.date).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      />
      <article className="max-w-[720px] mx-auto px-6 py-12 prose-showcase">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.content}</ReactMarkdown>
      </article>
    </>
  );
}
