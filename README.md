# YouTube to Ableton

Paste a YouTube link, get an MP3 in your set. Needs **Live 12.4.5 beta 3+** (Extensions), **yt-dlp**, and **ffmpeg**. Works on **Windows** and **macOS**.

---

## Install (just using it)

Build the `.ablx` with `npm run package` (or download from Releases), then follow **[INSTALL.md](INSTALL.md)**.

---

## Dev setup

Clone this repo and [AbletonExtensions](https://github.com/Kory111111111111111111/AbletonExtensions) (contains `extensions-sdk-1.0.0-beta.0`). A typical layout:

```
Desktop/
  AbletonExtensions/extensions-sdk-1.0.0-beta.0/   ← SDK .tgz files
  APPS/yt-dlp-for-ableton/ThirdAbletonProject/     ← this extension
```

From `ThirdAbletonProject/`:

```
npm install
npm run build
```

`npm install` runs `sync-sdk`, which copies the SDK packages into `vendor/` from `AbletonExtensions` (or set `ABLETON_SDK_DIR`). See [vendor/README.md](ThirdAbletonProject/vendor/README.md).

`.env` in the project root (no quotes on the path). Use the line for your OS:

**Windows**

```
EXTENSION_HOST_PATH=C:\ProgramData\Ableton\Live 12 Beta\Program\Ableton Live 12 Beta.exe
```

**macOS**

```
EXTENSION_HOST_PATH=/Applications/Ableton Live 12 Beta.app/Contents/MacOS/Ableton Live 12 Beta
```

Adjust the app name if your Live install differs (check `/Applications`).

Live → Extensions → **Developer mode on**.

```
npm run start
```

You want something like:

```
Extension Host sends greeting to Live
FlipMessageStreamSocket send success
```

(`cannot send now` right before `send success` is normal on first connect.)

Edit code → stop the terminal → `npm run start` again.

`npm run verify` — build + URL tests + quick yt-dlp check (uses your shell PATH; Live may differ — see INSTALL.md).

`npm run ci` — build + unit tests (same as GitHub Actions, no yt-dlp required).

---

## CI / releases

GitHub Actions on every push and PR:

- Build, typecheck, and unit tests (SDK pulled from [AbletonExtensions](https://github.com/Kory111111111111111111/AbletonExtensions))
- `npm audit` and Dependency Review on PRs
- CodeQL analysis

Tag a release as `v*` (e.g. `v0.1.1`) to attach **`YouTubeToProject.ablx`** to the GitHub Release automatically.

Security: see [SECURITY.md](SECURITY.md).

---

## When it won't connect

- Wrong path in `.env`
- yt-dlp / ffmpeg not on PATH  
  - Windows: `where yt-dlp` in PowerShell  
  - macOS: `which yt-dlp` in Terminal  
  - If they work in the shell but not in Live, use `tools.json` — **[INSTALL.md](INSTALL.md)**
- Extension host started before Live — close both, open Live first, then `npm run start`

If you did everything right and it still won't talk to Live: I've had to **reinstall Live 12.4.5 b3 from Centercode** on two machines before extensions worked at all. No idea why and I am too lazy to figure it out.

When you pick **YouTube › Import as MP3…**, expect a short pause before the URL box — Live loads the dialog webview each time. Normal, not a bug on your end.
