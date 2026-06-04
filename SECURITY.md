# Security Policy

## Supported versions

| Version | Supported |
| ------- | --------- |
| Latest release (`YouTubeToProject.ablx` on [Releases](https://github.com/Kory111111111111111111/yt-dlp-for-ableton/releases)) | Yes |
| Older tags | No |

This extension runs inside Ableton Live’s extension host with access to your Live set and can spawn **yt-dlp** and **ffmpeg** on your machine. Treat installed `.ablx` files like any third-party software.

## Reporting a vulnerability

**Please do not open a public GitHub issue for security problems.**

1. Use [GitHub private vulnerability reporting](https://github.com/Kory111111111111111111/yt-dlp-for-ableton/security/advisories/new) if available, **or**
2. Open a minimal advisory draft via the repository **Security** tab.

Include:

- Description and impact
- Steps to reproduce
- Affected version or commit
- Suggested fix (optional)

We aim to acknowledge reports within **7 days** and share a remediation plan when possible.

## Scope

In scope:

- This repository’s TypeScript/HTML extension code
- Command construction and user input handling (URLs, paths, `tools.json`)
- CI/workflow misconfigurations that affect the built artifact

Out of scope:

- Vulnerabilities in **yt-dlp**, **ffmpeg**, **Ableton Live**, or the **Ableton Extensions SDK** (report those to their maintainers)
- Social engineering or misuse of downloaded YouTube content (see [INSTALL.md](INSTALL.md) legal section)

## Secure development

- CI runs `npm audit`, [Dependency Review](https://docs.github.com/en/code-security/supply-chain-security/understanding-your-software-supply-chain/about-dependency-review) on pull requests, and [CodeQL](https://codeql.github.com/) analysis.
- The Ableton SDK is **not** vendored in this repo. Maintainer CI fetches packages from a private SDK mirror using `ABLETON_EXTENSIONS_PAT` (see README). Public CI runs tests that do not need the SDK.
- Release assets are built only from tagged commits via [.github/workflows/release.yml](.github/workflows/release.yml).

## User hardening

- Install **yt-dlp** and **ffmpeg** from trusted sources (winget, Homebrew, official builds).
- Use `tools.json` only with paths you control; do not paste untrusted config.
- Keep Live, yt-dlp, and this extension updated.
