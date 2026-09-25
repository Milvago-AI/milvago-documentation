---
sidebar_position: 3
title: Detection catalog
---

# Detection catalog

The catalog is the **engine and the data** that tell the extension what to measure on the covered sites: prompt and upload routes, bodies, DOM selectors of the composer, known platforms. It is signed, versioned, and its coverage depends on the served edition: two providers in Community, nine in Enterprise.

To open the editing screen, select **Administration → Detection catalog**. It is reserved under two cumulative conditions:

- the `MILVAGO_DEBUG` variable is set on the instance (see [Environment variables](../installation/variables-environnement.md));
- you hold `policy.manage` and the administration console is not masked.

It is a **noise** setting, not a security boundary: catalog publication requires the Owner of the root organization and a fresh MFA anyway. Nothing reads this flag in a request; only the environment defines it.

[IMAGEAMETTREICI 01]

## Import and publish

1. Enable `MILVAGO_DEBUG` in the server deployment and restart or redeploy it.
2. Sign in with `policy.manage`; publishing also requires the root organization Owner role and fresh MFA.
3. Open **Administration → Detection catalog**, then import the measured catalog.
4. Check the entries and revision before selecting **Publish**.
5. After publication, review detector health and the coverage notice on Monitoring screens.

## Importing and publishing

- **Manual import** goes through the console route, closed without `MILVAGO_DEBUG`: a measured catalog (read on the site, never guessed) is loaded, validated, then published.
- Publication produces a **monotone revision**: a catalog that changes entries must change revision, otherwise it is refused. This rule closes the case of an older catalog, with fewer entries, interchangeable within its validity window.
- A **published catalog keeps its signed bytes**: republishing does not rewrite them.
- The server remains the authority: promoting or publishing something it does not carry answers an explicit error, not a silent success.

## Detector health

The screen displays the server's verdict per provider **and per revision**: service, state, applied revision, devices, requests seen by the network detector and by the DOM detector. The states read in catalog terms — a network rule that no longer matches, selectors renamed by the site:

| State | Reading |
| --- | --- |
| Healthy | rule and DOM coincide |
| DOM only | the requests are no longer seen, the DOM is |
| Transport absent / partial | the devices no longer report coverage |
| Degraded / suspect | the network–DOM gap exceeds the thresholds |
| Insufficient data | service not visited over the window — **not measured, not down**; this state and "healthy" never trigger a banner |

[IMAGEAMETTREICI 02]

## The coverage banner

On the Monitoring screens, a notice is displayed to holders of `policy.manage` when coverage degrades, naming the concerned services: worst state first. Its role is simple — **say that the numbers are incomplete** — because a fleet that no longer captures looks exactly like a fleet that no longer uses AI, and the page showing the smaller number does not say it by itself. In debug mode, the banner carries the link to the details.

:::note
The catalog remains the only source of routes: the extension never seals, masks or blocks a site outside the measured routes it carries. See [Shadow AI](../administration/shadow-ai.md) for the policy, [Discovery](../monitoring/discovery.md) for what the catalog does not cover yet.
:::
