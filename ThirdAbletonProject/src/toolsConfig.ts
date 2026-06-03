import * as fs from "node:fs";
import * as path from "node:path";
import type { ExtensionContext } from "@ableton-extensions/sdk";

const TOOLS_FILE = "tools.json";

type ToolsConfig = {
  ytDlpPath?: string;
  ffmpegPath?: string;
};

function toolsConfigPath(context: ExtensionContext<"1.0.0">): string | null {
  const dir = context.environment.storageDirectory;
  if (!dir) {
    return null;
  }
  return path.join(dir, TOOLS_FILE);
}

function loadToolsConfig(context: ExtensionContext<"1.0.0">): ToolsConfig | null {
  const filePath = toolsConfigPath(context);
  if (!filePath || !fs.existsSync(filePath)) {
    return null;
  }
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as ToolsConfig;
  } catch {
    return null;
  }
}

export function loadYtDlpOverride(context: ExtensionContext<"1.0.0">): string | null {
  const config = loadToolsConfig(context);
  const trimmed = config?.ytDlpPath?.trim();
  return trimmed || null;
}

export function loadFfmpegOverride(context: ExtensionContext<"1.0.0">): string | null {
  const config = loadToolsConfig(context);
  const trimmed = config?.ffmpegPath?.trim();
  return trimmed || null;
}
