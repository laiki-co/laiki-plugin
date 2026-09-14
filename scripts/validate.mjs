import { lstat, readFile, readdir } from "node:fs/promises";
import { join, relative } from "node:path";

const root = new URL("../", import.meta.url);
const expectedEndpoint = "https://mcp.laiki.co/mcp";

const readJson = async (path) =>
  JSON.parse(await readFile(new URL(path, root), "utf8"));

const portable = await readJson("plugin.json");
const portableMcp = await readJson("mcp.json");
const claude = await readJson(".claude-plugin/plugin.json");
const claudeMarketplace = await readJson(".claude-plugin/marketplace.json");
const claudeMcp = await readJson(".mcp.json");

const versions = [
  portable.version,
  claude.version,
  claudeMarketplace.plugins?.[0]?.version,
];

if (new Set(versions).size !== 1 || versions.some((version) => !version)) {
  throw new Error(`Plugin versions differ: ${versions.join(", ")}`);
}

const endpoints = [
  portableMcp.mcpServers?.laiki?.url,
  claudeMcp.mcpServers?.laiki?.url,
];

if (endpoints.some((endpoint) => endpoint !== expectedEndpoint)) {
  throw new Error(`MCP endpoint must be ${expectedEndpoint}`);
}

if (portable.name !== "laiki" || claude.name !== "laiki") {
  throw new Error("Plugin name must remain laiki");
}

const repositoryUrl = "https://github.com/laiki-co/laiki-plugin";
if (portable.repository !== repositoryUrl || claude.repository !== repositoryUrl) {
  throw new Error(`Repository URL must be ${repositoryUrl}`);
}

const privateMarkers = [
  ["github.com", "laiki-co", "laiki2"].join("/"),
  ["@laiki", "laiki2"].join("/"),
];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === ".git") continue;
    const path = join(directory, entry.name);
    const stats = await lstat(path);
    if (stats.isSymbolicLink()) {
      throw new Error(`Symlinks are forbidden: ${relative(root.pathname, path)}`);
    }
    if (entry.isDirectory()) {
      await walk(path);
      continue;
    }
    if (!entry.isFile()) continue;
    const content = await readFile(path, "utf8").catch(() => "");
    const marker = privateMarkers.find((candidate) => content.includes(candidate));
    if (marker) {
      throw new Error(
        `Private source marker ${marker} found in ${relative(root.pathname, path)}`,
      );
    }
  }
}

await walk(root.pathname);
console.log(`Validated Laiki plugin ${portable.version}`);
