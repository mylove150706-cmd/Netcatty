import type { SidePanelTool } from './sidePanelLayout';

export type SidePanelCycleDirection = 'next' | 'prev';

/**
 * Step through the cyclable side panel tool list. `tools` must already be
 * ordered and availability-filtered by the caller; a `current` that is null
 * or missing from the list restarts at the first entry.
 */
export function cycleSidePanelTool(params: {
  tools: readonly SidePanelTool[];
  current: SidePanelTool | null;
  direction: SidePanelCycleDirection;
}): SidePanelTool | null {
  const { tools, current, direction } = params;
  if (tools.length === 0) return null;
  const index = current === null ? -1 : tools.indexOf(current);
  if (index === -1) return tools[0] ?? null;
  const delta = direction === 'next' ? 1 : -1;
  return tools[(index + delta + tools.length) % tools.length] ?? null;
}
