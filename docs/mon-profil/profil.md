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

The **Security and access** block lists, one row each, your email address, your password and your second factor. Each **Change**, **Add a device** or **Remove** button opens a secure Milvago sign-in page in the same tab, then brings you back to **My profile**, where a message confirms the change.

The available actions depend on the account type:

- **Local**: change the email address, change the password, and manage the second factor.
- **LDAP**: manage the second factor, which can be configured locally.
- **SSO**: the name, email address, password, and second factor are managed by the identity provider.

The **Second factor** row lists your devices, each with its name and the date it was added:

- With no device, **Configure my second factor** walks you through scanning a QR code with an authenticator app (Microsoft Authenticator, Google Authenticator, FreeOTP…), then entering the code it shows.
- **Add a device** sets up another app, for example on a second phone; at sign-in, you choose which device shows the code.
- **Remove** asks for confirmation first, then a code from one of your devices. If you signed in more than a few minutes ago, your password is asked again too. Without any device left, your sign-in only asks for your password, unless your organization requires a second factor: you then set up a new device at your next sign-in.

When the second factor cannot be checked, the row says so and offers no action.

If you use **Forgot your password?** on the sign-in page, the email link lets you set a new password. A device already configured for the account remains in place and is still required at the next sign-in.

In a read-only demo instance, these buttons are hidden and a notice explains this.

![Milvago - Security and access](/img/docs/en/mon-profil-profil-03.png)

Manage personal keys in [API keys and MCP server](cles-api.md).
