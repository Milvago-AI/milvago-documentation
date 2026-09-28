---
sidebar_position: 1
title: Devices
---

# Devices

## Access this screen

In the sidebar, click **Fleet**, then **Devices**. It requires `devices.read` and is unavailable to aggregate-only readers.

1. With `installers.manage`, click **Download agent**, choose Windows ZIP or Linux RPM, install it, return here and click **Refresh**. Approve a pending device with `devices.manage` to make it active when the enrollment rule permits it.
2. Open a device name, then choose **Details**, **Device policy**, or, in Enterprise with `events.read`, **Local tools**. To change its group, click the group tag (or **No group**) and select the target; the revision applies at the next sync.
3. **Approve**, **Revoke**, and **Delete** require `devices.manage` and confirmation. Select several rows then **Delete (N)** for bulk deletion; failures are reported per device.

The **Devices** screen lists the devices enrolled with the server and answers the question: which devices report information, and which still have the right to do so. It is located in the **Fleet** section of the navigation, with [Device groups](groupes.md).

The information line under the title states the agent scope, according to the edition:

- **Community**: "The Community agent covers browser usage. Installed application inventory is not included. Pending or revoked devices cannot submit events."
- **Enterprise**: "The Enterprise agent covers the browser and the targeted tool inventory. Pending or revoked devices cannot submit events."

![Milvago - Access this screen](/img/docs/en/fleet-postes-01.png)

## Who sees what

| Action | Condition |
| --- | --- |
| See the list and the pages | `devices.read` right, and not an aggregate-only consultation |
| Download the agent | `installers.manage` right |
| Approve, revoke, delete | `devices.manage` right |
| Change a device's group | `devices.manage` right |
| Set the device policy | `policy.manage` right |

## The device list

The section is titled **Registered devices**, with the reading rule "One revocable identity per device": each device holds its own identity, which the console can revoke individually. A counter displays the number of devices matching the filters.

The **Per page** selector offers 10, 20, 50, 100 or 200 devices. Filters apply to the entire fleet before pagination, and the numbered controls provide access to the first, last and neighbouring pages.

The filter bar only appears if there is at least one device. It carries three cumulative criteria:

- **Device name** — contains the entered text;
- **User** — contains the entered text, on the reported OS account;
- **System** — dropdown of the platforms actually present in the fleet ("All systems" by default).

![Milvago - The device list](/img/docs/en/fleet-postes-02.png)

Table columns:

| Column | Content |
| --- | --- |
| **Device** | machine name clickable to its page, or "Machine name unavailable"; the first characters of the identifier appear below |
| **User** | logged-in OS account, or "—" until something has been reported |
| **Group** | tag clickable to the group, or "—" |
| **Platform** | device system, with the agent version in the detail |
| **Status** | **Pending**, **Active** or **Revoked** badge |
| **Last seen** | timestamp of the last report |
| **Actions** | "Approve" (pending device) and "Revoke" (non-revoked device) for those with the right; "—" otherwise |

Two distinct empty screens, which do not say the same thing:

- no device at all: "**Your first device awaits you**" — "Download the Windows ZIP containing the MSI, script and provisioning file, or the Linux RPM. The device appears automatically after installation and connection.";
- no device matching the filters: "**No device matches**" — "Change the search criteria."

## Download the agent

The "**Download the agent**" button opens a download-only dialog: it creates nothing, the organization already holds a deployment key. Three safeguards, in code order:

1. **Public URL confirmed**: without it, the dialog displays a warning box — "Set and confirm the public HTTPS URL in Administration → Settings before downloading an installer. Agents will connect to that URL." — or requests the intervention of an owner when the URL cannot be edited.
2. **Active deployment key**: if the key has been revoked, the box "No active deployment key" invites you to rotate it in Administration → Settings.
3. **Approval mode announced before the download**:
   - manual approval — amber box "Manual approval is on": "Every installed device will appear as pending and will report nothing until you approve it in Devices." A pending device receives no policy: from the moment the agent is installed, and until approval, **no access to AI platforms** is permitted on that device — the extension fails closed and seals the covered AI surface, rather than leaving it open by default;
   - approval by network — "Approval depends on the network": "A device installed from an allowed network reports immediately; the others stay pending approval."

The dialog offers **Windows ZIP** (one download containing the MSI, installation script and this organization's provisioning JSON) and **Linux RPM** (systemd service for the whole device). If your account uses a second factor, the Windows ZIP is only served when that factor was verified in the last 5 minutes; otherwise the console asks for it again, then the download resumes automatically. An account without a second factor downloads directly, and an API key can never download the ZIP. The Linux RPM asks for no new verification and still carries the deployment key. After installation, the device enrolls once and keeps its state in an encrypted cache. The downloaded version is shown under the tile.

The MSI inside each Windows ZIP is identical for every organization; the provisioning JSON is specific to this organization. Protect the ZIP and JSON. Rotating the deployment key invalidates earlier Windows provisioning files and Linux RPMs, while enrolled devices remain active.

![Milvago - Download the agent](/img/docs/en/fleet-postes-03.png)

## The device page

Opening a device in the list displays its page. The information line under the title summarizes the content: "Revocable device identity, overrides and local observations."

The page actions depend on the status: "Approve" on a pending device, "Revoke" on any non-revoked device, "Delete" in all cases for those with the right. Tabs are added when their conditions are met:

- **Details** — always present;
- **Device policy** — `policy.manage` right, in both editions;
- **Local tools** — Enterprise, with an analyst access.

![Milvago - The device page](/img/docs/en/fleet-postes-04.png)

### Details

| Field | Content |
| --- | --- |
| **Identifier** | unique identifier of the device, in a monospaced font |
| **Platform** | system reported by the agent |
| **Agent** | version of the installed agent |
| **Update** | "To update", "Pending", "Applied" or "Unavailable" badge, with the date of the last report when it exists |
| **Logged-in user** | OS account at the time of the report, or "Not reported" |
| **Declared domain** | machine domain declared at enrollment and its kind (Active Directory, Entra ID, Linux realm), or absent if the device declared none — the case for agents older than version 0.5.45 |
| **Group** | assignment tag, detailed below |
| **Native collectors** | Enterprise only: status of each inventory collector, version, last success, ignored trees and detected managed configuration changes |
| **Browser extensions** | live presence of the extension per browser, detailed below |
| **Status** | Pending / Active / Revoked |
| **Last seen** | timestamp |

#### A device's group

The Group line reads in two steps. Closed, it shows the current assignment — the group tag, clickable to its page, or "No group" — followed by the "Open the group" link. A click on the tag turns the line into a select list: one tag per group of the organization, plus "No group" to detach the device. Clicking the group already carried closes the line without saving anything.

#### The browser extensions

A browser is presented as **active** only if its extension talked to the agent recently; any older contact is dated ("Silent since" with the date) rather than presented as present. The rule separates two situations the User column cannot distinguish: an extension disabled by the user, and a device that simply does not use AI tools. Failing any report, the line reads "No extension reported".

### Device policy

The tab carries the **device override** of the organization policy — or of its group's. The editor is the same as [Shadow AI](../administration/shadow-ai.md), restricted to the sections a device can override: **Enrollment & collection**, **Services**, **Protections**, **Local masking**, and in Enterprise **Usage sensitivity**. The sections left in inheritance follow the group if there is one, otherwise the organization — the "Inherit" checkbox names the screen the section is inherited from.

The section header displays the scope ("Device override") and the current revision. Each save produces a new revision, distributed to the devices at their next synchronization; the effective application is observed in Monitoring.

:::enterprise

The **Usage sensitivity** section only exists in the editor if the edition serves that capability: without it, the section is not displayed at all, rather than an unusable grid.

:::

![Milvago - Device policy](/img/docs/en/fleet-postes-06.png)

### Local tools

:::enterprise

This tab only exists in Enterprise, for an analyst access. It lists the local applications observed on this device by the inventory module: tool, type of observation (process, executable, installation, extension, port), first and last observation.

Two reading rules, owned by the screen itself:

- the observations "do not prove the use of a tool";
- "a detected local presence is distinct from a browser event or from a prompt sent" — an installed application is not a usage.

Failing any observation, the screen states it: "No local tool reported", and the observations of the inventory module will appear here.

:::

## Approve, revoke, delete

Three different actions, not to be confused:

- **Approve**: grant access. Reserved for the pending device; the device moves to the active state and starts transmitting.
- **Revoke**: cut access while keeping the history. The confirmation states it: the device "will lose access to event submission and new policies. A new enrollment will be required to restore access."
- **Delete**: go further than revocation, permanently. The confirmation carries the full text: "Deletion removes the device identity: it immediately loses the right to report, exactly as if revoked, and its agent drops its local queue. It is permanent and goes further than revocation: the device disappears from the console along with its events, its policy override and its local observations. Revocation stops reporting but keeps the history." Deleting a device requires a second factor verified moments ago and is never available to an API key, because deletion erases its whole history — events and any retained request/response text included. While the device still holds retained text, deleting it also requires the right to purge content (`content.purge`, owner-only by default); otherwise the server refuses with "This device still has retained prompt text: deleting it requires the right to purge content."

![Milvago - Approve, revoke, delete](/img/docs/en/fleet-postes-08.png)

Deletion also works in bulk: checking several devices in the list displays the "Delete (N)" button, and the confirmation lists the names (ten displayed, then "and N others"). Each device is deleted by its own request: a failure is reported device by device ("Could not delete: …") instead of interrupting the whole selection, and the successes are counted apart.
