---
sidebar_position: 6
title: Audit log
---

# Audit log

## Open the page

In the sidebar, click **Administration**, then **Audit log**. You need `audit.read`.

1. Click **Refresh**.
2. Verify that the table reloads, or that it reports no entries are visible.

The audit log answers the question "**who did what**" on the platform. It traces the administrative actions: role change, access removal, policy change, device deletion, key rotation, privacy change — the latter with the written reason that authorized it, shown in the **Reason** column.

Access requires the `audit.read` permission — among the built-in roles, only the Owner carries it; without it, the screen shows "Owner access required".

## The table

Every row carries five columns: **Date**, **Actor**, **Action** (dotted code, such as `directory.update` or `member.role`), **Target** (technical identifier, in monospace font), and **Reason** — the written reason that authorized a privacy change or an identity reveal, empty for every other action. When empty, the screen reads "No actions logged"; the "Refresh" button reloads the list.

![Milvago - The table](/img/docs/en/administration-audit-01.png)

## Append-only, by construction

The line under the title says it: "Append-only server log." It is not an interface policy, it is a database trigger: any change or deletion of an audit row is refused by PostgreSQL itself, hence unavoidable even by a compromised runtime role. An administrator cannot shorten the trace of their own actions.

**Retention** follows the same principle: the 730-day floor is engraved in the trigger, not in a setting. The automatic purges only touch rows older than that floor — retention is not configurable, and that is the purpose.
