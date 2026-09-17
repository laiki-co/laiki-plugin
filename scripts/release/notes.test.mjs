import assert from "node:assert/strict";
import test from "node:test";
import { extractReleaseNotes } from "./notes.mjs";

test("extracts one dated release without footer links", () => {
  const changelog = `# Changelog

## [Unreleased]

## [1.2.3] - 2026-09-17

### Fixed

- Fixed installation.

## [1.2.2] - 2026-09-16

### New!

- Added installation.

[1.2.3]: https://example.test
`;

  assert.equal(
    extractReleaseNotes(changelog, "1.2.3"),
    "## Changelog\n\n### Fixed\n\n- Fixed installation.\n",
  );
});

test("rejects missing and unstable versions", () => {
  assert.throws(() => extractReleaseNotes("# Changelog\n", "1.2.3"));
  assert.throws(() => extractReleaseNotes("# Changelog\n", "1.2.3-beta.1"));
  assert.throws(() => extractReleaseNotes("# Changelog\n", "1.02.3"));
});

test("excludes footer links from the oldest release", () => {
  const changelog = `## [1.0.0] - 2026-09-14

### New!

- Initial release.

[Unreleased]: https://example.test/compare/v1.0.0...HEAD
[1.0.0]: https://example.test/releases/v1.0.0
`;

  assert.equal(
    extractReleaseNotes(changelog, "1.0.0"),
    "## Changelog\n\n### New!\n\n- Initial release.\n",
  );
});
