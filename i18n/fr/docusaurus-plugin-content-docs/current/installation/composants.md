---
sidebar_position: 1
title: Composants
---

# Installation des composants

## Parcours d'installation

1. Déployez le serveur Milvago, puis ouvrez la console avec un compte administrateur.
2. Dans **Administration → Paramètres**, définissez et confirmez l’URL HTTPS publique qui sera portée par les agents.
3. Ouvrez **Parc → Postes** et sélectionnez **Télécharger l’agent** pour obtenir le paquet de votre édition.
4. Installez ce paquet sur le poste, puis distribuez l’extension adaptée au navigateur par votre politique d’entreprise.
5. Revenez dans **Parc → Postes** : approuvez le poste s’il est en attente et vérifiez ses derniers contacts ainsi que ses extensions navigateur.

## Extension navigateur

L'extension est distribuée en deux variantes d'édition. En Community, seuls les adaptateurs ChatGPT et Claude sont embarqués : aucun catalogue ni script de contenu des autres fournisseurs n'est présent dans le paquet.

![Milvago - Extension navigateur](/img/docs/fr/installation-composants-01.png)

- **Chrome / Edge / Brave / Vivaldi** : paquet CRX, déployé sous Windows par politique d'entreprise (`ExtensionInstallForcelist`). Vivaldi ne possède aucun chemin automatisé dédié sous Linux.
- **Arc (Windows)** : paquet CRX pris en charge et politique d'entreprise Arc. L'installation par MSI et le contrôle de contenu restent à qualifier séparément.
- **Firefox** : XPI signé, requis même sous politique d'entreprise ; Firefox 140.0 ou ultérieur est requis sur tous les systèmes d'exploitation. Sans paquet signé attendu, le service de mises à jour répond 503.

:::info[Installation de l'extension Google Chrome]
L'extension Chrome est privée et n'est pas publiée sur le Chrome Web Store. Pour le déploiement Windows décrit ici avec `ExtensionInstallForcelist`, le PC doit être joint à un domaine Active Directory ou à Microsoft Entra ID. L'installation de l'agent ou de l'hôte Native Messaging ne suffit pas à elle seule.
:::

Chromium autonome n'est pas un navigateur pris en charge. Voir [Architecture technique](../introduction/architecture.md) pour la matrice d'intégration par système d'exploitation, les modes de déploiement Linux et le périmètre des qualifications.

L'extension est pilotée par un **catalogue de détection signé** (moteur + données) qui décrit les routes mesurées des sites couverts : routes de prompt, routes de téléversement. Elle n'applique aucune heuristique hors de ces routes.

Dans les deux éditions, les **plateformes connues** signalent la présence sur une plateforme atteinte, jamais son contenu, sans rouvrir la capture hors des fournisseurs qualifiés.

:::enterprise

Le catalogue d'usine Enterprise couvre **neuf fournisseurs**. Le contrôle des modèles et la sensibilité des usages sont également réservés à Enterprise.

:::

## Agent Windows

L'agent Windows est distribué sous forme de MSI immuable. Son manifeste de mise à jour est signé ; la signature Authenticode du MSI attend le certificat de l'éditeur :

1. Téléchargez le ZIP Windows depuis la console. Il contient le MSI immuable, son script d’installation et le JSON de provisionnement de cette organisation. Si un second facteur est activé sur votre compte, le téléchargement reprend après une nouvelle vérification.
2. Extrayez le ZIP puis lancez le script en administrateur avec les chemins du MSI et du JSON. Le service s’exécute sous un compte local et relaie les politiques vers l’extension par des canaux loopback. Protégez et supprimez le ZIP et le JSON dès qu’ils ne sont plus nécessaires.

Les mises à jour sont distribuées par l'image Docker contenant le MSI et son manifeste : reconstruire et remettre en service l'image, puis vérifier l'empreinte du MSI effectivement servi, la signature et la version annoncée. L'application sur les postes dépend de la politique de mise à jour configurée.

![Milvago - Agent Windows](/img/docs/fr/installation-composants-02.png)

## Console

La console est fournie avec le backend (AGPL-3.0). Pour la mise en place avec Docker, voir [Installation Docker](docker.md).

Par défaut en Community : une organisation, sans contrôle de modèle, sans motifs de masquage intégrés ni sensibilité des usages. L'observation du nom du modèle ayant répondu est ouverte dans les deux éditions (inventaire) ; la décision de contrôle reste limitée aux fournisseurs couverts. La gestion des rôles et des membres, l'annuaire LDAP et la connexion SSO dépendent en Community d'une **licence** : tant qu'aucune n'est acceptée, l'instance reste en mode restreint — 5 postes, un seul compte administrateur, aucune de ces trois fonctions. Voir [Paramètres > Licence](../administration/parametres.md#licence).

:::enterprise

En Enterprise, la console gère plusieurs organisations isolées (PostgreSQL RLS), les groupes de postes, les clés de déploiement et le serveur MCP. Voir la section Administration. Une licence Enterprise valide et propre à l'instance est toujours requise, sans mode restreint : voir [Paramètres > Licence](../administration/parametres.md#licence).

:::

![Milvago - Console](/img/docs/fr/installation-composants-03.png)
