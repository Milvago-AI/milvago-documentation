---
sidebar_position: 5
title: Configuration inheritance
---

# Configuration inheritance

Milvago's Shadow AI configuration is read across three layers: **organization → device group → device**. Each layer only defines what it wants to change; an absent section is inherited from the layer above, and the derogation closest to the device wins.

[IMAGEAMETTREICI 01]

## The principle: sections, not blocks

The configuration is not a single block but a **list of sections**: enrollment, collection, services, protections, local masking, usage sensitivity, model controls, operations. Inheritance is set **section by section**:

- a section **defined** at a level applies to everything below;
- a section **left in inheritance** follows the layer above;
- a lower layer can rewrite a specific section without copying the others.

A group that only wants to change "Protections" therefore defines only that section: services, masking and the rest keep following the organization.

## What each level can define

| Level | Possible sections | Editing screen |
| --- | --- | --- |
| **Organization** | all, including Enrollment and Operations | Administration → Shadow AI |
| **Device group** | collection, services, protections, local masking, usage sensitivity, model controls | Fleet → Device groups |
| **Device** | the same six sections as the group | device page → Device policy |

Two sections remain organizational by nature: **Enrollment** (who can join, from which network) and **Operations** (agent updates). A group or a device can neither override nor weaken them — these are fleet decisions, not usage decisions.

A device belongs to only one group at a time: there is no priority to arbitrate between several groups. Removing it from a group returns it to the organization policy.

## Who sees the provenance

The editor displays the current scope ("Organization policy", "Group derogation", "Device derogation") and, for each inherited section, an "**Inherit · section name**" checkbox that names the screen the section comes from — the group on a device page, the organization on a group page. Provenance follows the **last writer**: a section inherited from the parent organization and then overridden by the group is attributed to the group.

[IMAGEAMETTREICI 02]

## Revisions, in order

Each save produces a **newer revision**, and the effective policy of a device adds up the revisions of its layers. A device never applies a revision older than the one it holds: moving a device from one group to another, then back, only grows. This **no-rollback** rule guarantees that no assignment manipulation can put a device back on an outdated policy — for example re-imposing a block that had been removed.

Reassigning to a device the group it already carries rewrites nothing: the revision does not move and the agent sees no change.

## The full chain in Enterprise

:::enterprise

In Enterprise, the chain counts one more layer **above** the organization: the **parent organization**. A child organization can mark sections "Inherit" and receive them from its parent — see [Parent and child organizations](organisations-mere-fille.md). The effective chain of a device becomes: parent organization → organization → group → device, always section by section, and provenance names the originating screen.

Two rules complete the picture:

- **usage sensitivity** only exists in the editor if the edition serves that capability — the section disappears rather than being displayed unusable;
- the depth of the organization tree is bounded: an ancestry that is too deep is refused rather than read indefinitely.

:::

## Who can write what

| Edition | Required right |
| --- | --- |
| Organization policy | `policy.manage` |
| Group policy | `policy.manage` |
| Device policy | `policy.manage` |

The right alone is not always enough: settings that expose content — enabling text collection, relaxing a privacy protection — require **fresh MFA authentication**, regardless of the level the change starts from.

See also: [Shadow AI](../administration/shadow-ai.md), [Device groups](../fleet/groupes.md), [Devices](../fleet/postes.md).
