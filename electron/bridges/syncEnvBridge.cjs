"use strict";

/**
 * Runtime sync-provider credentials from a local env file.
 *
 * Official builds bake VITE_SYNC_* credentials in at compile time from repo
 * secrets. Fork/personal builds without those secrets can instead drop a
 * netcatty-sync.env file into the app's userData directory; values there fill
 * in only the credentials the build left empty — they never override values
 * that were already baked in.
 */

const nodeFs = require("node:fs");
const nodePath = require("node:path");

const SYNC_ENV_FILE_NAME = "netcatty-sync.env";

const SYNC_ENV_KEYS = new Set([
  "VITE_SYNC_GITHUB_CLIENT_ID",
  "VITE_SYNC_GOOGLE_CLIENT_ID",
  "VITE_SYNC_GOOGLE_CLIENT_SECRET",
  "VITE_SYNC_ONEDRIVE_CLIENT_ID",
]);

function parseSyncEnvFile(contents) {
  const result = {};
  for (const rawLine of String(contents ?? "").split(/\r?\n/)) {
    const line = rawLine.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    const value = line.slice(eq + 1).trim();
    if (!SYNC_ENV_KEYS.has(key) || !value) continue;
    result[key] = value;
  }
  return result;
}

function readRuntimeSyncEnvFile(userDataPath, fs = nodeFs, path = nodePath) {
  try {
    const file = path.join(userDataPath, SYNC_ENV_FILE_NAME);
    if (!fs.existsSync(file)) return {};
    return parseSyncEnvFile(fs.readFileSync(file, "utf8"));
  } catch {
    return {};
  }
}

function registerSyncEnvBridge(ipcMain, app) {
  const env = readRuntimeSyncEnvFile(app.getPath("userData"));
  // Synchronous on purpose: the preload needs the values in hand before the
  // renderer bundle evaluates SYNC_CONSTANTS at module scope.
  ipcMain.on("netcatty:syncEnv:get", (event) => {
    event.returnValue = env;
  });
  return env;
}

module.exports = {
  SYNC_ENV_FILE_NAME,
  SYNC_ENV_KEYS,
  parseSyncEnvFile,
  readRuntimeSyncEnvFile,
  registerSyncEnvBridge,
};
