import { strict as assert } from "node:assert";
import { test } from "node:test";

import { buildUpdateFeedUrls } from "./updateService";

test("buildUpdateFeedUrls targets the producing fork", () => {
  const urls = buildUpdateFeedUrls("mylove150706-cmd", "Netcatty");
  assert.equal(
    urls.api,
    "https://api.github.com/repos/mylove150706-cmd/Netcatty/releases/latest"
  );
  assert.equal(urls.releasesPage, "https://github.com/mylove150706-cmd/Netcatty/releases");
});

test("buildUpdateFeedUrls keeps upstream shape for default owner", () => {
  const urls = buildUpdateFeedUrls("binaricat", "Netcatty");
  assert.equal(
    urls.api,
    "https://api.github.com/repos/binaricat/Netcatty/releases/latest"
  );
  assert.equal(urls.releasesPage, "https://github.com/binaricat/Netcatty/releases");
});
