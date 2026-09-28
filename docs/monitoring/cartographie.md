---
sidebar_position: 3
title: Map
---

# Request map

## Access this screen

In the sidebar, click **Monitoring**, then **Cartography**. This screen requires `events.read` and is unavailable to aggregate-only readers.

1. Click **Refine filters**, set the period and criteria, then click **Apply**.
2. Select or exclude values in the rails; remove a chip or click **Clear** to undo a selection. **Hide people (overall usage)** switches to a global view.
3. Click a node, ribbon, or **View these requests** to open Conversations with the drawn scope. Export JSON/CSV or open **Synthesis report**; both retain filters, selections and exclusions. Revealed identities require `identity.reveal`.

The map answers a single question: **who talks to what**. It draws, over the chosen period, the flows between people, tools, services and models, as ribbons whose width represents the requests and whose color represents the service vendor.

It does not answer "am I observing well": capture health lives in Discovery, with the rest of what speaks about coverage. Navigations and inventories are not converted into requests — the card footer says so when the period is empty.

![Milvago - Access this screen](/img/docs/en/monitoring-cartographie-01.png)

## What the screen counts

Four indicators under the filter bar: **Requests**, **Responses**, **Identified conversations**, and, in Enterprise, **Sensitive events** (amber tone as soon as the value is > 0). An information line names what the map cannot do: "N events without a verified person" — verified identity comes from an OIDC association; failing that, the OS account behind the tool is displayed for information only. Navigations are counted apart.

![Milvago - What the screen counts](/img/docs/en/monitoring-cartographie-02.png)

## The map: rails and ribbons

The diagram is organized in four columns connected by ribbons:

- on the left, **People** and **Browsers / applications**;
- in the center, the **ribbons** themselves, one per flow (person × tool × service × model);
- on the right, **Services** and **Models**.

Each column carries its count of values present over the period ("10 / 47"). On hover over a ribbon or a node, a tooltip details the volume, the blocked and, in Enterprise, the number of sensitive events.

![Milvago - The map: rails and ribbons](/img/docs/en/monitoring-cartographie-04.png)

- **Hide people (overall usage)**: a checkbox in the filter bar switches the view to "Tools → services → models" — the people pole disappears, usage becomes global. It is a client-side view: the side filters **never widen** what the server returned, they only decide what is drawn.
- The **side filters** (rails, collapsible) exclude or isolate values of each column. A selection the new view no longer draws is removed automatically rather than skewing the link to the log.
- Clicking a node or a ribbon **drills into Conversations**: the link carries the current period and selection, nature "prompt". The selection is readable in the card footer (removable chips, "Clear" button), with a "View these requests" that takes along exactly what the screen shows — selection and exclusions included.

![Milvago - The map: rails and ribbons](/img/docs/en/monitoring-cartographie-05-gauche.png)

## Legend and states

- The legend carries "Unattributed" (the flows without a person) and, in Enterprise, "Sensitive".
- At zero requests over the period, the map owns it: "No requests in this period", with the precision that navigations and inventories are not converted into requests.
- The filter bar is collapsible here (the map stays compact); the "Refine filters" button opens it, and a dedicated "Reset" removes the side filters.

![Milvago - Legend and states](/img/docs/en/monitoring-cartographie-05-droite.png)

:::enterprise

In Enterprise, the ribbon width is complemented by a coding of **detected sensitivity**: hatching on the ribbons, counter per node, dedicated KPI and filter rail. In Community, the map is limited to the requests/blocked pair — nothing is named sensitivity, neither on the map nor in the log.

:::

![Milvago - Legend and states](/img/docs/en/monitoring-cartographie-06.png)

## Exports

The export covers what you are looking at, not the bare filter bar: the selection chips and the rail exclusions fold into the report, exactly like the detail links. As for the log, the export contains the metadata corresponding exactly to the filters; any texts require an explicit reading right, and every consultation is audited.

![Milvago - Exports](/img/docs/en/monitoring-cartographie-07.png)
