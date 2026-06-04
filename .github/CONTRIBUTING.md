# Contributing

## CI

| Check | Who it runs for | Needs Ableton SDK |
|-------|-----------------|-------------------|
| **test (public)** | Everyone, including fork PRs | No |
| **dependency-review** | Pull requests | No |
| **build (maintainer)** | Upstream repo, non-fork PRs | Yes |
| **codeql (maintainer)** | Same as build | Yes |

Fork contributors should see a green **test (public)** job. Full build runs only on the upstream repository.

## Merging pull requests

Before merging an external PR:

1. Confirm **test (public)** passed.
2. Pull the branch locally and run `npm run ci` (requires the official Ableton Extensions SDK on your machine — see [vendor/README.md](../ThirdAbletonProject/vendor/README.md)).

### Branch protection (recommended)

On **yt-dlp-for-ableton** → **Settings** → **Branches** → add a rule for `main`:

- **Require status checks:** `test (public)`
- **Require a pull request before merging**
- **Restrict who can push to matching branches** → maintainers only

## Ableton Extensions SDK

This project uses **Ableton’s** Extensions SDK. It is not included in this repo. Obtain it from Ableton’s SDK download / beta program.

Do not commit SDK `.tgz` files here unless you have confirmed that is allowed under Ableton’s SDK license.
