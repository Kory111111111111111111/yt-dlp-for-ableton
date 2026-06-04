# Contributing

## CI

| Check | Who it runs for | Needs Ableton SDK |
|-------|-----------------|-------------------|
| **test (public)** | Everyone, including fork PRs | No |
| **dependency-review** | Pull requests | No |
| **build (maintainer)** | Pushes and same-repo PRs only, when `ABLETON_EXTENSIONS_PAT` is set | Yes (private [AbletonExtensions](https://github.com/Kory111111111111111111/AbletonExtensions)) |
| **codeql (maintainer)** | Same as build | Yes |

Fork contributors should see a green **test (public)** job. Full build runs only on the upstream repo with the maintainer secret.

## Merging pull requests

Only maintainers can run the full build in CI. Before merging an external PR:

1. Confirm **test (public)** passed.
2. Pull the branch locally and run `npm run ci` (requires your local SDK — see [vendor/README.md](../ThirdAbletonProject/vendor/README.md)).

### Branch protection (recommended)

On **yt-dlp-for-ableton** → **Settings** → **Branches** → add a rule for `main`:

- **Require status checks:** `test (public)` (required for everyone)
- Optionally also require `build (maintainer)` for pushes you make on the upstream repo
- **Require a pull request before merging**
- **Restrict who can push to matching branches** → only your account (or a team you control)

That way strangers cannot merge without your review, even if a check is green.

## Ableton Extensions SDK

This project uses Ableton’s Extensions SDK (not authored here). Obtain it from Ableton’s beta / SDK download; the maintainer stores packages in a private repo for CI only.

Do not commit SDK `.tgz` files to this repository unless you have confirmed that is allowed under Ableton’s SDK license.
