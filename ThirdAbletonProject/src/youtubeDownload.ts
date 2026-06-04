import { spawn } from "node:child_process";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import type { ExtensionContext } from "@ableton-extensions/sdk";
import type { ParsedYoutubeLink } from "./youtubeUrl.js";
import {
  assertYoutubeTooling,
  resolveFfmpegPath,
  spawnOptions,
} from "./youtubeTooling.js";

export type YoutubeDownloadResult = {
  filePath: string;
  title: string;
  durationSeconds: number;
};

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

function runProcess(
  executable: string,
  args: string[],
  tempDir: string,
  signal: AbortSignal,
  onLine: (line: string) => void,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const { shell, windowsHide } = spawnOptions(executable);
    const child = spawn(executable, args, {
      cwd: tempDir,
      shell,
      windowsHide,
      stdio: ["ignore", "pipe", "pipe"],
    });

    const handleAbort = () => {
      child.kill();
    };
    signal.addEventListener("abort", handleAbort, { once: true });

    const allLines: string[] = [];

    const consume = (chunk: Buffer) => {
      for (const line of chunk.toString("utf8").split(/\r?\n/)) {
        const trimmed = line.trim();
        if (trimmed) {
          allLines.push(trimmed);
          onLine(trimmed);
        }
      }
    };

    child.stdout?.on("data", consume);
    child.stderr?.on("data", consume);

    child.on("error", (error) => {
      signal.removeEventListener("abort", handleAbort);
      reject(error);
    });

    child.on("close", (code) => {
      signal.removeEventListener("abort", handleAbort);
      if (signal.aborted) {
        const err = new Error("Download cancelled");
        err.name = "AbortError";
        reject(err);
        return;
      }
      if (code === 0) {
        resolve();
        return;
      }
      const detail = allLines.slice(-10).join("\n");
      reject(
        new Error(
          `yt-dlp exited with code ${code ?? "unknown"}${detail ? `:\n\n${detail}` : ""}`,
        ),
      );
    });
  });
}

function parseProgressPercent(line: string): number | undefined {
  const match = /\[download\]\s+(\d+(?:\.\d+)?)%/.exec(line);
  if (!match?.[1]) {
    return undefined;
  }
  return Math.min(100, Math.round(Number.parseFloat(match[1])));
}

export async function downloadYoutubeAsMp3(
  context: ExtensionContext<"1.0.0">,
  link: ParsedYoutubeLink,
  tempDir: string,
  onProgress: (message: string, percent?: number) => Promise<void>,
  signal: AbortSignal,
): Promise<YoutubeDownloadResult> {
  const ytDlp = await assertYoutubeTooling(context);
  const ffmpegPath = resolveFfmpegPath(context);
  const { watchUrl, videoId } = link;

  const outputTemplate = path.join(tempDir, `${videoId}.%(ext)s`);
  const expectedMp3 = path.join(tempDir, `${videoId}.wav`);

  const ffmpegArgs = ffmpegPath ? ["--ffmpeg-location", ffmpegPath] : [];

  let title = "YouTube import";
  let durationSeconds = 0;

  await onProgress("Fetching video info…", 0);
  const infoLines: string[] = [];
  await runProcess(
    ytDlp,
    ["--no-playlist", "--print", "%(title)s", "--print", "%(duration)s", watchUrl],
    tempDir,
    signal,
    (line) => infoLines.push(line),
  );

  if (infoLines[0]) {
    title = infoLines[0];
  }
  if (infoLines[1]) {
    const parsed = Number.parseFloat(infoLines[1]);
    if (Number.isFinite(parsed) && parsed > 0) {
      durationSeconds = parsed;
    }
  }

  await onProgress("Downloading and converting to MP3…", 5);
  await runProcess(
    ytDlp,
    [
      "--no-playlist",
      "--extract-audio",
      "--audio-format",
      "wav",
      "--audio-quality",
      "0",
      "--no-part",
      ...ffmpegArgs,
      "-o",
      outputTemplate,
      watchUrl,
    ],
    tempDir,
    signal,
    (line) => {
      const percent = parseProgressPercent(line);
      void onProgress(line, percent);
    },
  );

  if (!(await fileExists(expectedMp3))) {
    const entries = await fs.readdir(tempDir);
    const mp3 = entries.find(
      (name) => name.startsWith(videoId) && name.endsWith(".wav"),
    );
    if (!mp3) {
      throw new Error(
        "Download finished but no MP3 file was found in the temp folder.",
      );
    }
    return {
      filePath: path.join(tempDir, mp3),
      title,
      durationSeconds,
    };
  }

  return { filePath: expectedMp3, title, durationSeconds };
}
