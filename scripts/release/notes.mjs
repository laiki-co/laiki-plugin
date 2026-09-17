import { readFile } from "node:fs/promises";

const stableSemverPattern =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;

export function extractReleaseNotes(changelog, version) {
  if (!stableSemverPattern.test(version)) {
    throw new Error(`Release version must use stable SemVer: ${version}`);
  }

  const heading = `## [${version}]`;
  const start = changelog.indexOf(heading);
  if (start === -1) {
    throw new Error(`CHANGELOG.md is missing ${heading}`);
  }

  const bodyStart = changelog.indexOf("\n", start);
  const nextHeading = changelog.indexOf("\n## [", bodyStart + 1);
  const footer = changelog.indexOf("\n[Unreleased]:", bodyStart + 1);
  const candidates = [nextHeading, footer].filter((index) => index !== -1);
  const end = candidates.length === 0 ? undefined : Math.min(...candidates);
  const body = changelog
    .slice(bodyStart + 1, end)
    .trim();

  if (!body) {
    throw new Error(`CHANGELOG.md has no notes for ${version}`);
  }

  return `## Changelog\n\n${body}\n`;
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const version = process.argv[2]?.replace(/^v/, "");
  if (!version) {
    throw new Error("Usage: node scripts/release/notes.mjs <version>");
  }
  const changelog = await readFile("CHANGELOG.md", "utf8");
  process.stdout.write(extractReleaseNotes(changelog, version));
}
