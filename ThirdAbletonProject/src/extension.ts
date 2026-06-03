import {
  AudioTrack,
  ClipSlot,
  DataModelObject,
  initialize,
  type ActivationContext,
  type ArrangementSelection,
  type ExtensionContext,
  type Handle,
} from "@ableton-extensions/sdk";
import { mkdir } from "node:fs/promises";
import errorDialogTemplate from "./error-dialog.html";
import youtubeDialogTemplate from "./youtube-dialog.html";
import { downloadYoutubeAsMp3 } from "./youtubeDownload.js";
import { cleanupTempArtifacts } from "./tempCleanup.js";
import { parseYoutubeLink, type ParsedYoutubeLink } from "./youtubeUrl.js";
import { assertYoutubeTooling, YoutubeToolingError } from "./youtubeTooling.js";

const YOUTUBE_DIALOG_WIDTH = 440;
const YOUTUBE_DIALOG_HEIGHT = 200;
const ERROR_DIALOG_WIDTH = 420;
const ERROR_DIALOG_HEIGHT = 220;

type YoutubeDialogResult = {
  canceled?: boolean;
  url?: string;
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildErrorDialogUrl(title: string, message: string): string {
  const html = errorDialogTemplate
    .replace("__DIALOG_TITLE__", escapeHtml(title))
    .replace("__DIALOG_MESSAGE__", escapeHtml(message));
  return `data:text/html,${encodeURIComponent(html)}`;
}

const youtubeDialogDataUrl = `data:text/html,${encodeURIComponent(youtubeDialogTemplate)}`;

async function showErrorDialog(
  context: ExtensionContext<"1.0.0">,
  title: string,
  message: string,
): Promise<void> {
  await context.ui.showModalDialog(
    buildErrorDialogUrl(title, message),
    ERROR_DIALOG_WIDTH,
    ERROR_DIALOG_HEIGHT,
  );
}

async function promptYoutubeLink(
  context: ExtensionContext<"1.0.0">,
): Promise<ParsedYoutubeLink | null> {
  const raw = await context.ui.showModalDialog(
    youtubeDialogDataUrl,
    YOUTUBE_DIALOG_WIDTH,
    YOUTUBE_DIALOG_HEIGHT,
  );

  let parsed: YoutubeDialogResult;
  try {
    parsed = JSON.parse(raw) as YoutubeDialogResult;
  } catch {
    return null;
  }

  if (parsed.canceled || !parsed.url?.trim()) {
    return null;
  }

  const link = parseYoutubeLink(parsed.url);
  if (!link) {
    await showErrorDialog(
      context,
      "Invalid URL",
      "Paste a single YouTube video link (watch, m.youtube.com, youtu.be, or Shorts).\n\nMix/playlist URLs are fine if they include ?v= with a video id.",
    );
    return null;
  }

  return link;
}

function throwIfAborted(signal: AbortSignal): void {
  if (signal.aborted) {
    const err = new Error("Download cancelled");
    err.name = "AbortError";
    throw err;
  }
}

function beatsFromSeconds(seconds: number, bpm: number): number {
  if (seconds <= 0 || bpm <= 0) {
    return 4;
  }
  return (seconds / 60) * bpm;
}

async function resolveTempDirectory(
  context: ExtensionContext<"1.0.0">,
): Promise<string | null> {
  const tempDir = context.environment.tempDirectory;
  if (!tempDir) {
    return null;
  }
  await mkdir(tempDir, { recursive: true });
  return tempDir;
}

async function runYoutubeImport(
  context: ExtensionContext<"1.0.0">,
  importTarget: (
    importedPath: string,
    title: string,
    durationSeconds: number,
  ) => Promise<void>,
): Promise<void> {
  const link = await promptYoutubeLink(context);
  if (!link) {
    return;
  }

  const tempDir = await resolveTempDirectory(context);
  if (!tempDir) {
    await showErrorDialog(
      context,
      "Import failed",
      "Extension temp directory is not available.\n\n" +
        "In Developer Mode, run npm start from ThirdAbletonProject " +
        "(it passes --temp-directory .temp).",
    );
    return;
  }

  try {
    await assertYoutubeTooling(context);
  } catch (error) {
    if (error instanceof YoutubeToolingError) {
      await showErrorDialog(context, "Missing tools", error.message);
      return;
    }
    throw error;
  }

  try {
    await context.ui.withinProgressDialog(
      "Importing from YouTube",
      {},
      async (update, signal) => {
        const download = await downloadYoutubeAsMp3(
          context,
          link,
          tempDir,
          async (message, percent) => {
            await update(message, percent ?? 0);
            throwIfAborted(signal);
          },
          signal,
        );

        await update("Adding to project…", 100);
        throwIfAborted(signal);

        const importedPath = await context.withinTransaction(() =>
          context.resources.importIntoProject(download.filePath),
        );

        await context.withinTransaction(() =>
          importTarget(importedPath, download.title, download.durationSeconds),
        );

        await cleanupTempArtifacts(tempDir, link.videoId);
      },
    );
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      return;
    }
    if (error instanceof YoutubeToolingError) {
      await showErrorDialog(context, "Missing tools", error.message);
      return;
    }
    const message =
      error instanceof Error ? error.message : "An unknown error occurred.";
    await showErrorDialog(context, "Import failed", message);
  }
}

export function activate(activation: ActivationContext) {
  const context = initialize(activation, "1.0.0");
  const bpm = () => context.application.song.tempo;

  context.commands.registerCommand("youtube.importClipSlot", (arg: unknown) => {
    void (async (handle: Handle) => {
      const clipSlot = context.getObjectFromHandle(handle, ClipSlot);
      await runYoutubeImport(context, async (importedPath, _title, durationSeconds) => {
        const endBeat = Math.max(4, beatsFromSeconds(durationSeconds, bpm()));
        await clipSlot.createAudioClip({
          filePath: importedPath,
          isWarped: false,
          loopSettings: {
            looping: false,
            startMarker: 1,
            endMarker: endBeat,
            loopStart: 1,
            loopEnd: endBeat,
          },
        });
      });
    })(arg as Handle).catch((error) => {
      void showErrorDialog(
        context,
        "Import failed",
        formatClipCreationError(error),
      );
    });
  });

  context.commands.registerCommand(
    "youtube.importArrangement",
    (arg: unknown) => {
      void (async (selection: ArrangementSelection) => {
        const audioTracks = selection.selected_lanes
          .map((handle) =>
            context.getObjectFromHandle(handle, DataModelObject),
          )
          .filter((obj): obj is AudioTrack<"1.0.0"> => obj instanceof AudioTrack);

        if (!audioTracks.length) {
          await showErrorDialog(
            context,
            "Audio track required",
            "Select an audio track in the arrangement (not a MIDI track), then try again.",
          );
          return;
        }

        const track = audioTracks[0]!;
        const selectionBeats = Math.max(
          0.25,
          selection.time_selection_end - selection.time_selection_start,
        );

        await runYoutubeImport(context, async (importedPath, _title, durationSeconds) => {
          const fileBeats = beatsFromSeconds(durationSeconds, bpm());
          const duration = Math.max(selectionBeats, fileBeats);
          await track.createAudioClip({
            filePath: importedPath,
            startTime: selection.time_selection_start,
            duration,
            isWarped: false,
          });
        });
      })(arg as ArrangementSelection);
    },
  );

  context.commands.registerCommand("youtube.importAudioTrack", (arg: unknown) => {
    void (async (handle: Handle) => {
      const track = context.getObjectFromHandle(handle, AudioTrack);
      await runYoutubeImport(context, async (importedPath) => {
        await track.createAudioClip({
          filePath: importedPath,
          startTime: 1,
          isWarped: false,
        });
      });
    })(arg as Handle);
  });

  const youtubeMenuLabel = "YouTube › Import as MP3…";

  context.ui.registerContextMenuAction(
    "ClipSlot",
    youtubeMenuLabel,
    "youtube.importClipSlot",
  );

  context.ui.registerContextMenuAction(
    "AudioTrack",
    youtubeMenuLabel,
    "youtube.importAudioTrack",
  );

  context.ui.registerContextMenuAction(
    "AudioTrack.ArrangementSelection",
    youtubeMenuLabel,
    "youtube.importArrangement",
  );
}

function formatClipCreationError(error: unknown): string {
  const detail = error instanceof Error ? error.message : String(error);
  return (
    "Could not create an audio clip in this slot.\n\n" +
    "Use an empty clip slot on an audio track in Session view.\n\n" +
    `Details: ${detail}`
  );
}
