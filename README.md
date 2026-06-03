# YouTube to Ableton

Paste a YouTube link, get an MP3 in your set. Needs **Live 12.4.5 beta 3+** (Extensions), **yt-dlp**, and **ffmpeg**.

---

## Install (just using it)

Build the `.ablx` with `npm run package` (or download from Releases), then follow **[INSTALL.md](INSTALL.md)**.

---

## Dev setup

Clone/copy `ThirdAbletonProject`, then:

```
npm install
npm run build
```

`.env` in the project root (no quotes on the path):

```
EXTENSION_HOST_PATH=C:\ProgramData\Ableton\Live 12 Beta\Program\Ableton Live 12 Beta.exe
```

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

`npm run verify` — build + URL tests + quick yt-dlp check.

---

## When it won't connect

- Wrong path in `.env`
- yt-dlp / ffmpeg not on PATH (`where yt-dlp` in PowerShell)
- Extension host started before Live — close both, open Live first, then `npm run start`

If you did everything right and it still won't talk to Live: I've had to **reinstall Live 12.4.5 b3 from Centercode** on two machines before extensions worked at all. No idea why and I am too lazy to figure it out.

When you pick **YouTube › Import as MP3…**, expect a short pause before the URL box — Live loads the dialog webview each time. Normal, not a bug on your end.
