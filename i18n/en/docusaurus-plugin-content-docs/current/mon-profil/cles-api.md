---
sidebar_position: 2
title: API keys and MCP server
---

# API keys and MCP server

## Open the page

Click your user block at the bottom left, then **My profile**. **API keys** is a separate card after **Security and access**.

1. Click **New API key**.
2. Enter its name, duration, and permissions, then create it.
3. Copy the secret shown only once.

API keys are found on the **My profile** page, under the "Security and access" block. They answer the question "**how does a script or an external tool call the API**": "So a script or an external tool can call the API with your rights, without sharing your password."

## Creating a key

The "New API key" button opens the creation dialog, capped at 5 active keys per account ("Limit of 5 active keys reached"). Four settings:

- **Key name** — a human phrase, for example "SIEM export".
- **Validity** — 30, 90 or 365 days; beyond that, the key expires and the screen marks it "Expired".
- **Permissions** — the list of rights that **you** carry, nothing pre-checked, and nothing the server would not grant you: "Limited to your own rights, and recomputed on every call: the key loses a right as soon as you do."
- **Allow reading prompt content** — a separate switch, offered only if your instance provides it: "Enable only if the tool needs it: without this box the key sees metadata only."

[IMAGEAMETTREICI 01]

Two warnings appear when the decision is made, not after:

- Selecting `installers.manage` ("Manage installers") reads "This permission outlives the key": "A key that can download the installer can read the organization's deployment key, which does not expire. The ability to enrol devices will therefore outlive this key: to take it away, rotate the deployment key in Settings."
- In Enterprise, enabling content reading reads "Prompt text will be able to leave for an external LLM": "This key also opens the MCP server. A model connected with it will be able to read the text your users submitted, and that text will be sent to that model's provider."

The secret key is displayed **once**, in a dialog that survives reloading the list: "Copy this key now: it will never be shown again, to anyone." If you lose it, revoke the key and create another one.

## The keys table

Columns: **Name** (with the amber "Content" badge if the key reads contents), **Permissions** (up to two spelled out, beyond that a "N permissions" badge with the detail on hover), **Created**, **Expires** ("Expires in N days", "Expires tomorrow", or "Expired"), **Last used** ("Never used" otherwise). **Revoke** asks for confirmation and takes effect immediately: "Any tool using “…” will immediately stop authenticating. This is final."

[IMAGEAMETTREICI 02]

:::enterprise

## MCP server

Under the keys table, the "MCP server" card appears in Enterprise only: "To connect a language model to Milvago. It reads the same surface as the console — with the rights of whoever signs in, or those of one of the keys above." It gives the three configuration elements:

- **Endpoint** — `<your console URL>/mcp`, to declare as a remote MCP server over HTTP; "The endpoint accepts POST only."
- **Sign in with your account** — the public client identifier `milvago-mcp-client`, for a client that asks for one; "Most clients need nothing but the address above: they open a sign-in page, ask you to consent, and the model then reads with your own rights, in your own organization." The exchange is protected by PKCE.
- **Authentication header** — `Authorization: Bearer <API key>`: "Required on every method, discovery included: without a credential the server answers nothing. A session cookie is refused, never accepted instead."

Two revisions of the protocol are served — the product's own and the published one — and the notice says so, so that a client that opens with "initialize" knows which one it receives.

Signing in with your account is not permanent: a connector left unused for seven days, and every connector after thirty days, will ask you to sign in again. The server also refuses a token issued for the console itself, and a connector that registers itself must explicitly request the `milvago:mcp` access at sign-in time — which is what common connectors do. The same applies to every other application declared on the identity provider: at startup, Milvago removes `milvago:mcp` from the access granted by default to those applications, including ones created before this rule.

### Read-only, and untrusted data

"No tool changes a policy, a device, a member or a setting. The answers do contain data written by your users, though — hostnames, labels, and prompt text when the key has access to it: they leave for the model provider." The MCP server is not a bypass: it goes through the same RBAC and the same per-organization isolation, and an MCP key can never write. An API key or an MCP connector token only ever lists the members of its own organization, never those of a child organization, even when your own role spans a wider subtree in Enterprise.

### Connector self-registration

When a connector must obtain credentials of its own rather than a personal key, the registration is set in [Settings](../administration/parametres.md), at the identity provider, with its allowed hosts and its client ceiling.

"In an organization that requires multi-factor authentication, a self-registered connector is accepted only if its token attests a second factor through its authentication methods list (`amr`); its declared level (`acr`) is trusted only for the connector supplied by Milvago. A token valid for more than one hour is refused, as is a client that has given itself mappers, a service account, or a flow other than authorization code with consent."

:::
