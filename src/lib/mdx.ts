import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import type { WritingMeta } from "@/content/types";

const WRITING_DIR = path.join(process.cwd(), "src", "content", "writing");

function wordCount(s: string): number {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

function minutesFromWords(words: number): number {
  return Math.max(1, Math.round(words / 220));
}

function readAllSlugs(): string[] {
  if (!fs.existsSync(WRITING_DIR)) return [];
  return fs
    .readdirSync(WRITING_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export type LoadedWriting = {
  meta: WritingMeta;
  content: string;
};

export function getWritingBySlug(slug: string): LoadedWriting | null {
  const file = path.join(WRITING_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;

  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);

  const meta: WritingMeta = {
    slug,
    title: String(data.title ?? "Untitled"),
    date: String(data.date ?? "1970-01-01"),
    excerpt: String(data.excerpt ?? ""),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    published: Boolean(data.published),
    readingMinutes: minutesFromWords(wordCount(content)),
  };

  return { meta, content };
}

export function getAllWritingMeta(): WritingMeta[] {
  return readAllSlugs()
    .map((slug) => getWritingBySlug(slug)?.meta)
    .filter((m): m is WritingMeta => m != null)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPublishedWritingMeta(): WritingMeta[] {
  return getAllWritingMeta().filter((m) => m.published);
}
