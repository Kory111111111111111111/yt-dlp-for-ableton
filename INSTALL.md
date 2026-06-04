## Install guide

More detail for using the packaged extension. For development see README.md.

---

### Prerequesites
- Ableton Live 12.4.5 Beta 3 (this is the minimum version that has Extension support)
- Windows (this also works for Mac, I just dont know how to set it up as I dont have one)
- yt-dlp and ffmpeg (the extension does not bundle these)
```
winget install yt-dlp.yt-dlp
winget install Gyan.FFmpeg
```
- Common sense

On Mac people usually run this if they have Homebrew:
```
brew install yt-dlp ffmpeg
```

When you install yt-dlp and ffmpeg, make sure your terminal is closed after so PATH updates. Restart Ableton.

If import says yt-dlp was not found, run `where.exe yt-dlp` in PowerShell on Windows or `which yt-dlp` on Mac and see the tools.json section below.

---

### Using The Extension
- Download the ablx from the releases tab (file is called YouTubeToProject.ablx)
- open Ableton, go to Settings, go to extensions and drag the ablx or just hit the select file button thing and select the ablx
- restart Ableton
- Right click on audio track, import audio from YouTube as WAV (default) or MP3 :)))

Go into your Ableton extension settings and verify that Development mode is turned off. This should only be turned on while developing the extension (see README).

Where you right click:
- audio track header on the right side - clip at bar 1
- inside an audio track in arrangement view with a time selection - clip at your selection
- empty clip slot on an audio track in session view - clip in that slot

The audio ends up inside your Live set like a normal import. Save the project if you want to keep it.

---

### Where files go
- while downloading it uses Lives extension temp folder (not your Downloads folder)
- after import it is in your set
- temp download files get deleted after import so they dont pile up

---

### yt-dlp or ffmpeg not found in Live
- Verify you have correctly installed yt-dlp and ffmpeg (i included both for winget as I find just using yt-dlp doesnt like to work). Sometimes they work in your terminal but not inside Live because Live does not always see the same PATH as your shell.

If that is your problem, put full paths in a tools.json file.

Find your paths.

Windows - PowerShell:
```
where.exe yt-dlp
where.exe ffmpeg
```

Mac - Terminal:
```
which yt-dlp
which ffmpeg
```

Find the storage folder. Try an import once (even if it fails), then look for a folder named YouTubeToAbleton under your Ableton preferences:
- Windows: `%APPDATA%\Ableton\Live <version>\Preferences\Extensions\YouTubeToAbleton\storage\`
- Mac: `~/Library/Preferences/Ableton/Live <version>/Preferences/Extensions/YouTubeToAbleton/storage/`

Replace `<version>` with whatever your Live install is called, like `Live 12 Beta`.

In that storage folder create a file called `tools.json`.

Windows example (use the paths from where.exe, not this copy paste):
```json
{
  "ytDlpPath": "C:\\Users\\YourName\\AppData\\Local\\Microsoft\\WinGet\\Packages\\yt-dlp.yt-dlp_Microsoft.Winget.Source_8wekyb3d8bbwe\\yt-dlp.exe",
  "ffmpegPath": "C:\\Users\\YourName\\AppData\\Local\\Microsoft\\WinGet\\Packages\\Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe\\ffmpeg-7.1-full_build\\bin\\ffmpeg.exe"
}
```

Mac example Apple Silicon:
```json
{
  "ytDlpPath": "/opt/homebrew/bin/yt-dlp",
  "ffmpegPath": "/opt/homebrew/bin/ffmpeg"
}
```

Mac example Intel:
```json
{
  "ytDlpPath": "/usr/local/bin/yt-dlp",
  "ffmpegPath": "/usr/local/bin/ffmpeg"
}
```

Only add the keys for tools Live cant find. Restart Live after you save tools.json.

YT_DLP_PATH and FFMPEG_PATH environment variables also work but tools.json is easier.

---

## Troubleshooting for Extension usage
- Verify that you have correctly installed yt-dlp and ffmpeg from winget using your terminal.
- Go into your Ableton extension settings, verify that Development mode is turned off, this should only be turned on while developing the extension.
- Restart Ableton after installing yt-dlp and ffmpeg
### If you have done all of the above and its still not working follow these steps
- Restart your PC
- Open Ableton
- Try import again
- If yt-dlp works in terminal but not in Live, set up tools.json (section above)

For development / npm run start issues see README.md.

---

### Uninstall
- Remove the extension from Settings, extensions in Live

---

### Legal
- Only import audio you have the right to use. YouTube's terms of service apply.
