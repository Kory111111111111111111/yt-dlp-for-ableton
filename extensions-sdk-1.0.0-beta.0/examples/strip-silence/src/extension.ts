/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { ArrangementSelection } from "@ableton-extensions/sdk";
import {
  initialize,
  type ActivationContext,
  DataModelObject,
  AudioTrack,
} from "@ableton-extensions/sdk";

import * as fs from "fs/promises";
import decodeAudio from "audio-decode";

interface SilenceOptions {
  sampleRate: number;
  windowSize: number; // in samples
  rmsThreshold: number; // below this = silence
  minSilenceDuration: number; // in seconds
}

interface SilenceRange {
  start: number; // seconds
  end: number; // seconds
}

// WARNING! ALL THIS CODE IS WRITTEN BY COPILOT! I DID NOT CARE ABOUT THE DETAILS AT ALL.
function computeSilenceRanges(
  channels: Float32Array[],
  opts: SilenceOptions,
): SilenceRange[] {
  const { sampleRate, windowSize, rmsThreshold, minSilenceDuration } = opts;
  if (!channels.length) return [];
  const length = channels[0]!.length;
  const windowDur = windowSize / sampleRate;
  const minWindows = Math.ceil(minSilenceDuration / windowDur);

  const rmsVals: number[] = [];
  for (let i = 0; i < length; i += windowSize) {
    const end = Math.min(i + windowSize, length);
    let sumSq = 0;
    let count = 0;
    for (let j = i; j < end; j++) {
      for (let c = 0; c < channels.length; c++) {
        const v = channels[c]![j]!;
        sumSq += v * v;
      }
      count += channels.length;
    }
    rmsVals.push(Math.sqrt(sumSq / count));
  }

  const silentFlags = rmsVals.map((v) => v < rmsThreshold);

  const ranges: SilenceRange[] = [];
  let runStart = -1;
  for (let i = 0; i < silentFlags.length; i++) {
    if (silentFlags[i]) {
      if (runStart === -1) runStart = i;
    } else if (runStart !== -1) {
      const runLen = i - runStart;
      if (runLen >= minWindows) {
        ranges.push({ start: runStart * windowDur, end: i * windowDur });
      }
      runStart = -1;
    }
  }
  if (runStart !== -1) {
    const runLen = silentFlags.length - runStart;
    if (runLen >= minWindows) {
      ranges.push({
        start: runStart * windowDur,
        end: silentFlags.length * windowDur,
      });
    }
  }

  const merged: SilenceRange[] = [];
  for (const r of ranges) {
    if (!merged.length) merged.push(r);
    else {
      const last = merged[merged.length - 1]!;
      if (Math.abs(r.start - last.end) < 1e-4) last.end = r.end;
      else merged.push(r);
    }
  }
  return merged;
}

export function activate(activation: ActivationContext) {
  const context = initialize(activation, "1.0.0");

  context.commands.registerCommand("example.stripSilence", (arg: unknown) =>
    void (async (selection: ArrangementSelection) => {
      const tracks = selection.selected_lanes
        .map((handle) => context.getObjectFromHandle(handle, DataModelObject))
        .filter((obj) => obj instanceof AudioTrack);

      if (!tracks.length) {
        console.log("No audio tracks selected.");
        return;
      }

      await context.ui.withinProgressDialog("Strip Silence", {}, async (update, abortSignal) => {
        try {
          // Phase 1: render and analyze all tracks
          const results: { track: AudioTrack<"1.0.0">; silence: SilenceRange[] }[] = [];

          for (let i = 0; i < tracks.length; i++) {
            if (abortSignal.aborted) return;

            const track = tracks[i]!;
            update(`Analyzing track ${i + 1}/${tracks.length}: ${track.name}`, (i / tracks.length) * 50);

            const wavPath = await context.resources.renderPreFxAudio(
              track,
              selection.time_selection_start,
              selection.time_selection_end,
            );

            if (abortSignal.aborted) return;

            const decoded = await decodeAudio(await fs.readFile(wavPath));

            const channelData = Array.from(
              { length: decoded.numberOfChannels },
              (_, j) => decoded.getChannelData(j),
            );

            const silence = computeSilenceRanges(channelData, {
              sampleRate: decoded.sampleRate,
              windowSize: 2048,
              rmsThreshold: 0.01,
              minSilenceDuration: 0.25,
            });

            console.log(`[${track.name}] ${decoded.duration.toFixed(3)}s, ${silence.length} silent region(s)`);

            if (silence.length) {
              results.push({ track, silence });
            }
          }

          if (abortSignal.aborted) return;

          // Phase 2: strip all silence in one transaction
          if (results.length) {
            update("Stripping silence", 80);
            const tempo = context.application.song!.tempo;
            const beatsPerSecond = 60.0 / tempo;

            const promises = context.withinTransaction(() => {
              return results.flatMap(({ track, silence }) =>
                silence.map((r) => {
                  const start = selection.time_selection_start + r.start / beatsPerSecond;
                  const end = selection.time_selection_start + r.end / beatsPerSecond;
                  return track.clearClipsInRange(start, end);
                }),
              );
            });
            await Promise.all(promises);
          }
        } catch (e) {
          if (abortSignal.aborted) return;
          throw e;
        }
      })
    })(arg as ArrangementSelection).catch((e) => console.error(e)),
  );

  context.ui.registerContextMenuAction(
    "AudioTrack.ArrangementSelection",
    "Strip Silence",
    "example.stripSilence",
  );
}
