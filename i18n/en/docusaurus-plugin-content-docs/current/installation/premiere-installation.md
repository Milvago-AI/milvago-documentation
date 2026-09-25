---
sidebar_position: 3
title: First installation
---

# First installation

How does a brand-new Milvago instance, with no administrator yet, get set up? This page describes the wizard that creates the first account and sets its security, the organization, the mail server, and the default privacy values.

## Accessing the screen

An instance started **without** the `BOOTSTRAP_EMAIL` variable has no administrator: instead of the sign-in page, the console shows the wizard **"Set up this Milvago instance"** directly. There is nothing to click to open it — it replaces the entry page until an account exists.

[IMAGEAMETTREICI 01]

## What protects the wizard

The wizard stays closed until the server has both:

- **`MILVAGO_SETUP_TOKEN`** — a one-time token of at least 32 characters, given by environment variable or by a Kubernetes Secret. The server keeps only its SHA-256 digest; it appears in no log. The Community script `scripts/local-init.mjs` generates one automatically into `.env`.
- **An identity administration service account** — `OIDC_ADMIN_CLIENT_ID` and `OIDC_ADMIN_CLIENT_SECRET`.

Without either, the wizard shows **"The setup wizard is closed"** — "Give the server MILVAGO_SETUP_TOKEN and the identity administration account (OIDC_ADMIN_CLIENT_ID, OIDC_ADMIN_CLIENT_SECRET), then reload this page." See [Environment variables](variables-environnement.md).

Nothing is saved before the last step: the password and the entered license stay in the page's memory until they are sent, once, at the last step, and are never written to browser storage.

## The nine steps

### 1. Setup token

Field **Setup token** — "The value of MILVAGO_SETUP_TOKEN given to the server. It appears in no log." Once validated, a setup session opens.

### 2. License

**Enterprise**: "The license is provided by Milvago AI. Share the instance identifier below when you request one, then paste it here to continue." The wizard shows the **instance identifier** of the future installation, with a button to copy it, then a field to paste the received license text. The license is required to continue.

**Community**: three choices, "Continue without a license" selected by default:

- **I have a license** — a field to paste the license text.
- **Request a free license** — an e-mail address to type in, then **Send the request**; "Request sent. Check the mailbox for {`address`} and paste the license you receive below.", followed by the same field to paste it.
- **Continue without a license** — the notice "No license": "Limited to 5 devices, a single administrator account, no rights management, no LDAP directory and no SSO. A license can be requested later from [Administration > Settings > License](../administration/parametres.md#license)."

Choosing "I have a license" without pasting text, or staying on Enterprise without pasting one, blocks moving to the next step with "Enter a license to continue." The pasted text is only verified by the server at the very end of the wizard, when the account is created: an invalid license, or a Community license offered to an Enterprise instance, then fails with the server's error, shown on the Summary — not on this step. The Summary lists this choice first: "License entered" or "None".

[IMAGEAMETTREICI 02]

### 3. Language

**Instance default language**: choosing it switches the wizard's language immediately.

### 4. Administrator account

"This account becomes the owner of the organization at its first sign-in." E-mail address, first name, last name, then the password typed twice — "At least 12 characters, different from the e-mail address. The identity provider may require more." The identity provider's password policy has the final word.

[IMAGEAMETTREICI 03]

### 5. Security

Two settings:

- **Enrol an authenticator app at the first sign-in** — checked by default. "Recommended: this account holds every permission."
- **Require multi-factor authentication for every member** — "Members who sign in with a password need a second factor. Identities from an external identity provider rely on its own."

### 6. Organization and access

**Organization name**, then **Public agent HTTPS URL** — "Address used by agents and the browser extension." — prefilled with the current address. An HTTP URL is accepted only on explicit loopback.

### 7. E-mail server

An optional step — "Used to send member invitations. It can also be configured later in the identity provider." Once **Configure an e-mail server now** is checked: host, port, connection security (STARTTLS, TLS, or none), sender address and name, then optional username and password. The **Send a test e-mail** button sends a real message to the administrator's address with these settings. Credentials are never accepted over an unencrypted remote connection. These settings become the identity provider's SMTP server, later used for invitations.

### 8. Privacy

The same settings as Administration > Privacy, except **OIDC team claim**, which is set once an identity provider is in place — "Defaults for this organization. They remain editable in Privacy."

### 9. Summary

"Check your choices. The administrator account is created when you finish; you then sign in with it." The final button, **Create the administrator and finish**, triggers creation.

[IMAGEAMETTREICI 04]

## What happens at the end

The account is created in the identity provider with the chosen password, e-mail marked as verified; the organization, security, e-mail server, and privacy settings are written; the browser is then redirected to sign-in. If a second factor was chosen in the Security step — authenticator app enrolment, or multi-factor authentication required for every member — password and TOTP enrolment happen in a single sign-in. The account becomes the organization's owner at that first sign-in — not before.

An e-mail address that already exists at the identity provider is refused: the wizard never takes over an existing account.

## Session, limits, and permanent closure

The setup session lasts 30 minutes; past that, the token must be entered again. Guessing the token is rate limited per address. Once an administrator exists, **every** wizard route answers 404: the token becomes useless, and it is recommended to remove it from the environment or the Secret.

## Automatic mode (`BOOTSTRAP_EMAIL`)

If `BOOTSTRAP_EMAIL` is set at startup, the wizard never appears: the account with that address, pre-created in the identity provider, becomes the organization's owner at its first sign-in. This mode remains useful for demonstrations and automated tests. See [Environment variables](variables-environnement.md).

Both modes exist in Milvago Community and in Milvago Enterprise.
