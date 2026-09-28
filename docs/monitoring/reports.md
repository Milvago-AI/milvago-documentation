---
sidebar_position: 6
title: Reports
---

# Reports

## Access this screen

In the sidebar, click **Monitoring**, then **Reports**. `reports.aggregate` is required; the screen exists in both editions and is also the aggregate-only overview.

1. Choose **Teams** or **Groups** when both are available, then **Table** or **Cartography**.
2. Click a map node to isolate or remove a selection.
3. Click **Export** to download every published week for the current breakdown; when no week is published, the button is absent and **Not enough data to publish** is expected.

Reports is the **aggregated and published** synthesis view of usage: complete and fixed weeks, published once, never recomputed. It answers "what is happening, week after week, by team or by fleet?" without exposing individuals: small groups and identifying links are omitted.

It requires the `reports.aggregate` permission — it is the only Monitoring screen accessible to a reader of aggregates without reading the devices or the conversations.

![Milvago - Access this screen](/img/docs/en/monitoring-reports-01.png)

## Two breakdowns of the same week

Each published week reads along two axes, placed side by side:

- **Teams** — the OIDC attribute carried by the people (configured in Privacy);
- **Groups** — the Fleet > Groups breakdown.

The tab only appears if the breakdown actually exists; if neither the team attribute nor the groups exist, a warning says so and suggests where to act: "No OIDC team attribute is configured and no device group exists, so every row reads as unattributed. Set the team attribute in Privacy, or create groups under Fleet."

![Milvago - Two breakdowns of the same week](/img/docs/en/monitoring-reports-02.png)

A week published **before** the device group breakdown existed does not carry it: the screen displays "No breakdown by device group for this week: it was published before this breakdown existed, and a published report is never recomputed." rather than a misleading zero — the absence of the data never means "zero requests".

## Table or map

Each week reads as a **table** (team or group, tool, service, model, requests, responses, distinct subjects) or as a **map**: the same ribbon diagram as the Monitoring Map, where each team (or group) becomes the starting point of the flows. Selecting a node is possible there, without sensitivity coding.

![Milvago - Table or map](/img/docs/en/monitoring-reports-03.png)

## What k-anonymity does to the rows

A row (team or group, tool, service, model) is published only when at least *k* distinct people used it during the week. This threshold is set in [Privacy](../administration/confidentialite.md). Smaller rows are withheld. So are rows that fall under the threshold in the other breakdown (teams or groups): otherwise they could be recovered by subtraction between the two views. Activity not linked to any person is left out too.

Rows that clear the threshold stay displayed. An incomplete week carries the **Rows withheld** badge, and a notice above the weeks explains why. Close it with the cross: the choice is remembered in your browser, the badge stays on every affected week, and the **Why are rows withheld?** link brings the explanation back. A missing row is never a zero: what is omitted is flagged as omitted.

![Milvago - What k-anonymity does to the rows](/img/docs/en/monitoring-reports-04.png)

## Export

The export button produces a **CSV** of all the weeks according to the current breakdown: week, team (or group), tool, service, model, requests, responses, distinct subjects. The file opens correctly in Excel without an import assistant (UTF-8 BOM, announced separator), and the values coming from an identity token or a console field are neutralized against formula injection — a cell starting with `=`, `+`, `-`, `@` is never interpreted.

![Milvago - Export](/img/docs/en/monitoring-reports-05.png)

At zero published weeks, the screen reads "Not enough data to publish": aggregates accumulate with the publications, they are not computed retroactively.

![Milvago - Export](/img/docs/en/monitoring-reports-06.png)
