import { execSync } from "node:child_process";
import { parseYoutubeLink } from "../src/youtubeUrl.ts";

const sample =
  "https://m.youtube.com/watch?v=q1ULJ92aldE&list=RDq1ULJ92aldE&start_radio=1&pp=ygUDbmNzoAcB";

const parsed = parseYoutubeLink(sample);
if (!parsed) {
  console.error("FAIL: sample URL did not parse");
  process.exit(1);
}
console.log("OK: URL parse →", parsed.watchUrl);

try {
  const version = execSync("yt-dlp --version", {
    encoding: "utf8",
    windowsHide: true,
  }).trim();
  console.log("OK: yt-dlp", version);
} catch {
  console.error("FAIL: yt-dlp not runnable from this shell (Live may differ — use .storage/tools.json)");
  process.exit(1);
}

try {
  execSync("ffmpeg -version", { encoding: "utf8", windowsHide: true, stdio: "ignore" });
  console.log("OK: ffmpeg found");
} catch {
  console.warn("WARN: ffmpeg not on PATH (yt-dlp may still work if ffmpeg is bundled with yt-dlp)");
}

console.log("verify-tooling: all checks passed");
