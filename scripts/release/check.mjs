import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";

const stableSemverPattern =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/;
const manifestPaths = [
  "plugin.json",
  ".claude-plugin/plugin.json",
  ".claude-plugin/marketplace.json",
];

function runGit(args) {
  const result = spawnSync("git", args, { encoding: "utf8" });
  if (result.status !== 0) {
    throw new Error(result.stderr.trim() || `git ${args.join(" ")} failed`);
  }
  return result.stdout.trim();
}

function fail(message) {
  throw new Error(`release:check: ${message}`);
}

function versionFromManifest(path, target) {
  const content = runGit(["show", `${target}:${path}`]);
  const manifest = JSON.parse(content);
  if (path.endsWith("marketplace.json")) {
    return manifest.plugins?.[0]?.version;
  }
  return manifest.version;
}

export function parseReleaseArgs(args) {
  const value = (name) => {
    const index = args.indexOf(name);
    return index === -1 ? undefined : args[index + 1];
  };
  const version = value("--version")?.replace(/^v/, "");
  const target = value("--target") ?? "HEAD";
  if (!version || !stableSemverPattern.test(version)) {
    fail("--version must use stable MAJOR.MINOR.PATCH SemVer");
  }
  return { target, version };
}

export function releaseDate(changelog, version) {
  if (!stableSemverPattern.test(version)) {
    fail("release version must use stable MAJOR.MINOR.PATCH SemVer");
  }

  const prefix = `## [${version}] - `;
  const line = changelog
    .split(/\r?\n/)
    .find((candidate) => candidate.startsWith(prefix));
  const date = line?.slice(prefix.length);
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    fail(`CHANGELOG.md is missing dated release ${version}`);
  }
  return date;
}

export function checkRelease({ target, version }) {
  const tag = `v${version}`;
  const targetSha = runGit(["rev-parse", `${target}^{commit}`]);
  const ancestor = spawnSync(
    "git",
    ["merge-base", "--is-ancestor", targetSha, "HEAD"],
    { encoding: "utf8" },
  );
  if (ancestor.status !== 0) fail(`${targetSha} is not an ancestor of HEAD`);

  const versions = manifestPaths.map((path) =>
    versionFromManifest(path, targetSha),
  );
  if (versions.some((candidate) => candidate !== version)) {
    fail(`target manifest versions differ from ${version}: ${versions.join(", ")}`);
  }

  const tagLookup = spawnSync(
    "git",
    ["rev-parse", "--quiet", "--verify", `refs/tags/${tag}`],
    { encoding: "utf8" },
  );
  if (tagLookup.status === 0) fail(`${tag} already exists`);

  const changelog = readFileSync("CHANGELOG.md", "utf8");
  const expectedDate = runGit([
    "show",
    "-s",
    "--format=%as",
    targetSha,
  ]);
  const documentedDate = releaseDate(changelog, version);
  if (documentedDate !== expectedDate) {
    fail(
      `CHANGELOG.md date ${documentedDate} differs from target commit date ${expectedDate}`,
    );
  }
  if (
    !changelog.includes(
      `[${version}]: https://github.com/laiki-co/laiki-plugin/compare/`,
    ) &&
    !changelog.includes(
      `[${version}]: https://github.com/laiki-co/laiki-plugin/releases/tag/${tag}`,
    )
  ) {
    fail(`CHANGELOG.md is missing the ${version} footer link`);
  }
  if (runGit(["status", "--porcelain"])) fail("worktree is dirty");

  return { tag, targetSha, version };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const result = checkRelease(parseReleaseArgs(process.argv.slice(2)));
  process.stdout.write(
    `release:check: ${result.tag} target ${result.targetSha} valid\n`,
  );
}
