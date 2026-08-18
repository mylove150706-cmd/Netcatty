import assert from "node:assert/strict";
import test from "node:test";

import {
  neutralChromeAccentHex,
  neutralChromeAccentToken,
  neutralChromeForegroundHex,
  neutralChromeForegroundToken,
} from "./colorContrast.ts";

test("neutralChromeForegroundToken neutralizes saturated dark-theme foregrounds", () => {
  // #21B568 all-green terminal foreground (HSL ~ 152 69% 42%).
  assert.equal(neutralChromeForegroundToken("152 69.4% 41.6%", true), "0 0% 85%");
});

test("neutralChromeForegroundToken passes low-saturation foregrounds through unchanged", () => {
  assert.equal(neutralChromeForegroundToken("210 4% 90%", true), "210 4% 90%");
  assert.equal(neutralChromeForegroundToken("0 0% 100%", true), "0 0% 100%");
});

test("neutralChromeForegroundToken clamps light-theme foregrounds dark", () => {
  assert.equal(neutralChromeForegroundToken("152 69.4% 41.6%", false), "0 0% 22%");
});

test("neutralChromeForegroundToken returns invalid tokens unchanged", () => {
  assert.equal(neutralChromeForegroundToken("not-a-token", true), "not-a-token");
});

test("neutralChromeAccentToken neutralizes saturated dark-theme accents", () => {
  // #21B568 green terminal cursor used as the chrome accent.
  assert.equal(neutralChromeAccentToken("152 69.4% 41.6%", true), "0 0% 78%");
});

test("neutralChromeAccentToken passes low-saturation accents through unchanged", () => {
  assert.equal(neutralChromeAccentToken("210 4% 84%", true), "210 4% 84%");
});

test("neutralChromeAccentToken clamps light-theme accents dark", () => {
  assert.equal(neutralChromeAccentToken("152 69.4% 41.6%", false), "0 0% 35%");
});

test("neutralChromeAccentToken returns invalid tokens unchanged", () => {
  assert.equal(neutralChromeAccentToken("not-a-token", true), "not-a-token");
});

test("neutralChromeForegroundHex neutralizes saturated hex foregrounds", () => {
  assert.equal(neutralChromeForegroundHex("#21b568", true), "#d9d9d9");
  assert.equal(neutralChromeForegroundHex("#21b568", false), "#383838");
});

test("neutralChromeAccentHex neutralizes saturated hex accents", () => {
  assert.equal(neutralChromeAccentHex("#21b568", true), "#c7c7c7");
});

test("hex helpers pass low-saturation and invalid inputs through unchanged", () => {
  assert.equal(neutralChromeForegroundHex("#e5e7eb", true), "#e5e7eb");
  assert.equal(neutralChromeAccentHex("#ffffff", true), "#ffffff");
  assert.equal(neutralChromeForegroundHex("not-hex", true), "not-hex");
});
