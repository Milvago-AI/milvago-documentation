---
sidebar_position: 1
title: Qu'est-ce que Milvago
---

# Qu'est-ce que Milvago

Milvago donne à une organisation une vue exacte des usages d'IA : quels services sont sollicités, depuis quels postes, à quelle fréquence, et ce que la politique autorise ou bloque. C'est une plateforme de **détection et de gouvernance du « Shadow AI »** : le parcours voulu est comprendre les usages, identifier les postes, définir la politique, vérifier les effets.

La console, la page de connexion et la documentation partagent une palette adoucie : fond bleu ardoise en mode sombre, fond gris bleuté et cartes blanches en mode clair. Le bleu distingue les actions ; le vert, l’ambre et le rouge accompagnent les libellés d’état.

![Milvago - Qu'est-ce que Milvago](/img/docs/fr/introduction-milvago-01.png)

## Ce que le produit conserve — et ce qu'il ne conserve pas

Par défaut, seuls les **faits** sont conservés : un service a été atteint, un prompt est parti, un blocage a eu lieu. S'y ajoutent les **noms des fichiers** envoyés à un service d'IA, jamais leurs octets.

La **capture du texte des prompts et des réponses** existe, mais elle est **désactivée par défaut** et soumise à une autorisation explicite dans l'outil. Quand elle est activée, la lecture d'un contenu reste soumise à des verrous de confidentialité (session valide, MFA fraîche, motif écrit) et chaque lecture est auditée. Le produit dit cette faculté franchement, à l'endroit où la question se pose : une formulation absolue (« jamais collecté ») contredite par une option du produit serait une faute, pas une simplification.

## Ce que chaque composant peut voir

L'honnêteté sur les limites fait partie du produit, et chaque écran la rappelle : un événement navigateur n'est pas un inventaire logiciel ; une présence détectée n'établit ni un usage ni un envoi ; un outil présent sur un poste n'infère pas son utilisateur. Un service visité sans requête observée est un **signal** qu'un détecteur demande une mise à jour, pas une preuve d'usage.

## Les trois gestes du produit

1. **Observer** — l'extension et l'agent remontent des événements factuels : navigations, requêtes, décisions, plateformes atteintes.
2. **Comprendre** — la console met ces faits en perspective : vue d'ensemble, conversations, cartographie, rapports agrégés.
3. **Décider** — la politique Shadow AI observe, bloque ou masque ; le contrôle des modèles autorise ou refuse un modèle ; Fleet distribue la politique aux postes.

## Les éditions

- **Community** : extension limitée à ChatGPT et Claude, agent Windows et Linux, console mono-organisation. Le paquet construit n'embarque même pas les adaptateurs des autres fournisseurs.
- **Enterprise** : multi-organisations isolées par PostgreSQL, neuf fournisseurs couverts, inventaire natif des applications IA, groupes de postes, contrôle des modèles, sensibilité des usages, serveur MCP, observabilité OTLP.

Une édition déclarée par le client n'accorde jamais d'autorisation : les gardes sont serveur, jamais un champ client.

## Le ton

Sobre, factuel, précis. Les états vides et les erreurs sont visibles et expliqués, jamais maquillés ; aucune donnée fictive n'est présentée comme réelle. La promesse : **voir juste, agir avec confiance**.

![Milvago - Le ton](/img/docs/fr/introduction-milvago-02.png)
