---
sidebar_position: 5
title: Organizations
tags: [Enterprise]
---

# Organizations

## Open the page

Click **Administration** > **Organizations** in the sidebar. This Enterprise-only page requires `organizations.manage` to create, rename, or delete.

1. Click **New organization**.
2. Complete the name, parent, and MFA option.
3. Confirm the creation.

:::enterprise

This page only concerns the Enterprise edition. In Community, the organization is unique and this navigation entry does not exist.

:::

The Organizations screen answers the question "**which organizations I see, and which I govern**". Organizations are the isolation roots of the platform: devices, policies, conversations, members and inventory exist only within an organization, and isolation is provided by **PostgreSQL Row-Level Security** at the row level, not by an application-level filter.

## The organization selector

The sidebar carries, above the navigation, the organization selector: the current organization as a button, and a side panel "Choose an organization" that draws the tree — "Child organizations are grouped under their parent organization." Each entry carries its name and your role in the organization; the current organization is marked with a check. The accessible organizations whose parent is not are listed at the root of the panel.

![Milvago - The organization selector](/img/docs/en/administration-organisations-01.png)

## The organization list

The screen lists the "Accessible organizations": name ("Root" badge for the root, "Current" for the session's), identifier, parent, and actions. An organization without access reads "No accessible organizations".

With the `organizations.manage` permission ("Manage organizations"), the screen gains checkbox selection and the actions:

- **New organization** — a name, a **parent organization** (among those where you are owner), and a "Require multi-factor authentication for all members" switch, not changeable after creation. The creation notice carries the access rule: "Members of a parent organization can access child organization data according to their permissions." Creating an organization makes you its owner: you must therefore hold every permission of the Owner role in the parent organization; a custom role or API key that only has "Manage organizations" is refused. Organizations nest up to twenty levels deep, including the root.
- **Rename** — any accessible organization.
- **Delete** — one, or "Delete selected" for a batch. The server refuses the deletion of the current organization, of the root, and of an organization that still has children ("Delete its child organizations first (or select them together)."). A batch deletion orders the targets from the deepest to the least deep, to empty each parent of its selected children before removing it. The confirmation names the irreversible: "This permanently deletes the following organizations and all their data (members, roles, devices, events). User accounts are not deleted." Deleting requires a second factor verified moments ago; the console redirects to the verification and replays the deletion on return. While the organization still holds retained request/response text, deleting it also requires the right to purge content (`content.purge`, owner-only by default); otherwise the server refuses with "This organization still has retained prompt text: deleting it requires the right to purge content."

Acting on another organization from this list — renaming it, deleting it, or rotating its deployment key — requires that your sign-in carries multi-factor authentication whenever that organization requires it of its members: the same rule as switching into it. Creating an organization writes an audit entry in the parent organization's log **and** one in the new organization's own log; deleting one is recorded only in the parent's log; a rename is recorded in the renamed organization's log.

![Milvago - The organization list](/img/docs/en/administration-organisations-02.png)

## The page of an organization

Every row opens the page specific to the organization: "The organization's identity and the deployment means that belong to it."

- **Details** — identifier, parent organization ("None — root organization" for the root, link to the parent otherwise) and your role in it.
- **Deployment key** — with `installers.manage`, the panel of the key specific to this organization. It exists so that an administrator of a parent can rotate or revoke the key of a child **without switching to its context**. See [Deployment](deploiement.md).

![Milvago - The page of an organization](/img/docs/en/administration-organisations-03.png)
