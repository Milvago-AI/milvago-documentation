# Milvago documentation

Source of the Milvago product documentation — Community and Enterprise editions — built with
[Docusaurus](https://docusaurus.io/).

**Read it online at [docs.milvago.ai](https://docs.milvago.ai)** (publication coming soon).

Milvago gives organizations visibility and control over the use of generative AI: a server and
its console, an endpoint agent, and a browser extension. This repository holds only the
documentation site; the product sources live in their own repositories.

## Languages

| Language | Source |
|---|---|
| English (default) | `docs/` |
| Français | `i18n/fr/docusaurus-plugin-content-docs/current/` |
| Español | `i18n/es/docusaurus-plugin-content-docs/current/` |
| Português (Brasil) | `i18n/pt-BR/docusaurus-plugin-content-docs/current/` |

A page exists in all four languages, with the same path and the same facts. Menu labels are
translated in `i18n/<locale>/docusaurus-plugin-content-docs/current.json`, interface strings of
the theme in `i18n/<locale>/code.json`.

## Run it locally

Requires Node.js 20 or later.

```bash
npm ci
npm start                        # dev server on http://localhost:3000, English only
npm start -- --locale fr         # dev server for one other language
npm run build && npm run serve   # production build of all four languages
```

The dev server serves a single locale: `/fr/docs/…` returns a 404 there, this is expected. Use a
production build to check every language. **Do not run `npm run build` while `npm start` is running
in the same checkout.** Both commands write to `.docusaurus`; the build can replace the dev
server's English routes with another locale and make `/docs/…` display a Portuguese 404. Stop
the dev server before building.

For a stable preview of all four languages on port 3001, run `npm run build` and then
`npm run serve -- --port 3001`. Rebuild after editing the documentation; the preview server serves
the updated files without needing a restart.

## Layout

```
docs/            English pages, one folder per sidebar section (_category_.json)
i18n/            French, Spanish and Brazilian Portuguese translations
src/components/  React components used by pages (architecture diagram)
src/theme/       Swizzled theme parts (footer, Enterprise admonition)
src/css/         Site styles and design tokens
static/img/      Logos and console screenshots
```

## Contributing

Corrections, clarifications and translations are welcome. Every page has an *Edit this page*
link; read [CONTRIBUTING.md](CONTRIBUTING.md) first. Questions go to
[Discord](https://discord.gg/69JPyVjqv), see [SUPPORT.md](SUPPORT.md). Everyone taking part
follows the [Code of Conduct](CODE_OF_CONDUCT.md).

## License

The documentation is licensed under the [Apache License 2.0](LICENSE). Copyright Milvago AI, LLC.
The Milvago name and logo are trademarks of Milvago AI, LLC and are not covered by this license.
