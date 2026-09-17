import assert from "node:assert/strict";
import test from "node:test";
import { parseReleaseArgs, releaseDate } from "./check.mjs";

test("parses a stable release version and target", () => {
  assert.deepEqual(
    parseReleaseArgs(["--version", "v1.2.3", "--target", "abc123"]),
    { target: "abc123", version: "1.2.3" },
  );
});

test("rejects missing and unstable release versions", () => {
  assert.throws(() => parseReleaseArgs([]));
  assert.throws(() => parseReleaseArgs(["--version", "1.2.3-beta.1"]));
  assert.throws(() => parseReleaseArgs(["--version", "01.2.3"]));
});

test("reads the stored historical release date", () => {
  assert.equal(
    releaseDate("## [1.2.3] - 2026-09-17\n", "1.2.3"),
    "2026-09-17",
  );
});
