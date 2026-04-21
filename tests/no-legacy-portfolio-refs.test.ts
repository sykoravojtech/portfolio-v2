import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { projects } from "@/content/projects";

const LEGACY = "raw.githubusercontent.com/sykoravojtech/portfolio";

describe("no legacy portfolio URL references", () => {
  it("no project metadata points at sykoravojtech/portfolio raw URLs", () => {
    for (const p of projects) {
      for (const field of [p.heroImage, p.github, p.paper, p.webapp]) {
        if (!field) continue;
        expect(field, `project ${p.slug}: ${field}`).not.toContain(LEGACY);
      }
    }
  });

  it("no MDX file under src/content/projects/ references it", () => {
    const dir = path.join(process.cwd(), "src", "content", "projects");
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
    for (const f of files) {
      const raw = fs.readFileSync(path.join(dir, f), "utf8");
      expect(raw, `file ${f}`).not.toContain(LEGACY);
    }
  });
});
