---
sidebar_position: 3
title: Technical architecture
---

# Technical architecture

import ArchitectureDiagram from '@site/src/components/ArchitectureDiagram';

Milvago consists of four parts, connected by bounded and signed channels: the **browser extension**, the **local agent**, the **server** and the **console**.

<ArchitectureDiagram />

## Flows and ports

The diagram arrows show **who opens the connection**. Responses use the same channel. The agent contacts the server; the server does not connect to endpoints. Browser traffic to an AI site does not pass through the Milvago server.

### Platform network

| Initiator → destination | Protocol and port | Use and configuration |
| --- | --- | --- |
| Agent → instance entry point | HTTPS, usually TCP **443** | Signed policies, events, heartbeat, catalog, and updates. The port comes from the provisioning URL. |
| Console browser → instance entry point | HTTPS, usually TCP **443** | React console and API on the same origin; no separate Node.js server. |
| Reverse proxy / Ingress / Gateway API → Go server | HTTP, TCP **4020** by default | Listens on `LISTEN_ADDR=:4020`. TLS termination must be configured upstream; the binary builds an `http.Server` and calls `Serve` on a `net.Listen` listener, not an integrated TLS server. |
| Go server → PostgreSQL | PostgreSQL, TCP **5432** in Compose | `DATABASE_URL` and `MIGRATION_DATABASE_URL` connections, on a private network. |
| Console browser → Keycloak | HTTPS, usually TCP **443** in production | Sign-in, MFA, and OIDC redirects through the issuer's public URL. Server-only access to Keycloak is insufficient. |
| Go server → Keycloak | HTTP **8080** in Compose; otherwise the port of the chosen URL | OIDC discovery, public keys, code exchange, and identity administration. `OIDC_INTERNAL_URL` can route these calls over the private network while retaining the public issuer. |
| Keycloak → PostgreSQL | PostgreSQL, TCP **5432** in Compose | Dedicated identity database, separate from application databases. |
| API client / MCP client → instance | HTTPS, public URL port | REST API; Enterprise MCP at `/mcp`, with no additional listening port. |
| Server → external OTLP collector | OTLP/HTTP JSON, configured URL port | Enterprise: `/v1/logs` and `/v1/metrics`. **4318** is the example collector port, not a Milvago listener or required port. Internal HTTP requires `MILVAGO_OTEL_HTTP_HOSTS` authorization. |
| Monitoring tool → server | HTTP(S), same port as the instance | `/metrics` when a monitoring token is configured; `/health/live` and `/health` probes also use the application port. |

For Kubernetes, plan separate API, maintenance and Enterprise export roles. The API and exports can use independent HPAs; keep the API’s **ClusterIP Service 4020 → 4020** internal. Provision the HTTPS entry point through Ingress or Gateway API, certificates, PostgreSQL and Keycloak separately. Do not publish the private ports above to the Internet. See [Sizing PostgreSQL and autoscaling](../avance/dimensionnement-postgresql-hpa.md).

### Local endpoint communications

| Initiator → destination | Local transport / port | Function |
| --- | --- | --- |
| Extension → Native Messaging relay | Framed standard input/output; **no TCP port** | Exchanges between the extension and the binary launched by the browser. |
| Relay → agent service | Windows: named pipe `milvago-browser` or `milvago-commercial`; Linux: `/run/milvago/browser.sock` or `commercial.sock` | Policy, decisions, and events over IPC; no network opening is needed. |
| Chromium-based browsers → agent | HTTP **127.0.0.1:17641** (Community), **:17642** (Enterprise) | CRX and `/ext/update.xml` manifest, from the embedded package. |
| Firefox → agent | HTTPS **127.0.0.1:17651** (Community), **:17652** (Enterprise) | Signed XPI and `/ext/updates.json`; local certificate managed by the installation. |
| Browser → AI site | HTTPS, usually TCP **443** | Direct traffic to the provider, controlled by the extension on covered sites. |
| Enterprise agent → native collector | Local IPC, without TCP | The agent requests observations and then acknowledges their persistence. The collector does not push directly to the server. |
| Native tools → Enterprise native collector | OTLP/HTTP protobuf on **127.0.0.1**, port assigned at first start then retained | `/v1/logs`, authentication, and attribution to the calling process; this port is not fixed at 4318. |
| Covered native clients → Enterprise filter | TLS proxy on **127.0.0.1:47831–47834** | Respectively Codex, Claude Code, Claude Desktop, Claude Desktop Agent; filter outbound connections to providers on **443**. Only for configured clients. |
| Enterprise detection → local model services | Loopback probes **11434, 1234, 1337, 4891** | Target ports allowed for local inventory; these are not servers opened by Milvago. |

Loopback listeners remain accessible only on the endpoint. They do not justify any inbound rule from the LAN. The presence of a port in the table does not mean that its optional feature is active.

### Development Compose ports

All publications are bound to `127.0.0.1`: **4020 → 4020** for Community, **4120 → 4020** for Enterprise, **4080 → 8080** for Keycloak, **55432 → 5432** for PostgreSQL, and **4081 → 8025** for the test mail server interface. These values are Compose defaults and can be replaced by its variables. They are not a production port plan.

## The browser extension

A service worker in Chrome, Edge, Brave, Vivaldi, and Arc, and background scripts in Firefox, apply the policy on covered AI sites. The extension is driven by a **signed detection catalog** — an engine and data: measured routes of the sites (prompt routes, upload routes), DOM selectors of the composer, field paths. It applies no heuristic outside those measured routes, and coverage depends on the served edition.

Without a valid policy (agent down, revocation), it **fails closed**: the covered AI surface is sealed, never left open by default. The signed policy is persisted locally and re-read by the background component, with revision and expiration checked at every read.

## Supported browsers

The product scope includes six browsers: Google Chrome, Microsoft Edge, Brave, Vivaldi, Mozilla Firefox, and Arc. Standalone Chromium is not included, even where it remains in historical scripts. No macOS, Safari, or mobile agent is declared.

| Browser | Family | Windows | Linux |
| --- | --- | --- | --- |
| Google Chrome | Chromium | MSI policy and local CRX. For this private extension, the PC must be joined to an Active Directory domain or Microsoft Entra ID. | Native Messaging integration through the system script; the extension and profile remain to be administered. |
| Microsoft Edge | Chromium | MSI policy and local CRX. | Native Messaging integration through the system script; the extension and profile remain to be administered. |
| Brave | Chromium | MSI policy and local CRX. | Native Messaging integration through the system script; the extension and profile remain to be administered. |
| Vivaldi | Chromium | MSI policy, local CRX, and Native Messaging host. | No dedicated automated Vivaldi path; the extension and profile remain to be administered. |
| Mozilla Firefox | Gecko | MSI policy, signed XPI, and Native Messaging host. | Native Messaging integration through the system script; the extension and profile remain to be administered. |
| Arc | Chromium | Supported: Arc policy and local CRX. MSI installation and content control remain to be qualified separately. | Not declared. |

The Chrome extension is private and is not published in the Chrome Web Store. For the Windows policy deployment described here, the PC must be joined to an Active Directory domain or Microsoft Entra ID; installing the Native Messaging host alone does not meet this requirement.

Firefox 140.0 or later is required on every operating system; Firefox Release and Beta require a signed XPI. Chromium browsers have no minimum version set in the manifest; target stable versions remain to be qualified. The Linux bundle does not configure browser profiles by itself: `deploy/install-browser.sh` installs the system service and Native Messaging manifests. The platform-distributed RPM installs the same system systemd service, under the `milvago-agent` user, and the same machine-wide Native Messaging manifests as `deploy/install-browser.sh`.

Network controls using `webRequestBlocking` require a managed extension installation in browsers that reserve this capability for policy-installed extensions. A manual installation does not demonstrate the same control.

AI-site coverage is independent of the browser. Community embeds capture for ChatGPT and Claude, while both editions report presence on known platforms separately without re-enabling capture. Enterprise covers nine providers. Qualification results apply only to the edition, browser, operating system, and executed scenario: a dated note or a built artifact does not generalize to another context.

## The agent: a service, not a user task

The agent core is a **service** (Rust): `endpoint` in Community and `bridge` in Enterprise. On Windows, it runs without a user session under NetworkService, with a reduced privilege set (`SeChangeNotifyPrivilege` and `SeCreateGlobalPrivilege` only) and ProgramData folders whose ACL now names the service's own SID rather than NetworkService as a whole. On Linux, the RPM and the standalone `deploy/install-browser.sh` script both install a system systemd service, under the `milvago-agent` user, with machine-wide Native Messaging manifests. It runs two loops:

- the **synchronization** loop: policy, event queue, updates, and the inventory in Enterprise;
- a **local IPC server**, the only contact point of the browser.

The browser cannot talk to a service (session 0). The same binary, launched by the browser as a Native Messaging host, acts as a **relay**: it forwards frames to the service over a local channel (Windows named pipe with a hardened descriptor, Unix socket). The device identity remains that of the service, never that of the client.

The device state lives in a store **encrypted by the machine** (DPAPI under Windows): credentials, cached policy, event queue. A break between the agent and the server does not stop the browser: while the local agent answers over the authenticated channel, it applies its last verified local policy and keeps events until synchronization resumes. The **five-minute** grace period starts only when the SYSTEM service can no longer reach that local agent; when it expires, the AI surface is sealed. An explicit revocation or refusal blocks immediately.

## The server

A **Go** backend serving:

- **ingestion** from the agents: events, heartbeats (OS user of the active session, purely informative), inventory, with rate limits per device;
- the signed **detection catalog** and its versioned publication;
- the **console** and the **REST API** with permission-based RBAC;
- **updates**: immutable MSI and signed update manifest, frozen into the image;
- storage: **PostgreSQL**, with isolation by **Row-Level Security** in Enterprise.

The console (React) is served by the same binary; **no external resource** is loaded at runtime — bundle, fonts and theme are embedded. Authentication goes through Keycloak (OIDC Authorization Code + PKCE); the login theme follows the same tokens.

## In Enterprise, three additional privileged components

- The **native collector** (`collector`, LocalSystem) reads the native AI applications declared by the policy, without ever sharing the agent's store: it has its own anchor, its own key, and trusts nothing the agent stores. The agent **pulls** the collector's records, never the reverse.
- The **network filter** (`filter`) observes the traffic of the covered services on the machine.
- The **inventory** merges AI applications per device (never a destructive snapshot: an empty reading erases nothing), with `first_seen` to answer the question "what appeared this week?".

## The channels, in summary

For `/v2/events`, the agent first writes the event to its encrypted local store. The server returns its identifier in `accepted_ids` only after validating the device and committing PostgreSQL. If PostgreSQL is unavailable, the API temporarily returns `503`: the agent keeps the same identifier and retries. Replay is expected and remains idempotent; a received acknowledgement means PostgreSQL has taken custody of the event.

| Channel | Direction | Content |
| --- | --- | --- |
| `/v3/policy` | extension → agent → server | **projected** policy: services, collection, model controls; keywords and exceptions do not leave it |
| `/v2/events` | agent → server | Shadow AI events, in batches, acknowledged |
| `/v2/heartbeat` | agent → server | OS user of the active session (information, never an authority), extensions seen |
| `/v1/inventory` | agent → server | detected AI applications (Enterprise) |

A synchronization failure is not hidden: the agent logs a single state (`synchronized`, `deferred` with a valid cached authorization, `blocked`), with the classified cause and the proposed remedy — never a transport detail or an identifier.
