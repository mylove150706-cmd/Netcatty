import test from "node:test";
import assert from "node:assert/strict";

test("SYNC_CONSTANTS falls back to preload runtime env when nothing is baked in", async () => {
  (globalThis as { netcatty?: unknown }).netcatty = {
    runtimeSyncEnv: {
      VITE_SYNC_ONEDRIVE_CLIENT_ID: "c35d3e45-99a9-4526-a1b5-dc3a0ce26944",
      VITE_SYNC_GOOGLE_CLIENT_ID: "test.apps.googleusercontent.com",
    },
  };
  const { SYNC_CONSTANTS } = await import("./sync.ts");

  assert.equal(SYNC_CONSTANTS.ONEDRIVE_CLIENT_ID, "c35d3e45-99a9-4526-a1b5-dc3a0ce26944");
  assert.equal(SYNC_CONSTANTS.GOOGLE_CLIENT_ID, "test.apps.googleusercontent.com");
  // Keys absent from the runtime env stay empty — the file only fills gaps.
  assert.equal(SYNC_CONSTANTS.GOOGLE_CLIENT_SECRET, "");

  delete (globalThis as { netcatty?: unknown }).netcatty;
});
