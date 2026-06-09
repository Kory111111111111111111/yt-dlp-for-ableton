import { execSync, spawn } from "node:child_process";
import * as fs from "node:fs";
import * as path from "node:path";
import type { ExtensionContext } from "@ableton-extensions/sdk";
import { loadFfmpegOverride, loadYtDlpOverride } from "./toolsConfig.js";

/** Homebrew and common manual install locations (GUI apps often omit these from PATH). */
const UNIX_BIN_DIRS = ["/opt/homebrew/bin", "/usr/local/bin"] as const;

export class YoutubeToolingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "YoutubeToolingError";
  }
}

function getToolingHint(context?: ExtensionContext<"1.0.0">): string {
  const storageDir = context?.environment.storageDirectory?.trim();
  const toolsJsonLine = storageDir
    ? `Create tools.json here:\n  ${path.join(storageDir, "tools.json")}\n\n`
    : "Create a tools.json file in the extension storage directory (see Ableton extension logs if unsure).\n\n";

  const toolsJsonExample =
    process.platform === "win32"
      ? '{ "ytDlpPath": "C:\\\\...\\\\yt-dlp.exe", "ffmpegPath": "C:\\\\...\\\\ffmpeg.exe" }'
      : '{ "ytDlpPath": "/opt/homebrew/bin/yt-dlp", "ffmpegPath": "/opt/homebrew/bin/ffmpeg" }';

  const lines = [
    "Install yt-dlp and ffmpeg, then either:",
    "• Restart Live after adding them to your system PATH, or",
    "• Put the full paths in tools.json:",
    `  ${toolsJsonExample}`,
    "",
    toolsJsonLine,
  ];

  if (process.platform === "darwin") {
    lines.push(
      "macOS install (Homebrew):",
      "  brew install yt-dlp ffmpeg",
      "",
      "Get paths in Terminal:",
      "  which yt-dlp",
      "  which ffmpeg",
      "",
      "Note: Terminal and Ableton often have different PATH settings.",
      "Homebrew is usually at /opt/homebrew/bin (Apple Silicon) or /usr/local/bin (Intel).",
      "Recent extension versions check those folders automatically; tools.json still works if yours differ.",
    );
  } else if (process.platform === "win32") {
    lines.push(
      "Windows install:",
      "  winget install yt-dlp.yt-dlp",
      "  winget install Gyan.FFmpeg",
      "",
      "Get paths in PowerShell:",
      "  where yt-dlp",
      "  where ffmpeg",
    );
  } else {
    lines.push(
      "Linux install (example):",
      "  sudo apt install yt-dlp ffmpeg",
      "",
      "Get paths:",
      "  which yt-dlp",
      "  which ffmpeg",
    );
  }

  return lines.join("\n");
}

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

/** @internal Exported for unit tests. */
export function findInBinDirs(
  command: string,
  dirs: readonly string[],
): string | null {
  for (const dir of dirs) {
    const fullPath = path.join(dir, command);
    if (fileExists(fullPath)) {
      return fullPath;
    }
  }
  return null;
}

function findOnUnixPath(command: string): string | null {
  return findInBinDirs(command, UNIX_BIN_DIRS);
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
    const fromUnixBins = findOnUnixPath("yt-dlp");
    if (fromUnixBins) {
      candidates.push(fromUnixBins);
    }
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
  const toolingHint = getToolingHint(context);
  try {
    await runYtDlpVersion(executable, new AbortController().signal);
    return executable;
  } catch (error) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      throw new YoutubeToolingError(
        `Could not run "${executable}" (not found).\n\n${toolingHint}`,
      );
    }
    throw new YoutubeToolingError(
      `Could not run yt-dlp (${error instanceof Error ? error.message : String(error)}).\n\n${toolingHint}`,
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
    return null;
  }

  return findOnUnixPath("ffmpeg");
}
