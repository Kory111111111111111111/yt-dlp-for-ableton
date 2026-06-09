import assert from "node:assert/strict";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, it } from "node:test";
import { findInBinDirs } from "../src/youtubeTooling.ts";

describe("findInBinDirs", () => {
  it("returns the first matching executable path", async () => {
    const first = await mkdtemp(join(tmpdir(), "yt-tooling-a-"));
    const second = await mkdtemp(join(tmpdir(), "yt-tooling-b-"));
    await writeFile(join(first, "yt-dlp"), "");
    await writeFile(join(second, "yt-dlp"), "");

    const found = findInBinDirs("yt-dlp", [first, second]);

    assert.equal(found, join(first, "yt-dlp"));
  });

  it("returns null when the command is not in any directory", async () => {
    const empty = await mkdtemp(join(tmpdir(), "yt-tooling-empty-"));

    assert.equal(findInBinDirs("yt-dlp", [empty]), null);
  });

  it("skips missing directories without throwing", () => {
    assert.equal(
      findInBinDirs("yt-dlp", ["/nonexistent/path/for/yt-tooling-test"]),
      null,
    );
  });
});
