# Strip Silence

Renders the audio from a selected range, detects silent regions, and removes them by clearing clips in those areas. A more complete example combining arrangement selection, audio rendering, and transactions.

## How to try it

In Arrangement View, click and drag to select a time range that covers one or more audio tracks with clips. Right-click on the selected area and choose **Strip Silence**. A progress dialog shows while the extension analyzes each track. Silent regions longer than 250 ms are cleared from the arrangement. You can cancel at any point. Note that this extension only works with WAV files. Depending on Live's settings, Live might render an AIFF file. In that case, the extension will print an error.
