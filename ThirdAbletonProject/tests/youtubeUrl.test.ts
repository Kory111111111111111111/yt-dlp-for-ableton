import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { parseYoutubeLink } from "../src/youtubeUrl.ts";

const VALID_ID = "q1ULJ92aldE";

const SHOULD_PASS = [
  `https://www.youtube.com/watch?v=${VALID_ID}`,
  `https://m.youtube.com/watch?v=${VALID_ID}&list=RD${VALID_ID}&start_radio=1&pp=ygUDbmNzoAcB`,
  `youtube.com/watch?v=${VALID_ID}&list=RD${VALID_ID}&start_radio=1`,
  `https://youtu.be/${VALID_ID}`,
  `https://www.youtube.com/shorts/${VALID_ID}`,
  `\u200Bhttps://www.youtube.com/watch?v=${VALID_ID}`,
];

const SHOULD_FAIL = [
  "",
  "https://example.com/watch?v=abcdefghijk",
  "https://www.youtube.com/playlist?list=PL123",
];

describe("parseYoutubeLink", () => {
  for (const raw of SHOULD_PASS) {
    it(`accepts ${raw.slice(0, 60)}`, () => {
      const parsed = parseYoutubeLink(raw);
      assert.ok(parsed);
      assert.equal(parsed.videoId, VALID_ID);
      assert.equal(
        parsed.watchUrl,
        `https://www.youtube.com/watch?v=${VALID_ID}`,
      );
    });
  }

  for (const raw of SHOULD_FAIL) {
    it(`rejects ${raw || "(empty)"}`, () => {
      assert.equal(parseYoutubeLink(raw), null);
    });
  }
});
