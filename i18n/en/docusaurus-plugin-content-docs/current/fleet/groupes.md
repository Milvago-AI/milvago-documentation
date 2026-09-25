---
sidebar_position: 2
title: Device groups
---

# Device groups

## Access this screen

In the sidebar, click **Fleet**, then **Groups**. It requires `devices.read` and is unavailable to aggregate-only readers.

1. With `devices.manage`, click **New group**, enter the required name and optional description, then create it.
2. Open its name, click **Add devices**, select devices and confirm **Add (N)**. A device in another group moves to this group; failures are reported per device.
3. From the record, rename, remove, or delete and confirm. With `policy.manage`, open **Group policy**, save the required sections, and wait for the next sync. Usage sensitivity is shown only in Enterprise.

Device groups carry a common Shadow AI policy to several devices at once. They answer the question: how to apply the same derogation to a set of machines without retyping it device by device.

The information line under the title carries the two reading rules: "A group applies the same Shadow AI policy to all the devices it contains. A device's own derogation always wins over its group."

[IMAGEAMETTREICI 01]

## Who sees what

| Action | Condition |
| --- | --- |
| See the groups and their pages | `devices.read` right |
| Create, rename, delete, assign devices | `devices.manage` right |
| Set the group policy | `policy.manage` right |

Groups exist in both editions: a group is a fleet organization tool, not an inventory function.

## The policy chain

The effective policy of a device reads across three layers: **device > group > organization**. A group only overrides the sections it defines; the sections left in inheritance follow the organization. The derogation closest to the device wins: a device's own derogation wins over its group.

A device belongs to **only one group** at a time — no priority between groups to arbitrate. Removing it from a group returns it to the organization policy, and its history is preserved.

## The group list

The table carries four columns:

| Column | Content |
| --- | --- |
| **Name** | clickable to the group page |
| **Description** | free text, or "—" |
| **Devices** | number of member devices |
| **Actions** | "Rename" and "Delete" for those with the management right; "—" otherwise |

A counter displays the number of groups. Failing any group, the screen reads "No device groups".

The "**New group**" button opens a two-field dialog: **Group name** (required) and **Description**. Two names do not differ by case only, and the description stays short — both bounds are checked on save.

[IMAGEAMETTREICI 02]

## The group page

The page opens from the group name in the list. It carries two tabs: **Information**, always present, and **Group policy** with the `policy.manage` right.

### Information

The Information card gathers the group identifier, its description and its device count. Below the card, the member device table repeats the columns of the device list — Device (clickable to its page), Platform, Status, Last contact — plus the "**Remove from group**" action, which returns the device to the organization policy.

The table offers 10, 20, 50, 100 or 200 devices per page and keeps the first, last and neighbouring pages within reach.

[IMAGEAMETTREICI 03]

### Assign devices

The "**Add devices**" button opens a side panel listing the organization devices that do not yet belong to the group. Each row carries a checkbox, and a device already a member of another group displays that group's name: moving it is a change to see before committing it. The confirmation button carries its count — "Add (N)" — and stays inactive until something is checked.

This panel uses the same pagination; checked devices remain selected when changing pages.

Two empty states are stated as they are:

- no member device: "No device in this group";
- no candidate left: "All devices already belong to this group."

Assignment sends one request per device: a refusal is reported device by device ("Update impossible for: …") instead of interrupting the others. Reassigning to a device the group it already carries rewrites nothing.

Assigning a device to a group whose policy retains request and response text requires the same fresh second-factor verification as enabling it in Shadow AI.

### Group policy

The tab carries the **group derogation**. The editor is the same as [Shadow AI](../administration/shadow-ai.md), restricted to the sections a group can override: **Enrollment & collection**, **Services**, **Protections**, **Local masking**, and in Enterprise **Usage sensitivity**. The sections left in inheritance follow the organization — the "Inherit" checkbox names it.

The section header displays the scope ("Group derogation") and the current revision. Each save produces a new revision; the installations receive it at their next synchronization, and the effective application is observed in Monitoring.

[IMAGEAMETTREICI 04]

## Revisions and no-rollback

Each change on the group side — policy save, assignment, removal, deletion — produces a newer revision, and the effective policy of a device inherits it. A device never applies a revision older than the one it holds: moving from one group to another, then back, only grows. This rule prevents a device from being blocked on a policy outdated by an unfavorable set of dates.

## Delete a group

The confirmation carries the exact consequence: "The devices of a deleted group return to the organization policy. Their history is preserved." The devices are detached first — each receives a fresh revision — then the group disappears with its policy. The group's device count appears in the confirmation. Deleting a group whose devices would then start retaining request and response text — the organization retains it, the group did not — requires the same fresh second-factor verification as assigning a device to such a group.

[IMAGEAMETTREICI 05]

See also: [Devices](postes.md), [Shadow AI](../administration/shadow-ai.md).
