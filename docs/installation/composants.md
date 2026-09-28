---
sidebar_position: 1
title: Components
---

# Installing the components

## Installation path

1. Deploy the Milvago server, then open the console with an administrator account.
2. In **Administration → Settings**, set and confirm the public HTTPS URL that agents will carry.
3. Open **Fleet → Devices** and select **Download agent** to obtain the package for your edition.
4. Install that package on the device, then distribute the browser-specific extension through your enterprise policy.
5. Return to **Fleet → Devices**: approve the device if it is pending and check its last contact and browser extensions.

## Browser extension

The extension is distributed in two edition variants. In Community, only the ChatGPT and Claude adapters are embedded: no catalog or content script of the other providers is present in the package.

![Milvago - Browser extension](/img/docs/en/installation-composants-01.png)

- **Chrome / Edge / Brave / Vivaldi**: CRX package, deployed on Windows through enterprise policy (`ExtensionInstallForcelist`). Vivaldi has no dedicated automated Linux path.
- **Arc (Windows)**: supported CRX package and Arc enterprise policy. MSI installation and content control remain to be qualified separately.
- **Firefox**: signed XPI, required even under enterprise policy; Firefox 140.0 or later is required on every operating system. Without the expected signed package, the extension update service answers 503.

:::info[Google Chrome installation]
The Chrome extension is private and is not published in the Chrome Web Store. For the Windows deployment described here through `ExtensionInstallForcelist`, the PC must be joined to an Active Directory domain or Microsoft Entra ID. Installing the agent or Native Messaging host alone is not enough.
:::

Standalone Chromium is not supported. See [Technical architecture](../introduction/architecture.md) for the operating-system integration matrix, the Linux deployment modes, and the scope of qualifications.

The extension is driven by a **signed detection catalog** (engine + data) that describes the measured routes of the covered sites: prompt routes, upload routes. It applies no heuristic outside those routes.

In both editions, **known platforms** report presence on a reached platform, never its content, without re-enabling capture outside qualified providers.

:::enterprise

The Enterprise factory catalog covers **nine providers**. Model controls and usage sensitivity are also reserved for Enterprise.

:::

## Windows agent

The Windows agent is distributed as an immutable MSI. Its update manifest is signed; Authenticode signing of the MSI awaits the publisher certificate:

1. Download the Windows ZIP from the console. It contains the immutable MSI, the matching installation script, this organization's provisioning JSON and a `README.md` with the exact command. If a second factor is enabled on your account, the download resumes after fresh verification.
2. Extract the ZIP and run the script as administrator with the MSI and JSON paths. The service runs under a local account and relays policies to the extension via loopback channels. Protect and delete the ZIP and JSON when no longer needed.

Updates are distributed by the Docker image containing the MSI and its manifest: rebuild and redeploy the image, then verify the fingerprint of the MSI actually served, the signature and the announced version. Application on the devices depends on the configured update policy.

![Milvago - Windows agent](/img/docs/fr/installation-composants-02.png)

## Console

The console ships with the backend (AGPL-3.0). For Docker setup, see [Docker installation](docker.md).

By default in Community: one organization, no model controls, no built-in masking patterns and no usage sensitivity. Observing the name of the model that answered is open in both editions (inventory); the control decision remains limited to the covered providers. Role and member management, the LDAP directory and SSO sign-in depend in Community on a **license**: as long as none is accepted, the instance stays in restricted mode — 5 devices, a single administrator account, none of these three features. See [Settings > License](../administration/parametres.md#license).

:::enterprise

In Enterprise, the console manages several isolated organizations (PostgreSQL RLS), device groups, deployment keys and the MCP server. See the Administration section. A valid Enterprise license bound to the instance is always required, with no restricted mode: see [Settings > License](../administration/parametres.md#license).

:::

![Milvago - Console](/img/docs/en/installation-composants-03.png)
