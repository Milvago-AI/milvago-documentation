---
sidebar_position: 6
title: Parent and child organizations
tags: [Enterprise]
---

# Parent and child organizations

:::enterprise

This page only concerns the Enterprise edition, which allows several isolated organizations within a single instance. In Community, there is only a single organization.

:::

Milvago Enterprise hosts several organizations in a single instance: a **root organization**, and below it a tree of child organizations — the root has no parent, every other organization has one. Each organization keeps its own devices, events, policies and members; the tree organizes access and inheritance.

[IMAGEAMETTREICI 01]

## Creation path

1. Sign in to Milvago Enterprise with `organizations.manage` on the parent organization.
2. In the side navigation, open **Administration → Organizations**.
3. Select **New organization**.
4. Enter the name, choose the parent organization and, if needed, require multi-factor authentication for all its members.
5. Create the organization, then check that it appears below its parent in the tree.

## Creating a child organization

The **Organizations** screen lists the accessible organizations, the root first, and groups the children under their parent. The "New organization" dialog asks for:

- the **name** (required);
- the **parent organization**, chosen among the organizations where the creator is an owner — otherwise, the root;
- the option "**Enforce multi-factor authentication for all members**".

The creator becomes an **owner** of the new organization. The parent link is fixed at creation and no longer changes; an organization is moved by recreating it, not by re-parenting it.

Creation is authorized by the `organizations.manage` right held by the targeted **parent organization**, not by the current organization of the session. The child is operational immediately: its built-in roles are set, and its **deployment key** is issued as soon as it exists — it can enroll devices without any further configuration.

## Access flows down the tree

A membership grants access to the entire subtree:

- being a member (whatever the role) of an organization gives access to **all its child organizations**, at every level;
- the role applied in an organization is that of the **closest ancestry membership** — a direct membership wins over an inherited one;
- conversely, a child never accesses its parent: access only flows down.

The console lists the accessible organizations with the effective role in each, and switching organizations happens without a new login. An administrator of the parent can thus intervene in a child according to their effective permissions — for example rotate a child's deployment key from its page, without switching to it.

:::note
An API key is **pinned to the organization where it was created**: whatever the memberships of its creator, it never acts outside that organization, including on routes that name another organization in the URL.
:::

[IMAGEAMETTREICI 02]

## Data isolation

Isolation relies on **PostgreSQL Row-Level Security**: each query carries the context of one organization, and the rows of another organization are invisible — including for an account that would have rights elsewhere. Identifiers of another organization passed in a query answer "not found", with no difference between "does not exist" and "out of scope".

Deleting an organization takes its data down by cascade — devices, events, policies, groups — but not the user accounts, which are shared across organizations.

## What the parent enforces

Three settings flow down the tree, each with its own rule.

### The Shadow AI policy

A child organization can mark sections "**Inherit**" and receive them from its parent, section by section — including Enrollment and Operations, which groups and devices cannot touch. Provenance names the originating organization, and a section overridden lower down goes back to its real writer. See [Configuration inheritance](heritage-configuration.md).

### Privacy

:::note
Parental locking only enforces **protective** settings: pseudonymization by default, aggregate reports only, k-anonymity, identity linkage duration. A parent organization can never give its consent to a collection on behalf of a child.
:::

When the parent enables "**Enforce on child organizations**", the locked configuration is displayed as-is in the children with the mention "The configuration is locked." and its origin — the parent organization; the corresponding fields become inert.

### Observability exports

An organization can "**Enforce this configuration on child organizations**" for its export destinations. The child under enforcement reads "Configuration enforced by" followed by the name of the parent organization — it can neither customize it nor disable the export, and its earlier customization remains **stored but inactive** while the restriction applies. Without enforcement, the child can inherit voluntarily or keep its own configuration; the parent's secrets are never copied to the child.

[IMAGEAMETTREICI 03]

## Settings reserved to the root

Two instance settings can only be changed from the root organization, by an owner: the **public agent URL** (the one carried by the installers) and the **default language** of the console. A child organization reads them but does not change them.

## Deleting an organization

Three locks, in code order:

- the **current** organization of the session cannot delete itself;
- the **root** organization cannot be deleted;
- a **parent** cannot be deleted while it has children — the screen invites you to delete them first, or to select them together: mass deletion goes **from the leaves to the root**.

See also: [Configuration inheritance](heritage-configuration.md), [Organizations](../administration/organisations.md).
