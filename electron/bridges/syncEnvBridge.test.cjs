"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const os = require("node:os");
const fs = require("node:fs");
const path = require("node:path");

const {
  SYNC_ENV_FILE_NAME,
  parseSyncEnvFile,
  readRuntimeSyncEnvFile,
} = require("./syncEnvBridge.cjs");

test("parseSyncEnvFile accepts known keys with comments and blank lines", () => {
  const parsed = parseSyncEnvFile(
    "# netcatty sync credentials\r\n" +
      "\n" +
      "VITE_SYNC_ONEDRIVE_CLIENT_ID = c35d3e45-99a9-4526-a1b5-dc3a0ce26944 \r\n" +
      "VITE_SYNC_GOOGLE_CLIENT_ID=abc.apps.googleusercontent.com\n" +
      "VITE_SYNC_GOOGLE_CLIENT_SECRET=GOCSPX-xyz\n" +
      "not-a-sync-key=ignored\n" +
      "VITE_SYNC_GITHUB_CLIENT_ID=\n",
  );
  assert.deepEqual(parsed, {
    VITE_SYNC_ONEDRIVE_CLIENT_ID: "c35d3e45-99a9-4526-a1b5-dc3a0ce26944",
    VITE_SYNC_GOOGLE_CLIENT_ID: "abc.apps.googleusercontent.com",
    VITE_SYNC_GOOGLE_CLIENT_SECRET: "GOCSPX-xyz",
  });
});

test("parseSyncEnvFile ignores malformed lines and unknown keys", () => {
  assert.deepEqual(parseSyncEnvFile("novalue\n=random\n#\n"), {});
  assert.deepEqual(parseSyncEnvFile(null), {});
});

test("readRuntimeSyncEnvFile returns empty object when file is missing", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "netcatty-syncenv-"));
  assert.deepEqual(readRuntimeSyncEnvFile(dir), {});
});

test("readRuntimeSyncEnvFile reads and parses the env file from userData", () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "netcatty-syncenv-"));
  fs.writeFileSync(
    path.join(dir, SYNC_ENV_FILE_NAME),
    "VITE_SYNC_ONEDRIVE_CLIENT_ID=c35d3e45\n",
    "utf8",
  );
  assert.deepEqual(readRuntimeSyncEnvFile(dir), {
    VITE_SYNC_ONEDRIVE_CLIENT_ID: "c35d3e45",
  });
});
