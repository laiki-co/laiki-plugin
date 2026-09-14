# AGENTS.md

Public distribution repository for the Laiki agent plugin.

## Boundaries

- Never copy private application source, internal documentation, credentials,
  customer data, fixture data, environment values, or private repository links
  into this repository.
- Only distributable manifests, skills, assets, setup documentation, and their
  validation automation belong here.
- `https://mcp.laiki.co/mcp` is the canonical production MCP endpoint.
- Never add placeholder OAuth credentials or OpenAI application IDs.

## Standards

- Root `plugin.json` and `mcp.json` follow Agent Plugins v1.
- Skills follow the Agent Skills specification and live at
  `skills/<name>/SKILL.md`.
- `.claude-plugin/plugin.json` and `.mcp.json` follow current Claude plugin
  conventions.
- OpenAI-specific metadata lives under `extensions.com.openai` in root
  `plugin.json`.
- Keep one plugin version across every vendor manifest and marketplace entry.
- Validate before commit with `node scripts/validate.mjs` and Claude's strict
  plugin validator.

## Git

- Conventional commits: `type(scope): message`.
- Synced skill changes arrive through reviewed pull requests. Never auto-merge
  them.
