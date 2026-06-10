import assert from "node:assert/strict";
import { chmod, mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { delimiter, join } from "node:path";
import { describe, it } from "node:test";
import {
  findInBinDirs,
  getUnixProbeDirs,
  isResolvedAbsoluteExecutable,
  mergePathDirs,
} from "../src/youtubeTooling.ts";

async function writeExecutable(filePath: string): Promise<void> {
  await writeFile(filePath, "");
  if (process.platform !== "win32") {
    await chmod(filePath, 0o755);
  }
}

describe("findInBinDirs", () => {
  it("returns the first matching executable path", async () => {
    const first = await mkdtemp(join(tmpdir(), "yt-tooling-a-"));
    const second = await mkdtemp(join(tmpdir(), "yt-tooling-b-"));
    await writeExecutable(join(first, "yt-dlp"));
    await writeExecutable(join(second, "yt-dlp"));

    const found = findInBinDirs("yt-dlp", [first, second]);

    assert.equal(found, join(first, "yt-dlp"));
  });

  it("returns null when the command is not in any directory", async () => {
    const empty = await mkdtemp(join(tmpdir(), "yt-tooling-empty-"));

    assert.equal(findInBinDirs("yt-dlp", [empty]), null);
  });

  it("skips non-executable files on Unix", async () => {
    if (process.platform === "win32") {
      return;
    }

    const dir = await mkdtemp(join(tmpdir(), "yt-tooling-noexec-"));
    await writeFile(join(dir, "yt-dlp"), "");

    assert.equal(findInBinDirs("yt-dlp", [dir]), null);
  });

  it("skips missing directories without throwing", () => {
    assert.equal(
      findInBinDirs("yt-dlp", ["/nonexistent/path/for/yt-tooling-test"]),
      null,
    );
  });
});

describe("mergePathDirs", () => {
  it("prepends extra dirs and deduplicates entries", () => {
    const inherited = ["/usr/bin", "/bin"].join(delimiter);
    const merged = mergePathDirs(inherited, ["/opt/homebrew/bin", "/usr/bin"]);

    assert.equal(
      merged,
      ["/opt/homebrew/bin", "/usr/bin", "/bin"].join(delimiter),
    );
  });
});

describe("getUnixProbeDirs", () => {
  it("includes standard Homebrew and user-local directories", () => {
    const dirs = getUnixProbeDirs();

    assert.ok(dirs.includes("/opt/homebrew/bin"));
    assert.ok(dirs.includes("/usr/local/bin"));
    assert.ok(dirs.includes("/opt/local/bin"));
    assert.ok(
      dirs.some((dir) => dir.replaceAll("\\", "/").endsWith(".local/bin")),
    );
  });
});

describe("isResolvedAbsoluteExecutable", () => {
  it("returns false for bare command names", () => {
    assert.equal(isResolvedAbsoluteExecutable("yt-dlp"), false);
  });
});
