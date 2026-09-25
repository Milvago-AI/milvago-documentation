---
sidebar_position: 3
title: Shadow AI
---

# Shadow AI

## Open the page

In the sidebar, click **Administration**, then **Shadow AI**. You need `policy.manage`.

1. Select the rule section in the vertical navigation.
2. Change the relevant fields.
3. Click **Save changes**. The Draft badge disappears and the confirmation states that installations receive the new revision at their next synchronization.

The "Shadow AI administration" screen carries the **policy applied to AI usage**: what is collected, which services are observed, blocked or redirected, what is masked on the way out of the device, what Discovery is allowed to name. It answers the question "**which rules do my devices apply**". Access requires the `policy.manage` permission ("Manage policy (Shadow AI)").

The line under the title sets the frame: "Collection, protection and operations in one consistent policy." The policy is **signed and revised** — every save produces a new revision, distributed to the installations at their next synchronization; a device never applies a revision older than its own.

## The sections

A vertical navigation splits the screen, numbered in the order of the policy:

1. **Enrollment & collection** — how a device obtains the right to report, and what collection keeps.
2. **Services** — the covered services and their behavior; in Enterprise, model controls.
3. **Protections** — blocking of attachments and protected words.
4. **Local masking** — replacement of detected data before anything is sent.
5. **Usage sensitivity** — Enterprise only; the section does not exist elsewhere.
6. **AI platforms** — what Discovery reports, at the organization level.
7. **Operations** — signed updates and pilot fleet, under the diagnostic flag.

Every save reads "Configuration saved. Installations will receive it at their next synchronization." As long as fields change, a "Draft" badge signals the unsaved state.

[IMAGEAMETTREICI 01]

## Enrollment & collection

### Device approval

"Choose how a new installation receives permission to report." Three modes:

- **Manual approval** — every installed device appears as pending and reports nothing until approved in Devices.
- **Automatic approval** — the device reports as soon as it enrolls.
- **Allowed networks and domains** — a list of rules, up to 50 (**Add rule** / **Delete rule**). Each rule carries a required **Network (CIDR)** and an optional **Machine domain (optional)**. A device is approved automatically when its connecting address, as seen by the server, is inside a rule's network and, when the rule names a domain, the machine declared that domain at enrollment.

  A request received behind a reverse proxy, an Ingress or a Gateway — carrying a `Forwarded`, `X-Forwarded-For` or `X-Real-IP` header — is never approved by network: the device waits for manual approval in Devices. Behind such an intermediary, use manual or automatic approval instead.

  Declared domains: an Active Directory DNS domain (Windows joined to an AD), an Entra ID tenant ID (Windows joined to Entra), or a Linux Kerberos realm (`realm join`, `default_realm` from `/etc/krb5.conf`). Matching is case-insensitive and exact, with no partial or suffix match.

  A domain never approves on its own: a rule always requires a CIDR, since the domain is declared by the machine itself and the server cannot verify it — someone holding the organization's installer on a machine outside the fleet could declare any domain. Rules written before this version (a plain network list) keep working as rules without a domain. Agents older than version 0.5.45 declare no domain: only domainless rules can approve them.

This section exists only at the organization level: neither a group nor a device redefines enrollment.

### Browser collection

- **Enable collection** — the usage in the browser. Turning it off stops new collection.
- **Retain request and response text** — "Off by default. Enabling requires a second factor verified moments ago, never an API key. Reading requires a separate permission." The console then redirects to the second-factor verification and replays the change on return. Text retention is bounded by "Text retention (days)", from 1 to 30. Turning content off stops new collection and removes queued text at the next policy refresh; it does not delete the metadata already received.
- **Retain submitted file names** — "Names only, never contents." They are collected where a file actually enters the composer — selection, drop, paste; a file added through a path the page does not expose stays invisible.

The section description carries the edition limit: "Community connects the extension to the open Rust bridge. Local application conversations remain an Enterprise capability."

[IMAGEAMETTREICI 02]

## Services

"The catalog and allowed domains come from the server. An enabled service does not imply exhaustive interface coverage." Each covered service carries:

- an activation switch;
- its domains, displayed as the catalog declares them;
- a **behavior**: Observe, Block, Redirect;
- when redirecting, a mandatory **redirect destination**.

:::enterprise

The Community package builds only the ChatGPT and Claude adapters: its factory catalog and its execution never name the other services. Enterprise covers nine providers — ChatGPT, Claude, Le Chat, Copilot, Gemini, NotebookLM, DeepSeek, Perplexity, Grok.

### Model controls

When the edition qualifies model controls, the Services section gains a "Model controls" block: "Service restrictions take precedence. These rules refine allowed or denied models for each platform." Each platform, per channel (Browser or Local application), carries a rule — "No restriction", "Allow all except listed", "Deny all except listed" — and, where applicable, a list of exact model identifiers: one identifier per line, 100 maximum, never approximated. "Unverifiable Unknown or Auto models are blocked while a restriction is active."

An "Applied device status" table lists, per device and platform, the state (Needs update, Pending, Applied, Unavailable), the expected revision and any reason: "Saved rules remain distinct from revisions actually applied." The device appears there under its real name for a reader holding `devices.read` outside aggregate-only reporting; other readers see the device alias. In aggregate-only reporting, the table only counts devices per platform, channel and state, without naming a device. Observing the name of the model that answered remains open to both editions; the decision to allow or deny a model is Enterprise.

System-level confinement (WFP on Windows, SELinux on Linux) only covers registered executables at their installed path. A copy of the executable placed elsewhere is not confined.

:::

[IMAGEAMETTREICI 03]

## Protections

### Attachments

**Block file uploads** seals the **measured** upload routes of the catalog (`kind:"file"`) — the URLs an upload actually triggers on the site, read on the spot and published in the signed catalog, never guessed. No heuristic on the method, the host or the body shape: three wrongful blocks are better than one intercepted legitimate upload. "Interception depends on the browser and supported interfaces."

### Protected words and phrases

"Detections are applied locally according to the signed policy." The block carries:

- **Protected phrases** — one phrase per line; do not put access credentials in a rule.
- Three match tiers, set separately: **Exact match**, **Unicode variants**, **Approximate match** (the latter can be Off).
- **Exceptions** — one per line; they reduce the detection coverage.
- **Message shown when blocked**.

[IMAGEAMETTREICI 04]

## Local masking

"Acts on the captured text, on the device, before anything is sent: each detected item is replaced by its label, for example [email]. Independent from usage sensitivity (dashboards) and from text retention." Two switches: **Enable masking**, and **Require review before sending**.

:::enterprise

The **built-in categories** — Email, Phone, IBAN, Payment card, Social identifier (France), Social Security number (United States), IP address — are an Enterprise capability. The network guard only retains what carries a prompt: a prompt route of the catalog, or a body shaped like a prompt — the composer has already stopped or masked the text at the source. The markers carry the **rule label** and a number per distinct value as soon as there are several: `[IP]`, or `[IP1]` and `[IP2]`.

:::

### Custom masking rules

Both editions define custom rules: a **label**, a bounded **regular expression** (without backreferences or lookaround — the server rejects unsafe patterns), **Enabled**, **Ignore case**. A label recognized by its own expression is reported and blocks the save: the label becomes the marker inserted into the masked text (`[LABEL]`, `[LABEL1]`…), and an expression that would capture it would mask its own markers on every pass, endlessly.

In Community, without built-in categories, the screen states it explicitly: "This edition ships no built-in detection patterns: define your own regular expressions under \"Custom masking rules\" below."

[IMAGEAMETTREICI 05]

:::enterprise

## Usage sensitivity

The section exists in Enterprise only when the edition qualifies sensitivity — otherwise it is not displayed at all, never empty. "Decides which detected categories mark an event as sensitive in the journal, the cartography and exports. Does not change the captured text: masking is configured under Local masking. Categories indicate sensitivity; they do not certify compliance."

Three blocks:

- **Browser usage sensitivity** and **Local application sensitivity** — the categories that mark an event as sensitive: personal data, plus Source code, Medical data and Keywords.
- **Medical terms** — "A text containing one of these terms receives the \"Medical data\" label. Case-insensitive substring search, on the device." One term per line, 100 at most, 60 characters each; an empty list means no detection.

Keywords come from the protected phrases of Protections.

:::

## AI platforms

This section is set **at the organization level**: Discovery is read there, and the platforms it is allowed to name are chosen there. It carries two distinct settings:

- **Discover candidate domains** — "When enabled, discovery inspects the bodies of in-memory requests locally to recognize their structure, without retaining them." The switch writes to the privacy settings: it requires `settings.manage`, a fresh MFA and a written reason of at least 8 characters, kept in the audit log. Off by default, the Discovery screen stays empty with the notice that refers here.
- **The list of known platforms** — grouped by category (General assistants, Coding assistants, Multi-model aggregators…), with search and the count "Platforms: N · hidden from Discovery: N". Unchecking a platform **hides it from Discovery**: "Presence only: these platforms are reported as reached, and nothing is read from their pages. Hiding one keeps recording the visits and removes it from Discovery, so showing it again brings its history back." Hiding does not traverse the signed catalog: it is a reading choice, not a detection change, and it produces no new policy revision.

A platform the edition already captures never appears in the list: the server only sends what this edition does not capture fully, and a captured platform cannot reach Discovery.

[IMAGEAMETTREICI 06]

## Operations

Under the diagnostic flag of the instance, the "Updates and pilot devices" section configures **signed updates**: activation, share of the pilot fleet, identifiers of pilot devices, paused versions. Without an announced signed delivery chain, the switch is inert with the notice "No signed update delivery chain is reported as operational." Turning it off carries its own warning: "Signed updates are off: agents stay on their installed version, including when a security fix is published."

A "Server-reported status" block shows the announced state and the signed versions available.

## Inheritance and derogations

The policy is read in cascade: **organization → device group → device**. At the organization level, every section can be **enforced** on the descendants that inherit; a group or a device can derogate section by section, the derogation closest to the device winning. See [Configuration inheritance](../introduction/heritage-configuration.md), [Device groups](../fleet/groupes.md) and [Devices](../fleet/postes.md).
