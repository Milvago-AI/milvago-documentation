---
sidebar_position: 2
title: Roles
---

# Roles

## Open the page

In the sidebar, click **Administration**, then **Roles**. You need `roles.manage` to see the screen — among built-in roles, only the Owner has this permission. Creating, editing or deleting a role, and listing who holds one, go further still: the server requires the Owner role itself.

1. Click **New role**.
2. Enter its name and select the permissions to grant.
3. Click **Save**.
4. Verify that the role appears in the list with the selected permissions.

The Roles screen answers the question "**who is allowed to do what**". It defines the organization's roles and, for each of them, the set of permissions it grants. Access requires the `roles.manage` permission — among the built-in roles, only the Owner carries it; without it, the screen shows "Owner access required". Managing roles is reserved to the Owner role by name, not merely by permission: the server checks that the caller's role is `owner`, so `roles.manage` is no longer offered when building a custom role — granting it to one would have no effect.

## The principle: permissions, not labels

Authorization is carried by **permissions** verified by the server on every call, never by the name of a role. A role is only a named set of permissions: giving it a flattering name grants it no extra rights, and an edition declared by the client never grants authorization.

The permissions of the catalog, and their label in the console:

| Permission | Label |
| --- | --- |
| `overview.read` | Overview |
| `events.read` | Events & cartography |
| `devices.read` | View devices |
| `devices.manage` | Manage devices |
| `members.read` | View members |
| `members.manage` | Manage members |
| `roles.manage` | Manage roles |
| `settings.manage` | Manage settings |
| `policy.manage` | Manage policy (Shadow AI) |
| `installers.manage` | Manage installers |
| `content.read` | Read content |
| `content.purge` | Purge retained content |
| `audit.read` | Audit log |
| `organizations.manage` | Manage organizations |
| `directory.manage` | Manage LDAP directory and SSO |
| `reports.aggregate` | Read aggregated reports |
| `identity.reveal` | Reveal identities |
| `identity.erase` | Erase identities and renew aliases |
| `observability.manage` | Manage observability (Enterprise only) |

![Milvago - The principle: permissions, not labels](/img/docs/en/administration-roles-01.png)

## Built-in and custom roles

Four built-in roles exist in every organization, carried with the "built-in" mention and in read-only:

- **Owner** (`owner`): all the permissions of the catalog.
- **Administrator** (`admin`): the operating permissions — overview, events, devices (view and manage), members (view and manage), settings, policy, installers, content (read), and aggregated reports — without `roles.manage`, `observability.manage`, `content.purge`, `audit.read`, `organizations.manage`, `directory.manage`, `identity.reveal` or `identity.erase`.
- **Viewer** (`viewer`): overview, events and devices in read, and aggregated reports.
- **Reporter** (`reporter`): overview and aggregated reports only, the narrowest built-in role. Unlike the first three, `reporter` has no dedicated display name yet: role pickers show it as the raw name "reporter".

The "New role" button creates a custom role: a name, and the permissions checked one by one. At creation as at editing, nothing is pre-checked — a role starts without authorization and widens deliberately. A name already taken is reported before saving.

Built-in roles are not modified; custom roles carry "Edit" and "Delete", the latter disabled on your own role ("You cannot delete the role you currently hold.").

![Milvago - Built-in and custom roles](/img/docs/en/administration-roles-02.png)

## Deleting a role still assigned

A deletion refused because members still hold the role opens a dedicated dialog: "The role "…" cannot be deleted while it is assigned. Reassign or remove the members below, then retry the deletion." It lists the holders and offers two ways out, without leaving the page: **Reassign** each member to another role, or **Remove access**. As long as members hold the role, the "Delete role" button stays blocked ("Members still hold this role."); with no holder left, it opens.

A member without the member-management right sees the list of holders but not their actions, with the notice that refers them to a member manager.

:::enterprise

In Enterprise, the member list of a role and the reassignments cover the current organization only; the role itself remains specific to each organization. The `organizations.manage` (organization tree) and `directory.manage` (LDAP directory) permissions only serve in multi-organization setups.

:::
