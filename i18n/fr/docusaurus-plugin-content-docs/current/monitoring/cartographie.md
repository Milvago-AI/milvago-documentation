---
sidebar_position: 3
title: Cartographie
---

# Cartographie des requêtes

La cartographie répond à une seule question : **qui parle à quoi**. Elle dessine, sur la période choisie, les flux entre les personnes, les outils, les services et les modèles, en rubans dont la largeur représente les requêtes et la couleur l'éditeur du service.

Elle ne répond pas à « est-ce que j'observe bien » : la santé de la capture vit dans Découverte, avec le reste de ce qui parle de couverture. Navigations et inventaires ne sont pas convertis en requêtes — le pied de carte le dit quand la période est vide.

## Accéder à l’écran

Dans la barre latérale, cliquez sur **Supervision**, puis sur **Cartographie**. Il faut `events.read` et une organisation qui n’est pas en consultation agrégée seule.

1. Cliquez sur **Affiner les filtres**, définissez la période et les critères, puis cliquez sur **Appliquer**. La carte se limite au périmètre demandé.
2. Cochez **Masquer les personnes** pour une lecture globale. Dans les rails, sélectionnez ou excluez des valeurs; retirez une pastille ou cliquez sur **Effacer** pour annuler la sélection.
3. Cliquez sur un nœud, un ruban ou **Voir ces requêtes** pour ouvrir **Conversations** avec la période et la vue réellement dessinée.
4. Choisissez JSON ou CSV puis **Exporter**, ou cliquez sur **Rapport de synthèse**. L’export et le rapport reprennent les critères, sélections et exclusions; l’identité révélée exige `identity.reveal`.

![Milvago - Cartographie des requêtes](/img/docs/fr/monitoring-cartographie-01.png)

## Ce que l'écran compte

Quatre indicateurs sous la barre de filtres : **Requêtes**, **Réponses**, **Conversations identifiées**, et, en Enterprise, **Événements sensibles** (tonalité ambre dès que la valeur est > 0). Une ligne d'information nomme ce que la carte ne peut pas faire : « N événements sans personne vérifiée » — l'identité vérifiée vient d'une association OIDC ; à défaut, le compte OS derrière l'outil est affiché à titre informatif. Les navigations sont comptées à part.

![Milvago - Ce que l'écran compte](/img/docs/fr/monitoring-cartographie-02.png)

## La carte : rails et rubans

Le diagramme est organisé en quatre colonnes reliées par des rubans :

- à gauche, **Personnes** et **Navigateurs / applications** ;
- au centre, les **rubans** eux-mêmes, un par flux (personne × outil × service × modèle) ;
- à droite, **Services** et **Modèles**.

Chaque colonne porte son compte de valeurs présentes sur la période (« 10 / 47 »). Au survol d'un ruban ou d'un nœud, une infobulle détaille le volume, les bloqués et, en Enterprise, le nombre d'événements sensibles.

- **Masquer les personnes (usage global)** : une case de la barre de filtres bascule la vue en « Outils → services → modèles » — le pôle personnes disparaît, l'usage devient global. C'est une vue client : les filtres latéraux **n'élargissent jamais** ce que le serveur a renvoyé, ils décident seulement de ce qui est dessiné.
- Les **filtres latéraux** (rails, repliables) excluent ou isolent des valeurs de chaque colonne. Une sélection que la nouvelle vue ne dessine plus est retirée automatiquement plutôt que de fausser le lien vers le journal.
- Cliquer un nœud ou un ruban **creuse dans Conversations** : le lien transmet la période et la sélection courante, nature « prompt ». La sélection se lit dans le pied de carte (pastilles amovibles, bouton « Effacer »), avec un « Voir ces requêtes » qui emporte exactement ce que l'écran montre — sélection et exclusions comprises.

![Milvago - La carte : rails et rubans](/img/docs/fr/monitoring-cartographie-04.png)

## Légende et états

- La légende porte « Non attribué » (les flux sans personne) et, en Enterprise, « Sensible ».
- À zéro requête sur la période, la carte l'assume : « Aucune requête dans cette période », avec la précision que les navigations et inventaires ne sont pas convertis en requêtes.
- La barre de filtres est repliable ici (la carte reste compacte) ; le bouton « Affiner les filtres » l'ouvre, et un « Réinitialiser » dédié retire les filtres latéraux.

<div className="mv-doc-image-pair">

![Milvago - Filtres Personnes et Navigateurs ou applications](/img/docs/fr/monitoring-cartographie-05-gauche.png)

![Milvago - Filtres Services et Modèles](/img/docs/fr/monitoring-cartographie-05-droite.png)

</div>

:::enterprise

En Enterprise, la largeur des rubans se double d'un codage de **sensibilité détectée** : hachures sur les rubans, compteur par nœud, KPI dédié et rail de filtrage. En Community, la carte se limite au couple requêtes/bloqués — rien n'est nommé sensibilité, ni sur la carte ni dans le journal.

:::

![Milvago - Légende et états](/img/docs/fr/monitoring-cartographie-06.png)

## Exports

L'export couvre ce que vous regardez, pas la barre de filtres nue : les pastilles de sélection et les exclusions des rails se replient dans le rapport, exactement comme les liens de détail. Comme pour le journal, l'export contient les métadonnées correspondant exactement aux filtres ; les textes éventuels exigent un droit de lecture explicite, et chaque consultation est auditée.

![Milvago - Exports](/img/docs/fr/monitoring-cartographie-07.png)
