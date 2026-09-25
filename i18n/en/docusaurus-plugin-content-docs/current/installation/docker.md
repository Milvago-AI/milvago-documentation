---
sidebar_position: 2
title: Docker Installation
---

# Docker Installation

:::note[Coming soon]

This page is being prepared. The Docker deployment already exists in the product (the server, console and agent MSI images feed the current `compose`); this page will document it step by step.

:::

Planned content:

- the official images of both editions (server, console, agent MSI + update manifest);
- the `compose` file and the environment variables (`SESSION_KEY`, `CONTENT_KEYS`, `POLICY_SIGNING_KEY`, `MILVAGO_INSTALLER_DIRECTORY`);
- PostgreSQL and the startup migrations;
- going live and the verifications after an image replacement.

## First start

Once the stack is running, open the console: with no administrator yet, it shows the [first installation](premiere-installation.md) wizard. Enter the `MILVAGO_SETUP_TOKEN` value generated into `.env`, then follow the wizard.
