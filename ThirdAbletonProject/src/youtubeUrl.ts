const VIDEO_ID_RE = /^[a-zA-Z0-9_-]{11}$/;

const YOUTUBE_HOST_RE =
  /(^|\.)((youtube\.(com|co\.\w{2,3}|[\w.]+))|(youtu\.be))$/i;

const INVISIBLE_RE = /[\u200B-\u200D\uFEFF\u00A0]/g;

export type ParsedYoutubeLink = {
  watchUrl: string;
  videoId: string;
};

function sanitizeInput(raw: string): string {
  return raw
    .replace(INVISIBLE_RE, "")
    .replace(/&amp;/gi, "&")
    .trim()
    .replace(/^<|>$/g, "")
    .replace(/^["']|["']$/g, "");
}

function isYoutubeHost(hostname: string): boolean {
  const host = hostname.toLowerCase();
  if (
    host === "youtube.com" ||
    host === "www.youtube.com" ||
    host === "m.youtube.com" ||
    host === "music.youtube.com" ||
    host === "youtu.be" ||
    host === "www.youtu.be"
  ) {
    return true;
  }
  return YOUTUBE_HOST_RE.test(host);
}

function normalizeVideoId(id: string | null | undefined): string | null {
  if (!id) {
    return null;
  }
  const cleaned = id.replace(INVISIBLE_RE, "").trim();
  return VIDEO_ID_RE.test(cleaned) ? cleaned : null;
}

/** Prefer `?v=` / `&v=` in the raw string (works even when URL parsing is odd). */
function videoIdFromText(text: string): string | null {
  const vParam = text.match(/[?&]v=([a-zA-Z0-9_-]{11})(?:[&/?#]|$)/i);
  if (vParam?.[1]) {
    return normalizeVideoId(vParam[1]);
  }

  const youtuBe = text.match(/youtu\.be\/([a-zA-Z0-9_-]{11})(?:[/?#&]|$)/i);
  if (youtuBe?.[1]) {
    return normalizeVideoId(youtuBe[1]);
  }

  const pathForm = text.match(
    /youtube\.com\/(?:shorts|live|embed|v)\/([a-zA-Z0-9_-]{11})(?:[/?#&]|$)/i,
  );
  return normalizeVideoId(pathForm?.[1]);
}

function videoIdFromParsedUrl(parsed: URL): string | null {
  const host = parsed.hostname.toLowerCase();

  if (host === "youtu.be" || host === "www.youtu.be") {
    const segment = parsed.pathname.replace(/^\//, "").split("/")[0];
    return normalizeVideoId(segment?.split("?")[0]);
  }

  const fromQuery = normalizeVideoId(parsed.searchParams.get("v"));
  if (fromQuery) {
    return fromQuery;
  }

  const pathMatch = parsed.pathname.match(
    /\/(?:shorts|live|embed|v)\/([a-zA-Z0-9_-]{11})/i,
  );
  return normalizeVideoId(pathMatch?.[1]);
}

function toWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

/**
 * Parse any common YouTube link shape into a canonical watch URL + video id.
 */
export function parseYoutubeLink(raw: string): ParsedYoutubeLink | null {
  const cleaned = sanitizeInput(raw);
  if (!cleaned) {
    return null;
  }

  let videoId: string | null = null;

  try {
    const href = cleaned.startsWith("http") ? cleaned : `https://${cleaned}`;
    const parsed = new URL(href);
    if (isYoutubeHost(parsed.hostname)) {
      videoId = videoIdFromParsedUrl(parsed);
    }
  } catch {
    // fall through
  }

  if (!videoId && /youtube|youtu\.be/i.test(cleaned)) {
    videoId = videoIdFromText(cleaned);
  }

  if (!videoId) {
    return null;
  }

  return { watchUrl: toWatchUrl(videoId), videoId };
}
