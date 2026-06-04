# Vendor (Ableton Extensions SDK)

npm installs `@ableton-extensions/sdk` and `@ableton-extensions/cli` from `.tgz` files in this folder.

**Do not commit these files** to this repository.

## Setup

1. Download the **Ableton Extensions SDK** from Ableton ([Extensions SDK](https://ableton.github.io/extensions-sdk/)) — not from this GitHub repo.
2. Unpack it so you have a folder `extensions-sdk-1.0.0-beta.0` with the `.tgz` packages inside.
3. From `ThirdAbletonProject/`:

```bash
export ABLETON_SDK_DIR=/path/to/extensions-sdk-1.0.0-beta.0
npm run sync-sdk
npm install
```

Or copy these two files into this `vendor/` folder by hand:

- `ableton-extensions-sdk-1.0.0-beta.0.tgz`
- `ableton-extensions-cli-1.0.0-beta.0.tgz`

then run `npm install`.
