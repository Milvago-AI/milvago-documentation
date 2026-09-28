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

This page describes how **devices** are enrolled: the deployment key that authorizes the enrollment, the installation files that deliver it, and what happens to a device after its installation. For the installation of the platform itself (server, database, images), see [Installing the components](../installation/composants.md).

## The deployment key

A deployment key authorizes a device enrollment. In Windows deployments, the key is in a separate provisioning file; the MSI has no organization secret. The current Linux RPM still carries the key. Each device receives its own credentials after enrollment. The panel in [Settings](parametres.md), and on each [organization](organisations.md) page in Enterprise, shows the key state, creation date, last rotation and installation count.

- **Generate a key** or **Rotate**: then download a new Windows ZIP. Previously distributed provisioning files and Linux RPMs can no longer enroll devices. Enrolled devices are unchanged.
- **Revoke**: no new device can enroll until a new key is generated. Enrolled devices are unchanged.

![Milvago - The deployment key](/img/docs/fr/administration-deploiement-01.png)

## Downloading the agent

Confirm the **public HTTPS URL** in [Settings](parametres.md), then click **Windows ZIP**. One archive contains the immutable MSI, its matching PowerShell script, this organization's provisioning JSON, and a `README.md` with the installation command. The download requires `installers.manage`. If your account uses a second factor, a fresh verification may be required; after verification the ZIP downloads automatically. The ZIP and JSON contain a deployment token: protect them until they are deleted or the key is rotated or revoked.

Extract `milvago-windows-package.zip` into a restricted folder. In that folder, run the script as an administrator:

```powershell
powershell.exe -NoProfile -File .\milvago-windows-install.ps1 -MsiPath .\milvago-windows-installer.msi -ProvisionPath .\milvago-provision.json
```

The three paths in the command refer to files inside the ZIP. Keep them together after extraction. The two script parameters are required; running it without them prompts for `MsiPath` and `ProvisionPath`. The included `README.md` repeats the installation steps.

The script checks the MSI against its release hash, verifies the publisher's Authenticode signature when a signing certificate is configured, stages the MSI and JSON with SYSTEM/Administrators access, runs Windows Installer, then removes the staging files. Opening the MSI alone cannot enroll a new device because it contains no organization key. Local packages made before the signing certificate is available have no Authenticode signature; qualify them only in a controlled test environment.

Linux still downloads an organization-specific RPM. Manual and network approval continue to apply after installation. The browser extension must also be distributed.

## After installation

An enrolled device asks for its approval according to the chosen mode, then receives the Shadow AI policy and its following revisions. The agent updates go through signed installers; the screen of a device exposes its update state, and the "Operations" section of [Shadow AI](shadow-ai.md) sets pilot fleet and paused versions when it is open to diagnostics.

:::enterprise

In multi-organization Enterprise, each organization carries **its own** deployment key. The administrator of a parent organization rotates or revokes it from the child's page, without switching to its context — this is the first block of this page.

The Enterprise Docker images embed the immutable MSI, its release-specific deployment script and a signed update manifest. The server serves the same MSI bytes to every organization. The build order, the keys and the check of the served fingerprint belong to the build procedures of the Windows agent.

:::
