import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

// The checkable rules of docs/ANTI_SLOP.md.
function files(dir: string): string[] {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    return e.isDirectory() ? files(p) : /\.(tsx?|mdx?)$/.test(e.name) ? [p] : [];
  });
}
const src = files(path.join(process.cwd(), "src")).map((f) => ({ f, s: fs.readFileSync(f, "utf8") }));

describe("anti-slop", () => {
  it("no accent word in italic or colour inside a headline", () => {
    for (const { f, s } of src) {
      expect(s, f).not.toMatch(/<em[^>]*className="[^"]*italic[^"]*text-(cedar|accent)/);
      expect(s, f).not.toMatch(/headline=\{\s*<>[\s\S]*?<em/);
    }
  });

  it("no numbered section labels", () => {
    for (const { f, s } of src) expect(s, f).not.toMatch(/<SectionLabel no=/);
  });

  it("no indigo or violet, no gradient text", () => {
    for (const { f, s } of src) {
      expect(s, f).not.toMatch(/#(6366f1|8b5cf6|7c3aed|a855f7)|\b(indigo|violet|purple)-\d{3}\b/i);
      expect(s, f).not.toMatch(/bg-clip-text/);
    }
  });

  it("no rhetorical-question call to action and no mirrored 'by training, by habit' copy", () => {
    for (const { f, s } of src) {
      expect(s, f).not.toMatch(/\?\s*(<br\s*\/>)?\s*Let(&apos;|')s talk/);
      expect(s, f).not.toMatch(/by training, [^.]* by habit/);
    }
  });
});
