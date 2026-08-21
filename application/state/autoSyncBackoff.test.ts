import test from "node:test";
import assert from "node:assert/strict";

import {
  AUTO_SYNC_BACKOFF_MAX_MS,
  AUTO_SYNC_DEBOUNCE_MS,
  getAutoSyncScheduleDelayMs,
  nextAutoSyncBackoffDelay,
} from "./autoSyncBackoff.ts";

test("first attempt uses the base debounce, failure doubles the next delay", () => {
  assert.equal(getAutoSyncScheduleDelayMs(null), AUTO_SYNC_DEBOUNCE_MS);
  assert.equal(nextAutoSyncBackoffDelay(null), 6_000);
  assert.equal(nextAutoSyncBackoffDelay(6_000), 12_000);
  assert.equal(nextAutoSyncBackoffDelay(12_000), 24_000);
  assert.equal(nextAutoSyncBackoffDelay(24_000), 48_000);
  assert.equal(nextAutoSyncBackoffDelay(48_000), 96_000);
});

test("backoff is capped at the configured maximum and stays there", () => {
  assert.equal(nextAutoSyncBackoffDelay(96_000), AUTO_SYNC_BACKOFF_MAX_MS);
  assert.equal(nextAutoSyncBackoffDelay(AUTO_SYNC_BACKOFF_MAX_MS), AUTO_SYNC_BACKOFF_MAX_MS);
});

test("a held backoff delays the scheduled attempt until it is cleared", () => {
  assert.equal(getAutoSyncScheduleDelayMs(12_000), 12_000);
  assert.equal(getAutoSyncScheduleDelayMs(AUTO_SYNC_BACKOFF_MAX_MS), AUTO_SYNC_BACKOFF_MAX_MS);
});

test("cap is 180 seconds", () => {
  assert.equal(AUTO_SYNC_BACKOFF_MAX_MS, 180_000);
});
