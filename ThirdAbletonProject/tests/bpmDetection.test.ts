import assert from "node:assert/strict";
import { mkdtemp, writeFile, access } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { describe, it } from "node:test";
import { detectBpm } from "../src/bpmDetection.ts";

describe("detectBpm", () => {
  it("returns null for a non-existent file path", async () => {
    const result = await detectBpm(
      join(tmpdir(), "yt-bpm-nonexistent-file.wav"),
    );
    assert.equal(result, null);
  });

  it("returns null for an empty file (invalid audio)", async () => {
    const dir = await mkdtemp(join(tmpdir(), "yt-bpm-empty-"));
    const filePath = join(dir, "empty.wav");
    await writeFile(filePath, Buffer.alloc(0));

    const result = await detectBpm(filePath);
    assert.equal(result, null);
  });

  it("returns null for a file containing garbage bytes", async () => {
    const dir = await mkdtemp(join(tmpdir(), "yt-bpm-garbage-"));
    const filePath = join(dir, "garbage.wav");
    await writeFile(filePath, Buffer.from("not valid audio data"));

    const result = await detectBpm(filePath);
    assert.equal(result, null);
  });

  it("returns a reasonable BPM for a real WAV file (integration)", async () => {
    // This test requires a pre-downloaded .wav fixture.
    // Download with:
    //   yt-dlp -x --audio-format wav --postprocessor-args "-t 30" \
    //     -o ".temp/bcuAw77J8_Y.%(ext)s" \
    //     "https://www.youtube.com/watch?v=bcuAw77J8_Y"
    const fixturePath = resolve(".temp", "bcuAw77J8_Y.wav");
    try {
      await access(fixturePath);
    } catch {
      // Fixture not present — skip the integration test.
      return;
    }

    const bpm = await detectBpm(fixturePath);

    assert.ok(
      bpm !== null,
      "Expected a BPM value but got null — the fixture should be a valid audio file",
    );
    assert.ok(
      bpm! >= 40 && bpm! <= 250,
      `BPM ${bpm} is outside the reasonable range (40-250)`,
    );
  });
});
