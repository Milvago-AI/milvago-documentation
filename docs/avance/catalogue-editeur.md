---
sidebar_position: 3
title: Detection catalogue
---

# Detection catalogue

The catalog is the **engine and the data** that tell the extension what to measure on the covered sites: prompt and upload routes, bodies, DOM selectors of the composer, known platforms. It is signed, versioned, and its coverage depends on the served edition: two providers in Community, nine in Enterprise.

To open the editing screen, select **Administration → Detection catalogue**. It is reserved under two cumulative conditions:

- the `MILVAGO_DEBUG` variable is set on the instance (see [Environment variables](../installation/variables-environnement.md));
- you hold `policy.manage` and the administration console is not masked.

`MILVAGO_DEBUG` is more than a console-visibility switch: the server checks it first on every manual import and every publish request, ahead of the ownership check, and refuses the request outright — the same generic refusal a non-owner already gets, so probing an instance never reveals whether the flag is set. Publishing itself further requires the Owner of the root organization and a fresh MFA. The automatic publisher import is a different path and stays open regardless of the flag: it must be able to correct detectors on a running instance.

![Milvago - Detection catalogue](/img/docs/en/avance-catalogue-editeur-01.png)

## Import and publish

1. Enable `MILVAGO_DEBUG` in the server deployment and restart or redeploy it.
2. Sign in with `policy.manage`; publishing also requires the root organization Owner role and fresh MFA.
3. Open **Administration → Detection catalogue**, then import the measured catalog.
4. Check the entries and revision before selecting **Publish**.
5. After publication, review detector health and the coverage notice on Monitoring screens.

## Importing and publishing

- **Manual import** goes through the console route, closed without `MILVAGO_DEBUG`: a measured catalog (read on the site, never guessed) is loaded, validated, then published.
- Publication produces a **monotone revision**: an import is refused unless its revision is strictly greater than the instance's current one, whatever entries it carries. This rule closes the case of an older or unchanged catalog, with fewer entries, replayed within its validity window.
- A **published catalog keeps its signed bytes**: republishing does not rewrite them.
- The server remains the authority: promoting or publishing something it does not carry answers an explicit error, not a silent success.

## Detector health

The screen displays the server's verdict per provider **and per revision**: service, state, applied revision, devices, requests seen by the network detector and by the DOM detector. The states read in catalog terms — a network rule that no longer matches, selectors renamed by the site:

| State | Reading |
| --- | --- |
| **Available signals consistent** | rule and DOM coincide |
| **DOM only: network capture unavailable** | the network requests are no longer seen, the DOM is |
| **No detector transport** / **Partial detector transport** | the devices no longer report coverage, wholly or in part |
| **DOM detection degraded** / **Coverage requires investigation** | the network–DOM gap exceeds the thresholds |
| **Not enough data to publish** | service not visited over the window — **not measured, not down**; this state and "Available signals consistent" never trigger a banner |

![Milvago - Detector health](/img/docs/en/avance-catalogue-editeur-02.png)

## The coverage banner

On the Monitoring screens, a notice is displayed to holders of `policy.manage` when coverage degrades, naming the concerned services: worst state first. Its role is simple — **say that the numbers are incomplete** — because a fleet that no longer captures looks exactly like a fleet that no longer uses AI, and the page showing the smaller number does not say it by itself. In debug mode, the banner carries the link to the details.

:::note
The catalog remains the only source of routes: the extension never seals, masks or blocks a site outside the measured routes it carries. See [Shadow AI](../administration/shadow-ai.md) for the policy, [Discovery](../monitoring/discovery.md) for what the catalog does not cover yet.
:::
