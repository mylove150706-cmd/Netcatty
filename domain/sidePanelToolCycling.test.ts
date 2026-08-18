import assert from 'node:assert/strict';
import test from 'node:test';

import { cycleSidePanelTool } from './sidePanelToolCycling.ts';
import type { SidePanelTool } from './sidePanelLayout.ts';

const TOOLS: SidePanelTool[] = ['sftp', 'scripts', 'history'];

test('cycleSidePanelTool advances forward and wraps around', () => {
  assert.equal(cycleSidePanelTool({ tools: TOOLS, current: 'sftp', direction: 'next' }), 'scripts');
  assert.equal(cycleSidePanelTool({ tools: TOOLS, current: 'history', direction: 'next' }), 'sftp');
});

test('cycleSidePanelTool steps backward and wraps around', () => {
  assert.equal(cycleSidePanelTool({ tools: TOOLS, current: 'scripts', direction: 'prev' }), 'sftp');
  assert.equal(cycleSidePanelTool({ tools: TOOLS, current: 'sftp', direction: 'prev' }), 'history');
});

test('cycleSidePanelTool returns the first tool when current is null or not in the list', () => {
  assert.equal(cycleSidePanelTool({ tools: TOOLS, current: null, direction: 'next' }), 'sftp');
  assert.equal(cycleSidePanelTool({ tools: TOOLS, current: 'notes', direction: 'prev' }), 'sftp');
});

test('cycleSidePanelTool handles empty and single-tool lists', () => {
  assert.equal(cycleSidePanelTool({ tools: [], current: 'sftp', direction: 'next' }), null);
  assert.equal(cycleSidePanelTool({ tools: ['history'], current: 'history', direction: 'next' }), 'history');
  assert.equal(cycleSidePanelTool({ tools: ['history'], current: 'history', direction: 'prev' }), 'history');
});
