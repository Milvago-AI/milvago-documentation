---
sidebar_position: 5
title: Environment variables
---

# Environment variables

All server configuration goes through the environment: the console never reads one and nothing is set at runtime. A missing or invalid variable stops the server with the exact message of the problem — no silent fallback. Required variables also depend on the process role.

## Process roles

`MILVAGO_ROLE` selects the process responsibility. Its default value, `all`, preserves the combined process for existing deployments. In Kubernetes, separate the roles and mount only the secrets needed by each pod.

| Value | Responsibility | Notes |
| --- | --- | --- |
| `all` | API, maintenance, Enterprise exports, and migrations | compatibility mode; combines the relevant role secrets |
| `migrate` | migrations and initialization | uses `MIGRATION_DATABASE_URL`; runs as a Job before the API |
| `api` | HTTP, console, and agents | receives neither a migration URL nor an initialization identity |
| `exports` | Enterprise exports | serves no console and runs no migration |
| `maintenance` | maintenance work | serves no console and runs no migration |

## Required by role

| Variable | Role |
| --- | --- |
| `DATABASE_URL` | runtime PostgreSQL connection |
| `MIGRATION_DATABASE_URL` | connection used only by `all` and `migrate` for migrations (privileged role) |
| `APP_URL` | HTTP or HTTPS origin of the application; HTTPS enables secure cookies |
| `OIDC_ISSUER` | Keycloak issuer (HTTP or HTTPS) |
| `OIDC_CLIENT_ID` / `OIDC_CLIENT_SECRET` | OIDC client of the console |
| `SESSION_KEY` | encryption root of the OIDC session tokens (AES-256-GCM, 32 bytes in standard base64) |
| `CONTENT_KEYS` | roots of the sealed content, format `version:base64` (`1:<32 bytes base64>,2:…`); the highest version seals, earlier ones only open |
| `POLICY_SIGNING_KEY` | Ed25519 seed for signing policies and catalogs (32 bytes in base64) |

`DATABASE_URL` and `CONTENT_KEYS` remain necessary for roles that access data. `APP_URL`, OIDC configuration, `SESSION_KEY`, and `POLICY_SIGNING_KEY` are required by the API. `migrate` also requires `APP_URL`, and `maintenance` requires the OIDC issuer. In Milvago Enterprise, `migrate` also requires `OIDC_ISSUER`, unless the MCP server is disabled (`MILVAGO_MCP`). The `exports` role is accepted only in Milvago Enterprise and needs neither console session secrets, nor a migration URL, nor an initialization identity.

:::warning
`SESSION_KEY` and `CONTENT_KEYS` have distinct roles **by design**: the session is disposable (a rotation costs re-logins), the sealed content is durable. A `CONTENT_KEYS` entry equal to `SESSION_KEY` is refused at startup.
:::

## With a default value

| Variable | Default | Role |
| --- | --- | --- |
| `DB_RUNTIME_ROLE` | `milvago_runtime` | PostgreSQL role of the runtime (RLS in Enterprise); format `^[a-z_][a-z0-9_]{0,62}$` |
| `STATIC_DIR` | `../console/dist` | console bundle served by the same binary |
| `LISTEN_ADDR` | `:4020` | HTTP listening port |
| `COMMUNITY_ORG_NAME` | `Milvago` | name of the Community organization created at startup |
| `PUBLIC_URL` | value of `APP_URL` | public origin shown to the agents (origin only: no path, no query, no fragment) |
| `OIDC_INTERNAL_URL` | — | OIDC issuer as seen from the internal network, if different |
| `EDITION` | fixed at compile time | must match the compiled composition of the binary, otherwise refused at startup |
| `BOOTSTRAP_EMAIL` | empty | address of the first account, created automatically by `all` or `migrate` ("automatic mode"). Left empty, the [first installation](premiere-installation.md) wizard creates this account instead of an import. |
| `OIDC_ADMIN_CLIENT_ID` / `OIDC_ADMIN_CLIENT_SECRET` | — | required for profile, invitation, directory and SSO operations by the `api` or `all` roles (with an existing Keycloak, grant this service account `manage-identity-providers` and `view-identity-providers`, and give the console client the `basic` scope, which carries `auth_time`), for the [first installation](premiere-installation.md) wizard, and for Keycloak maintenance checks; not required at startup and not used by exports |

## Optional `MILVAGO_*`

| Variable | Effect |
| --- | --- |
| `MILVAGO_INSTALLER_DIRECTORY` | directory of the MSIs and manifests served to the devices; updates are served next to the installers |
| `MILVAGO_UPDATE_PUBLIC_KEY` | verification key of the update manifests (32 bytes base64), separate from the policy signing key |
| `MILVAGO_SETUP_TOKEN` | one-time token of at least 32 characters that opens the [first installation](premiere-installation.md) wizard while `BOOTSTRAP_EMAIL` is empty; the server keeps only its SHA-256 digest, never logged |
| `MILVAGO_SHADOW_METRICS` | closes `GET /api/shadow/metrics` on the instance if `0`/`false`/`off`/`no`; open by default |
| `MILVAGO_MCP` | closes the Enterprise MCP server if `0`/`false`/`off`/`no`; served by default (the absence of the variable is the normal state) |
| `MILVAGO_DEBUG` | opens the detection catalog editor and its write routes if `1`/`true`/`on`/`yes`; publication remains subject to the root Owner and a fresh MFA — this is a noise setting, not a security boundary |
| `MILVAGO_DEMO_READONLY` | refuses every console mutation, whatever the role (unsupervised demo instance); device ingestion remains deliberately out of scope |
| `MILVAGO_DEMO_MCP_KEY` | MCP key displayed on the profile page of a demo instance — kept only if `MILVAGO_DEMO_READONLY` is active: an instance that accepts writes never displays a key it did not serve |
| `MILVAGO_PUBLISHER_URL` + `MILVAGO_PUBLISHER_CREDENTIAL` + `MILVAGO_PUBLISHER_PUBLIC_KEY` | connection to the publisher service: all three values are provided together; see [Connect to the publisher service](../avance/service-editeur.md) |
| `MILVAGO_METRICS_TOKEN` | deliberate token that exposes the metrics route beyond the console |
| `MILVAGO_OTEL_HTTP_HOSTS` | allowed OTLP HTTP hosts, comma-separated; each entry is strictly validated (host only, no user, path, query or fragment) |
| `MILVAGO_EXPORT_CA_FILE` | PEM file (≤ 1 MB) of root authorities for the export destinations; must contain at least one usable certificate |

## Keycloak features to disable

"Milvago disables the Keycloak features it does not use and that a self-registered client could turn on to obtain tokens without a redirect address: `KC_FEATURES_DISABLED=device-flow,ciba,token-exchange-standard`. An existing identity provider serving Milvago must apply the same setting."

## Startup refusals are safeguards

The configuration is validated as a whole: roots of exactly 32 bytes, positive and unique `CONTENT_KEYS` versions, content keys distinct from `SESSION_KEY`, HTTP or HTTPS origins, well-formed OIDC issuer, well-formed database roles. A configuration defect is an error, not a silent substitution by a root of another use.
