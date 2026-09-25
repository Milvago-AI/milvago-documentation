---
sidebar_position: 5
title: Discovery
---

# Discovery

## Access this screen

In the sidebar, click **Monitoring**, then **Discovery**. `policy.manage` is required.

To collect candidate domains, go to **Administration > Shadow AI > AI platforms**, enable **Discover candidate domains**, enter a reason of at least eight characters, then save after the requested fresh MFA. `settings.manage` is also required and only future observations can appear.

1. For a candidate, click **Promote** only when it is offered by a published catalogue, or click **Ignore** / **Reconsider**; the list reloads with the new status.
2. In Enterprise, click a service or domain to list devices, search by name or identifier and open a device record. Community has neither that dialog nor OS accounts; a read-only demo shows no action buttons.

Discovery answers the question a CISO asks on day one: **which AIs are my people using that I am not looking at?** The screen lists what the fleet reached **beyond what the catalog covers**: the known AI platforms visited, and the candidate domains observed by the detectors.

It requires policy management (`policy.manage`) — it is a decision screen, not a passive consultation.

[IMAGEAMETTREICI 01]

## Known platforms

The first card carries the **known AI platforms** that the devices reached. The header notice sets the boundary, in full: **presence only** — the host was reached; no prompt, no response, no address or conversation is collected on these platforms.

| Column | Content |
| --- | --- |
| **Service** | the platform ("reached by devices" button in Enterprise) |
| **Visits** | the number of recorded visits |
| **Devices** | the number of distinct devices |
| **OS accounts** | Enterprise only: the OS accounts logged in at the time of the visits |
| **Last report** | the most recent date |

[IMAGEAMETTREICI 02]

Both tables are bounded server-side (at most 500 candidate domains, platforms from the signed catalog): pagination is a reading aid, not a way to fetch less. A shortened list under the displayed page falls back to the last page instead of presenting an empty table.

## Candidate domains

The second card lists the **AI domains** that the devices report and that the catalog does not cover, with their number of observations and two actions per row:

- **Mark the published candidate as promoted** — offered only for a domain the published catalog actually carries; the server remains the authority and answers 409 if the publication is missing.
- **Ignore / Reconsider** — remove a domain from the signal, or put it back.

[IMAGEAMETTREICI 03]

On a read-only instance, the actions do not appear rather than promising buttons that would be refused.

At **zero candidates, the screen is a normal state, not a failure**: candidate domain discovery is disabled by default, and the screen says so with the link that re-enables it — "Enable it in Shadow AI, AI Platforms, so that the devices report the AI domains they reach and that this catalog does not cover." The switch goes through the privacy route, with its written reason and its fresh MFA.

[IMAGEAMETTREICI 04]

## Who reached this domain?

Each row opens a dialog **"Devices that reached this domain over the last N days"**, with a search (machine name or device identifier, what a reader coming from a device page carries), the number of observations per device and the latest date. The detector readings are purged beyond the window: an older visit is no longer counted here.

A single dialog answers the same question from both tables, because a reader asking "who went there" does not care which table carries the answer.

[IMAGEAMETTREICI 05]

:::enterprise

The "reached by devices" dialog and the OS accounts column only exist in Enterprise: in Community, the rows remain plain text rather than carrying a control that would answer 404. The catalog also carries the discovery hygiene rule: the domains of the covered providers — after narrowing to the served edition — never appear in Discovery, and a platform masked by the organization leaves it while keeping its visits recorded.

:::

[IMAGEAMETTREICI 06]
