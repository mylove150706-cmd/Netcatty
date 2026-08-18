import assert from 'node:assert/strict';
import test from 'node:test';

import { terminalTopbarMetrics } from './topbarMetrics.ts';

test('default height 28 reproduces every current hardcoded size exactly', () => {
  const m = terminalTopbarMetrics(28);
  assert.equal(m.heightPx, 28);
  assert.equal(m.textPx, 11);
  assert.equal(m.statsPx, 10);
  assert.equal(m.iconPx, 10);
  assert.equal(m.iconLgPx, 12);
  assert.equal(m.buttonPx, 24);
  assert.equal(m.terminalOffsetPx, 32);
});

test('content scales proportionally with height', () => {
  const m = terminalTopbarMetrics(36);
  assert.equal(m.heightPx, 36);
  assert.equal(m.textPx, 14);   // round(11 * 36/28) = 14
  assert.equal(m.statsPx, 13);  // round(10 * 36/28) = 13
  assert.equal(m.iconPx, 13);
  assert.equal(m.iconLgPx, 15); // round(12 * 36/28) = 15
  assert.equal(m.buttonPx, 31); // round(24 * 36/28) = 31
  assert.equal(m.terminalOffsetPx, 40);
});

test('endpoints 22 and 44 respect per-field clamps', () => {
  const low = terminalTopbarMetrics(22);
  assert.equal(low.textPx, 9);
  assert.equal(low.statsPx, 8);
  assert.equal(low.iconPx, 8);
  assert.equal(low.iconLgPx, 9);
  assert.equal(low.buttonPx, 20); // round(18.86)=19 clamped to 20
  assert.equal(low.terminalOffsetPx, 26);

  const high = terminalTopbarMetrics(44);
  assert.equal(high.textPx, 17);
  assert.equal(high.statsPx, 16);
  assert.equal(high.iconPx, 16);
  assert.equal(high.iconLgPx, 19);
  assert.equal(high.buttonPx, 36); // round(37.71)=38 clamped to 36
  assert.equal(high.terminalOffsetPx, 48);
});

test('input is clamped into range and invalid input falls back to default', () => {
  assert.equal(terminalTopbarMetrics(99).heightPx, 44);
  assert.equal(terminalTopbarMetrics(1).heightPx, 22);
  assert.equal(terminalTopbarMetrics(Number.NaN).heightPx, 28);
  const fallback = terminalTopbarMetrics(Number.NaN);
  assert.equal(fallback.textPx, 11);
});
