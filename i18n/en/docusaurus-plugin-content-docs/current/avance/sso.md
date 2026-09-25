---
sidebar_position: 5
title: SSO (Google / Microsoft Entra ID)
---

# SSO (Google / Microsoft Entra ID)

How do you connect Milvago to the organization's single sign-on (SSO), with Google or Microsoft Entra ID as the identity provider?

Milvago's SSO is **Keycloak identity brokering**: the external provider is configured in the Keycloak admin console of the `milvago` realm, never in the Milvago console. This page assumes a local or demonstration `compose` deployment, with the bootstrap account `bootstrap-admin` (password `IDENTITY_ADMIN_PASSWORD` from `.env`) to sign in to Keycloak.

:::warning Trust assumption
Automatic linking (`idp-auto-link`) is not limited to invited accounts that have never signed in: any identity from a federated provider presenting the same e-mail links to **any** local Keycloak account with that e-mail — including an already active account, including the administrator or owner account. This is why the domain or tenant restriction, and **Trust Email** enabled only once that restriction is set, are vital: without them, an unrestricted provider would let an outsider take over the owner account by simply presenting its e-mail. Only federate providers whose e-mail is trustworthy.
:::

## Principle: linking at first login

Milvago defines its own first-login-via-external-provider flow, `milvago-v1-first-broker-login`: if no Keycloak account shares the same e-mail, it creates one; if a local Keycloak account already exists with that e-mail — an **invited** Milvago account (Administration > Members) is the intended use, but linking applies to **any** local account with that e-mail, whatever its state — it automatically links it to the external provider. After that link, the person always signs in through the external provider; the account type shown in Members switches to **SSO**.

Direct consequence: **a person must be invited in Milvago before their first SSO sign-in**. Without a prior invitation, sign-in is refused (`membership_required`), and an invited SSO account receives no activation e-mail — its first action is signing in through the provider.

SSO identities are exempt from Milvago's multi-factor requirement: their MFA is the provider's responsibility (enable it in Google Workspace or in Microsoft Entra Conditional Access policies). On the Milvago profile page, self-service actions — changing the password, e-mail, profile, or enrolling MFA — remain locked for an SSO account: they are managed at the provider.

## Preparing Keycloak

In the Keycloak admin console (realm `milvago`), open **Identity providers** in the left menu, then **Add provider**. Choose Google or OpenID Connect v1.0 depending on the provider (details below). Every provider you add shows a **Redirect URI** in this format:

```
https://<keycloak-host>/realms/milvago/broker/<alias>/endpoint
```

That is the value to paste into the external provider's configuration (Google Cloud Console or Microsoft Entra admin center) — never the other way around.

## Google

Official sources consulted: [Google Cloud — Using OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server), [Google Cloud — Setting up OAuth 2.0](https://support.google.com/cloud/answer/6158849), Keycloak's Google provider documentation.

### 1. Create the OAuth credentials on Google's side

1. In the [Google Cloud Console](https://console.cloud.google.com/), open **APIs & Services > OAuth consent screen** and complete the consent screen.
2. Open **APIs & Services > Credentials**, then **Create Credentials > OAuth client ID**.
3. Select the **Web application** application type.
4. Under **Authorized redirect URIs**, paste the **Redirect URI** Keycloak shows for this provider.
5. Create the client: Google displays the **Client ID** and **Client secret** (the secret is shown only once).

### 2. Add the provider in Keycloak

Under **Identity providers > Add provider**, choose **Google**, then fill in:

- the **Client ID** and **Client Secret** obtained in the previous step;
- **Hosted Domain** — the company's Google Workspace domain. This is the field that **restricts access to organization members**; without it, any Google account can present itself to the broker.
- **Trust Email** — enable it only once the domain is set: without the domain restriction, trusting the Google e-mail would let any Google account claim a Milvago account invited at the same address.

## Microsoft Entra ID

Official sources consulted: [Microsoft Learn — Register an application with the Microsoft identity platform](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app), [Microsoft Learn — Add and manage app credentials](https://learn.microsoft.com/en-us/entra/identity-platform/how-to-add-credentials), Keycloak's OpenID Connect v1.0 provider documentation.

### 1. Register the application on Microsoft Entra's side

1. In the [Microsoft Entra admin center](https://entra.microsoft.com), open **Entra ID > App registrations > New registration**.
2. Give the application a name.
3. Under **Supported account types**, choose **Single tenant only — &lt;your tenant&gt;** — this option limits registration to the company's tenant; the other options (multitenant, personal accounts) open it to tenants or accounts outside the company.
4. Select **Register**, then record the **Application (client) ID** shown on the **Overview** page.
5. Open **Authentication > Add a platform > Web**, and paste the **Redirect URI** Keycloak shows.
6. Open **Certificates & secrets > Client secrets > New client secret**, add a description, choose an expiration (24 months at most — prefer a shorter duration and note the expiry to renew it), then **Add**. The secret's **Value** is shown only once: record it immediately.

### 2. Add the provider in Keycloak — prefer OpenID Connect v1.0 with the tenant-specific discovery endpoint

Keycloak's built-in **Microsoft** social provider offers no field restricting sign-in to a specific Entra tenant: you would then rely solely on the restriction set on Entra's side (single-tenant account). To avoid depending on a single lock, prefer a generic **OpenID Connect v1.0** provider, with the tenant-specific discovery endpoint:

```
https://login.microsoftonline.com/<tenant-id>/v2.0/.well-known/openid-configuration
```

**Never** `common` or `organizations` in place of `<tenant-id>`: those aliases target multi-tenant applications, their issuer is not specific to your tenant, and Keycloak cannot then check that the token really comes from your tenant — always use the tenant-specific discovery URL.

Under **Identity providers > Add provider > OpenID Connect v1.0**, import the configuration from this discovery URL (Keycloak then fills in the Authorization URL, Token URL, and other endpoints), then enter the **Client ID** and **Client Secret** obtained in the previous step.

## Verify

1. Invite an account from the company's domain or tenant (Administration > Members), without it having signed in yet.
2. Sign in with that account through the SSO provider: the sign-in must succeed, and its member type switches to **SSO** in Members.
3. Attempt a sign-in with a Google or Microsoft account **outside** the restricted domain or tenant: the provider (Google) or Keycloak (Microsoft, through the tenant-specific discovery endpoint) must refuse it.

These checks validate the provider configuration; they do not replace a full test of the provider's MFA policies, which remain its responsibility.
