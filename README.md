## This repo holds the open source yt-dl wrapper extension for Ableton Live (12.4.5 Beta 3)
## The extension will automatically clean **most** youtube links, I have not found one to fail due to the link but if you find a pattern of it submit an issue
## Generally speaking, I am more than happy to offer support if you are having issues, the only thing I require is just minimal ammounts of effort on your end to make my job easier. Please remember, this is not a product that you or anyone else has paid for and any work done with this is simply out of the kindness of whoevers heart is working with the extension. 
## If you enjoy this extension, you may enjoy some of my VST3 projects that I offer for free on my website wavfinaudio.com
---
## There are no new big features being guaranteed for this, the only other features I am now exploring are
- Automatically setting the BPM to sync w/ the imported track
- Import specific time frames of videos vs just importing the entire video
- Potentially building a bridge that allows you to just search for songs inside of Ableton on Youtube or Youtube Music and keep the entire flow in the extension. (this is more of a concept I am looking into, whether or not this gets implemented is honestly dependent on how well my zoloft continues to work)

### Prerequesites
- YOU NEED TO HAVE TEH extensions-sdk-1.0.0-beta.0 in the workspace, I have included it in the repo. 
- Ableton Live 12.4.5 Beta 3 (this is the minimum version that has Extension support)
- Windows (this also works for Mac, I just dont know how to set it up as I dont have one)
- yt-dlp and ffmpeg 
```
winget install yt-dlp.yt-dlp
winget install Gyan.FFmpeg
```
- Common sense
---

### Development
- Clone Repo
- Open terminal in ThirdAbletonProject folder
```
npm install
npm run build
npm run verify
```
- Go into Ableton, go to settings and ensure that Development Mode is toggled on in the extension settings (last option)
- Create a .env and paste your Ableton Live 12 Beta EXE, it should look similar to this
```
EXTENSION_HOST_PATH=C:\ProgramData\Ableton\Live 12 Beta\Program\Ableton Live 12 Beta.exe
```
- Go back to terminal, run npm run start and you should see something like
```
Extension Host sends greeting to Live
FlipMessageStreamSocket send success
```
- Go into Ableton, right click on Audio track and you should see the Extensions in the context menu. Open this extension, paste a link, choose WAV or MP3, and it will automatically import it for you.
---
### Using The Extension
- Download the ablx from the releases tab
- open Ableton, go to Settings, go to extensions and drag the ablx or just hit the select file button thing and select the ablx
- restart Ableton
- Right click on an audio track, import audio from YouTube as WAV or MP3 :)))


## Troubleshooting For Development

### Extension is not connecting to Ableton. 
- Verify you have correctly installed yt-dlp and ffmpeg (i included both for winget as I find just using yt-dlp doesnt like to work). When you install these, make sure your IDE or terminal is closed as it automatically updates your PATH to allow the extension to work. 
- Verify you have correctly put the .env in the ThirdAbletonProject folder, not the root repo. 
- Verify that you have turned on Developer mode inside of the Ableton Extensions settings tab or it Ableton wont open up the extensions server. 
### If you have done all of the above and its still not working follow these steps
- Freshly install yt-dlp and ffmpeg using the commands above, try running your terminal in Administrator mode, though you should not have to do this. 
- Once you have verified these are installed, open Ableton, verify that your Development mode toggle is turned on.
- Restart your PC 
- Open your terminal or IDE
- Navigate to ThirdAbletonProject
- run the above mentioned commands
- start Ableton
- Run npm run start, it at this point should connect. If it doesnt please open an issue and I will fix it as soon as I can.

## Troubleshooting for Extension usage
- Verify that you have correctly installed yt-dlp and ffmpeg from winget using your terminal. 
- Go into your Ableton extension settings, verify that Development mode is turned off, this should only be turned on while developing the extension. 

## Maintenance checklist for Ableton updates
- Pull latest changes and run from `ThirdAbletonProject`: `npm install`, `npm run build`, `npm run test`, `npm run verify`.
- In Ableton, smoke test all three entry points (Audio Track, Arrangement Selection, Session Clip Slot).
- For each smoke test, verify both output formats:
  - WAV import (default)
  - MP3 import (switch format in dialog)
- Confirm yt-dlp/ffmpeg resolution still works (PATH or `tools.json` overrides).
- If Ableton extension APIs changed, update supported version notes before release.
