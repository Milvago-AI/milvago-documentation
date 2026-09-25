---
sidebar_position: 6
title: Connect Milvago to the publisher service
---

# Connect Milvago to the publisher service

The connection is configured on the **Milvago server**. Ask the publisher service operator for the service address, the connection credential for your instance and its public verification key.

## Configure the server

Provide these three environment variables together to the Milvago server container:

- `MILVAGO_PUBLISHER_URL` — the HTTPS origin of the service, without a path or URL parameters;
- `MILVAGO_PUBLISHER_CREDENTIAL` — the connection credential issued for your instance, with at least 32 characters;
- `MILVAGO_PUBLISHER_PUBLIC_KEY` — the Ed25519 public key issued for this service, base64-encoded (32 bytes once decoded).

Your deployment supplies these values, and the server reads them at startup. They are not entered in the console. If the URL is supplied without the other two valid values, the server refuses to start. Do not publish the connection credential in documentation or a versioned file.

Milvago Community also requires these three variables, but no separate client ID is entered. The publisher service uses the connection credential to select the appropriate catalogue; in Community, that catalogue contains ChatGPT and Claude only.

## Choose features in the console

1. Sign in with `settings.manage` and fresh MFA.
2. In the side navigation, open **Administration → Privacy**.
3. Under **Publisher sharing**, select the relevant choices: **Automatically import the publisher catalogue**, **Share detector health**, or **Share fleet counts**.
4. Enter the required reason, then select **Save**. Automatic catalogue import is offered only to the root organization.
5. If you are the instance owner, review the publisher service preview shown below these choices.

The server connection alone does not enable these choices.

See [Privacy](../administration/confidentialite.md) for the screen permissions and settings.
