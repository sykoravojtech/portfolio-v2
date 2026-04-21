import { describe, it, expect } from "vitest";
import {
  getProjectContent,
  listProjectSlugs,
} from "@/lib/projects-mdx";

describe("projects MDX loader", () => {
  it("lists all MDX slugs in src/content/projects/", () => {
    const slugs = listProjectSlugs();
    expect(slugs).toContain("_fixture");
  });

  it("reads an MDX file by slug and returns body + frontmatter", () => {
    const loaded = getProjectContent("_fixture");
    expect(loaded).not.toBeNull();
    expect(loaded!.frontmatter.title).toBe("Fixture project");
    expect(loaded!.content).toContain("Hello world");
  });

  it("returns null for a missing slug", () => {
    expect(getProjectContent("does-not-exist")).toBeNull();
  });
});
