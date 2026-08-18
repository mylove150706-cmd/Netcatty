import assert from 'node:assert/strict';
import test from 'node:test';

import {
  HOST_INFO_BAR_HEIGHT_DEFAULT,
  HOST_INFO_BAR_HEIGHT_MAX,
  HOST_INFO_BAR_HEIGHT_MIN,
  normalizeTerminalSettings,
} from './models/terminal.ts';

test('hostInfoBarHeight defaults to 28 and exposes range constants', () => {
  assert.equal(HOST_INFO_BAR_HEIGHT_DEFAULT, 28);
  assert.equal(HOST_INFO_BAR_HEIGHT_MIN, 22);
  assert.equal(HOST_INFO_BAR_HEIGHT_MAX, 44);
  assert.equal(normalizeTerminalSettings({}).hostInfoBarHeight, 28);
});

test('hostInfoBarHeight passes through in-range values', () => {
  assert.equal(normalizeTerminalSettings({ hostInfoBarHeight: 22 }).hostInfoBarHeight, 22);
  assert.equal(normalizeTerminalSettings({ hostInfoBarHeight: 36 }).hostInfoBarHeight, 36);
  assert.equal(normalizeTerminalSettings({ hostInfoBarHeight: 44 }).hostInfoBarHeight, 44);
});

test('hostInfoBarHeight clamps out-of-range values and recovers invalid ones', () => {
  assert.equal(normalizeTerminalSettings({ hostInfoBarHeight: 21 }).hostInfoBarHeight, 22);
  assert.equal(normalizeTerminalSettings({ hostInfoBarHeight: 45 }).hostInfoBarHeight, 44);
  assert.equal(normalizeTerminalSettings({ hostInfoBarHeight: 99 }).hostInfoBarHeight, 44);
  assert.equal(normalizeTerminalSettings({ hostInfoBarHeight: Number.NaN }).hostInfoBarHeight, 28);
  assert.equal(normalizeTerminalSettings({ hostInfoBarHeight: 'not-a-number' as unknown as number }).hostInfoBarHeight, 28);
});
