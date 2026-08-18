import assert from "node:assert/strict";
import test from "node:test";

import { neutralChromeForegroundToken } from "./colorContrast.ts";

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
