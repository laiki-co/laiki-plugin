# Releasing the Laiki plugin

Laiki plugin releases use stable Semantic Versioning independently from Laiki
application releases. `plugin.json` is the candidate version source, and every
duplicated vendor manifest must carry the same version.

## Release preparation

Prepare every release through a reviewed pull request:

1. Apply the appropriate SemVer bump to every vendor manifest in the same
   commit as installable package changes.
2. Add a curated, user-facing `CHANGELOG.md` section using the tagged commit's
   stored `YYYY-MM-DD` date.
3. Update the comparison links at the bottom of `CHANGELOG.md`.
4. Run `bun run validate`, `bun test`, and Claude's strict plugin validator.
5. Merge only after required validation passes. Never auto-merge synchronized
   skill changes or release preparation.

An unchanged skill sync produces no version bump and no release.

## Release publication

Run the **Release** workflow on `main`. It:

- validates the exact target commit and all manifest versions;
- confirms the changelog date matches the target commit date;
- preflights the pinned release signing key;
- creates and verifies a signed annotated tag;
- creates a draft GitHub Release from the curated changelog section;
- verifies the draft notes before publication;
- cleans up only when it can prove no published release would be damaged.

The protected `plugin-release` environment must permit only `main` and contain
`RELEASE_SIGNING_KEY`. The key must match `release-signers` and remain
registered as an SSH signing key for `juanpujol`. Never use a personal access
token.

## Historical backfill

Publish oldest to newest:

| Version | Target commit | Latest |
| --- | --- | --- |
| `0.1.0` | `a359c2ce4e4228288653acaad777274530c02ddc` | No |
| `0.2.0` | `34b40637e272550b8ab97ad3a4d5be4ac34b2118` | No |
| `0.2.1` | `430b15d0e2e096867a51b1c181b8c9d16d3e1b76` | Yes |

GitHub records the backfill publication time. `CHANGELOG.md` preserves each
version's original commit date.
