---
sidebar_position: 5
title: SSO (Google / Microsoft Entra ID)
---

# SSO (Google / Microsoft Entra ID)

How do you let members sign in with their Google Workspace or Microsoft Entra ID account?

Single sign-on is configured entirely from the Milvago console, in **Administration** > **Settings** > **SSO**. Nobody needs to open the identity service behind Milvago: its administration is not reachable from the network, and the console writes the provider for you.

## Open the screen

1. In the sidebar, open **Administration**, then click **Settings**.
2. In the vertical navigation, click **SSO**.

The section shows one block per provider — **Google Workspace** and **Microsoft Entra ID** — each with its **Redirect URI**, its fields and a **Save** button.

![SSO settings for Google Workspace and Microsoft Entra ID](/img/docs/en/avance-sso-01.png)

## Who can configure it

- The **SSO** section appears with the `directory.manage` permission ("Manage LDAP directory and SSO") and a license outside restricted mode: a Community instance without a license shows neither the section nor SSO sign-in.
- Saving or removing a provider requires a second factor verified moments ago, and neither action is available to an API key.
- The client secret is never shown again once saved: the field stays empty, and leaving it empty keeps the stored secret.

:::enterprise

A provider is offered on the sign-in page of every organization of the instance. Only an owner of the root organization can configure it; anyone else who opens the section reads "Single sign-on applies to every organization of this instance: only an owner of the root organization can configure it."

:::

## Principle: invite first, link at first sign-in

**A person must be invited in Milvago before their first SSO sign-in** (Administration > Members). Without a prior invitation, sign-in is refused (`membership_required`). An invited SSO account receives no activation e-mail: its first action is signing in through the provider.

At that first sign-in, if a Milvago account already exists with the same e-mail — the invited account, or any other one, the owner's included — it is never linked on the e-mail match alone. The person is asked to confirm the link, then to prove they control that existing account: by signing in with its current credentials, or by confirming a link sent to its e-mail address. Only then does the account become an SSO identity; its type switches to **SSO** in Members, and the person signs in through the provider from then on.

Linking is only possible this way. A signed-in user cannot attach an external account to their own from their account security page: that option is turned off when a provider is saved.

The organization's multi-factor requirement applies to SSO sign-ins too: Milvago reads MFA from the evidence the provider attests on the sign-in, never from the account type. When the organization requires MFA, enforce it on the provider's side (Google Workspace 2-Step Verification, or a Microsoft Entra Conditional Access policy requiring MFA). On the Milvago profile page, password, e-mail, profile and second-factor actions stay locked for an SSO account: they are managed at the provider.

### Invitations of the organization's domain

When a provider is offered, a new member invited with an address of its domain — the **Google Workspace domain**, or the Microsoft **Invitation domain** — receives an invitation without a password to create. The e-mail link confirms the address; the "Your account is ready" page then offers **Sign in**, and the first sign-in through the provider button links the provider account directly, without the proof above: the invitation link has already proved the mailbox, and the provider answers for the same address.

This applies once, to an account created by the invitation that has never signed in. From its first sign-in on, and for every other account, the proof above is required again. A member invited with another address receives the usual invitation, with a password to choose.

For Microsoft, the invitation domain is optional and must be a domain your tenant owns: Microsoft Entra does not guarantee that the e-mail address of a sign-in was verified, so without this domain Microsoft invitations keep the proof. A provider saved before this option existed must be saved once more for it to apply.

## Google Workspace

Official sources: [Google Cloud — Using OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server), [Google Cloud — Setting up OAuth 2.0](https://support.google.com/cloud/answer/6158849).

### 1. Create the OAuth client at Google

1. In the [Google Cloud Console](https://console.cloud.google.com/), open **APIs & Services > OAuth consent screen** and complete the consent screen.
2. Open **APIs & Services > Credentials**, then **Create Credentials > OAuth client ID**.
3. Select the **Web application** type.
4. Under **Authorized redirect URIs**, paste the **Redirect URI** shown in the **Google Workspace** block of Milvago.
5. Create the client: Google displays the **Client ID** and the **Client secret**.

### 2. Save it in Milvago

1. In the **Google Workspace** block, enter the **OAuth client ID** and the **Client secret**.
2. Enter the **Google Workspace domain** of the company, for example `example.com`. It is required: only accounts of this domain can sign in. Members invited with an address of this domain sign in with Google directly, without creating a password.
3. Leave **Offer this provider on the sign-in page** checked.
4. Click **Save**, then verify the second factor if asked. "Provider saved." confirms it; a **Google** button now appears on the sign-in page.

## Microsoft Entra ID

Official sources: [Microsoft Learn — Register an application with the Microsoft identity platform](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app), [Microsoft Learn — Add and manage app credentials](https://learn.microsoft.com/en-us/entra/identity-platform/how-to-add-credentials), [Microsoft Learn — Provide optional claims](https://learn.microsoft.com/en-us/entra/identity-platform/optional-claims).

### 1. Register the application at Microsoft

1. In the [Microsoft Entra admin center](https://entra.microsoft.com), open **Entra ID > App registrations > New registration**.
2. Give the application a name.
3. Under **Supported account types**, choose the single-tenant option (accounts in your organizational directory only).
4. Under **Redirect URI**, choose **Web** and paste the **Redirect URI** shown in the **Microsoft Entra ID** block of Milvago, then click **Register**.
5. On the **Overview** page, record the **Application (client) ID** and the **Directory (tenant) ID**.
6. Open **Certificates & secrets > Client secrets > New client secret**, choose an expiration — note it, the secret must be renewed before then — and click **Add**. The secret's **Value** is shown only once: record it immediately.
7. Open **Token configuration > Add optional claim**, choose the **ID** token type, check **email** and click **Add**, so that each sign-in carries the person's e-mail address.

### 2. Save it in Milvago

1. In the **Microsoft Entra ID** block, enter the **Application (client) ID** and the **Client secret**.
2. Enter the **Directory (tenant) ID**, a value of the form `00000000-0000-0000-0000-000000000000`. Only accounts of this tenant can sign in; shared values such as `common` or `organizations` are refused, since they would accept other tenants.
3. Optionally, enter the **Invitation domain (optional)**, for example `example.com`: members invited with an address of this domain sign in with Microsoft directly. Enter only a domain your tenant owns, or leave it empty.
4. Leave **Offer this provider on the sign-in page** checked.
5. Click **Save**, then verify the second factor if asked. "Provider saved." confirms it; a **Microsoft** button now appears on the sign-in page.

Milvago derives every Microsoft address from the tenant ID and checks that each sign-in was issued by that tenant.


## Change, suspend or remove a provider

- **Renew the secret**: enter the new value in **Client secret**, then click **Save**. Changing the client ID always requires its secret.
- **Suspend**: uncheck **Offer this provider on the sign-in page**, then click **Save**. The configuration is kept.
- **Remove**: click **Remove provider**, read the warning "Accounts that sign in through this provider will no longer be able to sign in with it.", then click **Confirm removal**. "Provider removed." confirms it.
- **Provider created outside the console**: if the identity provider already holds a provider of the same name that was not configured here (another type, a post-sign-in flow or mappers), **Save** is refused instead of taking it over. Click **Remove provider**, then save again.

Every save and removal is recorded in the [audit log](../administration/audit.md) (`sso.update`, `sso.remove`).

## Verify

1. Invite an account of the company's domain or tenant (Administration > Members), without it having signed in yet.
2. Sign in with that account through the provider button: the sign-in must succeed, and its member type switches to **SSO** in Members.
3. Attempt a sign-in with a Google or Microsoft account **outside** the domain or tenant: it must be refused.

These checks validate the provider configuration; they do not replace a test of the provider's MFA policies, which remain its responsibility.
