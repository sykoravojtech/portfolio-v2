import { describe, it, expect } from "vitest";
import {
  getAllWritingMeta,
  getPublishedWritingMeta,
  getWritingBySlug,
} from "@/lib/mdx";

describe("writing loader", () => {
  it("lists all posts including unpublished", () => {
    const all = getAllWritingMeta();
    expect(all.some((p) => p.slug === "_fixture")).toBe(true);
  });

  it("filters unpublished by default", () => {
    const published = getPublishedWritingMeta();
    expect(published.some((p) => p.slug === "_fixture")).toBe(false);
  });

  it("reads a post body by slug", () => {
    const post = getWritingBySlug("_fixture");
    expect(post).not.toBeNull();
    expect(post!.meta.title).toBe("Fixture post");
    expect(post!.content).toContain("# Fixture");
  });

  it("estimates reading minutes from word count", () => {
    const post = getWritingBySlug("_fixture");
    expect(post!.meta.readingMinutes).toBeGreaterThanOrEqual(1);
  });
});
