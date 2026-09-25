---
sidebar_position: 1
title: Members
---

# Members

## Open the page

In the sidebar, click **Administration**, then **Members**. You need `members.read`; inviting, importing, or changing a member also requires `members.manage`.

1. Click **Invite member**.
2. Enter their email address, then choose their role and console language.
3. Send the invitation. The identity provider completes the process and the member appears once affiliated.

The Members screen answers the question "**who can enter** this organization, and with which role". It lists the members visible from your organization — including, in Enterprise, those of the child organizations of your subtree — and carries the affiliation actions: invitation, role change, language change, access removal.

Access requires the `members.read` permission; without it, the navigation entry does not exist and the screen shows "Access restricted".

[IMAGEAMETTREICI 01]

## The members table

Each row is a member, with its columns:

The **Per page** selector offers 10, 20, 50, 100 or 200 members. The counter covers all visible members, and the numbered controls provide access to the first, last and neighbouring pages.

| Column | Content |
| --- | --- |
| **Member** | displayed name, or "—" when there is none |
| **Email address** | the account address |
| **Role** | badge of the current role (`owner`, `admin`, `viewer` or a custom role) |
| **Type** | provenance of the identity: "Local", "SSO" or "LDAP" |
| **Language** | the member's console language, or "Default" |
| **Organization** | name of the affiliation organization, or "—" |
| **Actions** | see below |

[IMAGEAMETTREICI 02]

When empty, the screen reads "No visible members": this describes what your rights let you see, not an organization without users.

## The per-member actions

The three actions appear only if you carry `members.manage` ("Manage members"), the member belongs to the current organization, it is not your own account, and — for an owner — you are yourself an owner of the organization. Otherwise the cell shows a lock with, on hover, the exact reason: "This is you: you cannot change your own access.", "Owner: only an owner can change this member.", or "Switch to this organization to manage this member." These same actions also require that your own permissions cover every permission of the member's current role — the same rule as granting a role; an API key is bound the same way by its own permissions.

- **Change role**: the new role applies after a new sign-in, and the member's current sessions are invalidated. The list of proposed roles omits "Owner" if you are not an owner.
- **Change language**: the language applies the next time this member opens the console; "Default" follows their browser language, or English when it is not served. Their sessions stay open.
- **Remove access**: the member loses access to this organization and their sessions are invalidated; their identity at the sign-in provider is retained. On your own account, a warning precedes the confirmation.

:::enterprise

A person who reaches this organization through its parent organization (inherited access) can be invited, imported, re-assigned or removed here only by someone who manages the members of the parent organization; otherwise the server refuses with "This person's access comes from the parent organization; manage it there."

In Enterprise, an account that already belongs to another organization — one that yours does not contain and that does not contain yours, such as a sibling organization — cannot be invited or imported here: the server refuses with "This account belongs to another organization. Invite it from an organization that contains both." For such a person, the console language can only be changed by the person themselves, from their profile.

:::

[IMAGEAMETTREICI 03]

## Inviting a member

The "Invite a member" button opens a dialog with three fields: email address, role (same omission rule for the Owner role) and console language. The invitation is sent by the identity provider; the footer note says so and recalls its conditions:

- Identities and invitations are managed by Keycloak. Sending an invitation requires working SMTP configuration.
- SSO and LDAP accounts invited by email receive none; access activates at their first sign-in.

## Importing from the directory

When an LDAP directory is configured for the organization, a second button appears: "Import from directory". It opens a search over the directory, and the import creates the member with the chosen role. The import requires `members.manage` and a directory reachable over LDAPS or verified StartTLS; a directory account without an email address is refused.

The directory itself is configured in [Settings](parametres.md).
