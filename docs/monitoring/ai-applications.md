---
sidebar_position: 4
title: AI applications
tags: [Enterprise]
---

# AI applications

## Access this screen

In the sidebar, click **Monitoring**, then **AI applications**. It requires Milvago Enterprise, `events.read`, and an organisation that is not aggregate-only.

1. Choose **Per page** to browse the list.
2. Click a value in **Found on** to open every affected device, then click a device name to open its record.
3. Close the dialog when finished. It makes no change and the screen has no filters.

:::enterprise

This page only concerns the Enterprise edition: it appears in the navigation only with the analyst role. Community is limited to the browser — the inventory code and dependencies are absent from the shipped binary.

:::

The page lists the **AI applications** detected on the devices: native software, embedded assistants, local AI applications, read by the agent inventory and described by the **signed catalog**. It complements the browser usage of Monitoring with the software fleet.

The header sentence sets the reading rule: **A detected presence establishes neither a use nor a submission.** Requests are read under Shadow AI; a tool installed but never called upon is not a Shadow AI event.

![Milvago - Access this screen](/img/docs/en/monitoring-ai-applications-01.png)

## The table of observed applications

One row per detected **tool** (all observations are grouped by tool, not by device), ranked from the most widespread to the rarest, then alphabetically:

The **Per page** selector offers 10, 20, 50, 100 or 200 tools. A tool and all its observations stay on the same page; the numbered controls provide access to the first, last and neighbouring pages.

| Column | Content |
| --- | --- |
| **Application** | the catalog name (or the raw identifier if the tool is unknown to the catalog) |
| **Vendor** | the vendor name, "—" if the catalog does not know it |
| **Risk** | tone badge according to the catalog level |
| **Devices** | number of devices where the tool was found |
| **Found on** | the first three machine names, then "and N more"; the cell is a **button** (see below) |
| **Recognised by** | how the tool was identified (browser extension, local application…) |
| **First observation** | the earliest detection date of the tool |

![Milvago - The table of observed applications](/img/docs/en/monitoring-ai-applications-02.png)

At zero detections, the screen owns it: "No AI application observed — Enterprise devices report the applications described by the signed catalog. A presence is not a use."

## Found on

A count alone would force reopening every machine to know which one to act on. The cell therefore opens a dialog listing **all** the devices carrying the tool — without a second request, the complete list is already in the page load: device (link to its page), way of being recognized, first observation. This dialog uses the same wide, height-limited list layout as Discovery: its header stays visible while the table scrolls within the window. The device appears there under its real name for a reader holding `devices.read` outside aggregate-only reporting; other readers see the device alias. In aggregate-only reporting, the API and the MCP server return counts only: number of devices per tool and per way of being recognized, first and last observation of the tool; no device is named, and the list of tools for one specific device is refused.

![Milvago - Found on](/img/docs/en/monitoring-ai-applications-03.png)

What this page does not say: it does not infer usage from a presence. A tool reported, then removed from the device, disappears from the list at the next report — its history remains in the conversations.
