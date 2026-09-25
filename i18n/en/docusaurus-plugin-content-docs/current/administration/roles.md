---
sidebar_position: 2
title: Roles
---

# Roles

## Open the page

In the sidebar, click **Administration**, then **Roles**. You need `roles.manage`; among built-in roles, the Owner has this permission.

1. Click **New role**.
2. Enter its name and select the permissions to grant.
3. Click **Save**.
4. Verify that the role appears in the list with the selected permissions.

The Roles screen answers the question "**who is allowed to do what**". It defines the organization's roles and, for each of them, the set of permissions it grants. Access requires the `roles.manage` permission — among the built-in roles, only the Owner carries it; without it, the screen shows "Owner access required".

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
| `observability.manage` | Manage observability |
| `settings.manage` | Manage settings |
| `policy.manage` | Manage policy (Shadow AI) |
| `installers.manage` | Manage installers |
| `content.read` | Read content |
| `content.purge` | Purge retained content |
| `audit.read` | Audit log |
| `organizations.manage` | Manage organizations |
| `directory.manage` | Manage LDAP directory |

[IMAGEAMETTREICI 01]

## Built-in and custom roles

Three built-in roles exist in every organization, carried with the "built-in" mention and in read-only:

- **Owner** (`owner`): all the permissions of the catalog.
- **Administrator** (`admin`): the operating permissions, without `roles.manage`, `audit.read`, `organizations.manage` or `directory.manage`.
- **Viewer** (`viewer`): overview, events and devices in read.

The "New role" button creates a custom role: a name, and the permissions checked one by one. At creation as at editing, nothing is pre-checked — a role starts without authorization and widens deliberately. A name already taken is reported before saving.

Built-in roles are not modified; custom roles carry "Edit" and "Delete", the latter disabled on your own role ("You cannot delete the role you currently hold.").

[IMAGEAMETTREICI 02]

## Deleting a role still assigned

A deletion refused because members still hold the role opens a dedicated dialog: "The role “…” cannot be deleted while it is assigned." It lists the holders and offers two ways out, without leaving the page: **Reassign** each member to another role, or **Remove access**. As long as members hold the role, the "Delete role" button stays blocked ("Members still hold this role."); with no holder left, it opens.

A member without the member-management right sees the list of holders but not their actions, with the notice that refers them to a member manager.

:::enterprise

In Enterprise, the member list of a role and the reassignments cover your subtree of organizations; the role itself remains specific to each organization. The `organizations.manage` (organization tree) and `directory.manage` (LDAP directory) permissions only serve in multi-organization setups.

:::
