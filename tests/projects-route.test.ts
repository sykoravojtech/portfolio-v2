import { describe, it, expect } from "vitest";
import { projects } from "@/content/projects";
import { listProjectSlugs, getProjectContent } from "@/lib/projects-mdx";

describe("projects route data integrity", () => {
  it("every project with hasDetail=true has an MDX file", () => {
    const slugs = new Set(listProjectSlugs());
    const missing = projects
      .filter((p) => p.hasDetail)
      .filter((p) => !slugs.has(p.slug))
      .map((p) => p.slug);
    expect(missing).toEqual([]);
  });

  it("every hasDetail project loads non-empty content", () => {
    for (const p of projects.filter((p) => p.hasDetail)) {
      const loaded = getProjectContent(p.slug);
      expect(loaded, `slug ${p.slug}`).not.toBeNull();
      expect(loaded!.content.length).toBeGreaterThan(20);
    }
  });
});
