## Learned User Preferences

- Do all extension development from `ThirdAbletonProject/` (`npm install`, `build`, `start`, `verify`); put `.env` with `EXTENSION_HOST_PATH` there, not the repo root.
- On Windows, install tooling with `winget install yt-dlp.yt-dlp` and `winget install Gyan.FFmpeg`; restart the IDE/terminal after install so PATH updates apply.
- Use Ableton Extensions Development Mode ON for `npm run start` / local host work; keep it OFF when using a packaged `.ablx`.

## Learned Workspace Facts

- This repo is an Ableton Live extension (`YouTubeToAbleton`, author koryi, manifest v0.1.5) that downloads YouTube audio via yt-dlp/ffmpeg and imports WAV or MP3 clips into the Live set (`isWarped: false`).
- App source lives in `ThirdAbletonProject/`; `extensions-sdk-1.0.0-beta.0/` is the checked-in Ableton Extensions SDK (docs, examples, TGZs) and must stay in the workspace — `preinstall`/`sync-sdk` copies TGZs into `ThirdAbletonProject/vendor/`.
- Three context-menu entry points (label “YouTube › Import audio…”): Audio Track, Arrangement Selection, and Session Clip Slot (`youtube.importAudioTrack`, `youtube.importArrangement`, `youtube.importClipSlot`).
- Stack: Node.js ≥ 24, TypeScript strict (`nodenext`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`; imports use `.js` extensions), esbuild bundles `src/extension.ts` → CJS `dist/extension.js` with `.html` loaded as text.
- Key modules: `extension.ts` (`activate`, commands/UI/pipeline), `youtubeDownload.ts`, `youtubeUrl.ts` (watch/youtu.be/shorts/live/embed/music/m), `youtubeTooling.ts`, `toolsConfig.ts`, `tempCleanup.ts`, plus HTML dialog templates; tests in `tests/` via `tsx --test`.
- Tool path resolution order: `tools.json` (`ytDlpPath`/`ffmpegPath` in storage directory) → `YT_DLP_PATH`/`FFMPEG_PATH` → PATH probing (including macOS login-shell PATH); always spawn with `shell: false` and `windowsHide: true`.
- Extensions are filesystem-sandboxed to `storageDirectory` and `tempDirectory`; use `resources.importIntoProject()` for external files, keep yt-dlp output inside temp, and clean by video-ID prefix (plus stale cleanup on activate).
- Minimum host: Ableton Live 12.4.5 Beta 3 with Extensions API `minimumApiVersion` 1.0.0; package with `npm run package` to `dist/YouTubeToProject.ablx` (build first — `extensions-cli package` does not build).
- Root `knowledge.md` is the durable project handbook (layout, conventions, SDK patterns, gotchas); prefer it over rediscovering SDK behavior from scratch.
- Gitignore excludes `node_modules/`, `dist/`, `*.ablx`, `.temp/`, `.storage/`, and `.env`.
