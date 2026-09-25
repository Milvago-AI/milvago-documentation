---
sidebar_position: 9
title: Deployment
---

# Deployment

## Open deployment settings

There is no **Deployment** navigation entry. Click **Administration** > **Settings** > **Deployment key**; in Enterprise, you can also use **Administration** > **Organizations** > the relevant organization > **Deployment key**. You need `installers.manage`.

1. Click **Generate a key**, **Rotate**, or **Revoke**, according to the displayed state.
2. Read the warning describing the effect on installers already distributed.
3. Confirm the action.
4. Verify the state and last rotation date in the panel; enrolled devices are unchanged.

This page describes how **devices** are enrolled: the deployment key that authorizes the enrollment, the installers that carry it, and what happens to a device after its installation. For the installation of the platform itself (server, database, images), see [Installing the components](../installation/composants.md).

## The deployment key

"A random key unique to this organization, carried inside every installer downloaded. It is never displayed: it only ever buys a device enrollment, and each device then receives credentials of its own." The panel, in [Settings](parametres.md) — and in Enterprise, on the page of each [organization](organisations.md) — shows what exists, never the secret: state, creation, last rotation, installation count.

Three actions, each with its confirmation:

- **Generate a key** / **Rotate** — "A new installer will be required: every MSI and RPM already distributed stops installing new devices immediately. Devices already enrolled are unchanged."
- **Revoke** — "No installation will be possible in this organization until a new key has been generated. Devices already enrolled are unchanged."

In the keyless state, the screen states it: "No active key. No installer can enrol a device in this organization until a key is generated."

[IMAGEAMETTREICI 01]

## Downloading the agent

The download of the installers — Windows MSI, Linux RPM, both machine-wide services — is blocked as long as the **public HTTPS URL** is not confirmed in [Settings](parametres.md): "Set and confirm the public HTTPS URL in Administration → Settings before downloading an installer. Agents will connect to that URL."

The dialog recalls three things:

- "The package carries this organization's deployment key. After installation, the device enrolls once and keeps its state in an encrypted cache. Your administrator must also distribute the browser extension."
- Depending on the **approval mode** chosen in the Shadow AI policy: under manual approval, "Every installed device will appear as pending and will report nothing until you approve it in Devices."; under network-based approval, "A device installed from an allowed network reports immediately; the others stay pending approval."
- "The same package serves the whole organization. The deployment key is managed in Administration → Settings: rotating it immediately invalidates installers already distributed."

The version of the downloaded installer is confirmed after the download. If the key has been revoked in the meantime, the download fails with the notice that refers to rotation: "This organization's key was revoked. Rotate it in Administration → Settings to resume deployments."

[IMAGEAMETTREICI 02]

## After installation

An enrolled device asks for its approval according to the chosen mode, then receives the Shadow AI policy and its following revisions. The agent updates go through signed installers; the screen of a device exposes its update state, and the "Operations" section of [Shadow AI](shadow-ai.md) sets pilot fleet and paused versions when it is open to diagnostics.

:::enterprise

In multi-organization Enterprise, each organization carries **its own** deployment key. The administrator of a parent organization rotates or revokes it from the child's page, without switching to its context — this is the first block of this page.

The Enterprise Docker images embed the signed MSI and its update manifest; the server serves the MSI frozen from its installer directory, never a package rebuilt locally. The build order, the keys and the check of the served fingerprint belong to the build procedures of the Windows agent.

:::
