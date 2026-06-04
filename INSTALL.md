# Install Guide

For **end users** — no Terminal, no Developer Mode, no `npm start`.

## What you need

1. **Ableton Live 12** with Extensions support (beta) — **Windows or macOS**
2. **yt-dlp** and **ffmpeg** installed and on your system PATH  
   (the extension does not bundle them)

### Windows

```powershell
winget install yt-dlp.yt-dlp
winget install Gyan.FFmpeg
```

Restart Ableton after installing.

If import says yt-dlp was not found, open PowerShell, run `where.exe yt-dlp`, and see **Optional: custom tool paths** below.

### macOS

Install [Homebrew](https://brew.sh/) if you do not have it, then in Terminal:

```bash
brew install yt-dlp ffmpeg
```

Restart Ableton after installing.

If import says yt-dlp was not found, open Terminal, run `which yt-dlp`, and see **Optional: custom tool paths** below.

On Apple Silicon, Homebrew usually installs to `/opt/homebrew/bin`. On Intel Macs, `/usr/local/bin` is common.

## Install the extension

1. Download **`YouTubeToProject.ablx`** from the [Releases page](https://github.com/Kory111111111111111111/yt-dlp-for-ableton/releases/latest).
2. Open **Ableton Live**.
3. Go to **Settings / Preferences → Extensions**.
4. Make sure **Developer Mode is OFF** (normal use).
5. Drag **`YouTubeToProject.ablx`** onto the Extensions page, or use the install control shown there.
6. Enable the extension if Live asks you to.

Restart Live once if the menu does not appear.

## How to use

Right-click in Live and choose **YouTube › Import as MP3…**:

| Where to click | Result |
|----------------|--------|
| Audio track header (right side) | Clip at bar 1 |
| Inside an audio track in Arrangement (with time selection) | Clip at selection |
| Empty clip slot on an **audio** track (Session) | Clip in that slot |

Paste a YouTube link and confirm. Audio is copied into your **Live project** (same as importing a file).

## Where files go

| Stage | Location |
|-------|----------|
| During download | Live's extension **temp** folder (automatic; not your Downloads folder) |
| After import | Inside your **Live set** via Collect/Import (save the set to keep it) |

The extension **deletes temp download files** after a successful import so they do not pile up.

## Optional: custom tool paths

If yt-dlp and ffmpeg work in Terminal or PowerShell but **not in Live**, Live is likely running with a narrower PATH than your shell. GUI apps on Windows and macOS often miss user PATH entries (e.g. WinGet folders or Homebrew’s `/opt/homebrew/bin`).

Fix this by giving the extension explicit absolute paths to both executables.

### Step 1 — find your paths

**Windows** — PowerShell:

```powershell
where.exe yt-dlp
where.exe ffmpeg
```

**macOS** — Terminal:

```bash
which yt-dlp
which ffmpeg
```

Copy the full path printed for each.

### Step 2 — find the extension storage folder

The extension creates its storage folder the first time it runs:

| OS | Typical location |
|----|------------------|
| Windows | `%APPDATA%\Ableton\Live <version>\Preferences\Extensions\YouTubeToAbleton\storage\` |
| macOS | `~/Library/Preferences/Ableton/Live <version>/Preferences/Extensions/YouTubeToAbleton/storage/` |

The fastest way: attempt an import once (it may fail with a message), then look for a folder named `YouTubeToAbleton` under your Ableton Live preferences (see paths above). Replace `<version>` with your Live install name, e.g. `Live 12 Beta`.

### Step 3 — create tools.json

In that **storage** folder, create a file called **`tools.json`**.

**Windows example:**

```json
{
  "ytDlpPath": "C:\\Users\\YourName\\AppData\\Local\\Microsoft\\WinGet\\Packages\\yt-dlp.yt-dlp_Microsoft.Winget.Source_8wekyb3d8bbwe\\yt-dlp.exe",
  "ffmpegPath": "C:\\Users\\YourName\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-7.1-full_build\\bin\\ffmpeg.exe"
}
```

**macOS example (Apple Silicon / Homebrew):**

```json
{
  "ytDlpPath": "/opt/homebrew/bin/yt-dlp",
  "ffmpegPath": "/opt/homebrew/bin/ffmpeg"
}
```

**macOS example (Intel Mac, Homebrew on `/usr/local`):**

```json
{
  "ytDlpPath": "/usr/local/bin/yt-dlp",
  "ffmpegPath": "/usr/local/bin/ffmpeg"
}
```

Use the exact paths from Step 1. You can omit either key if that tool is already visible to Live — only add the ones that are missing.

Restart Live after saving `tools.json`.

> **Tip:** The `YT_DLP_PATH` and `FFMPEG_PATH` environment variables are also honoured as fallbacks when set for the Live process (uncommon; `tools.json` is simpler).

## Uninstall

Remove the extension from **Preferences → Extensions** in Live.

## Legal

Only import audio you have the right to use. YouTube's terms of service apply.
