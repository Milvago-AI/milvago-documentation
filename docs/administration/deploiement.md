---
sidebar_position: 9
title: Déploiement
---

# Déploiement

## Accéder au déploiement

Il n’existe pas d’entrée de navigation **Déploiement**. Pour gérer une clé, cliquez sur **Administration**, puis sur **Paramètres**, et ouvrez **Clé de déploiement**. En Enterprise : **Administration** > **Organisations** > l’organisation concernée > **Clé de déploiement**. Vous devez disposer de `installers.manage` (« Gérer les installeurs »).

1. Cliquez sur **Générer une clé**, **Faire tourner** ou **Révoquer**, selon l’état affiché.
2. Lisez l’avertissement qui précise l’effet sur les installateurs déjà distribués.
3. Confirmez l’action.
4. Vérifiez l’état et la date de dernière rotation dans le panneau ; les postes déjà inscrits ne sont pas modifiés.

Cette page décrit comment les **postes** sont enrôlés : la clé de déploiement qui autorise l'inscription, les installateurs qui la portent, et ce qui arrive à un poste après son installation. Pour l'installation de la plateforme elle-même (serveur, base, images), voir [Installation des composants](../installation/composants.md).

## La clé de déploiement

« Une clé aléatoire propre à cette organisation, portée par chaque installateur téléchargé. Elle n'est jamais affichée : elle n'autorise que l'inscription d'un poste, et chaque poste reçoit ensuite ses propres identifiants. » Le panneau, dans [Paramètres](parametres.md) — et en Enterprise, sur la page de chaque [organisation](organisations.md) — montre ce qui existe, jamais le secret : état, création, dernière rotation, compteur d'installations.

Trois actions, chacune avec sa confirmation :

- **Générer une clé** / **Faire tourner** — « Un nouvel installateur sera nécessaire : tous les MSI et RPM déjà distribués cesseront immédiatement d'installer de nouveaux postes. Les postes déjà inscrits ne sont pas modifiés. »
- **Révoquer** — « Plus aucune installation ne sera possible dans cette organisation tant qu'une nouvelle clé n'aura pas été générée. Les postes déjà inscrits ne sont pas modifiés. »

À l'état sans clé, l'écran l'énonce : « Aucune clé active. Aucun installateur ne peut inscrire de poste dans cette organisation tant qu'une clé n'a pas été générée. »

![Milvago - La clé de déploiement](/img/docs/fr/administration-deploiement-01.png)

## Télécharger l'agent

Le téléchargement des installateurs — Windows MSI, Linux RPM, tous deux services pour tout le poste — est bloqué tant que l'**URL HTTPS publique** n'est pas confirmée dans [Paramètres](parametres.md) : « Définissez et confirmez l'URL HTTPS publique dans Administration → Paramètres avant de télécharger un installateur. Les agents se connecteront à cette URL. »

Le dialogue rappelle trois choses :

- « Le paquet porte la clé de déploiement de cette organisation. Après installation, le poste s'inscrit une seule fois et conserve son état dans un cache chiffré. L'extension navigateur doit aussi être distribuée par votre administrateur. »
- Selon le **mode d'approbation** choisi dans la politique Shadow AI : sous approbation manuelle, « Chaque poste installé apparaîtra en attente et ne transmettra rien avant votre approbation dans Postes. » ; en approbation selon le réseau, « Un poste installé depuis un réseau autorisé transmet immédiatement ; les autres restent en attente d'approbation. »
- « Le même paquet vaut pour toute l'organisation. La clé de déploiement se gère dans Administration → Paramètres : la faire tourner invalide immédiatement les installateurs déjà distribués. »

La version de l'installateur téléchargé est confirmée après le téléchargement. Si la clé a été révolquée entre-temps, le téléchargement échoue avec l'avis qui renvoie à la rotation : « La clé de cette organisation a été révoquée. Faites-la tourner dans Administration → Paramètres pour reprendre les déploiements. »

![Milvago - Télécharger l'agent](/img/docs/fr/administration-deploiement-02.png)

## Après l'installation

Un poste inscrit demande son approbation selon le mode choisi, puis reçoit la politique Shadow AI et ses révisions suivantes. Les mises à jour de l'agent passent par des installateurs signés ; l'écran d'un poste expose son état de mise à jour, et la section « Exploitation » de [Shadow AI](shadow-ai.md) règle parc pilote et versions suspendues quand elle est ouverte au diagnostic.

:::enterprise

En Enterprise multi-organisations, chaque organisation porte **sa propre** clé de déploiement. L'administrateur d'une organisation mère la fait tourner ou la révoque depuis la page de la fille, sans basculer dans son contexte — c'est le premier bloc de cette page.

Les images Docker Enterprise embarquent le MSI signé et son manifeste de mise à jour ; le serveur sert le MSI figé de son répertoire d'installateurs, jamais un paquet reconstruit localement. L'ordre des builds, les clés et la vérification de l'empreinte servie relèvent des procédures de fabrication de l'agent Windows.

:::
