import { execSync, spawn } from "node:child_process";
import * as fs from "node:fs";
import type { ExtensionContext } from "@ableton-extensions/sdk";
import { loadFfmpegOverride, loadYtDlpOverride } from "./toolsConfig.js";

export class YoutubeToolingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "YoutubeToolingError";
  }
}

const TOOLING_HINT =
  "Install yt-dlp and ffmpeg, then either:\n" +
  "• Restart Live after adding them to your system PATH, or\n" +
  "• Put the full paths in the extension's tools.json:\n" +
  "  { \"ytDlpPath\": \"C:\\\\...\\\\yt-dlp.exe\", \"ffmpegPath\": \"C:\\\\...\\\\ffmpeg.exe\" }\n" +
  "  (Run 'where yt-dlp' and 'where ffmpeg' in PowerShell to get the paths)\n\n" +
  "Windows: winget install yt-dlp.yt-dlp && winget install Gyan.FFmpeg";

function fileExists(filePath: string): boolean {
  try {
    fs.accessSync(filePath);
    return true;
  } catch {
    return false;
  }
}

function findOnWindowsPath(command: string): string | null {
  try {
    const output = execSync(`where ${command}`, {
      encoding: "utf8",
      windowsHide: true,
      stdio: ["ignore", "pipe", "ignore"],
    });
    const line = output
      .split(/\r?\n/)
      .map((s) => s.trim())
      .find(Boolean);
    return line && fileExists(line) ? line : null;
  } catch {
    return null;
  }
}

let cachedYtDlp: string | null | undefined;

export function resolveYtDlpExecutable(
  context?: ExtensionContext<"1.0.0">,
): string {
  if (cachedYtDlp !== undefined) {
    return cachedYtDlp ?? (process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp");
  }

  const candidates: string[] = [];

  const fromStorage = context ? loadYtDlpOverride(context) : null;
  if (fromStorage) {
    candidates.push(fromStorage);
  }

  const fromEnv = process.env.YT_DLP_PATH?.trim();
  if (fromEnv) {
    candidates.push(fromEnv);
  }

  if (process.platform === "win32") {
    const fromWhere = findOnWindowsPath("yt-dlp");
    if (fromWhere) {
      candidates.push(fromWhere);
    }
    candidates.push("yt-dlp.exe", "yt-dlp");
  } else {
    candidates.push("yt-dlp");
  }

  for (const candidate of candidates) {
    if (fileExists(candidate)) {
      cachedYtDlp = candidate;
      return candidate;
    }
  }

  cachedYtDlp = null;
  return process.platform === "win32" ? "yt-dlp.exe" : "yt-dlp";
}

export function spawnOptions(_executable: string): {
  shell: boolean;
  windowsHide: boolean;
} {
  // Never use shell:true — on Windows, cmd.exe would mangle % signs in yt-dlp
  // output templates (e.g. %(ext)s → empty string). Windows process creation
  // resolves bare executable names against PATH without needing a shell wrapper.
  return { shell: false, windowsHide: true };
}

function runYtDlpVersion(
  executable: string,
  signal: AbortSignal,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const { shell, windowsHide } = spawnOptions(executable);
    const child = spawn(executable, ["--version"], {
      shell,
      windowsHide,
      stdio: ["ignore", "pipe", "pipe"],
    });

    const onAbort = () => {
      child.kill();
    };
    signal.addEventListener("abort", onAbort, { once: true });

    child.on("error", (error) => {
      signal.removeEventListener("abort", onAbort);
      reject(error);
    });

    child.on("close", (code) => {
      signal.removeEventListener("abort", onAbort);
      if (signal.aborted) {
        reject(new Error("Cancelled"));
        return;
      }
      if (code === 0) {
        resolve();
        return;
      }
      reject(new Error(`exit ${code ?? "unknown"}`));
    });
  });
}

export async function assertYoutubeTooling(
  context?: ExtensionContext<"1.0.0">,
): Promise<string> {
  const executable = resolveYtDlpExecutable(context);
  try {
    await runYtDlpVersion(executable, new AbortController().signal);
    return executable;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      throw new YoutubeToolingError(
        `Could not run "${executable}" (not found).\n\n${TOOLING_HINT}`,
      );
    }
    throw new YoutubeToolingError(
      `Could not run yt-dlp (${error instanceof Error ? error.message : String(error)}).\n\n${TOOLING_HINT}`,
    );
  }
}

export function resolveFfmpegPath(
  context?: ExtensionContext<"1.0.0">,
): string | null {
  if (context) {
    const fromStorage = loadFfmpegOverride(context);
    if (fromStorage) {
      return fromStorage;
    }
  }

  const fromEnv = process.env.FFMPEG_PATH?.trim();
  if (fromEnv) {
    return fromEnv;
  }

  if (process.platform === "win32") {
    const fromWhere = findOnWindowsPath("ffmpeg");
    if (fromWhere) {
      return fromWhere;
    }
  }

  return null;
}
