---
sidebar_position: 6
title: Reports
---

# Reports

Reports est la vue de synthèse **agrégée et publiée** des usages : des semaines complètes et fixes, publiées une fois, jamais recalculées. Elle répond à « que se passe-t-il, semaine après semaine, par équipe ou par parc ? » sans exposer les individus : les petits groupes et les liens identifiants sont omis.

Elle exige la permission `reports.aggregate` — c'est le seul écran de Monitoring accessible à un lecteur d'agrégats sans lecture des postes ni des conversations.

## Accéder à l’écran

Dans la barre latérale, cliquez sur **Supervision**, puis sur **Rapports**. Le droit `reports.aggregate` est requis; l’écran existe dans Milvago Community comme Enterprise. En consultation agrégée seule, la vue d’ensemble conduit aussi à ce contenu.

1. Si les deux répartitions existent, choisissez **Équipes** ou **Groupes**; sinon l’unique répartition disponible est affichée.
2. Cliquez sur **Tableau** ou **Cartographie**. Dans la carte, cliquez sur un nœud pour isoler ou retirer une sélection.
3. Cliquez sur **Exporter** pour télécharger le CSV de toutes les semaines selon la répartition courante. Sans semaine publiée, le bouton est absent et l’état **Données insuffisantes** est attendu.

![Milvago - Reports](/img/docs/fr/monitoring-reports-01.png)

## Deux répartitions d'une même semaine

Chaque semaine publiée se lit selon deux axes, mis côte à côte :

- **Équipes** — l'attribut OIDC porté par les personnes (configuré dans Confidentialité) ;
- **Groupes de postes** — la répartition Fleet > Groupes.

L'onglet n'apparaît que si la répartition existe réellement ; si ni l'attribut d'équipe ni les groupes n'existent, un avertissement le dit et propose où agir : « toutes les lignes ressortent en non attribué — renseignez l'attribut d'équipe dans Confidentialité, ou créez des groupes dans Parc ».

![Milvago - Deux répartitions d'une même semaine](/img/docs/fr/monitoring-reports-02.png)

Une semaine publiée **avant** l'existence de la répartition par groupes n'en porte pas : l'écran affiche « pas de répartition par groupe de postes pour cette semaine » plutôt qu'un zéro trompeur — l'absence de la donnée ne vaut jamais « zéro requête ».

## Tableau ou carte

Chaque semaine se lit en **tableau** (équipe ou groupe, outil, service, modèle, requêtes, réponses, sujets) ou en **cartographie** : le même diagramme en rubans que la Cartographie Monitoring, où chaque équipe (ou groupe) devient le point de départ des flux. La sélection d'un nœud y est possible, sans codage de sensibilité.

![Milvago - Tableau ou carte](/img/docs/fr/monitoring-reports-03.png)

## Ce que le k-anonymat fait aux lignes

Une ligne (équipe ou groupe, outil, service, modèle) n'est publiée que si au moins *k* personnes distinctes l'ont utilisée dans la semaine. Ce seuil se règle dans [Confidentialité](../administration/confidentialite.md). Les lignes plus petites sont retirées. Celles qui passent sous le seuil dans l'autre répartition (équipes ou groupes) le sont aussi : sinon, on pourrait les retrouver par soustraction entre les deux vues. L'activité rattachée à aucune personne est également écartée.

Les lignes qui franchissent le seuil restent affichées. Une semaine incomplète porte le badge **Lignes masquées**, et un encadré au-dessus des semaines explique pourquoi. Fermez-le avec la croix : ce choix est mémorisé dans votre navigateur, le badge reste sur chaque semaine concernée, et le lien **Pourquoi des lignes sont-elles masquées ?** rouvre l'explication. Une ligne absente n'est jamais un zéro : ce qui est omis est signalé comme omis.

[IMAGEAMETTREICI 04]

## Export

Le bouton d'export produit un **CSV** de toutes les semaines selon la répartition courante : semaine, équipe (ou groupe), outil, service, modèle, requêtes, réponses, sujets. Le fichier s'ouvre correctement sous Excel sans assistant d'import (BOM UTF-8, séparateur annoncé), et les valeurs venant d'un jeton d'identité ou d'un champ de console sont neutralisées contre l'injection de formules — une cellule commençant par `=`, `+`, `-`, `@` n'est jamais interprétée.

![Milvago - Export](/img/docs/fr/monitoring-reports-05.png)

À zéro semaine publiée, l'écran lit « Données insuffisantes » : les agrégats s'accumulent avec les publications, ils ne se rétrocalculent pas.

![Milvago - Export](/img/docs/fr/monitoring-reports-06.png)
