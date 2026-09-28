# Contributing

Thanks for helping. A typo, an unclear step or a missing translation is a welcome pull request.
Before a large change — a new section, a restructured page — say hello on the
[Milvago AI Discord](https://discord.gg/69JPyVjqv) or open an issue: agreeing on the approach
first saves everyone a rewrite. Everyone taking part follows the
[Code of Conduct](CODE_OF_CONDUCT.md).

## Licensing of contributions

A contribution is accepted under the license of this repository, Apache-2.0. Copyright holder:
Milvago AI, LLC. Inbound equals outbound: we ask for no copyright assignment.

Sign your commits off (`git commit -s`), which states that you have the right to submit the
work under that license — the [Developer Certificate of Origin](https://developercertificate.org/).

## What makes a good page

- **Describe what the product does, not what it should do.** A behavior, a label or a
  permission quoted in a page must match the product. Quote interface labels exactly as the
  console shows them in that language.
- **A page that documents a screen lets the reader do the task.** Start with where to find it
  (*In the sidebar, open **Administration**, then click **Privacy***), then numbered steps:
  prerequisites, what to open, what to fill, the final button, the visible result.
- **Mark the edition.** A page that concerns only Enterprise carries `tags: [Enterprise]` in its
  front matter; an Enterprise section inside a mixed page uses the `:::enterprise` admonition.
  Never promise Community a capability it does not have.
- **Tone:** sober and factual. An empty state is explained, never dressed up; a missing value is
  not "zero".
- **No real names, customer names, credentials, internal URLs or personal data** — in text,
  examples or screenshots. Use obviously fictional values (`example.com`, RFC 5737 addresses).

## Languages

English (`docs/`) is the default language and the source tree; French, Spanish and Brazilian
Portuguese live under
`i18n/<locale>/docusaurus-plugin-content-docs/current/` with the same paths. A change of facts
lands in all four languages in the same pull request. If you can only write one language, say
so in the pull request: a maintainer will complete the others before merging.

A new sidebar category also needs its label in
`i18n/<locale>/docusaurus-plugin-content-docs/current.json`.

## Before opening a pull request

```bash
npm ci
npm run build
```

The build covers all four languages and fails on a broken link. Then look at the page you
changed in the built site (`npm run serve`), in the languages you touched.

MDX pitfalls that break the build:

- no heading anchors (`## Title {#id}`);
- a blank line between sibling JSX elements, and a JSX `<p>` on a single line;
- `:::enterprise` does not work inside a JSX block.

New or updated dependencies are pinned to an exact version and come with the updated
`package-lock.json`.

## Reporting a problem

Open an issue with the page URL, what is wrong and, if you know it, what is right. For anything
with a security dimension, follow [SECURITY.md](SECURITY.md) instead.
