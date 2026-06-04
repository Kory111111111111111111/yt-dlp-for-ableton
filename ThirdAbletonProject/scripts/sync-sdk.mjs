/**
 * Copy Ableton Extensions SDK .tgz files into vendor/ for npm install.
 *
 * Sources (first match wins):
 *   1. ABLETON_SDK_DIR environment variable
 *   2. ../../../AbletonExtensions/extensions-sdk-1.0.0-beta.0 (sibling repo on Desktop)
 *   3. ../extensions-sdk-1.0.0-beta.0 (legacy layout next to ThirdAbletonProject)
 */
import * as fs from "node:fs";
import * as path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const vendorDir = path.join(projectRoot, "vendor");

const SDK_TGZ = "ableton-extensions-sdk-1.0.0-beta.0.tgz";
const CLI_TGZ = "ableton-extensions-cli-1.0.0-beta.0.tgz";

function resolveSdkDir() {
  const fromEnv = process.env.ABLETON_SDK_DIR?.trim();
  if (fromEnv) {
    return path.resolve(fromEnv);
  }

  const candidates = [
    path.resolve(projectRoot, "../../../AbletonExtensions/extensions-sdk-1.0.0-beta.0"),
    path.resolve(projectRoot, "../extensions-sdk-1.0.0-beta.0"),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(path.join(candidate, SDK_TGZ))) {
      return candidate;
    }
  }

  return null;
}

function copySdkArtifacts(sdkDir) {
  fs.mkdirSync(vendorDir, { recursive: true });

  for (const name of [SDK_TGZ, CLI_TGZ]) {
    const src = path.join(sdkDir, name);
    const dest = path.join(vendorDir, name);
    if (!fs.existsSync(src)) {
      throw new Error(`Missing ${name} in ${sdkDir}`);
    }
    fs.copyFileSync(src, dest);
    console.log(`sync-sdk: ${name} ← ${src}`);
  }
}

const vendorReady =
  fs.existsSync(path.join(vendorDir, SDK_TGZ)) &&
  fs.existsSync(path.join(vendorDir, CLI_TGZ));

if (vendorReady && process.env.FORCE_SDK_SYNC !== "1") {
  console.log("sync-sdk: vendor/ already has SDK packages (set FORCE_SDK_SYNC=1 to refresh)");
  process.exit(0);
}

const sdkDir = resolveSdkDir();
if (!sdkDir) {
  console.error(
    "sync-sdk: Could not find Ableton Extensions SDK.\n\n" +
      "Set ABLETON_SDK_DIR to your extensions-sdk-1.0.0-beta.0 folder, or clone:\n" +
      "  https://github.com/Kory111111111111111111/AbletonExtensions\n\n" +
      "CI checks out that repo automatically; local dev needs it nearby or in vendor/.",
  );
  process.exit(1);
}

copySdkArtifacts(sdkDir);
console.log("sync-sdk: done");
