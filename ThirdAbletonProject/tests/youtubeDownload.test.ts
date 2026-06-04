import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { buildYtDlpAudioDownloadArgs } from "../src/youtubeDownload.ts";

describe("buildYtDlpAudioDownloadArgs", () => {
  it("builds WAV args without mp3-only quality option", () => {
    const args = buildYtDlpAudioDownloadArgs({
      watchUrl: "https://www.youtube.com/watch?v=q1ULJ92aldE",
      outputTemplate: "C:/temp/q1ULJ92aldE.%(ext)s",
      ffmpegPath: "C:/ffmpeg/bin/ffmpeg.exe",
      format: "wav",
    });

    assert.deepEqual(args, [
      "--no-playlist",
      "--extract-audio",
      "--audio-format",
      "wav",
      "--no-part",
      "--ffmpeg-location",
      "C:/ffmpeg/bin/ffmpeg.exe",
      "-o",
      "C:/temp/q1ULJ92aldE.%(ext)s",
      "https://www.youtube.com/watch?v=q1ULJ92aldE",
    ]);
    assert.equal(args.includes("--audio-quality"), false);
  });

  it("builds MP3 args with quality flag", () => {
    const args = buildYtDlpAudioDownloadArgs({
      watchUrl: "https://www.youtube.com/watch?v=q1ULJ92aldE",
      outputTemplate: "C:/temp/q1ULJ92aldE.%(ext)s",
      ffmpegPath: null,
      format: "mp3",
    });

    assert.deepEqual(args, [
      "--no-playlist",
      "--extract-audio",
      "--audio-format",
      "mp3",
      "--audio-quality",
      "0",
      "--no-part",
      "-o",
      "C:/temp/q1ULJ92aldE.%(ext)s",
      "https://www.youtube.com/watch?v=q1ULJ92aldE",
    ]);
  });
});
