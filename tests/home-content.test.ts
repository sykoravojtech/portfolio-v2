import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";
import { experiences } from "@/content/experiences";
import { now, selectedWork, labApps } from "@/content/home";

describe("homepage content", () => {
  it("every Selected work card opens an existing job", () => {
    const ids = new Set(experiences.map((e) => e.id));
    for (const w of selectedWork) expect(ids, w.experienceId).toContain(w.experienceId);
  });

  it("every local logo and screenshot exists in public/", () => {
    const files = [...experiences.map((e) => e.logo), ...labApps.map((a) => a.shot)].filter(
      (f): f is string => !!f && f.startsWith("/"),
    );
    for (const f of files) expect(fs.existsSync(path.join(process.cwd(), "public", f)), f).toBe(true);
  });

  it("only one job is current", () => {
    expect(experiences.filter((e) => e.end === "present").map((e) => e.id)).toEqual(["rapidsos"]);
  });

  it("the public RapidSOS text names no internal product", () => {
    const text = JSON.stringify([now, experiences.find((e) => e.id === "rapidsos")]);
    expect(text).not.toMatch(/studio/i);
  });
});
