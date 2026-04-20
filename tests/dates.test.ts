import { describe, it, expect } from "vitest";
import { parseStart, compareByStartDesc } from "@/lib/dates";

describe("parseStart", () => {
  it("parses ISO year-month", () => {
    expect(parseStart("2025-10")).toEqual(new Date("2025-10-01T00:00:00Z"));
  });

  it("parses ISO year only as January", () => {
    expect(parseStart("2023")).toEqual(new Date("2023-01-01T00:00:00Z"));
  });
});

describe("compareByStartDesc", () => {
  it("sorts newer first", () => {
    const items = [
      { start: "2020-01" },
      { start: "2025-10" },
      { start: "2023-06" },
    ];
    const sorted = [...items].sort(compareByStartDesc);
    expect(sorted.map((i) => i.start)).toEqual([
      "2025-10",
      "2023-06",
      "2020-01",
    ]);
  });
});
