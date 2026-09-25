---
sidebar_position: 5
title: Discovery
---

# Discovery

Discovery répond à la question que pose un RSSI dès le premier jour : **quelles IA mes gens utilisent-ils, que je ne regarde pas ?** L'écran liste ce que la flotte a atteint **au-delà de ce que le catalogue couvre** : les plateformes IA connues visitées, et les domaines candidats observés par les détecteurs.

Il exige la gestion de la politique (`policy.manage`) — c'est un écran de décision, pas une consultation passive.

## Accéder à l’écran

Dans la barre latérale, cliquez sur **Supervision**, puis sur **Découverte**. Le droit `policy.manage` est requis.

Pour activer la remontée des domaines candidats, allez dans **Administration > Shadow AI > Plateformes IA**, cochez **Découvrir les domaines candidats**, saisissez un motif d’au moins huit caractères, puis enregistrez après la MFA fraîche demandée. Il faut aussi `settings.manage`. Seules les observations futures peuvent alors apparaître.

1. Dans une ligne de domaine candidat, cliquez sur **Promouvoir** seulement si le bouton est proposé (catalogue publié), ou sur **Ignorer** / **Réconsidérer**. La liste se recharge avec le nouveau statut.
2. En Enterprise, cliquez sur le service ou le domaine pour voir les postes, recherchez par nom ou identifiant, choisissez **Par page**, puis cliquez sur un poste pour sa fiche.
3. En instance de démonstration en lecture seule, les boutons d’action sont absents. En Community, les noms restent du texte : la liste des postes et les comptes OS ne sont pas disponibles.

![Milvago - Discovery](/img/docs/fr/monitoring-discovery-01.png)

## Plateformes connues

La première carte porte les **plateformes IA connues** que les postes ont atteintes. La notice d'en-tête fixe la frontière, en toutes lettres : **présence seule** — l'hôte a été atteint ; aucun prompt, aucune réponse, aucune adresse ni conversation n'est collecté sur ces plateformes.

| Colonne | Contenu |
| --- | --- |
| **Service** | la plateforme (bouton « atteint par les postes » en Enterprise) |
| **Visites** | le nombre de visites enregistrées |
| **Postes** | le nombre de postes distincts |
| **Comptes OS** | Enterprise uniquement : les comptes OS connectés au moment des visites |
| **Dernier signalement** | la date la plus récente |

![Milvago - Plateformes connues](/img/docs/fr/monitoring-discovery-02.png)

Les deux tables sont bornées côté serveur (500 domaines candidats au plus, plateformes du catalogue signé) : la pagination est une aide à la lecture, pas un moyen d'aller chercher moins. Une liste réduite sous la page affichée retombe sur la dernière page au lieu de présenter une table vide.

## Domaines candidats

La deuxième carte liste les **domaines d'IA** que les postes signalent et que le catalogue ne couvre pas, avec leur nombre d'observations et deux actions par ligne :

- **Marquer le candidat publié comme promu** — offerte seulement pour un domaine que le catalogue publié porte réellement ; le serveur reste l'autorité et répond 409 si la publication manque.
- **Ignorer / Réconsidérer** — retirer un domaine du signal, ou le remettre.

![Milvago - Domaines candidats](/img/docs/fr/monitoring-discovery-03.png)

Sur une instance en lecture seule, les actions n'apparaissent pas plutôt que de promettre des boutons refusés.

À **zéro candidat, l'écran est un état normal, pas un échec** : la découverte des domaines candidats est désactivée par défaut, et l'écran le dit avec le lien qui la réactive — « Activez-la dans Shadow AI, Plateformes IA, pour que les postes signalent les domaines d'IA qu'ils atteignent et que ce catalogue ne couvre pas. » L'interrupteur traverse la route de confidentialité, avec son motif écrit et sa MFA fraîche.

![Milvago - Domaines candidats](/img/docs/fr/monitoring-discovery-04.png)

## Qui a atteint ce domaine ?

Chaque ligne s'ouvre sur un dialogue **« Postes ayant atteint ce domaine sur les N derniers jours »**, avec une recherche (nom de machine ou identifiant de poste, ce que porte un lecteur venu d'une fiche de poste), le nombre d'observations par poste et la dernière date. Les relevés du détecteur sont purgés au-delà de la fenêtre : une visite plus ancienne n'est plus comptée ici.

Un seul dialogue répond à la même question depuis les deux tables, parce qu'un lecteur demandant « qui y est allé » ne se soucie pas de savoir quelle table porte la réponse.

![Milvago - Qui a atteint ce domaine ?](/img/docs/fr/monitoring-discovery-05.png)

:::enterprise

Le dialogue « atteint par les postes » et la colonne Comptes OS n'existent qu'en Enterprise : en Community, les lignes restent en texte plein plutôt que de porter un contrôle qui répondrait 404. Le catalogue porte aussi la règle d'hygiène de la découverte : les domaines des fournisseurs couverts — après réduction à l'édition servie — n'apparaissent jamais dans Discovery, et une plateforme masquée par l'organisation en sort tout en gardant ses visites enregistrées.

:::

![Milvago - Qui a atteint ce domaine ?](/img/docs/fr/monitoring-discovery-06.png)
