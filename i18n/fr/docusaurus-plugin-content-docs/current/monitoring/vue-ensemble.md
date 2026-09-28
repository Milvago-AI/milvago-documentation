---
sidebar_position: 1
title: Vue d'ensemble
---

# Vue d'ensemble

La vue d'ensemble est le premier écran de la console, celui qui s'affiche à la connexion (`#overview`). Elle répond à une seule question, en une fenêtre de 24 heures : **que se passe-t-il, en ce moment, dans les usages d'IA de l'organisation ?**

## Accéder à l’écran

Dans la barre latérale, cliquez sur **Supervision**, puis sur **Vue d’ensemble**. Les droits `overview.read` et `events.read` donnent accès à cet écran. Une organisation en consultation agrégée seule, un profil sans `events.read`, ou un profil avec `reports.aggregate` mais sans `devices.read`, voit **Rapports** à la place s’il a `reports.aggregate` ; sinon l’accès est refusé.

Pour agir depuis cette page :

1. Cliquez sur **Voir les postes** dans le bandeau, puis approuvez le poste en attente dans **Parc > Postes** si votre rôle possède `members.manage`.
2. Cliquez sur **Ouvrir les conversations** pour examiner les événements, ou sur **Voir la cartographie** pour analyser les flux. Ces raccourcis ouvrent l’écran concerné; ils n’appliquent pas de filtre.
3. Cliquez sur **Actualiser** pour recharger les indicateurs et l’état des postes en attente.

Elle ne remplace ni le détail (Conversations), ni la géographie des flux (Cartographie), ni la gestion (Parc, Administration). Son rôle est de permettre la décision du jour : y a-t-il une anomalie à creuser, un poste à approuver, une politique à ajuster ?

![Milvago - Vue d'ensemble](/img/docs/fr/monitoring-vue-ensemble-01.png)

## Le principe de lecture

Deux règles guident tout l'écran, et toute la plateforme :

1. **Les chiffres sont des faits observés.** La page ne projette, n'estime ni n'extrapole rien. Ce qu'un navigateur ne peut pas capter n'est pas deviné — et la ligne d'information sous le titre le rappelle en toutes lettres : un événement navigateur n'est pas un inventaire logiciel. Voir « 12 fournisseurs » ne signifie pas « 12 logiciels installés ».
2. **Deux familles d'événements, comptées séparément.** Une **navigation** (un poste visite un site d'IA) n'est pas une **requête** (un prompt est parti). La tuile « Requêtes » porte le nombre de requêtes et nomme les navigations à part, dans son indice.

Les nombres sont formatés selon la langue de la console (séparateurs, espaces) et restent tabulaires.

## Le parcours de la page

L'écran se lit dans l'ordre du code, du plus urgent au plus analytique. Chaque bloc n'apparaît que si sa condition est vraie.

### 1. Le bandeau « À traiter »

Si des postes attendent l'approbation **et** que vous avez le droit de les approuver, un bandeau d'alerte s'affiche en tête : « N postes attendent votre approbation. », avec un bouton vers Postes. Tant qu'un poste est en attente, rien ne remonte de lui : c'est le seul blocage qui vaut un bandeau permanent.

![Milvago - 1. Le bandeau « À traiter »](/img/docs/fr/monitoring-vue-ensemble-02.png)

### 2. La carte de démarrage

Si **aucun poste** n'est enregistré, la page montre les trois étapes du premier parcours, avec un lien de raccourci vers chaque écran :

1. **Télécharger l'agent** — le serveur fournit le ZIP Windows (MSI, script d'installation et fichier de provisionnement) ou le RPM Linux.
2. **Approuver le premier poste** — un poste apparaît en attente après son installation, selon la politique d'approbation de l'organisation.
3. **Configurer les services** — dans Shadow AI, choisir les services d'IA observés, bloqués ou redirigés.

Cette carte disparaît dès que la flotte existe. À la place de la page vide, l'écran montre alors les indicateurs ci-dessous, éventuellement à zéro — un zéro est affiché, pas masqué.

![Milvago - 2. La carte de démarrage](/img/docs/fr/monitoring-vue-ensemble-03.png)

### 3. Les quatre indicateurs (KPI)

| Tuile | Valeur | Indice | Lecture |
| --- | --- | --- | --- |
| **Requêtes** | nombre de requêtes reçues sur la période | « N dernières heures · N navigations » | le volume d'usage réel, navigations décomptées à part |
| **Bloqués** | nombre d'événements bloqués | « N % des requêtes » ou « Selon les règles appliquées » si zéro requête | prend une tonalité danger dès que la valeur est > 0 |
| **Postes actifs** | actifs / total | « N inactifs, en attente ou révoqués » | le rapport de couverture : un poste inactif est une fenêtre de mesure fermée |
| **Fournisseurs observés** | nombre de fournisseurs distincts | « Sur la période » | l'étendue du périmètre effectivement sollicité |

Le pourcentage de blocage est calculé sur la même fenêtre de 24 h ; le décompte des inactifs est la différence entre le parc total et les postes actifs.

![Milvago - 3. Les quatre indicateurs (KPI)](/img/docs/fr/monitoring-vue-ensemble-04.png)

### 4. « Rythme des usages » (colonne gauche)

Un histogramme horaire sur la fenêtre d'observation : chaque barre porte le volume de l'heure, empilement **observé** (gris) et **bloqué** (rouge). Une infobulle par barre détaille « heure · événements / bloqués ». Deux lectures s'y font :

- la **forme** (crêtes, creux, plages mortes) raconte quand l'organisation sollicite l'IA ;
- la part rouge, en proportion, raconte si la politique freine ou laisse passer.

Le pied de carte rappelle la fenêtre exacte et propose le bouton vers **Conversations** pour passer du « combien » au « quoi ». À zéro événement, la carte affiche l'état vide « Aucun événement reçu » et dit quand les événements apparaîtront.

![Milvago - 4. « Rythme des usages » (colonne gauche)](/img/docs/fr/monitoring-vue-ensemble-05.png)

### 5. « Fournisseurs observés » (colonne droite)

Une liste classée : un barème par fournisseur, où la part **observée** (requêtes non bloquées) et la part **bloquée** se lisent côte à côte, avec le décompte à droite. C'est la distribution réelle des usages sur la période.

- Si vous disposez du rôle d'analyse, le pied de carte rappelle la portée (« Personnes → outils → services → modèles ») et ouvre la **Cartographie**, qui détaille chaque flux poste par poste.
- Si la liste est vide, l'écran l'assume : « Cette liste reflète uniquement les événements réellement reçus. » — l'absence de fournisseur n'est pas un échec de mesure, c'est une absence de trafic.

![Milvago - 5. « Fournisseurs observés » (colonne droite)](/img/docs/fr/monitoring-vue-ensemble-06.png)

## Qui voit quoi

- L'écran exige les permissions `overview.read` et `events.read` ; il est masqué de la navigation sans `overview.read`, et sans `events.read` il laisse place aux Rapports ou à un accès restreint.
- Le bandeau d'approbation exige en plus la gestion des postes.
- En Community, le périmètre observé se limite à ChatGPT et Claude ; en Enterprise, il s'étend aux neuf fournisseurs couverts et aux applications IA locales — la page fonctionne à l'identique, seule la donnée qui l'alimente change.
- Le bouton **Actualiser** recharge les indicateurs et la liste des postes ; la page ne se rafraîchit pas toute seule.
