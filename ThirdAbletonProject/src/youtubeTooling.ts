import { execFileSync, execSync, spawn } from "node:child_process";
import * as fs from "node:fs";
import * as os from "node:os";
import * as path from "node:path";
import type { ExtensionContext } from "@ableton-extensions/sdk";
import { loadFfmpegOverride, loadYtDlpOverride } from "./toolsConfig.js";

/** Homebrew and common manual install locations (GUI apps often omit these from PATH). */
const UNIX_BIN_DIRS = [
  "/opt/homebrew/bin",
  "/usr/local/bin",
  "/opt/local/bin",
  path.join(os.homedir(), ".local", "bin"),
] as const;

const MACOS_LOGIN_PATH_TIMEOUT_MS = 5000;
const LOG_PREFIX = "[YouTubeToAbleton]";

export class YoutubeToolingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "YoutubeToolingError";
  }
}

function logToolingDiag(message: string): void {
  console.log(`${LOG_PREFIX} ${message}`);
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
    "Install yt-dlp and ffmpeg, then put the full paths in tools.json:",
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
      "Note: Ableton does not inherit your Terminal PATH. tools.json with absolute paths is the most reliable fix.",
      "Homebrew is usually at /opt/homebrew/bin (Apple Silicon) or /usr/local/bin (Intel).",
      "This extension also checks MacPorts, ~/.local/bin, and /etc/paths automatically.",
    );
  } else if (process.platform === "win32") {
    lines.splice(
      1,
      0,
      "• Or restart Live after adding them to your system PATH",
    );
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
    lines.splice(
      1,
      0,
      "• Or restart Live after adding them to your system PATH",
    );
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

function isRunnable(filePath: string): boolean {
  try {
    fs.accessSync(filePath, fs.constants.F_OK);
    if (process.platform !== "win32") {
      fs.accessSync(filePath, fs.constants.X_OK);
    }
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
    return line && isRunnable(line) ? line : null;
  } catch {
    return null;
  }
}

/** @internal Exported for unit tests. */
export function mergePathDirs(
  inheritedPath: string,
  extraDirs: readonly string[],
): string {
  const seen = new Set<string>();
  const parts: string[] = [];
  for (const dir of [...extraDirs, ...inheritedPath.split(path.delimiter)]) {
    const trimmed = dir.trim();
    if (trimmed && !seen.has(trimmed)) {
      seen.add(trimmed);
      parts.push(trimmed);
    }
  }
  return parts.join(path.delimiter);
}

/** @internal Exported for unit tests. */
export function readEtcPathsDirs(): string[] {
  if (process.platform === "win32") {
    return [];
  }

  const dirs: string[] = [];
  try {
    for (const line of fs.readFileSync("/etc/paths", "utf8").split("\n")) {
      const trimmed = line.trim();
      if (trimmed) {
        dirs.push(trimmed);
      }
    }
  } catch {
    // /etc/paths may be unreadable in some environments.
  }

  try {
    for (const entry of fs.readdirSync("/etc/paths.d")) {
      const filePath = path.join("/etc/paths.d", entry);
      try {
        for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
          const trimmed = line.trim();
          if (trimmed) {
            dirs.push(trimmed);
          }
        }
      } catch {
        // Skip unreadable fragments.
      }
    }
  } catch {
    // /etc/paths.d may not exist.
  }

  return dirs;
}

/** @internal Exported for unit tests. */
export function getUnixProbeDirs(): string[] {
  const dirs = new Set<string>([...UNIX_BIN_DIRS, ...readEtcPathsDirs()]);
  return [...dirs];
}

/** @internal Exported for unit tests. */
export function findInBinDirs(
  command: string,
  dirs: readonly string[],
): string | null {
  for (const dir of dirs) {
    const fullPath = path.join(dir, command);
    if (isRunnable(fullPath)) {
      return fullPath;
    }
  }
  return null;
}

function findInPathEnv(pathEnv: string, command: string): string | null {
  const dirs = pathEnv
    .split(path.delimiter)
    .map((entry) => entry.trim())
    .filter(Boolean);
  return findInBinDirs(command, dirs);
}

let cachedMacOsLoginPath: string | null | undefined;

function getMacOsLoginPath(): string | null {
  if (process.platform !== "darwin") {
    return null;
  }
  if (cachedMacOsLoginPath !== undefined) {
    return cachedMacOsLoginPath;
  }

  try {
    const shell = process.env.SHELL?.trim() || "/bin/zsh";
    const output = execFileSync(shell, ["-ilc", 'echo -n "$PATH"'], {
      encoding: "utf8",
      timeout: MACOS_LOGIN_PATH_TIMEOUT_MS,
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    cachedMacOsLoginPath = output || null;
  } catch {
    cachedMacOsLoginPath = null;
  }

  if (cachedMacOsLoginPath) {
    logToolingDiag(
      `Resolved macOS login-shell PATH (${cachedMacOsLoginPath.length} chars)`,
    );
  } else {
    logToolingDiag("Could not resolve macOS login-shell PATH; using probe dirs only");
  }

  return cachedMacOsLoginPath;
}

let cachedAugmentedPath: string | undefined;

function getAugmentedPath(): string {
  if (cachedAugmentedPath !== undefined) {
    return cachedAugmentedPath;
  }

  const inherited = process.env.PATH ?? "";
  const extraDirs =
    process.platform === "win32"
      ? []
      : [...getUnixProbeDirs(), ...(getMacOsLoginPath()?.split(path.delimiter) ?? [])];

  cachedAugmentedPath = mergePathDirs(inherited, extraDirs);
  const preview =
    cachedAugmentedPath.length > 200
      ? `${cachedAugmentedPath.slice(0, 200)}…`
      : cachedAugmentedPath;
  logToolingDiag(`Augmented PATH for child processes: ${preview}`);
  return cachedAugmentedPath;
}

export function getSpawnEnv(): NodeJS.ProcessEnv {
  return { ...process.env, PATH: getAugmentedPath() };
}

/** @internal Exported for unit tests. */
export function isResolvedAbsoluteExecutable(executable: string): boolean {
  return path.isAbsolute(executable) && isRunnable(executable);
}

function findOnUnixLikePath(command: string): string | null {
  const probeDirs = getUnixProbeDirs();
  const fromProbeDirs = findInBinDirs(command, probeDirs);
  if (fromProbeDirs) {
    return fromProbeDirs;
  }

  if (process.platform === "darwin") {
    const loginPath = getMacOsLoginPath();
    if (loginPath) {
      return findInPathEnv(loginPath, command);
    }
  }

  return null;
}

function darwinFallbackExecutable(): string {
  return "";
}

function unixFallbackExecutable(): string {
  return "yt-dlp";
}

function windowsFallbackExecutable(): string {
  return "yt-dlp.exe";
}

function fallbackExecutable(): string {
  switch (process.platform) {
    case "win32":
      return windowsFallbackExecutable();
    case "darwin":
      return darwinFallbackExecutable();
    default:
      return unixFallbackExecutable();
  }
}

let cachedYtDlp: string | null | undefined;

export function resolveYtDlpExecutable(
  context?: ExtensionContext<"1.0.0">,
): string {
  if (cachedYtDlp !== undefined) {
    return cachedYtDlp ?? fallbackExecutable();
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
  } else if (process.platform === "darwin") {
    const fromUnix = findOnUnixLikePath("yt-dlp");
    if (fromUnix) {
      candidates.push(fromUnix);
    }
  } else {
    const fromUnix = findOnUnixLikePath("yt-dlp");
    if (fromUnix) {
      candidates.push(fromUnix);
    }
    candidates.push("yt-dlp");
  }

  for (const candidate of candidates) {
    if (isRunnable(candidate)) {
      cachedYtDlp = candidate;
      logToolingDiag(`Resolved yt-dlp: ${candidate}`);
      return candidate;
    }
  }

  cachedYtDlp = null;
  logToolingDiag("Could not resolve yt-dlp to an absolute executable path");
  return fallbackExecutable();
}

export function spawnOptions(_executable: string): {
  shell: boolean;
  windowsHide: boolean;
  env: NodeJS.ProcessEnv;
} {
  // Never use shell:true — on Windows, cmd.exe would mangle % signs in yt-dlp
  // output templates (e.g. %(ext)s → empty string). Windows process creation
  // resolves bare executable names against PATH without needing a shell wrapper.
  return { shell: false, windowsHide: true, env: getSpawnEnv() };
}

function runYtDlpVersion(
  executable: string,
  signal: AbortSignal,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const { shell, windowsHide, env } = spawnOptions(executable);
    const child = spawn(executable, ["--version"], {
      shell,
      windowsHide,
      env,
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

function runFfmpegVersion(
  executable: string,
  signal: AbortSignal,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const { shell, windowsHide, env } = spawnOptions(executable);
    const child = spawn(executable, ["-version"], {
      shell,
      windowsHide,
      env,
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

  if (
    process.platform === "darwin" &&
    !isResolvedAbsoluteExecutable(executable)
  ) {
    throw new YoutubeToolingError(
      `Could not find yt-dlp (Ableton cannot see Terminal PATH).\n\n${toolingHint}`,
    );
  }

  try {
    await runYtDlpVersion(executable, new AbortController().signal);
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

  // Also verify ffmpeg is available — yt-dlp needs it for audio conversion.
  const ffmpegPath = resolveFfmpegPath(context);
  const ffmpegExecutable = ffmpegPath ?? "ffmpeg";
  try {
    await runFfmpegVersion(ffmpegExecutable, new AbortController().signal);
    logToolingDiag(`ffmpeg validated: ${ffmpegExecutable}`);
  } catch (error) {
    throw new YoutubeToolingError(
      `Could not run ffmpeg (${ffmpegExecutable}).\n\n` +
        "ffmpeg is required for audio conversion. Install it and set ffmpegPath in tools.json if needed.\n\n" +
        toolingHint,
    );
  }

  return executable;
}

function resolveRunnableCandidate(candidate: string | null): string | null {
  if (!candidate) {
    return null;
  }
  return isRunnable(candidate) ? candidate : null;
}

export function resolveFfmpegPath(
  context?: ExtensionContext<"1.0.0">,
): string | null {
  if (context) {
    const fromStorage = resolveRunnableCandidate(loadFfmpegOverride(context));
    if (fromStorage) {
      logToolingDiag(`Resolved ffmpeg (tools.json): ${fromStorage}`);
      return fromStorage;
    }
  }

  const fromEnv = resolveRunnableCandidate(process.env.FFMPEG_PATH?.trim() ?? null);
  if (fromEnv) {
    logToolingDiag(`Resolved ffmpeg (FFMPEG_PATH): ${fromEnv}`);
    return fromEnv;
  }

  if (process.platform === "win32") {
    const fromWhere = findOnWindowsPath("ffmpeg");
    if (fromWhere) {
      logToolingDiag(`Resolved ffmpeg (where): ${fromWhere}`);
      return fromWhere;
    }
    logToolingDiag("ffmpeg not found; yt-dlp will search inherited PATH");
    return null;
  }

  const fromUnix = findOnUnixLikePath("ffmpeg");
  if (fromUnix) {
    logToolingDiag(`Resolved ffmpeg: ${fromUnix}`);
    return fromUnix;
  }

  logToolingDiag("ffmpeg not found; yt-dlp will search augmented PATH");
  return null;
}
