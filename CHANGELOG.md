# Changelog

All notable changes to the Laiki plugin are documented here.

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project uses [Semantic Versioning](https://semver.org/spec/v2.0.0.html).
Release dates use the stored Git commit date when each version first landed in
the public repository. Historical GitHub Releases may have a later publication
timestamp.

## [Unreleased]

## [0.2.1] - 2026-09-16

### Fixed

- Fixed Codex repository-marketplace installation by resolving the plugin from
  the cloned marketplace root ([`430b15d`](https://github.com/laiki-co/laiki-plugin/commit/430b15d0e2e096867a51b1c181b8c9d16d3e1b76), [#3](https://github.com/laiki-co/laiki-plugin/pull/3)).

### Other stuff

- Added the branded OpenAI composer icon and regression checks for marketplace
  shape and packaged logo references ([`430b15d`](https://github.com/laiki-co/laiki-plugin/commit/430b15d0e2e096867a51b1c181b8c9d16d3e1b76), [#3](https://github.com/laiki-co/laiki-plugin/pull/3)).
- Clarified the difference between repository installation and vendor public
  directory publication ([`430b15d`](https://github.com/laiki-co/laiki-plugin/commit/430b15d0e2e096867a51b1c181b8c9d16d3e1b76), [#3](https://github.com/laiki-co/laiki-plugin/pull/3)).

## [0.2.0] - 2026-09-16

### New!

- Added four portable skills for marketing analysis, dashboard construction,
  segment authoring, and workflow authoring ([`34b4063`](https://github.com/laiki-co/laiki-plugin/commit/34b40637e272550b8ab97ad3a4d5be4ac34b2118), [#2](https://github.com/laiki-co/laiki-plugin/pull/2)).
- Added source-neutral ownership metadata for safely synchronizing reviewed
  skill artifacts ([`34b4063`](https://github.com/laiki-co/laiki-plugin/commit/34b40637e272550b8ab97ad3a4d5be4ac34b2118), [#2](https://github.com/laiki-co/laiki-plugin/pull/2)).

## [0.1.0] - 2026-09-14

### New!

- Published the first cross-vendor Laiki plugin package with portable, Claude,
  ChatGPT, and Codex manifests connected to the production OAuth-protected MCP
  endpoint ([`e34e059`](https://github.com/laiki-co/laiki-plugin/commit/e34e059a78fd89cfbbb8b8fa29dff800af75cc2d)).
- Added setup guidance, Laiki branding, legal links, strict manifest validation,
  and public/private content boundaries ([`e34e059`](https://github.com/laiki-co/laiki-plugin/commit/e34e059a78fd89cfbbb8b8fa29dff800af75cc2d)).

### Fixed

- Aligned OpenAI listing metadata with the portable Agent Plugins schema
  ([`a359c2c`](https://github.com/laiki-co/laiki-plugin/commit/a359c2ce4e4228288653acaad777274530c02ddc), [#1](https://github.com/laiki-co/laiki-plugin/pull/1)).

[Unreleased]: https://github.com/laiki-co/laiki-plugin/compare/v0.2.1...HEAD
[0.2.1]: https://github.com/laiki-co/laiki-plugin/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/laiki-co/laiki-plugin/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/laiki-co/laiki-plugin/releases/tag/v0.1.0
