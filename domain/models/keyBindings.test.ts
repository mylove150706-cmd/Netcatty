import assert from 'node:assert/strict';
import test from 'node:test';

import { DEFAULT_KEY_BINDINGS } from './keyBindings.ts';

test('side panel cycling bindings are registered with the default key pairs', () => {
  const next = DEFAULT_KEY_BINDINGS.find((b) => b.id === 'side-panel-next-tool');
  const prev = DEFAULT_KEY_BINDINGS.find((b) => b.id === 'side-panel-prev-tool');
  assert.equal(next?.action, 'sidePanelNextTool');
  assert.equal(next?.category, 'app');
  assert.equal(next?.pc, 'Ctrl + Alt + ]');
  assert.equal(next?.mac, '⌘ + ⌥ + ]');
  assert.equal(prev?.action, 'sidePanelPrevTool');
  assert.equal(prev?.category, 'app');
  assert.equal(prev?.pc, 'Ctrl + Alt + [');
  assert.equal(prev?.mac, '⌘ + ⌥ + [');
});

test('default binding ids, actions, and key strings do not collide', () => {
  const ids = new Set(DEFAULT_KEY_BINDINGS.map((b) => b.id));
  const actions = new Set(DEFAULT_KEY_BINDINGS.map((b) => b.action));
  assert.equal(ids.size, DEFAULT_KEY_BINDINGS.length);
  assert.equal(actions.size, DEFAULT_KEY_BINDINGS.length);
  // Key collisions are checked per category: terminal and SFTP bindings
  // intentionally share keys (⌘+C/⌘+V/⌘+A) because they are context-scoped.
  for (const category of ['tabs', 'terminal', 'navigation', 'app', 'sftp'] as const) {
    for (const scheme of ['pc', 'mac'] as const) {
      const keys = new Set<string>();
      for (const binding of DEFAULT_KEY_BINDINGS) {
        if (binding.category !== category) continue;
        const key = binding[scheme];
        // Skip disabled, range patterns ([1...9]) and arrow patterns.
        if (!key || key === 'Disabled' || key.includes('...') || key.includes('arrows')) continue;
        assert.equal(keys.has(key), false, `duplicate ${scheme} binding: ${key}`);
        keys.add(key);
      }
    }
  }
  // The per-category scan allows intentional terminal/SFTP context-scoped key
  // sharing, so guard globally that the cycling keys are not reused anywhere.
  for (const key of ['Ctrl + Alt + ]', 'Ctrl + Alt + [']) {
    assert.equal(DEFAULT_KEY_BINDINGS.filter((b) => b.pc === key).length, 1, `expected exactly one pc binding for ${key}`);
  }
  for (const key of ['⌘ + ⌥ + ]', '⌘ + ⌥ + [']) {
    assert.equal(DEFAULT_KEY_BINDINGS.filter((b) => b.mac === key).length, 1, `expected exactly one mac binding for ${key}`);
  }
});
