import { describe, expect, it } from "@jest/globals";
import { cn } from "./cn";

describe("cn (tailwind-merge with our tokens)", () => {
  it("lets a later text colour token win over an earlier one", () => {
    expect(cn("text-fg", "text-fg-muted")).toBe("text-fg-muted");
  });
  it("keeps font size and colour together (different groups)", () => {
    expect(cn("text-[16px] text-fg", "text-primary")).toBe("text-[16px] text-primary");
  });
  it("resolves conflicting font families", () => {
    expect(cn("font-sans", "font-display")).toBe("font-display");
  });
  it("resolves conflicting radii including custom ones", () => {
    expect(cn("rounded-card", "rounded-full")).toBe("rounded-full");
    expect(cn("rounded-control", "rounded-sheet")).toBe("rounded-sheet");
  });
  it("drops falsy values", () => {
    expect(cn("p-4", false && "p-8", undefined, "bg-surface")).toBe("p-4 bg-surface");
  });
});
