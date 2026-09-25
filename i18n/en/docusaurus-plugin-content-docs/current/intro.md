---
sidebar_position: 1
slug: /
title: Milvago Documentation
description: AI usage control · Shadow AI · Product documentation
---

<div className="mv-hero">

<span className="mv-eyebrow">AI usage control · Shadow AI · Product documentation</span>

# Welcome to the Milvago documentation

<p className="mv-hero-lead">Milvago shows which AI services your teams actually use, from which devices, and whether sensitive data is leaving — then lets you set signed rules that hold, even offline. Every console screen has its own page, written from the code: what it shows, what it refuses, and what it does not know.</p>

<div className="mv-cta">

<a className="mv-btn mv-btn--primary" href="/en/docs/installation/composants">Get started with Community</a>

<a className="mv-btn mv-btn--ghost" href="/en/docs/introduction/architecture">How it works</a>

</div>

<div className="mv-chips">

<span>Open source Community edition</span>

<span>Self-hosted on your infrastructure</span>

<span>Windows · Linux · 6 browsers</span>

</div>

</div>

<div className="mv-section">

<p className="mv-kicker">Sections</p>

<div className="mv-title">The whole documentation, in seven entry points</div>

<p className="mv-title-desc">The sections read in order: understand the product, install it, observe usage, administer the fleet and the policy, then the operator topics.</p>

<div className="mv-content-grid">

<div className="mv-content-card">

<strong>Introduction</strong>

<ul>

<li><a href="/en/docs/introduction/milvago">What is Milvago</a></li>

<li><a href="/en/docs/introduction/hardware-requirements">Hardware Requirements</a></li>

<li><a href="/en/docs/introduction/architecture">Technical architecture</a></li>

<li><a href="/en/docs/introduction/securite">Security mechanisms</a></li>

<li><a href="/en/docs/introduction/heritage-configuration">Configuration inheritance</a></li>

<li><a href="/en/docs/introduction/organisations-mere-fille">Parent and child organisations</a> <span className="mv-edition-tag">Enterprise</span></li>

</ul>

</div>

<div className="mv-content-card">

<strong>Installation</strong>

<ul>

<li><a href="/en/docs/installation/composants">Components</a></li>

<li><a href="/en/docs/installation/docker">Docker</a> (upcoming)</li>

<li><a href="/en/docs/installation/premiere-installation">First installation</a></li>

<li><a href="/en/docs/installation/helm">Kubernetes deployment</a></li>

<li><a href="/en/docs/installation/variables-environnement">Environment variables</a></li>

</ul>

</div>

<div className="mv-content-card">

<strong>Monitoring</strong>

<ul>

<li><a href="/en/docs/monitoring/vue-ensemble">Overview</a></li>

<li><a href="/en/docs/monitoring/conversations">Conversations</a></li>

<li><a href="/en/docs/monitoring/cartographie">Mapping</a></li>

<li><a href="/en/docs/monitoring/ai-applications">AI applications</a> <span className="mv-edition-tag">Enterprise</span></li>

<li><a href="/en/docs/monitoring/discovery">Discovery</a></li>

<li><a href="/en/docs/monitoring/reports">Reports</a></li>

</ul>

</div>

<div className="mv-content-card">

<strong>Fleet</strong>

<ul>

<li><a href="/en/docs/fleet/postes">Devices</a></li>

<li><a href="/en/docs/fleet/groupes">Device groups</a></li>

</ul>

</div>

<div className="mv-content-card">

<strong>Administration</strong>

<ul>

<li><a href="/en/docs/administration/membres">Members</a></li>

<li><a href="/en/docs/administration/roles">Roles</a></li>

<li><a href="/en/docs/administration/shadow-ai">Shadow AI</a></li>

<li><a href="/en/docs/administration/confidentialite">Privacy</a></li>

<li><a href="/en/docs/administration/organisations">Organisations</a> <span className="mv-edition-tag">Enterprise</span></li>

<li><a href="/en/docs/administration/audit">Audit log</a></li>

<li><a href="/en/docs/administration/parametres">Settings</a></li>

<li><a href="/en/docs/administration/observabilite">Observability</a> <span className="mv-edition-tag">Enterprise</span></li>

<li><a href="/en/docs/administration/deploiement">Deployment</a></li>

</ul>

</div>

<div className="mv-content-card">

<strong>My Profile</strong>

<ul>

<li><a href="/en/docs/mon-profil/profil">Configure my profile</a></li>

<li><a href="/en/docs/mon-profil/cles-api">API keys and MCP server</a> <span className="mv-edition-tag">MCP · Enterprise</span></li>

</ul>

</div>

<div className="mv-content-card">

<strong>Advanced</strong>

<ul>

<li><a href="/en/docs/avance/catalogue-editeur">Detection catalogue</a></li>

<li><a href="/en/docs/avance/demo-instance">Demo instance</a></li>

<li><a href="/en/docs/avance/service-editeur">Connect to the publisher service</a></li>

<li><a href="/en/docs/avance/agent-configuration">Agent configuration</a> (TOML Windows / Linux)</li>

<li><a href="/en/docs/avance/sso">SSO (Google / Microsoft Entra ID)</a></li>

<li><a href="/en/docs/avance/dimensionnement-postgresql-hpa">Sizing PostgreSQL and autoscaling</a></li>

</ul>

</div>

</div>

</div>

<div className="mv-section">

<p className="mv-kicker">Editions</p>

<div className="mv-title">Community or Enterprise</div>

<div className="mv-cards">

<div className="mv-card">

<p className="mv-card-num">COMMUNITY</p>

<h3>Free and open source</h3>

<p>One organisation, browser extension for ChatGPT and Claude, Windows and Linux agent, full console and REST API. Apache-2.0 and AGPL-3.0 licences.</p>

</div>

<div className="mv-card">

<p className="mv-card-num">ENTERPRISE</p>

<h3>Multi-organisation and full inventory</h3>

<p>Nine covered vendors, native AI applications, organisations isolated by Row-Level Security, usage sensitivity, model access control, MCP server, OTLP exports and API keys.</p>

</div>

</div>

Throughout the documentation, <strong>Enterprise</strong> callouts mark what does not apply to Community; everything else applies to both editions.

</div>

## Get started

Use this path to put Milvago into service:

1. Check the [technical requirements](introduction/hardware-requirements.md) and choose Docker or Kubernetes.
2. Install the [components](installation/composants.md), then open the console.
3. In the console, select **Administration → Settings** to confirm the public URL used by agents.
4. Open **Fleet → Devices**, download the agent, and distribute the browser extension through your enterprise policy.
5. Return to **Fleet → Devices** to check that the device appears and is in the expected state, then configure the policy in **Administration → Shadow AI**.

## Licence

- Extension, Rust agent/service and CRX tool: Apache-2.0.
- Backend and console: AGPL-3.0.
