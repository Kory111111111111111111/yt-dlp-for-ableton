# Project knowledge

## What this is
An Ableton Live 12 extension that imports YouTube audio (WAV or MP3) directly into a session. Users right-click an audio track/clip slot, paste a YouTube link, and the extension downloads + converts it via yt-dlp/ffmpeg and inserts it as an audio clip.

**Author:** koryi | **Version:** 0.1.6 | **License:** see LICENSE.md

## Project layout
- **`ThirdAbletonProject/`** — the actual extension source code (this is where all dev work happens)
- **`extensions-sdk-1.0.0-beta.0/`** — the Ableton Extensions SDK (tgz packages + docs + examples)
- **Root** — README, INSTALL, knowledge.md, plus checked-in SDK artifacts

## Key source files (all under `ThirdAbletonProject/src/`)
| File | Role |
|---|---|
| `extension.ts` | Main entry: registers 3 context-menu commands, orchestrates download → import pipeline, HTML dialog handling |
| `youtubeDownload.ts` | Spawns yt-dlp to download + convert audio; parses progress from stdout |
| `youtubeUrl.ts` | Parses YouTube URLs (watch, youtu.be, shorts, m.youtube, music.youtube, playlists with `?v=`) into canonical watch URL + video ID |
| `youtubeTooling.ts` | Resolves yt-dlp & ffmpeg paths (tools.json overrides, PATH probing, macOS login-shell PATH, /etc/paths), validates tooling, provides spawn options |
| `toolsConfig.ts` | Reads `tools.json` from the extension's storage directory for yt-dlp/ffmpeg path overrides |
| `tempCleanup.ts` | Deletes temporary files by video ID prefix after import |
| `youtube-dialog.html` | Modal dialog template for the YouTube URL input form |
| `error-dialog.html` | Modal dialog template for error display |
| `html.d.ts` | TypeScript declaration for `.html` imports as text strings |
| `bpmDetection.ts` | Detects BPM from downloaded audio via `music-tempo` + `audio-decode`; includes octave correction |

## Commands (run from `ThirdAbletonProject/`)
```bash
npm install              # also runs preinstall → sync-sdk
npm run build            # tsc --noEmit + esbuild bundle to dist/extension.js
npm run start            # build + launch in Ableton dev mode (--temp-directory .temp)
npm run test             # tsx --test tests/**/*.test.ts
npm run verify           # build + test + verify yt-dlp & ffmpeg on PATH
npm run ci               # build + test (for CI)
npm run package          # production build + create .ablx package
```

## Tech stack
- **Runtime:** Node.js ≥ 24.16.0 (CJS bundle via esbuild)
- **Language:** TypeScript 5.9, strict mode, `module: nodenext`
- **SDK:** `@ableton-extensions/sdk` v1.0.0-beta.0 (Ableton Extensions API). SDK is distributed via Centercode as `extensions-sdk-<version>.zip`.
- **Build:** esbuild 0.28 (bundles `src/extension.ts` → `dist/extension.js`, `.html` files loaded as text via `loader: { ".html": "text" }`)
- **Test runner:** `tsx --test` (Node.js native test runner via tsx)
- **External dependencies:** yt-dlp (download), ffmpeg (audio conversion) — must be installed on the system

## Dev setup
1. Install yt-dlp + ffmpeg: `winget install yt-dlp.yt-dlp` and `winget install Gyan.FFmpeg` (Windows)
2. Create `.env` in `ThirdAbletonProject/` with `EXTENSION_HOST_PATH=C:\ProgramData\Ableton\Live 12 Beta\Program\Ableton Live 12 Beta.exe`
3. In Ableton: Settings → Extensions → toggle Development Mode ON
4. `npm install && npm run start`

## Conventions
- **Format:** Prettier/ESLint not configured — follow existing style (single quotes, 2-space indent, semicolons)
- **Imports:** Use `.js` extensions in TypeScript imports (e.g., `./youtubeUrl.js`) — this is required for `module: nodenext`
- **HTML templates:** Stored as `.html` files, imported as text via esbuild loader, interpolated with `str.replace()`
- **Error handling:** `YoutubeToolingError` for tooling failures; generic `Error` with `AbortError` name for cancellations
- **Abort signals:** All long-running operations pass through `AbortSignal`; check `signal.aborted` before proceeding
- **Spawn:** Always use `shell: false` + `windowsHide: true` (shell mode on Windows would mangle `%` in yt-dlp output templates)
- **Path resolution:** tools.json overrides > env vars (`YT_DLP_PATH`, `FFMPEG_PATH`) > PATH probing (platform-specific) > fallback
- **Naming:** camelCase for functions/variables, PascalCase for classes/types, lowercase-dash-case for files
- **Tests:** Co-located in `tests/` matching source file names (e.g., `youtubeUrl.test.ts`); use `assert` from `node:assert/strict`

## SDK API patterns (from official docs)
- **Activation:** Every extension exports an `activate(activation)` function. Call `initialize(activation, "1.0.0")` to get the typed `ExtensionContext`.
- **ExtensionContext namespaces:** `application` (Live Set model), `commands` (register callbacks), `ui` (context menus, modal dialogs, progress dialogs), `environment` (storageDirectory, tempDirectory, language), `resources` (importIntoProject, renderPreFxAudio), `getObjectFromHandle`, `withinTransaction`.
- **Available context menu scopes:** `AudioClip`, `MidiClip`, `AudioTrack`, `MidiTrack`, `ClipSlot`, `Scene`, `Simpler`, `Sample`, `DrumRack` (object scopes — receive a Handle). Plus selection scopes: `AudioTrack.ArrangementSelection`, `MidiTrack.ArrangementSelection` (receive `ArrangementSelection`), `ClipSlotSelection` (receive `ClipSlotSelection`).
- **Transactions (`withinTransaction`):** Groups mutations into one undo step. Must be synchronous — no `await` inside. For async mutations (e.g., `createAudioTrack`), return `Promise.all()` and `await` the transaction.
- **Progress dialogs (`withinProgressDialog`):** Takes `update(message, percent)` and `AbortSignal`. Blocking — user cannot interact with Live while open.
- **Webview communication:** On macOS: `window.webkit.messageHandlers.live.postMessage()`. On Windows: `window.chrome.webview.postMessage()`. Message format: `{ method: "close_and_send", params: [JSON.stringify(result)] }`.
- **Filesystem sandbox:** Extensions can only read/write `storageDirectory` and `tempDirectory`. Do not access arbitrary filesystem paths — future OS-level sandboxing will enforce this. Use `context.resources.importIntoProject()` to copy external files into the project.

## Dev tooling
- **Logging:** `console.log/error/info/warn` output goes to the Extension Host log file:
  - Windows: `%APPDATA%\Ableton\Live x.x.x\Preferences\ExtensionHost.txt`
  - macOS: `~/Library/Preferences/Ableton/Live x.x.x/ExtensionHost.txt`
- **CLI flags:** `extensions-cli run --live <path> --storage-directory <path> --temp-directory <path> --inspect`
- **VS Code debugging:** Pass `--inspect` to `extensions-cli run` (uses `--inspect-brk`).

## Gotchas
- **Ableton doesn't inherit Terminal PATH** (especially macOS). Use `tools.json` in the extension storage directory with absolute paths.
- **Shell mode disabled:** `spawnOptions()` always returns `shell: false` — cmd.exe would mangle `%` in yt-dlp output templates.
- **yt-dlp output:** Progress is parsed from yt-dlp's stderr/stdout lines matching `[download] XX.X%`.
- **macOS fallback:** On macOS, the extension shells out to `$SHELL -ilc` to get the login-shell PATH (cached, 5s timeout).
- **The `.ablx` package** is distributed via GitHub Releases, not built locally.
- **`extensions-sdk-1.0.0-beta.0/`** is checked into the repo — do not delete it. The sync-sdk script copies TGZ packages to `vendor/`.
- **Ableton version requirement:** 12.4.5 Beta 3 minimum. Minimum API version: 1.0.0.
- **Always build before packaging:** `extensions-cli package` does not run the build step. A properly bundled extension is a single JS file + manifest.json + optional assets.
- **yt-dlp child processes must also respect filesystem boundaries** — ensure they write to the temp directory only.
