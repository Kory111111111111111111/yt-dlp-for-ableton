declare module "*.html" {
  const content: string;
  export default content;
}

declare module "music-tempo" {
  interface MusicTempoOptions {
    sampleRate?: number;
    sensitivity?: number;
  }

  class MusicTempo {
    constructor(buffer: Float32Array | number[], options?: MusicTempoOptions);
    tempo: number;
    beats: number[];
  }

  export default MusicTempo;
}
