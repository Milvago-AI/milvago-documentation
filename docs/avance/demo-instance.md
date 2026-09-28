---
sidebar_position: 4
title: Demo instance
---

# Demo instance

A demo instance publishes the product on the Internet: anyone can visit it with a simple login, without being able to modify anything, with data that moves every five minutes. It relies on two environment variables and a dedicated Docker stack.

![Milvago - Demo instance](/img/docs/en/avance-demo-instance-01.png)

## Put the demo into service

1. From the Docker operations host, prepare the two demo variables in deployment secrets.
2. Start the dedicated `compose.demo.yaml` stack without exposing any service other than its proxy.
3. Open the public URL and sign in with the demo account.
4. Check that a modification action is refused and synthetic data is visible before sharing the URL.

## The two variables

| Variable | Effect |
| --- | --- |
| `MILVAGO_DEMO_READONLY` | refuses **every** console mutation on the instance, whatever the caller's role, **before routing** — a route added later is covered without thinking about it. Second, coarser guard, on top of the role: two console routes are registered without permission (`PUT /api/profile`, `POST /auth/logout`), so a read-only role does not cover everything |
| `MILVAGO_DEMO_MCP_KEY` | demo MCP key displayed on the profile page — **and nowhere else**, and only if the instance is read-only: an instance that accepts writes can manufacture its own keys, and a client instance must never display a credential it did not create |

**Device ingestion** (`/v1`, `/v2`, `/v3`) remains deliberately out of the flag's scope: it is how the data arrives, and it requires a device credential that no visitor holds.

## The stack

`compose.demo.yaml` is a self-contained stack, distinct from the main compose: no published port except those of the **proxy**, no Community instance, and everything that is not the proxy is cut off from the Internet. Four layers enforce read-only:

1. **The edge**: only `GET`/`HEAD` pass, plus logout; the ingestion paths, `/metrics` and `/ext` answer 404 publicly. `/mcp` is the one public machine endpoint: it accepts `POST` only — any other method there also answers 404 — proxied through to the application, still bound by its own read-only credential or OAuth token.
2. **The server**: `MILVAGO_DEMO_READONLY`.
3. **The role**: a `demo` role with eight read permissions — `overview.read`, `events.read`, `devices.read`, `members.read`, `content.read`, `reports.aggregate`, `policy.manage`, `audit.read`. `policy.manage` is what unlocks reading the Shadow AI configuration screens and the Discovery candidate list; the console still hides every action that writes, and the other three layers refuse it anyway.
4. **The identity**: password change and signup disabled — otherwise a visitor changes the shared password and locks out the following ones.

![Milvago - The stack](/img/docs/en/avance-demo-instance-02.png)

## No downloadable agent

A demonstration shows the product; it **does not distribute an agent** able to enroll a real machine. The installer and deployment key routes require a permission the role does not carry, and the edge explicitly refuses the extension and installer paths with 404 — a rule that depends neither on the role, nor on the image content. Owned consequence: the Shadow AI configuration screens and the Discovery candidate list are visible, read-only, through `policy.manage`; the screens gated by a `*.manage` write permission the role does not carry — Settings, Members, Roles, Organizations, LDAP directory — stay hidden.

## The demo data

The generator provisions what a device credential cannot reach, then speaks the **real agent protocol**: nothing is written into the event tables behind the server's back — sealing, classification, attribution and retention go through the code a client's fleet exercises.

- 30 days of history posted once, then a **wave every five minutes**: retention bounds the database, nothing is bulk-deleted.
- Content entirely invented (documentation ranges, example domains), therefore presented in clear text: the visitor sees the extent of what the product can retain.
- A synthetic default fleet of 25 devices, a quarter native (both collection channels side by side), without any person name.
- Twelve themes rotate over an hour — spike of blocked uploads, detected secrets, uncovered platform, denied model… — so a visitor who stays sees the **shape** change, not only the counters rise.

![Milvago - The demo data](/img/docs/en/avance-demo-instance-03.png)
