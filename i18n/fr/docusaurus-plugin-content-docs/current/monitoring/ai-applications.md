---
sidebar_position: 4
title: AI applications
tags: [Enterprise]
---

# AI applications

:::enterprise

Cette page ne concerne que l'édition Enterprise : elle n'apparaît dans la navigation qu'avec le rôle d'analyse. Community se limite au navigateur — le code et les dépendances d'inventaire sont absents du binaire livré.

:::

La page liste les **applications IA** détectées sur les postes : logiciels natifs, assistants intégrés, applications d'IA locales, relevés par l'inventaire de l'agent et décrits par le **catalogue signé**. Elle complète les usages navigateur de Monitoring par le parc logiciel.

La phrase d'en-tête fixe la règle de lecture : **Une présence détectée n'établit ni un usage, ni un envoi.** Les requêtes se lisent dans Shadow AI ; un outil installé mais jamais sollicité n'est pas un événement Shadow AI.

## Accéder à l’écran

Dans la barre latérale, cliquez sur **Supervision**, puis sur **Applications IA**. Cet écran exige Milvago Enterprise, `events.read` et une organisation qui n’est pas en consultation agrégée seule.

1. Choisissez la valeur **Par page** souhaitée pour parcourir les applications.
2. Cliquez sur un nom dans **Postes concernés** pour ouvrir la liste complète des postes concernés.
3. Cliquez sur le nom d’un poste dans ce dialogue pour ouvrir sa fiche. Le dialogue ne modifie aucune donnée et la page ne propose aucun filtre.

![Milvago - AI applications](/img/docs/fr/monitoring-ai-applications-01.png)

## Le tableau des applications observées

Une ligne par **outil** détecté (toutes les observations sont regroupées par outil, pas par poste), classées du plus répandu au plus rare, puis par ordre alphabétique :

Le sélecteur **Par page** propose 10, 20, 50, 100 ou 200 outils. Un outil et toutes ses observations restent sur la même page ; les boutons numérotés donnent accès à la première, à la dernière et aux pages voisines.

| Colonne | Contenu |
| --- | --- |
| **Application** | le nom du catalogue (ou l'identifiant brut si l'outil est inconnu du catalogue) |
| **Éditeur** | le nom de l'éditeur, « — » si le catalogue ne le connaît pas |
| **Risque** | badge de tonalité selon le niveau du catalogue |
| **Postes** | nombre de postes où l'outil a été trouvé |
| **Postes concernés** | les trois premiers noms de machines, puis « et N autres » ; la cellule est un **bouton** (voir ci-dessous) |
| **Reconnue par** | comment l'outil a été identifié (extension navigateur, application locale…) |
| **Première observation** | la plus ancienne date de détection de l'outil |

![Milvago - Le tableau des applications observées](/img/docs/fr/monitoring-ai-applications-02.png)

À zéro détection, l'écran l'assume : « Aucune application IA observée — les postes Enterprise remontent les applications décrites par le catalogue signé. Une présence n'est pas un usage. »

## Postes concernés

Un compte seul obligeait à rouvrir chaque machine pour savoir laquelle intervenir. La cellule ouvre donc un dialogue qui liste **tous** les postes portant l'outil — sans seconde requête, la liste complète est déjà dans la charge de la page : poste (lien vers sa fiche), façon d'être reconnu, première observation. Ce dialogue reprend la liste large et à hauteur bornée de Découverte : son en-tête reste visible et la table défile dans la fenêtre. Le poste y apparaît sous son nom réel pour qui porte `devices.read` hors consultation agrégée seule ; les autres lecteurs voient l'alias du poste. En consultation agrégée seule, l'API et le serveur MCP ne renvoient que des comptes : nombre de postes par outil et par façon d'être reconnu, première et dernière observation de l'outil ; aucun poste n'est désigné, et la liste des outils d'un poste précis est refusée.

![Milvago - Postes concernés](/img/docs/fr/monitoring-ai-applications-03.png)

Ce que cette page ne dit pas : elle ne déduit pas d'usage d'une présence. Un outil signalé, puis supprimé du poste, disparaît de la liste au signalement suivant — son historique reste dans les conversations.
