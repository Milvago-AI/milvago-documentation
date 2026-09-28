---
sidebar_position: 2
title: Conversations
---

# Conversations

## Access this screen

In the sidebar, click **Monitoring**, then **Conversations**. This screen requires `events.read` and is unavailable to aggregate-only readers.

1. Choose **24 h**, **7 d**, **30 d**, or **Custom**, enter criteria and click **Apply**. The table returns to page one with that scope.
2. Open a row to read its thread; use **Load earlier messages** when needed. Save the current scope with **Save this view**, a name, and optionally organisation sharing.
3. Choose JSON or CSV then click **Export**. The file exactly matches the filters; **Synthesis report** opens the same scope in a new tab. Revealed identities require `identity.reveal`.

The conversation log gathers the Shadow AI exchanges observed on the organization's devices: who spoke to which service, from which device, with what outcome (observed, blocked, masked). It answers the "**what**" question that the overview leaves open after the "how much".

The information line under the title defines the grain of the reading: a conversation groups the records of a single exchange on a single device; a record without a conversation identifier remains isolated.

![Milvago - Access this screen](/img/docs/en/monitoring-conversations-01.png)

## The filter bar

It is displayed right away, without a "Refine filters" button. It carries:

- the **period**, as direct segments (24 h, 7 d, 30 d) or custom (from / to, both bounds required and ordered);
- the **identifiers**: person (actor) and device;
- the **usage dimensions**: browser or application, service, model, and a full-text search;
- the **action** (observed, blocked, redirected) and the **nature** (prompt, response, navigation);
- the presence of an **attachment**.

![Milvago - The filter bar](/img/docs/en/monitoring-conversations-02.png)

**Saved views** complete the bar: a view carries a name, can be **shared with the organization** (then manageable by Owners and Admins), and applying it resets the pagination. Changing a filter always returns to page 1.

## The table

Each row is a conversation, and the whole row opens it — with a real button in the first cell for keyboard navigation. Columns:

| Column | Content |
| --- | --- |
| **Tool / service** | the provider (open button) and the precise tool (browser or local application) |
| **Model** | the model used, and its reasoning effort where applicable; "Unknown" when nothing could be observed |
| **Device** | machine name, or "machine name unavailable"; a truncated 8-character device identifier is always shown, hover reveals the full identifier |
| **Person** | see the attribution rule below |
| **Last activity** | with the start time of the exchange |
| **Messages** | prompts + responses exchanged |
| **Attachments** | amber badge "With a file" — a document sent with the conversation |
| **Action** | red badge "N blocked", amber badge "N redirected", otherwise observed status |
| **Sensitivity** | Enterprise only (see below) |

![Milvago - The table](/img/docs/en/monitoring-conversations-03.png)

### The person attribution rule

The Person column applies the same rule in the list, in the filter and in the detail, and the formula is honest about what it knows:

1. A **verified OIDC association** names the person, with the mention "Verified person".
2. Failing that, the **OS account** behind the browser or the tool is displayed *for information only* — and said as such. For a native tool, it is the profile collected by the application.
3. Failing that, if the server knows a person exists without saying who (pseudonymity), the cell reads "Pseudonymised"; with no lead at all, "Unattributed". The word "Unattributed" does not denote a masked account: it denotes the total absence of a lead.

A tool present on a device never allows inferring its user.

## The thread of a conversation

Opening a conversation unfolds a full-screen dialog: summary of the exchange (person, tool, model, start, last activity, number of messages) at the top, then the messages rendered from oldest to newest, as the exchange took place.

![Milvago - The thread of a conversation](/img/docs/en/monitoring-conversations-04.png)

- The thread **loads by pages**: "Load earlier messages" goes back in time. Each page is an independent request — if an identity reveal right expires, later pages no longer carry the revealed data, instead of a buffer that would keep it beyond its expiry.
- The message text is **plain** text, selectable and copyable, never rewritten or interpreted. A click on the bubble opens its detail, unless text is being selected (otherwise highlighting to reread would open a dialog on release); the focused bubble also opens with Enter or Space, and its small detail icon remains keyboard accessible.

### What a bubble shows

- **HIDDEN REQUEST / HIDDEN RESPONSE**, with the cause named: "reading not authorized" (missing right), "text not retained" (text collection is disabled or the content was purged), "identity not revealed".
- The **attachments** are listed with an icon per type — read from the file name extension, the only information available: no file byte is ever read.
- A send **accompanied by a file** produces two records (the file goes to the provider as soon as it is attached); on display, the attachment joins the bubble of its message — a display fold only, each record keeping its timestamp and its detail.
- A **blocked** bubble carries the reason of the refusal, named and not raw: "Model denied by policy", "Model could not be identified", "Local control unavailable".
- The **navigations** appear as landmark lines in the thread, clickable to their detail.

![Milvago - What a bubble shows](/img/docs/en/monitoring-conversations-05.png)

### The detail of a record

The detail concerns only one direction — a send **or** a response — and its title names it. It gathers: timestamp, person, device, source (browser or local application), service and model, action, refusal reason where applicable, platform, character count, detected categories, attachments, applied policy revision, URL, conversation and correlation identifiers.

The stored text, if any, is displayed with the notice **"This content read has been audited."**: every consultation of a stored text is traced. Without an explicit reading right, the screen shows a box saying so instead of an empty frame.

<img className="mv-doc-image--compact" src="/img/docs/en/monitoring-conversations-06.png" alt="Milvago - The detail of a record" />

## Exports and pagination

- The **exports** contain the metadata corresponding exactly to the current filters; any texts require an explicit reading right, and every consultation is audited. The mention appears under the table, not buried in a disclaimer.
- The **pagination** is numbered (first and last pages always reachable, ellipsis on jumps) with a page-size selector at the top right and the total result count. At zero results, the screen suggests widening the period or removing a filter.

![Milvago - Exports and pagination](/img/docs/en/monitoring-conversations-07.png)

:::enterprise

The filter and the column of **usage sensitivity** are reserved for Enterprise: Community never displays them, in the log as in the map. In Enterprise, a sensitive event carries an amber badge, and masked contents carry the labels of the masking rules that detected them.

:::
