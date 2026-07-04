import { describe, it, expect } from "vitest";
import { buildCSV } from "./export-utils";

describe("buildCSV", () => {
  it("builds a quoted CSV from headers and rows", () => {
    const csv = buildCSV(
      ["Name", "Age"],
      [
        ["Alice", 30],
        ["Bob", 25],
      ],
    );
    expect(csv).toBe('"Name","Age"\n"Alice","30"\n"Bob","25"');
  });

  it("escapes embedded double quotes", () => {
    const csv = buildCSV(["Note"], [['He said "hi"']]);
    expect(csv).toBe('"Note"\n"He said ""hi"""');
  });

  it("renders null and undefined cells as empty strings", () => {
    const csv = buildCSV(["A", "B"], [[null, undefined]]);
    expect(csv).toBe('"A","B"\n"",""');
  });

  it("keeps values containing commas in a single field", () => {
    const csv = buildCSV(["City"], [["Amman, Jordan"]]);
    expect(csv).toBe('"City"\n"Amman, Jordan"');
  });
});
