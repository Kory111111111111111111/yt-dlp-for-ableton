# Upgrading to 1.0.0-beta.1

Follow these steps to update an existing extension project from 1.0.0-beta.0.

## Steps

### 1. Clear the vendor folder

Your extension project was created with `ableton-create-extension` and contains a `vendor/` folder at its root, at the same level as `package.json` and `manifest.json`. Delete the contents of that folder. Leave the folder itself in place.

### 2. Copy the new packages

From this zip, copy the following two files into `vendor/`:

- `ableton-extensions-sdk-1.0.0-beta.1.tgz`
- `ableton-extensions-cli-1.0.0-beta.1.tgz`

### 3. Update package.json

In your extension's `package.json`, update both package references from `beta.0` to `beta.1`:

```json
"@ableton/extensions-sdk": "file:vendor/ableton-extensions-sdk-1.0.0-beta.1.tgz",
"@ableton/extensions-cli": "file:vendor/ableton-extensions-cli-1.0.0-beta.1.tgz"
```

### 4. Install dependencies

In a terminal, from your extension project folder:

```
npm install
```

### 5. Verify the upgrade

```
npm run build
```

A successful build confirms the upgrade is complete.

---

**Note**: The SDK now expects Node.js 24 or later.
If you see an `EBADENGINE` warning during `npm install`, update [Node.js](https://nodejs.org/en/download) before running your extension.
