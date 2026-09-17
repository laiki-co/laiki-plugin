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
const codexMarketplace = await readJson(".agents/plugins/marketplace.json");

const versions = [
  portable.version,
  claude.version,
  claudeMarketplace.plugins?.[0]?.version,
];

if (new Set(versions).size !== 1 || versions.some((version) => !version)) {
  throw new Error(`Plugin versions differ: ${versions.join(", ")}`);
}

if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(portable.version)) {
  throw new Error(`Plugin version must use stable SemVer: ${portable.version}`);
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

const codexEntries = codexMarketplace.plugins;
const codexEntry = Array.isArray(codexEntries) ? codexEntries[0] : undefined;
if (
  codexMarketplace.name !== "laiki" ||
  codexMarketplace.interface?.displayName !== "Laiki" ||
  !Array.isArray(codexEntries) ||
  codexEntries.length !== 1 ||
  codexEntry?.name !== "laiki" ||
  codexEntry?.source?.source !== "local" ||
  codexEntry?.source?.path !== "./"
) {
  throw new Error(
    "Codex marketplace must expose the repository-root Laiki plugin locally",
  );
}

const repositoryUrl = "https://github.com/laiki-co/laiki-plugin";
if (portable.repository !== repositoryUrl || claude.repository !== repositoryUrl) {
  throw new Error(`Repository URL must be ${repositoryUrl}`);
}

const openAiInterface = portable.extensions?.["com.openai"]?.interface;
if (
  typeof openAiInterface !== "object" ||
  openAiInterface === null ||
  Array.isArray(openAiInterface)
) {
  throw new Error("OpenAI interface metadata is required");
}

if (
  openAiInterface.composerIcon !== "./assets/logo.png" ||
  openAiInterface.logo !== "./assets/logo.png"
) {
  throw new Error("OpenAI interface must use the packaged Laiki logo");
}

if (
  typeof openAiInterface.shortDescription !== "string" ||
  openAiInterface.shortDescription.length === 0 ||
  openAiInterface.shortDescription.length > 30
) {
  throw new Error("OpenAI shortDescription must contain 1-30 characters");
}

const prompts = openAiInterface.defaultPrompt;
if (
  !Array.isArray(prompts) ||
  prompts.length === 0 ||
  prompts.length > 3 ||
  prompts.some(
    (prompt) =>
      typeof prompt !== "string" || prompt.length === 0 || prompt.length > 128,
  )
) {
  throw new Error("OpenAI defaultPrompt must contain 1-3 prompts of 1-128 characters");
}

for (const field of [
  "privacyPolicyURL",
  "supportURL",
  "termsOfServiceURL",
  "websiteURL",
]) {
  const value = openAiInterface[field];
  if (typeof value !== "string" || value.length > 1_024) {
    throw new Error(`OpenAI ${field} must be an HTTPS URL within 1,024 characters`);
  }
  try {
    if (new URL(value).protocol !== "https:") throw new Error("not HTTPS");
  } catch {
    throw new Error(`OpenAI ${field} must be an HTTPS URL within 1,024 characters`);
  }
}

const privateMarkers = [
  ["github.com", "laiki-co", "laiki2"].join("/"),
  ["@laiki", "laiki2"].join("/"),
];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === ".git" || entry.name === "node_modules") continue;
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
