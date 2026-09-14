# Laiki plugin

Official Laiki plugin for Claude, ChatGPT, Codex, and other compatible AI
agents.

The plugin connects agents to Laiki through the remote MCP endpoint at
`https://mcp.laiki.co/mcp`. OAuth authentication preserves each user's Laiki
organization membership, role, and configured MCP policy.

## Capabilities

- Analyze marketing performance.
- Work with dashboards and widgets.
- Build and preview segments.
- Author workflows with Laiki's safety contracts.

Task-specific skills will be published from reviewed release artifacts. The
public repository contains only distributable plugin metadata, skills, assets,
and validation automation. It does not contain Laiki application or MCP server
source code.

## Test locally

Clone the repository, then load it directly:

```bash
git clone https://github.com/laiki-co/laiki-plugin.git
claude --plugin-dir ./laiki-plugin
```

For OAuth steps, read [`SETUP.md`](SETUP.md).

## Configuration files

- `plugin.json` and `mcp.json`: portable Agent Plugins v1 package.
- `.claude-plugin/`: Claude plugin and marketplace metadata.
- `.mcp.json`: Claude-compatible remote MCP configuration.
- `.agents/plugins/marketplace.json`: ChatGPT and Codex marketplace metadata.

OpenAI's registered application mapping will be added after the submission
portal issues the production app identifier. No placeholder identifier is
committed.

## Security and privacy

- [Privacy policy](https://app.laiki.co/privacy)
- [Terms of service](https://app.laiki.co/terms)
- Report vulnerabilities through this repository's private security reporting
  channel. Do not open a public issue for sensitive reports.

## License

[MIT](LICENSE)
