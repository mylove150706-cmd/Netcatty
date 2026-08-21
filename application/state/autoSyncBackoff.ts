/**
 * Failure backoff for the debounced auto-sync push.
 *
 * The debounce effect re-runs whenever `sync.isSyncing` flips (every attempt,
 * success or failure), and a failed sync never advances the synced-data
 * baseline — so without a backoff, one persistent network failure plus one
 * pending edit retries every ~3s and spams failure toasts. These helpers
 * double the schedule delay after each consecutive auto failure and reset
 * to the base debounce on the first success (or when auto-sync restarts).
 */

export const AUTO_SYNC_DEBOUNCE_MS = 3_000;
export const AUTO_SYNC_BACKOFF_MAX_MS = 180_000;

/** Delay for scheduling the next debounced attempt; null means no failure streak. */
export function getAutoSyncScheduleDelayMs(backoffMs: number | null): number {
  return backoffMs ?? AUTO_SYNC_DEBOUNCE_MS;
}

/** Double the delay after a failed auto attempt, capped at the maximum. */
export function nextAutoSyncBackoffDelay(currentMs: number | null): number {
  const base = currentMs ?? AUTO_SYNC_DEBOUNCE_MS;
  return Math.min(AUTO_SYNC_BACKOFF_MAX_MS, base * 2);
}
