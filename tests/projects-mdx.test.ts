import { describe, it, expect } from "vitest";
import {
  getProjectContent,
  listProjectSlugs,
} from "@/lib/projects-mdx";

describe("projects MDX loader", () => {
  it("lists all MDX slugs in src/content/projects/", () => {
    const slugs = listProjectSlugs();
    expect(slugs).toContain("video-transformers");
    expect(slugs).toContain("multimodal-schematic-analysis");
  });

  it("reads a real MDX file by slug", () => {
    const loaded = getProjectContent("video-transformers");
    expect(loaded).not.toBeNull();
    expect(loaded!.content).toContain("Charades");
  });

  it("returns null for a missing slug", () => {
    expect(getProjectContent("does-not-exist")).toBeNull();
  });
});
