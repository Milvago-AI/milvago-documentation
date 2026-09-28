---
sidebar_position: 3
title: First installation
---

# First installation

How does a brand-new Milvago instance, with no administrator yet, get set up? This page describes the wizard that creates the first account and sets its security, the organization, the mail server, and the default privacy values.

## Accessing the screen

An instance started **without** the `BOOTSTRAP_EMAIL` variable has no administrator: instead of the sign-in page, the console shows the wizard **"Set up this Milvago instance"** directly. There is nothing to click to open it — it replaces the entry page until an account exists.


## What protects the wizard

The wizard stays closed until the server has both:

- **`MILVAGO_SETUP_TOKEN`** — a one-time token of at least 32 characters, given by environment variable or by a Kubernetes Secret. The server keeps only its SHA-256 digest; it appears in no log.
- **An identity administration service account** — `OIDC_ADMIN_CLIENT_ID` and `OIDC_ADMIN_CLIENT_SECRET`.

For Docker installation, see [Docker installation](docker.md).

Without either, the wizard shows **"The setup wizard is closed"** — "Give the server MILVAGO_SETUP_TOKEN and the identity administration account (OIDC_ADMIN_CLIENT_ID, OIDC_ADMIN_CLIENT_SECRET), then reload this page." See [Environment variables](variables-environnement.md).

No setup configuration is saved before the last step. A pasted license is sent to the server for validation at step 2 and checked again at completion. The password stays in the page's memory until completion; neither value is written to browser storage.

## The nine steps

### 1. Setup token

Field **Setup token** — "The value of MILVAGO_SETUP_TOKEN given to the server. It appears in no log." Once validated, a setup session opens.

![Installation wizard, step 1](/img/docs/en/installmilvago/step1_en.png)

### 2. License

**Enterprise**: "The license is provided by Milvago AI. Share the instance identifier below when you request one, then paste it here to continue." The wizard shows the **instance identifier** of the future installation, with a button to copy it, then a field to paste the received license text. The license is required to continue.

**Community**: three choices, "Continue without a license" selected by default:

The wizard also explains: "The free license lifts only Community limits. It does not unlock Enterprise, which requires the Enterprise edition and a separate license."

- **I have a license** — a field to paste the license text.
- **Request a free license** — an e-mail address to type in, then **Send the request**; "Request sent. Check the mailbox for {`address`} and paste the license you receive below.", followed by the same field to paste it.
- **Continue without a license** — the notice "No license": "Limited to 5 devices, a single administrator account, no rights management, no LDAP directory and no SSO. A license can be requested later from [Administration > Settings > License](../administration/parametres.md#license)."

Choosing "I have a license" without pasting text, or staying on Enterprise without one, blocks the next step with "Enter a license to continue." When a license is entered, selecting Next verifies its signature, instance and edition on the server. An invalid license displays an error on this step and keeps the wizard here. The server checks it again before creating the account. The Summary lists this choice first: "License entered" or "None".

![Installation wizard, step 2](/img/docs/en/installmilvago/step2_en.png)

### 3. Language

**Instance default language**: choosing it switches the wizard's language immediately.

![Installation wizard, step 3](/img/docs/en/installmilvago/step3_en.png)

### 4. Administrator account

"This account becomes the owner of the organization at its first sign-in." E-mail address, first name, last name, then the password typed twice — "At least 12 characters, different from the e-mail address. The identity provider may require more." The identity provider's password policy has the final word.

![Installation wizard, step 4](/img/docs/en/installmilvago/step4_en.png)

### 5. Security

Two settings:

- **Enrol an authenticator app at the first sign-in** — checked by default. "After enrolment, this account must use its authenticator at every sign-in."
- **Require multi-factor authentication for every member** — "Members who sign in with a password need a second factor. Identities from an external identity provider rely on its own."

Enrolling an authenticator makes it mandatory for that account at later sign-ins. After the password, the same sign-in continues to the authenticator code without asking for the password again. The second setting extends the requirement to every member.

![Installation wizard, step 5](/img/docs/en/installmilvago/step5_en.png)

### 6. Organization and access

**Organization name**, then **Public Milvago URL** — the address used by console sign-in, Keycloak, agents, and the browser extension. It is prefilled from the current page. Enter the HTTPS address of the front proxy when using one; HTTP is accepted for trusted LAN testing.

![Installation wizard, step 6](/img/docs/en/installmilvago/step6_en.png)

### 7. E-mail server

An optional step — "Used to send member invitations. It can also be configured later in the identity provider." Once **Configure an e-mail server now** is checked: host, port, connection security (STARTTLS, TLS, or none), sender address and name, then optional username and password. The **Send a test e-mail** button shows the administrator's address from step 4 and sends a real message there with these settings. If the mail server returns `550 5.1.1`, check that this address exists and correct it at step 4. Credentials are never accepted over an unencrypted remote connection. These settings become the identity provider's SMTP server, later used for invitations.

![Installation wizard, step 7](/img/docs/en/installmilvago/step7_en.png)

### 8. Privacy

The same settings as Administration > Privacy, except **OIDC team claim**, which is set once an identity provider is in place — "Defaults for this organization. They remain editable in Privacy."

![Installation wizard, step 8](/img/docs/en/installmilvago/step8_en.png)

### 9. Summary

"Check your choices. The administrator account is created when you finish; you then sign in with it." The final button, **Create the administrator and finish**, triggers creation. While the account is being created, the wizard shows a progress indicator and disables the controls until sign-in opens.


## What happens at the end

The account is created in the identity provider with the chosen password, e-mail marked as verified; the organization, security, e-mail server, and privacy settings are written; the browser is then redirected to sign-in. If a second factor was chosen in the Security step — authenticator app enrolment, or multi-factor authentication required for every member — password and TOTP enrolment happen in a single sign-in. The account becomes the organization's owner at that first sign-in — not before.

An e-mail address that already exists at the identity provider is refused: the wizard never takes over an existing account.

## Session, limits, and permanent closure

The setup session lasts 30 minutes; past that, the token must be entered again. Guessing the token is rate limited per address. Once an administrator exists, **every** wizard route answers 404: the token becomes useless, and it is recommended to remove it from the environment or the Secret.

## Automatic mode (`BOOTSTRAP_EMAIL`)

If `BOOTSTRAP_EMAIL` is set at startup, the wizard never appears: the account with that address, pre-created in the identity provider, becomes the organization's owner at its first sign-in. This mode remains useful for demonstrations and automated tests. See [Environment variables](variables-environnement.md).

Both modes exist in Milvago Community and in Milvago Enterprise.
