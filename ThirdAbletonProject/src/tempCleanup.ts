import { readdir, unlink } from "node:fs/promises";
import * as path from "node:path";

const AUDIO_EXTS = new Set([
  ".wav",
  ".mp3",
  ".m4a",
  ".webm",
  ".opus",
  ".ogg",
  ".flac",
  ".aac",
  ".part",
  ".ytdl",
]);

export async function cleanupTempArtifacts(
  tempDir: string,
  videoId: string,
): Promise<void> {
  let entries: string[];
  try {
    entries = await readdir(tempDir);
  } catch {
    return;
  }

  await Promise.all(
    entries
      .filter((name) => name.startsWith(videoId))
      .map((name) => unlink(path.join(tempDir, name)).catch(() => undefined)),
  );
}

/** Delete stale audio files left behind by crashed or cancelled downloads. */
export async function cleanupStaleTempFiles(tempDir: string): Promise<void> {
  let entries: string[];
  try {
    entries = await readdir(tempDir);
  } catch {
    return;
  }

  await Promise.all(
    entries
      .filter((name) => {
        const ext = path.extname(name).toLowerCase();
        return AUDIO_EXTS.has(ext);
      })
      .map((name) => unlink(path.join(tempDir, name)).catch(() => undefined)),
  );
}
