import { describe, it, expect } from "vitest";
import {
  getLatestExperiences,
  getLatestEducation,
  getFeaturedProjects,
} from "@/lib/content";

describe("getLatestExperiences", () => {
  it("returns items sorted newest-first and limited by count", () => {
    const result = getLatestExperiences(3);
    expect(result).toHaveLength(3);
    expect(result[0].id).toBe("miton");
  });

  it("returns all when count omitted", () => {
    const result = getLatestExperiences();
    expect(result.length).toBeGreaterThan(5);
  });
});

describe("getLatestEducation", () => {
  it("returns newest first", () => {
    const result = getLatestEducation();
    expect(result[0].id).toBe("tuebingen");
  });
});

describe("getFeaturedProjects", () => {
  it("returns only projects with featured=true", () => {
    const result = getFeaturedProjects();
    expect(result.every((p) => p.featured)).toBe(true);
  });

  it("returns the expected three, in priority order", () => {
    const ids = getFeaturedProjects().map((p) => p.id);
    expect(ids).toEqual([
      "video-transformers",
      "multimodal-schematic-analysis",
      "urban-traffic-control",
    ]);
  });
});
