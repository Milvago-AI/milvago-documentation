---
sidebar_position: 2
title: Groupes de postes
---

# Groupes de postes

Les groupes de postes portent une politique Shadow AI commune à plusieurs postes d'un coup. Ils répondent à la question : comment appliquer la même dérogation à un ensemble de machines sans la ressaisir poste par poste.

La ligne d'information sous le titre porte les deux règles de lecture : « Un groupe applique une même politique Shadow AI à tous les postes qu'il contient. La dérogation propre d'un poste l'emporte toujours sur son groupe. »

## Accéder à l’écran

Dans la barre latérale, cliquez sur **Parc**, puis sur **Groupes**. Il faut `devices.read` et une organisation qui n’est pas en consultation agrégée seule.

1. Avec `devices.manage`, cliquez sur **Nouveau groupe**, renseignez le nom obligatoire et la description facultative, puis cliquez sur **Créer le groupe**. Le groupe apparaît dans la liste.
2. Cliquez sur son nom, puis sur **Ajouter des postes**; cochez les postes, cliquez sur **Ajouter (N)** et vérifiez le résultat dans la liste. Un poste déjà membre d’un autre groupe est déplacé; les refus éventuels sont affichés poste par poste.
3. Depuis la fiche, cliquez sur **Retirer du groupe**, **Renommer** ou **Supprimer**, puis confirmez l’action. Un poste retiré ou un groupe supprimé revient à la politique de l’organisation.
4. Avec `policy.manage`, ouvrez **Politique du groupe**, modifiez les sections voulues et enregistrez. La révision est distribuée à la prochaine synchronisation; **Sensibilité des usages** n’est affichée qu’en Enterprise.

![Milvago - Groupes de postes](/img/docs/fr/fleet-groupes-01.png)

## Qui voit quoi

| Action | Condition |
| --- | --- |
| Voir les groupes et leurs fiches | droit `devices.read` |
| Créer, renommer, supprimer, affecter des postes | droit `devices.manage` |
| Régler la politique du groupe | droit `policy.manage` |

Les groupes existent dans les deux éditions : un groupe est un outil d'organisation du parc, pas une fonction d'inventaire.

## La chaîne de politique

La politique effective d'un poste se lit en trois étages : **poste > groupe > organisation**. Un groupe n'écrase que les sections qu'il définit ; les sections laissées en héritage suivent l'organisation. La dérogation la plus proche du poste gagne : une dérogation propre au poste l'emporte sur son groupe.

Un poste n'appartient qu'à **un seul groupe** à la fois — pas de priorité entre groupes à arbitrer. Le retirer d'un groupe le ramène à la politique de l'organisation, et son historique est conservé.

## La liste des groupes

Le tableau porte quatre colonnes :

| Colonne | Contenu |
| --- | --- |
| **Nom** | cliquable vers la fiche du groupe |
| **Description** | texte libre, ou « — » |
| **Postes** | nombre de postes membres |
| **Actions** | « Renommer » et « Supprimer » pour qui a le droit de gestion ; « — » sinon |

Un compteur affiche le nombre de groupes. À défaut de groupe, l'écran lit « Aucun groupe de postes ».

Le bouton « **Nouveau groupe** » ouvre un dialogue à deux champs : **Nom du groupe** (obligatoire) et **Description**. Deux noms ne diffèrent pas seulement par la casse, et la description reste courte — les deux bornes sont contrôlées à l'enregistrement.

![Milvago - La liste des groupes](/img/docs/fr/fleet-groupes-02.png)

## La fiche d'un groupe

La fiche s'ouvre par le nom du groupe dans la liste. Elle porte deux onglets : **Informations**, toujours présent, et **Politique du groupe** avec le droit `policy.manage`.

### Informations

La carte Informations réunit l'identifiant du groupe, sa description et son compte de postes. Sous la carte, le tableau des postes membres reprend les colonnes de la liste des postes — Poste (cliquable vers sa fiche), Plateforme, État, Dernier contact — plus l'action « **Retirer du groupe** », qui ramène le poste à la politique de l'organisation.

Le tableau propose 10, 20, 50, 100 ou 200 postes par page et conserve l'accès à la première, à la dernière et aux pages voisines.

![Milvago - Informations](/img/docs/fr/fleet-groupes-03.png)

### Affecter des postes

Le bouton « **Ajouter des postes** » ouvre un panneau latéral listant les postes de l'organisation qui n'appartiennent pas encore au groupe. Chaque ligne porte une case à cocher, et un poste déjà membre d'un autre groupe affiche le nom de ce groupe : le déplacer est un changement à voir avant de le commettre. Le bouton de confirmation porte son effectif — « Ajouter (N) » — et reste inactif tant que rien n'est coché.

Ce panneau utilise la même pagination ; les postes cochés restent sélectionnés lors d'un changement de page.

Deux états vides sont énoncés tels quels :

- aucun poste membre : « Aucun poste dans ce groupe » ;
- plus aucun candidat : « Tous les postes appartiennent déjà à ce groupe. »

L'affectation envoie une requête par poste : un refus est signalé poste par poste (« Mise à jour impossible pour : … ») au lieu d'interrompre les autres. Réaffecter à un poste le groupe qu'il porte déjà ne réécrit rien.

Affecter un poste à un groupe dont la politique conserve le texte des requêtes et réponses exige la même vérification de second facteur fraîche que l'activation dans Shadow AI.

### Politique du groupe

L'onglet porte la **dérogation du groupe**. L'éditeur est le même que celui de [Shadow AI](../administration/shadow-ai.md), restreint aux sections qu'un groupe peut écraser : **Enrôlement & collecte**, **Services**, **Protections**, **Masquage local**, et en Enterprise **Sensibilité des usages**. Les sections laissées en héritage suivent l'organisation — la case « Hériter » la nomme.

L'en-tête de section affiche la portée (« Dérogation du groupe ») et la révision courante. Chaque enregistrement produit une nouvelle révision ; les installations la reçoivent à leur prochaine synchronisation, et l'application effective s'observe dans Monitoring.

![Milvago - Politique du groupe](/img/docs/fr/fleet-groupes-04.png)

## Révisions et anti-retour arrière

Chaque changement côté groupe — enregistrement de la politique, affectation, retrait, suppression — produit une révision plus récente, et la politique effective d'un poste en hérite. Un poste n'applique jamais une révision plus ancienne que celle qu'il détient : passer d'un groupe à un autre, puis revenir, ne fait que croître. Cette règle empêche qu'un poste bloqué sur une politique dépassée par un jeu de dates défavorables.

## Supprimer un groupe

La confirmation porte la conséquence exacte : « Les postes d'un groupe supprimé reviennent à la politique de l'organisation. Leur historique est conservé. » Les postes sont d'abord détachés — chacun reçoit une révision fraîche — puis le groupe disparaît avec sa politique. Le compte de postes du groupe figure dans la confirmation. Supprimer un groupe dont les postes reviendraient alors à conserver le texte des requêtes et réponses — l'organisation le conserve, le groupe ne le conservait pas — exige le même second facteur fraîchement vérifié que d'y affecter un poste.

![Milvago - Supprimer un groupe](/img/docs/fr/fleet-groupes-05.png)

Voir aussi : [Postes](postes.md), [Shadow AI](../administration/shadow-ai.md).
