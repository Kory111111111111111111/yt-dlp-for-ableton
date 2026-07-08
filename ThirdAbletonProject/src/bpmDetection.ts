import { readFile } from "node:fs/promises";
import decode from "audio-decode";
import MusicTempo from "music-tempo";

const MIN_BPM = 40;
const MAX_BPM = 250;

/**
 * Analyse only the first N seconds — the intro almost always establishes
 * the clearest beat pattern.  Full-file analysis drifts on longer tracks.
 */
const ANALYSIS_WINDOW_SECONDS = 30;

/**
 * BPM values above this threshold are likely the detector counting
 * subdivisions (hi-hats, percussion) as beats. They get halved.
 */
const OCTAVE_THRESHOLD_BPM = 160;

/**
 * Detects the tempo (BPM) of an audio file.
 *
 * Decodes the WAV/MP3 file, keeps only the first 30 seconds, and runs
 * `music-tempo` on that slice.  No ffmpeg / child-process spawns so
 * it works inside the Ableton Extension Host's filesystem sandbox.
 *
 * Returns the rounded BPM value, or null if detection fails or the
 * result falls outside a reasonable range (40–250 BPM).
 *
 * @param filePath  Path to the WAV or MP3 file to analyse.  Must be
 *                  inside the extension's sandboxed temp directory.
 */
export async function detectBpm(filePath: string): Promise<number | null> {
  try {
    const fileBuffer = await readFile(filePath);
    const audioData = await decode(fileBuffer);

    const fullChannel = audioData.channelData[0];
    if (!fullChannel) return null;

    // Only analyse the first N seconds — later sections (bridges,
    // outros, busy verses) confuse music-tempo and shift the result.
    const analysisSamples = audioData.sampleRate * ANALYSIS_WINDOW_SECONDS;
    const channelData =
      fullChannel.length > analysisSamples
        ? fullChannel.slice(0, analysisSamples)
        : fullChannel;

    const mt = new MusicTempo(channelData, {
      sampleRate: audioData.sampleRate,
    });
    const tempo = Number(mt.tempo);

    if (Number.isFinite(tempo) && tempo > MIN_BPM && tempo < MAX_BPM) {
      const bpm = Math.round(tempo);

      // Octave correction: high BPMs are often the detector counting
      // subdivisions (hi-hats, percussion) as beats. If halving it
      // lands in a musically typical range, prefer the half value.
      if (
        bpm > OCTAVE_THRESHOLD_BPM &&
        bpm / 2 >= MIN_BPM &&
        bpm / 2 <= OCTAVE_THRESHOLD_BPM
      ) {
        return Math.round(bpm / 2);
      }

      return bpm;
    }

    return null;
  } catch {
    return null;
  }
}
