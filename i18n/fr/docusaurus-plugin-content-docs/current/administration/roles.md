---
sidebar_position: 2
title: Rôles
---

# Rôles

## Accéder à l’écran

Dans la barre latérale, cliquez sur **Administration**, puis sur **Rôles**. Vous devez disposer de `roles.manage` pour voir l'écran — dans les rôles intégrés, seul le Propriétaire porte ce droit. Créer, modifier ou supprimer un rôle, et lister ses porteurs, vont plus loin encore : le serveur exige le rôle Propriétaire lui-même.

1. Cliquez sur **Nouveau rôle**.
2. Saisissez son nom et cochez les permissions à accorder.
3. Cliquez sur **Enregistrer**.
4. Vérifiez que le rôle apparaît dans la liste avec les permissions choisies.

L'écran Rôles répond à la question « **qui a le droit de faire quoi** ». Il définit les rôles de l'organisation et, pour chacun, l'ensemble de permissions qu'il accorde. L'accès exige la permission `roles.manage` — dans les rôles intégrés, seul le Propriétaire la porte ; sans elle, l'écran affiche « Accès réservé au propriétaire ». La gestion des rôles est réservée au rôle Propriétaire par son nom, pas seulement par une permission : le serveur vérifie que le rôle de l'appelant est `owner`, si bien que `roles.manage` n'est plus proposé à la création d'un rôle personnalisé — l'y accorder n'aurait aucun effet.

## Le principe : des permissions, pas des libellés

Les autorisations sont portées par des **permissions** vérifiées par le serveur à chaque appel, jamais par le nom d'un rôle. Un rôle n'est qu'un ensemble nommé de permissions : lui donner un nom flatteur ne lui donne aucun droit supplémentaire, et une édition déclarée par le client n'accorde jamais d'autorisation.

Les permissions du catalogue, et leur libellé dans la console :

| Permission | Libellé |
| --- | --- |
| `overview.read` | Vue d'ensemble |
| `events.read` | Événements & cartographie |
| `devices.read` | Voir les postes |
| `devices.manage` | Gérer les postes |
| `members.read` | Voir les membres |
| `members.manage` | Gérer les membres |
| `roles.manage` | Gérer les rôles |
| `settings.manage` | Gérer les paramètres |
| `policy.manage` | Gérer la politique (Shadow AI) |
| `installers.manage` | Gérer les installeurs |
| `content.read` | Lire les contenus |
| `content.purge` | Purger les contenus conservés |
| `audit.read` | Journal d'audit |
| `organizations.manage` | Gérer les organisations |
| `directory.manage` | Gérer l'annuaire LDAP et le SSO |
| `reports.aggregate` | Lire les rapports agrégés |
| `identity.reveal` | Lever les identités |
| `identity.erase` | Effacer les identités et renouveler les alias |
| `observability.manage` | Gérer l'observabilité (Enterprise uniquement) |

![Milvago - Le principe : des permissions, pas des libellés](/img/docs/fr/administration-roles-01.png)

## Rôles intégrés et rôles personnalisés

Quatre rôles intégrés existent dans toute organisation, portés avec la mention « intégré » et en lecture seule :

- **Propriétaire** (`owner`) : toutes les permissions du catalogue.
- **Administrateur** (`admin`) : les permissions d'exploitation — vue d'ensemble, événements, postes (voir et gérer), membres (voir et gérer), paramètres, politique, installeurs, contenus (lecture) et rapports agrégés — sans `roles.manage`, `observability.manage`, `content.purge`, `audit.read`, `organizations.manage`, `directory.manage`, `identity.reveal` ni `identity.erase`.
- **Lecteur** (`viewer`) : vue d'ensemble, événements et postes en lecture, et rapports agrégés.
- **Reporter** (`reporter`) : vue d'ensemble et rapports agrégés seulement, le rôle intégré le plus restreint. Contrairement aux trois premiers, `reporter` n'a pas encore de nom d'affichage dédié : les listes de choix de rôle le montrent sous son nom brut « reporter ».

Le bouton « Nouveau rôle » crée un rôle personnalisé : un nom, et les permissions cochées une à une. À la création comme à l'édition, rien n'est précoché — un rôle commence sans autorisation et s'élargit délibérément. Un nom déjà pris est signalé avant l'enregistrement.

Les rôles intégrés ne se modifient pas ; les rôles personnalisés portent « Modifier » et « Supprimer », ce dernier désactivé sur votre propre rôle (« Vous ne pouvez pas supprimer votre propre rôle. »).

![Milvago - Rôles intégrés et rôles personnalisés](/img/docs/fr/administration-roles-02.png)

## Supprimer un rôle encore attribué

Une suppression refusée parce que des membres portent encore le rôle ouvre un dialogue dédié : « Le rôle « … » ne peut pas être supprimé tant qu'il est attribué. Réattribuez ou retirez les membres ci-dessous, puis relancez la suppression. » Il liste les porteurs et offre deux sorties, sans quitter la page : **Réattribuer** chaque membre à un autre rôle, ou **Retirer l'accès**. Tant que des membres portent le rôle, le bouton « Supprimer le rôle » reste bloqué (« Des membres portent encore ce rôle. ») ; plus aucun porteur, il s'ouvre.

Un membre sans droit de gestion des membres voit la liste des porteurs mais pas leurs actions, avec l'avis qui le renvoie à un gestionnaire des membres.

:::enterprise

En Enterprise, la liste des membres d'un rôle et les réattributions portent sur l'organisation courante seulement ; le rôle lui-même reste propre à chaque organisation. Les permissions `organizations.manage` (arbre d'organisations) et `directory.manage` (annuaire LDAP) ne servent qu'en multi-organisations.

:::
