---
sidebar_position: 7
title: Settings
---

# Settings

## Open the page

Click **Administration** > **Settings** in the sidebar. Sections and actions depend on your permissions.

1. Open **LDAP directory** in the vertical navigation.
2. Enter the connection and attribute settings.
3. Click **Test connection** and correct any step reported as failed.
4. After a successful test, click **Save directory**.
5. Verify that the status confirms the saved connection.

The Settings screen answers the question "**how this organization and this instance are set**". Its line under the title announces it: "Organization and instance settings." A vertical navigation splits the sections, and **each section appears only with the permission that governs it**: what you cannot set does not show up.

![Milvago - Open the page](/img/docs/en/administration-parametres-01.png)

## Organization

Always present. Four fields, saved together:

- **Organization name** — changeable by the organization owner.
- **Public Milvago URL** — The browser console, Keycloak sign-in, agents, and the browser extension use this origin. Only the root organization owner can change it. Milvago updates the Keycloak realm and console redirect through its private API; new sign-ins use the new URL. Already enrolled devices keep their previous URL and must be re-enrolled to move. Confirming the URL also enables installer downloads.
- **Instance default language** — "Applies to the sign-in page reached without a language. Users without a personal preference follow their own browser, then English. Only the root organization owner can change it."
- **Event retention (days)** — from 1 to 365; "The server validates and applies the retention period." Shortening this duration requires a second factor verified moments ago and is never available to an API key: the next hourly purge immediately deletes the history that becomes older than the new duration, retained texts included. Lengthening it is unchanged.

A "Complete setup" banner appears as long as the public URL is not confirmed on an instance installed in automatic mode (`BOOTSTRAP_EMAIL`) — the [first installation](../installation/premiere-installation.md) wizard sets these values directly and never leaves this banner behind. It opens a two-step wizard: instance default language, then organization name and public HTTPS URL. The same banner restates it differently: "Agents and the browser extension will connect to this URL. Confirm it in Administration before deploying."

## License

Always present for anyone who can open Settings: no permission governs it — only the instance owner role allows changing it. Its on-screen description: "Status of this instance's license."

On Community, the panel also states: "The free license lifts only Community limits. It does not unlock Enterprise, which requires the Enterprise edition and a separate license."

- **Status** — badge None, Valid, Grace period, or Expired.
- **Kind** — Enterprise, Community, or "—" if the instance never received a license.
- **Maximum devices** — a number, or "Unlimited" if the license sets none (value 0).
- **Expires** — shown only when the license carries an expiry date (Enterprise licenses; the free Community license is perpetual and shows none).
- **Grace period until** — shown only during the grace period that follows an Enterprise expiry.
- **Instance identifier** — with the **Copy instance ID** button, to pass on to Milvago AI to obtain a license.

Below this information, the instance owner sees a field to paste a new license's text and the **Save the license** button — "License saved." confirms it was saved. Any other reader instead sees the notice "Only the instance owner can change the license."

On **Community**, the instance owner also sees, below that field, a **Request a free license** area: an e-mail address (prefilled with their own) and the **Send the request** button; "Request sent. Check the mailbox for {`address`} and paste the license you receive below." confirms it was sent. The request goes to Milvago AI, which replies by e-mail with the text to paste here. This free license is perpetual and lifts every limit of the restricted mode described below.

![Community license settings](/img/docs/en/administration-parametres-02.png)

### Restricted mode (Community without a license)

As long as no license is accepted, a Community instance runs in **restricted mode**: 5 devices at most (revoked ones do not count), the single administrator account created at setup, no role or member management — the **Roles** entry disappears from the Administration navigation —, no LDAP directory — the **LDAP directory** section below disappears from this page itself —, and no SSO — the **SSO** section disappears too, and SSO sign-in is refused. A warning banner "No license" then appears on every page of the console, with a link to open settings. Enrolling a device beyond the quota fails with "This instance has reached its device limit for its current license."

### Enterprise: expiry and lockout

On **Enterprise**, the instance never runs without a valid license of its own: a Community license is refused there with "This is a Community license; this instance is Enterprise." The license always carries an expiry date and a maximum device count (0 = unlimited). After expiry, the instance enters a **10-day grace period**: a "License expiring" banner stays shown, the console keeps working normally. Past that delay, the entire console is replaced by the license screen alone — "License required" — "This instance has no valid license. An owner must enter one below to continue." — and agents are refused until a new, valid license is entered.

### License bound to the instance

A license is bound to this instance's identifier (shown above): reinstalling Milvago on a new database changes that identifier and invalidates the old license; a new one must then be obtained.

## LDAP directory

Present with the `directory.manage` permission ("Manage LDAP directory and SSO") and a license outside restricted mode: on a Community instance without a license, this section does not show up. An LDAP directory specific to the organization, materialized at the identity provider: directory type (Active Directory, and the pre-filled conventions for the others, editable), connection URL `ldap://` or `ldaps://`, bind DN, users DN, attributes, filter, scope, timeouts, pagination. The screen requires a verified transport — LDAPS or StartTLS — before any transmission of credentials: "LDAP requires LDAPS or StartTLS before any directory credentials are transmitted.", the validation refuses otherwise.

The **Test connection** button replays the two steps ("Connection and authentication succeeded." or the failed step); **Save directory** activates the LDAP connection; **Remove directory** warns: "Users of this directory will no longer be able to sign in." Testing, saving and removing the directory each require a second factor verified moments ago; none of these three actions is available to an API key.

Directory accounts are then imported in [Members](membres.md).

:::enterprise

Creating, testing, changing or deleting a directory is reserved to an owner of the root organization, for the root organization or, after switching to it, for a child organization — every organization's sign-in consults every directory of the shared identity provider. In a child organization, other people instead see the notice "Only an owner of the root organization can configure a directory, because every organization's sign-in consults it." or, when one is already configured, "This organization's directory is configured by an owner of the root organization, because every organization's sign-in consults it. Its users can be imported in Members."

:::

## SSO

Present under the same conditions as **LDAP directory**: the `directory.manage` permission and a license outside restricted mode. It configures sign-in with **Google Workspace** and **Microsoft Entra ID**: for each provider, the **Redirect URI** to register at the provider, the client ID, the client secret — never shown again, left empty to keep it — and the Google Workspace domain or the Microsoft Entra tenant that restricts who can sign in. **Save** and **Remove provider** each require a second factor verified moments ago, and neither is available to an API key. The full procedure is in [SSO (Google / Microsoft Entra ID)](../avance/sso.md).

:::enterprise

The providers are offered on the sign-in page of every organization: only an owner of the root organization can configure them. Anyone else sees "Single sign-on applies to every organization of this instance: only an owner of the root organization can configure it."

:::

## Deployment key

Present with the `installers.manage` permission ("Manage installers"). See [Deployment](deploiement.md), which describes it in detail.

## Connector self-registration

:::enterprise

Section reserved for Enterprise, and for the **root organization owner**: the decision is written on the identity provider of the instance, not in the Milvago database — what the screen shows is what is actually enforced.

It sets the way an MCP connector obtains credentials of its own: "A connector asks the identity provider for a client of its own, so nobody has to paste an identifier. Closed until you open it, and opening it always names the hosts a sign-in may be returned to."

- **Let a connector register itself** — off by default.
- **Hosts allowed to receive a sign-in** — "One host per line, without scheme, port or path — claude.ai, or *.example.com. A registration is refused unless every address it asks for is on one of these hosts, so a code can never be delivered anywhere else." A wildcard host keeps at least two labels after `*.` — `*.example.com` is accepted, `*.com` is refused. A state "open to every host" set by hand at the identity provider is reported as such, and cannot be produced by this screen.
- **Registered client ceiling** — "A registration that would exceed this number is refused. It bounds the clutter, not the risk."

What is not negotiable: "A person always sees a consent screen before a model reaches anything, a registered client is limited to its declared rights, and it can never read more than the rights of whoever signs in. The declared client keeps working for a connector that asks for an identifier instead." Every public client of the identity provider must use PKCE, registered connectors included, and Milvago caps the duration of connectors' long-lived sign-ins at startup — seven days unused, thirty days at most — never lengthening an already shorter duration. See [API keys and MCP server](../mon-profil/cles-api.md).

:::
