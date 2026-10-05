/* eslint-disable import/first -- jest.mock calls must run before the imports they replace */
import { describe, expect, it, jest } from "@jest/globals";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

jest.mock("nativewind", () => ({ vars: (v: unknown) => v, cssInterop: jest.fn() }));

import { hexToChannels, palette, themeVars, withAlpha } from "./colors";

describe("colour helpers", () => {
  it("splits hex into Tailwind-style channels", () => {
    expect(hexToChannels("#2e36a0")).toBe("46 54 160");
    expect(hexToChannels("#ffffff")).toBe("255 255 255");
  });
  it("builds rgba from hex", () => {
    expect(withAlpha("#2e36a0", 0.5)).toBe("rgba(46, 54, 160, 0.5)");
  });
  it("exposes every token as a CSS variable, per scheme", () => {
    const light = themeVars("light") as Record<string, string>;
    expect(light["--primary"]).toBe("46 54 160");
    expect(Object.keys(light)).toHaveLength(Object.keys(palette.light).length);
    expect(themeVars("light")).toBe(themeVars("light")); // cached → stable reference
  });
  it("has the same token names in light and dark", () => {
    expect(Object.keys(palette.dark).sort()).toEqual(Object.keys(palette.light).sort());
  });
});

/**
 * The mobile app must look like the website. When the web repo sits next to this one, check that every
 * colour here is exactly what globals.css defines, so the two can never drift apart silently.
 */
const webCss = resolve(__dirname, "../../../shop/app/globals.css");
const describeIfWeb = existsSync(webCss) ? describe : describe.skip;

describeIfWeb("palette matches the web app's globals.css", () => {
  const css = existsSync(webCss) ? readFileSync(webCss, "utf8") : "";
  const block = (selector: string) => {
    const start = css.indexOf(selector);
    return css.slice(start, css.indexOf("}", start));
  };
  const read = (scope: string) =>
    Object.fromEntries(
      [...scope.matchAll(/--([a-z0-9-]+):\s*(#[0-9a-fA-F]{6})\s*;/g)].map((m) => [m[1], m[2]!.toLowerCase()]),
    );

  const schemes = [
    ["light", ":root {"],
    ["dark", '[data-theme="dark"] {'],
  ] as const;
  for (const [scheme, selector] of schemes) {
    it(scheme, () => {
      const web = read(block(selector));
      for (const [token, hex] of Object.entries(palette[scheme])) {
        expect({ token, hex }).toEqual({ token, hex: web[token] });
      }
    });
  }
});
