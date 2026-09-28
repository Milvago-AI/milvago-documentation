---
sidebar_position: 1
title: Advanced topics
---

# Advanced topics

This section gathers what concerns operators and integration, after the discovery of the common screens.

## Content

- [Detection catalogue](catalogue-editeur.md) — the editor behind `MILVAGO_DEBUG`, publication under revision, detector health.
- [Demo instance](demo-instance.md) — `MILVAGO_DEMO_READONLY` and `MILVAGO_DEMO_MCP_KEY`, the stack, the four read-only layers.
- [Connect to the publisher service](service-editeur.md) — `MILVAGO_PUBLISHER_*` variables and choices available in the console.
- [Agent configuration](agent-configuration.md) — the `milvago.toml` file under Windows and Linux, parameter by parameter.
- [SSO (Google / Microsoft Entra ID)](sso.md) — Keycloak identity brokering, linking at first login, domain or tenant restriction.

![Milvago - Content](/img/docs/en/avance-index-01.png)

:::note
These topics do not all have the same configuration point: the server uses the environment, the agent uses its TOML file, while the catalog and sharing choices are set in the console. See [Environment variables](../installation/variables-environnement.md).
:::
