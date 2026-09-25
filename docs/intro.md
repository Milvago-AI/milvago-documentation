---
sidebar_position: 1
slug: /
title: Documentation Milvago
description: Contrôle des usages IA · Shadow AI · Documentation produit
---

<div className="mv-hero">

<span className="mv-eyebrow">Contrôle des usages IA · Shadow AI · Documentation produit</span>

# Bienvenue dans la documentation Milvago

<p className="mv-hero-lead">Milvago montre quels services d'IA vos équipes utilisent réellement, depuis quels postes, et si des données sensibles partent — puis laisse poser des règles signées qui tiennent, même hors connexion. Chaque écran de la console a sa page, écrite à partir du code : ce qu'il montre, ce qu'il refuse, et ce qu'il ne sait pas.</p>

<div className="mv-cta">

<a className="mv-btn mv-btn--primary" href="/docs/installation/composants">Premiers pas avec Community</a>

<a className="mv-btn mv-btn--ghost" href="/docs/introduction/architecture">Comment ça fonctionne</a>

</div>

<div className="mv-chips">

<span>Community open source</span>

<span>Auto-hébergé sur votre infrastructure</span>

<span>Windows · Linux · 6 navigateurs</span>

</div>

</div>

<div className="mv-section">

<p className="mv-kicker">Sections</p>

<div className="mv-title">Toute la documentation, en sept points d'entrée</div>

<p className="mv-title-desc">Les sections se lisent dans l'ordre : comprendre le produit, l'installer, observer les usages, administrer le parc et la politique, puis les sujets d'exploitation.</p>

<div className="mv-content-grid">

<div className="mv-content-card">

<strong>Introduction</strong>

<ul>

<li><a href="/docs/introduction/milvago">Qu'est-ce que Milvago</a></li>

<li><a href="/docs/introduction/hardware-requirements">Prérequis technique</a></li>

<li><a href="/docs/introduction/architecture">Architecture technique</a></li>

<li><a href="/docs/introduction/securite">Mécanismes de sécurité</a></li>

<li><a href="/docs/introduction/heritage-configuration">Héritage de la configuration</a></li>

<li><a href="/docs/introduction/organisations-mere-fille">Organisations mère et fille</a> <span className="mv-edition-tag">Enterprise</span></li>

</ul>

</div>

<div className="mv-content-card">

<strong>Installation</strong>

<ul>

<li><a href="/docs/installation/composants">Composants</a></li>

<li><a href="/docs/installation/docker">Docker</a> (à venir)</li>

<li><a href="/docs/installation/premiere-installation">Première installation</a></li>

<li><a href="/docs/installation/helm">Déploiement Kubernetes</a></li>

<li><a href="/docs/installation/variables-environnement">Variables d'environnement</a></li>

</ul>

</div>

<div className="mv-content-card">

<strong>Supervision</strong>

<ul>

<li><a href="/docs/monitoring/vue-ensemble">Vue d'ensemble</a></li>

<li><a href="/docs/monitoring/conversations">Conversations</a></li>

<li><a href="/docs/monitoring/cartographie">Cartographie</a></li>

<li><a href="/docs/monitoring/ai-applications">AI applications</a> <span className="mv-edition-tag">Enterprise</span></li>

<li><a href="/docs/monitoring/discovery">Discovery</a></li>

<li><a href="/docs/monitoring/reports">Rapports</a></li>

</ul>

</div>

<div className="mv-content-card">

<strong>Parc</strong>

<ul>

<li><a href="/docs/fleet/postes">Postes</a></li>

<li><a href="/docs/fleet/groupes">Groupes de postes</a></li>

</ul>

</div>

<div className="mv-content-card">

<strong>Administration</strong>

<ul>

<li><a href="/docs/administration/membres">Membres</a></li>

<li><a href="/docs/administration/roles">Rôles</a></li>

<li><a href="/docs/administration/shadow-ai">Shadow AI</a></li>

<li><a href="/docs/administration/confidentialite">Confidentialité</a></li>

<li><a href="/docs/administration/organisations">Organisations</a> <span className="mv-edition-tag">Enterprise</span></li>

<li><a href="/docs/administration/audit">Journal d'audit</a></li>

<li><a href="/docs/administration/parametres">Paramètres</a></li>

<li><a href="/docs/administration/observabilite">Observabilité</a> <span className="mv-edition-tag">Enterprise</span></li>

<li><a href="/docs/administration/deploiement">Déploiement</a></li>

</ul>

</div>

<div className="mv-content-card">

<strong>Mon Profil</strong>

<ul>

<li><a href="/docs/mon-profil/profil">Configurer mon profil</a></li>

<li><a href="/docs/mon-profil/cles-api">Clés API et serveur MCP</a> <span className="mv-edition-tag">MCP · Enterprise</span></li>

</ul>

</div>

<div className="mv-content-card">

<strong>Avancé</strong>

<ul>

<li><a href="/docs/avance/catalogue-editeur">Catalogue de détection</a></li>

<li><a href="/docs/avance/demo-instance">Instance de démonstration</a></li>

<li><a href="/docs/avance/service-editeur">Connexion au service éditeur</a></li>

<li><a href="/docs/avance/agent-configuration">Configuration de l'agent</a> (TOML Windows / Linux)</li>

<li><a href="/docs/avance/sso">SSO (Google / Microsoft Entra ID)</a></li>

<li><a href="/docs/avance/dimensionnement-postgresql-hpa">Dimensionner PostgreSQL et l'autoscaling</a></li>

</ul>

</div>

</div>

</div>

<div className="mv-section">

<p className="mv-kicker">Éditions</p>

<div className="mv-title">Community ou Enterprise</div>

<div className="mv-cards">

<div className="mv-card">

<p className="mv-card-num">COMMUNITY</p>

<h3>Gratuite et open source</h3>

<p>Une organisation, extension navigateur pour ChatGPT et Claude, agent Windows et Linux, console complète et API REST. Licences Apache-2.0 et AGPL-3.0.</p>

</div>

<div className="mv-card">

<p className="mv-card-num">ENTERPRISE</p>

<h3>Multi-organisation et inventaire complet</h3>

<p>Neuf fournisseurs couverts, applications IA natives, organisations isolées par Row-Level Security, sensibilité des usages, contrôle des modèles, serveur MCP, exports OTLP et clés API.</p>

</div>

</div>

Dans la documentation, les encadrés <strong>Enterprise</strong> signalent ce qui ne s'applique pas à Community ; tout le reste vaut pour les deux éditions.

</div>

## Commencer

Pour mettre Milvago en service, suivez ce parcours :

1. Vérifiez les [prérequis techniques](introduction/hardware-requirements.md) et choisissez Docker ou Kubernetes.
2. Installez les [composants](installation/composants.md), puis ouvrez la console.
3. Dans la console, sélectionnez **Administration → Paramètres** pour confirmer l’URL publique utilisée par les agents.
4. Ouvrez **Parc → Postes**, téléchargez l’agent et distribuez l’extension au navigateur par votre politique d’entreprise.
5. Revenez dans **Parc → Postes** pour vérifier l’apparition et l’état du poste, puis configurez la politique dans **Administration → Shadow AI**.

## Licence

- Extension, agent/service Rust et outil CRX : Apache-2.0.
- Backend et console : AGPL-3.0.
