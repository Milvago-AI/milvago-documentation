---
sidebar_position: 1
title: Configure my profile
---

# Configure my profile

## Open the page

Click your user block at the bottom left of the sidebar, then **My profile**; on mobile, open the menu first.

1. Complete the editable identity fields.
2. Choose the **Console language**.
3. Click **Save my profile**.
4. Verify the "Profile saved." confirmation; the changes apply to the account and current session.

The **My profile** page lets every signed-in person in Milvago Community or Milvago Enterprise view their identity and choose their console language.

In the sidebar, click your user block at the bottom left. On mobile, open the menu first, then click the same block.

![Milvago - Open the page](/img/docs/en/mon-profil-profil-01.png)

## Identity

The **Identity** block shows the first name, last name, email address, and account type: Local, SSO, or LDAP. The email address is displayed as read-only.

A local account can edit its first and last names, then save the profile. For an SSO or LDAP account, those fields come from the identity provider and cannot be changed in Milvago.

The **Console language** list is available for every account type: Français, English, Español, and Português (Brasil). With **Default**, the console first follows an explicit choice already saved in this browser, then the browser's preferred language; when none of the four languages is requested, it is shown in English. Click **Save my profile** to apply the choice to the account and current session.

## Security and access

The **Security and access** block shows the second-factor status: **unknown status** when it cannot be retrieved, **configured**, or **not configured**.

The available actions depend on the account type:

- **Local**: change the email address, change the password, and manage the second factor.
- **LDAP**: manage the second factor, which can be configured locally.
- **SSO**: the name, email address, password, and second factor are managed by the identity provider.

When the second factor is **not configured**, the **Configure my second factor** button opens direct enrollment with the identity provider in the current tab. Once enrollment is complete, you return automatically to **My profile**. When it is **configured** or its status is **unknown**, the **Manage my second factors** button opens the identity provider's secure area in a new tab, where you can view, add, or remove authenticators.

**My profile** remains open in its tab: return to it after managing authenticators with the identity provider, and its status refreshes. The actions to change the email address and password also return automatically to **My profile**.

If you use **Forgot password** on the sign-in page, the email link lets you set a new password. An authenticator already configured for the account remains in place and is still required at the next sign-in.

In a read-only demo instance, these buttons are hidden and a notice explains this.

![Milvago - Security and access](/img/docs/en/mon-profil-profil-03.png)

Manage personal keys in [API keys and MCP server](cles-api.md).
