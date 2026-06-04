# Vendor (Ableton Extensions SDK)

npm installs `@ableton-extensions/sdk` and `@ableton-extensions/cli` from `.tgz` files in this folder.

**Do not commit these files** to yt-dlp-for-ableton (they live in [AbletonExtensions](https://github.com/Kory111111111111111111/AbletonExtensions)).

## Local setup

From `ThirdAbletonProject/`:

```bash
npm run sync-sdk
npm install
```

Or clone [AbletonExtensions](https://github.com/Kory111111111111111111/AbletonExtensions) next to this repo on your machine — `sync-sdk` finds `../../../AbletonExtensions/extensions-sdk-1.0.0-beta.0` automatically.

Override the source path:

```bash
export ABLETON_SDK_DIR=/path/to/extensions-sdk-1.0.0-beta.0
npm run sync-sdk
```
