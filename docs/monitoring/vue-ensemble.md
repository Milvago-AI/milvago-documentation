---
sidebar_position: 1
title: Overview
---

# Overview

## Access this screen

In the sidebar, click **Monitoring**, then **Overview**. `overview.read` and `events.read` are required, except that aggregate-only organizations, a profile without `events.read`, or a profile with `reports.aggregate` but without `devices.read`, see Reports instead when they have `reports.aggregate`.

1. Use **View devices** to open **Fleet > Devices** and approve a pending device when you have `members.manage`.
2. Use **Open conversations** or **Open cartography** to investigate. These shortcuts open the destination without applying a filter.
3. Click **Refresh** to reload the indicators and pending-device state.

The overview is the first screen of the console, the one displayed at login (`#overview`). It answers a single question, over a 24-hour window: **what is happening, right now, in the organization's AI usage?**

It is neither the detail (Conversations), nor the geography of flows (Map), nor the management (Fleet, Administration). Its role is to enable the decision of the day: is there an anomaly to dig into, a device to approve, a policy to adjust?

![Milvago - Access this screen](/img/docs/en/monitoring-vue-ensemble-01.png)

## The reading principle

Two rules guide the whole screen, and the whole platform:

1. **The numbers are observed facts.** The page projects, estimates and extrapolates nothing. What a browser cannot capture is not guessed — and the information line under the title restates it in full: a browser event is not a software inventory. Seeing "12 providers" does not mean "12 installed applications".
2. **Two families of events, counted separately.** A **navigation** (a device visits an AI site) is not a **request** (a prompt was sent). The "Requests" tile carries the number of requests and names the navigations apart, in its caption.

Numbers are formatted according to the console language (separators, spaces) and remain tabular.

## The path of the page

The screen reads in code order, from the most urgent to the most analytical. Each block only appears if its condition is true.

### 1. The "To do" banner

If devices await approval **and** you have the right to approve them, an alert banner appears at the top: "N devices are waiting for your approval.", with a button to Devices. While a device is pending, nothing is reported from it: this is the only blockage worth a permanent banner.

![Milvago - 1. The To do banner](/img/docs/en/monitoring-vue-ensemble-02.png)

### 2. The onboarding card

If **no device** is registered, the page shows the three steps of the first journey, with a shortcut link to each screen:

1. **Download the agent** — the package (MSI or RPM) is served by the server.
2. **Approve the first device** — a device appears as pending after its installation, according to the organization's approval policy.
3. **Configure services** — in Shadow AI, choose the AI services observed, blocked or redirected.

This card disappears as soon as the fleet exists. In place of the empty page, the screen then shows the indicators below, possibly at zero — a zero is displayed, not hidden.

![Milvago - 2. The onboarding card](/img/docs/en/monitoring-vue-ensemble-03.png)

### 3. The four indicators (KPI)

| Tile | Value | Caption | Reading |
| --- | --- | --- | --- |
| **Requests** | number of requests received over the period | "Last 24 hours · N navigations" | the volume of actual usage, navigations counted apart |
| **Blocked** | number of blocked events | "N% of requests" or "According to applied rules" if zero requests | takes a danger tone as soon as the value is > 0 |
| **Active devices** | active / total | "N inactive, pending or revoked" | the coverage ratio: an inactive device is a closed measurement window |
| **Observed providers** | number of distinct providers | "Over the period" | the extent of the perimeter actually called upon |

The blocking percentage is computed over the same 24-hour window; the inactive count is the difference between the total fleet and the active devices.

![Milvago - 3. The four indicators (KPI)](/img/docs/en/monitoring-vue-ensemble-04.png)

### 4. "Usage rhythm" (left column)

An hourly histogram over the observation window: each bar carries the volume of the hour, stacking **observed** (grey) and **blocked** (red). A tooltip per bar details "hour · events / blocked". Two readings are possible:

- the **shape** (peaks, troughs, dead ranges) tells when the organization calls upon AI;
- the red share, in proportion, tells whether the policy slows things down or lets them through.

The card footer restates the exact window and offers the button to **Conversations** to move from the "how much" to the "what". At zero events, the card displays the empty state "No events received" and says when events will appear.

![Milvago - 4. Usage rhythm (left column)](/img/docs/en/monitoring-vue-ensemble-05.png)

### 5. "Observed providers" (right column)

A ranked list: one row per provider, where the **observed** share (non-blocked requests) and the **blocked** share read side by side, with the count on the right. It is the real distribution of usage over the period.

- If you hold the analyst role, the card footer restates the scope ("People → tools → services → models") and opens the **Map**, which details each flow device by device.
- If the list is empty, the screen owns it: "This list reflects only events actually received." — the absence of a provider is not a measurement failure, it is an absence of traffic.

![Milvago - 5. Observed providers (right column)](/img/docs/en/monitoring-vue-ensemble-06.png)

## Who sees what

- The screen requires the `overview.read` and `events.read` permissions; it is hidden from the navigation without `overview.read`, and without `events.read` it gives way to Reports or restricted access.
- The approval banner additionally requires device management.
- In Community, the observed perimeter is limited to ChatGPT and Claude; in Enterprise, it extends to the nine covered providers and to local AI applications — the page works identically, only the data feeding it changes.
- The **Refresh** button reloads the indicators and the device list; the page does not refresh by itself.
