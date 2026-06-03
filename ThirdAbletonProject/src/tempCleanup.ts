import { readdir, unlink } from "node:fs/promises";
import * as path from "node:path";

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
