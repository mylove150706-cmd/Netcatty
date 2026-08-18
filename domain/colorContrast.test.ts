import assert from "node:assert/strict";
import test from "node:test";

import { neutralChromeAccentToken, neutralChromeForegroundToken } from "./colorContrast.ts";

test("neutralChromeForegroundToken neutralizes saturated dark-theme foregrounds", () => {
  // #21B568 all-green terminal foreground (HSL ~ 152 69% 42%).
  assert.equal(neutralChromeForegroundToken("152 69.4% 41.6%", true), "0 0% 85%");
});

test("neutralChromeForegroundToken keeps in-band neutral foregrounds nearly unchanged", () => {
  assert.equal(neutralChromeForegroundToken("210 4% 90%", true), "0 0% 90%");
});

test("neutralChromeForegroundToken clamps light-theme foregrounds dark", () => {
  assert.equal(neutralChromeForegroundToken("152 69.4% 41.6%", false), "0 0% 22%");
  assert.equal(neutralChromeForegroundToken("0 0% 60%", false), "0 0% 22%");
});

test("neutralChromeForegroundToken returns invalid tokens unchanged", () => {
  assert.equal(neutralChromeForegroundToken("not-a-token", true), "not-a-token");
});

test("neutralChromeAccentToken neutralizes saturated dark-theme accents", () => {
  // #21B568 green terminal cursor used as the chrome accent.
  assert.equal(neutralChromeAccentToken("152 69.4% 41.6%", true), "0 0% 78%");
});

test("neutralChromeAccentToken keeps in-band neutral accents nearly unchanged", () => {
  assert.equal(neutralChromeAccentToken("210 4% 84%", true), "0 0% 84%");
});

test("neutralChromeAccentToken clamps light-theme accents dark", () => {
  assert.equal(neutralChromeAccentToken("152 69.4% 41.6%", false), "0 0% 35%");
});

test("neutralChromeAccentToken returns invalid tokens unchanged", () => {
  assert.equal(neutralChromeAccentToken("not-a-token", true), "not-a-token");
});
