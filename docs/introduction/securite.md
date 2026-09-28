---
sidebar_position: 4
title: Security mechanisms
---

# Security mechanisms

Milvago's safeguards fall into four layers: **policy integrity**, **local hardening**, **server-side isolation** and **access control**. No layer relies on trusting another.

![Milvago - Security mechanisms](/img/docs/en/introduction-securite-01.png)

## Signed and ephemeral policies

Everything that drives a device is **signed server-side and verified agent-side**:

- the **detection catalog** (engine + data) carries a monotone revision and signed data; an older catalog, with fewer entries, is not interchangeable within its validity window;
- the **policy** applied by the extension requires a revision and an expiration (at most 15 minutes): an expired policy is rejected, not adapted;
- the **update manifest** is signed; a version upgrade refuses the replay of an already-installed version, and any signed rollback does not reopen a downgrade — a local SYSTEM applier verifies the health of the current service before announcing "installed", and a protected receipt can prove a rollback.

## Local hardening (device)

- **Fail closed everywhere**: without a valid policy, the extension seals the covered AI surface; the relay refuses an IPC channel squatted by a user process (check on the **object owner**, not on a falsifiable process identifier).
- **Hardened IPC channel**: restricted descriptor, anti-squatting (`FIRST_PIPE_INSTANCE`, SYSTEM owner), anti-impersonation (client impersonation to read its token, authority fields replaced by the service), connection ceiling **per caller** — a local process cannot deprive the whole device of decisions.
- **The service does not disclose its policy**: the `/v3/policy` projection removes keywords, exceptions, custom masking expressions and the block message from the channel visible to any local user.
- **The collector trusts nothing from the agent**: separate state and anchor, channel reserved to services, and file reads validated **on the open handle**, not on the path — a substituted junction yields an error, not a read.
- **Privileged updates without a downgrade primitive**: the applier service ignores the caller's arguments, re-reads the `binPath` set by SYSTEM, and refuses any installation whose scope exceeds its own.

## Server-side isolation and controls

- **Row-Level Security**: in Enterprise, each organization only accesses its own rows at the database level — not an application-level filter; isolation is proven by the test suite.
- **RBAC by live permissions**: routes require permissions verified on every call; an edition declared by the client grants nothing.
- **Privacy locks**: machine names, conversation reading, candidate domain discovery — each route requires a valid session, **fresh MFA** and a **written reason**; a privacy change carries its reason and its revision.
- **Non-purgeable audit log**: 730-day retention enforced by a database trigger — no code path, not even a compromised role, can shorten the trace of actions.
- **Hashed API keys** (SHA-256, 256 bits from `crypto/rand`) with bounded authority (`keyOnly` for the MCP server, read-only); expirations and revocations verified on every call.
- **Sealed content**: all stored text and all durable secrets go through **AES-256-GCM** encryption whose envelope carries its own version, bound to the ciphertext — a relabeled envelope cannot open the bytes with another key; two distinct key roots separate cheap rotation (sessions) from re-sealing (content).
- **Defensive ingestion**: strict JSON documents (unknown fields rejected), size bounds, OS user sanitization (never the service account), Origin/CSRF validation on the console side, rate limits per device and per route.

## The posture

![Milvago - The posture](/img/docs/en/introduction-securite-02.png)

Three principles run through all these mechanisms:

1. **Failures are closed.** Agent unreachable, service down, suspicious channel: the AI surface is blocked, never left open while waiting for better. The only documented exception: a channel that refuses *every* non-identifiable server would break legitimate enrollment — the case is bounded and documented, never extended.
2. **Presence is not usage.** No mechanism turns a detection into an accusation: attributing a person requires a verified OIDC association; everything else is stated as "informative".
3. **The default of privilege is a decision, not an oversight.** Each privileged component holds its own channel, its own anchor and its own store; the agent never receives a power it did not ask for.
