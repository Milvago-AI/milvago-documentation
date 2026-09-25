---
sidebar_position: 4
title: Privacy
---

# Privacy

## Open the page

In the sidebar, click **Administration**, then **Privacy**. You need `settings.manage` to change settings; with only the identity-erasure permission, only alias rotation is available.

1. Change the relevant settings.
2. Enter a reason of at least 8 characters.
3. Click **Save** and complete MFA verification when requested.
4. Back in the console, verify that the new values are displayed; they are applied without re-entering the fields.

The Privacy screen answers the question "**how far the platform identifies people**". It sets pseudonymization by default, the aggregation of reports, the retention of identity links and the publisher shares. Access requires the `settings.manage` permission ("Manage settings"); an account that only carries the right to erase an identity sees here the alias rotation only.

Every change requires a **written reason** of at least 8 characters — "This reason is kept in the audit log." — and a **recent multi-factor authentication**: when it is missing, the server refuses and the console redirects to the verification, then applies the change on return without asking to re-enter it.

[IMAGEAMETTREICI 01]

## The settings

- **Pseudonymous by default** — shows an alias by default in individual views. An authorized identity reveal can still be possible.
- **Aggregate reports only** — enables aggregate reports and disables individual access to usage.
- **Aggregation threshold** — from 1 to 100: report groups below the distinct-person threshold are hidden.
- **Identity link retention days** — from 7 to 365 days for the person-to-event association; after that, identity reveal is impossible.
- **Reason for extended retention** — justifies event retention set in Settings beyond 180 days. It is required above that duration and does not change it.
- **OIDC team claim** — the exact OIDC team claim name, not a team name; it distributes reports.

:::enterprise

**Enforce for child organizations** — a parent organization can enforce only pseudonymization, aggregate mode, the threshold and identity link retention across its descendants. Sharing and alias rotation remain specific to each organization. The enforced fields are locked in child organizations.

:::

[IMAGEAMETTREICI 02]

## Rotating the aliases

An alias links events from the same person without showing their name. Rotation changes the aliases of **the currently selected organization**, for example after a pseudonymous export has been shared. It does not propagate to child organizations or delete events.

The **alias rotation** recalculates the pseudonyms of all people and revokes the active identity reveals. It requires the identity-erasure right, a written reason, and carries its own warning: "Recalculate aliases and revoke active reveals. Rotation does not guarantee anonymity; previously exported data and correlations remain possible." The confirmation reads "Aliases recalculated: N. Active reveals revoked."

## Identity lift, elsewhere in the console

Rotation is only one side of the balance: an identity is **lifted** from the detail of a conversation (15 minutes, mandatory reason, audited read) and **recomposes** itself alone at the expiry of the identity links. See [Conversations](../monitoring/conversations.md).

## Publisher sharing

Any account with `settings.manage` sees the **Publisher sharing** panel. It lets the account choose separately:

- **Automatically import the publisher catalogue** — imports the signed catalogue when a connection is configured. This choice appears only for the root organization and applies to the whole instance. It does not send telemetry on its own.
- **Share detector health** — organization-specific consent that shares aggregate detector status by provider and revision, without conversation text.
- **Share fleet counts** — organization-specific consent that shares only counts of enrolled devices active in the last 30 days, without device names.

Previews and statuses are reserved for the instance owner.

See [Connect to the publisher service](../avance/service-editeur.md) for server configuration.
