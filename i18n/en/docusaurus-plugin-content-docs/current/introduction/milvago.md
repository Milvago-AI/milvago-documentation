---
sidebar_position: 1
title: What is Milvago
---

# What is Milvago

Milvago gives an organization an exact view of AI usage: which services are called, from which devices, how often, and what the policy allows or blocks. It is a platform for **Shadow AI detection and governance**: the intended journey is to understand usage, identify devices, define the policy, verify the effects.

The console, sign-in page and documentation share a softer palette: slate blue backgrounds in dark mode, pale blue-grey backgrounds and white cards in light mode. Blue identifies actions; green, amber and red accompany status labels.

[IMAGEAMETTREICI 01]

## What the product keeps — and what it does not keep

By default, only the **facts** are kept: a service was reached, a prompt was sent, a block took place. Added to these are the **names of the files** sent to an AI service, never their bytes.

**Prompt and response text capture** exists, but it is **disabled by default** and subject to an explicit authorization in the tool. When it is enabled, reading a stored content remains subject to privacy locks (valid session, fresh MFA, written reason) and every read is audited. The product states this capability plainly, where the question arises: an absolute claim ("never collected") contradicted by a product option would be a fault, not a simplification.

## What each component can see

Honesty about limits is part of the product, and every screen restates it: a browser event is not a software inventory; a detected presence establishes neither a usage nor a send; a tool present on a device does not infer its user. A service visited without an observed request is a **signal** that a detector asks for an update, not a proof of usage.

## The three gestures of the product

1. **Observe** — the extension and the agent report factual events: navigations, requests, decisions, platforms reached.
2. **Understand** — the console puts these facts into perspective: overview, conversations, map, aggregate reports.
3. **Decide** — the Shadow AI policy observes, blocks or masks; model controls allow or deny a model; Fleet distributes the policy to the devices.

## The editions

- **Community**: extension limited to ChatGPT and Claude, Windows and Linux agent, single-organization console. The built package does not even embed the adapters of the other providers.
- **Enterprise**: multi-organization isolated by PostgreSQL, nine covered providers, native inventory of AI applications, device groups, model controls, usage sensitivity, MCP server, OTLP observability.

An edition declared by the client never grants authorization: the guards are server-side, never a client field.

## The tone

Sober, factual, precise. Empty states and errors are visible and explained, never disguised; no fictional data is presented as real. The promise: **see accurately, act with confidence**.

[IMAGEAMETTREICI 02]
