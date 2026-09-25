---
sidebar_position: 6
title: Organisations mère et fille
tags: [Enterprise]
---

# Organisations mère et fille

:::enterprise

Cette page ne concerne que l'édition Enterprise, qui permet plusieurs organisations isolées au sein d'une même instance. En Community, il n'existe qu'une organisation unique.

:::

Milvago Enterprise héberge plusieurs organisations dans une même instance : une **organisation racine**, et sous elle un arbre d'organisations filles — la racine n'a pas de mère, toute autre organisation en a une. Chaque organisation garde ses propres postes, événements, politiques et membres ; l'arbre organise l'accès et l'héritage.

![Milvago - Organisations mère et fille](/img/docs/fr/introduction-organisations-mere-fille-01.png)

## Parcours de création

1. Connectez-vous à Milvago Enterprise avec le droit `organizations.manage` sur l’organisation mère.
2. Dans le menu latéral, ouvrez **Administration → Organisations**.
3. Sélectionnez **Nouvelle organisation**.
4. Saisissez le nom, choisissez l’organisation parente et, si nécessaire, activez l’authentification multifacteur pour tous ses membres.
5. Créez l’organisation, puis vérifiez qu’elle apparaît sous sa mère dans l’arbre.

## Créer une organisation fille

L'écran **Organisations** liste les organisations accessibles, la racine en tête, et groupe les filles sous leur mère. Le dialogue « Nouvelle organisation » demande :

- le **nom** (obligatoire) ;
- l'**organisation parente**, choisie parmi les organisations où le créateur est propriétaire — à défaut, la racine ;
- l'option « **Imposer l'authentification multifacteur à tous les membres** ».

Le créateur devient **propriétaire** de la nouvelle organisation. Le lien de filiation est fixé à la création et ne se modifie plus ; une organisation se déplace en la recréant, pas en la re-parentant.

La création est autorisée par le droit `organizations.manage` porté par l'**organisation parente** visée, pas par l'organisation courante de la session. La fille est opérationnelle immédiatement : ses rôles intégrés sont posés, et sa **clé de déploiement** est émise dès l'existence — elle peut enrôler des postes sans autre configuration.

## L'accès descend l'arbre

Une appartenance accorde l'accès à tout le sous-arbre :

- être membre (quel que soit le rôle) d'une organisation donne accès à **toutes ses organisations filles**, à tous les niveaux ;
- le rôle appliqué dans une organisation est celui de l'**appartenance d'ascendance la plus proche** — une appartenance directe gagne sur une héritée ;
- à l'inverse, une fille n'accède jamais à sa mère : l'accès ne descend que.

La console liste les organisations accessibles avec le rôle effectif dans chacune, et le changement d'organisation se fait sans nouvelle connexion. Un administrateur de la mère peut ainsi intervenir dans une fille selon ses permissions effectives — par exemple faire tourner la clé de déploiement d'une fille depuis sa fiche, sans y basculer.

:::note
Une clé API est **épinglée à l'organisation où elle a été créée** : quelle que soit l'appartenance de son créateur, elle n'agit jamais hors de cette organisation, y compris sur les routes qui nomment une autre organisation dans l'URL.
:::

![Milvago - L'accès descend l'arbre](/img/docs/fr/introduction-organisations-mere-fille-02.png)

## L'isolation des données

L'isolation repose sur **PostgreSQL Row-Level Security** : chaque requête porte le contexte d'une organisation, et les lignes d'une autre organisation sont invisibles — y compris pour un compte qui aurait des droits ailleurs. Les identifiants d'une organisation passée dans une requête depuis une autre répondent « introuvable », sans différence entre « inexistant » et « hors de portée ».

La suppression d'une organisation emporte ses données par cascade — postes, événements, politiques, groupes — mais pas le compte des utilisateurs, qui est partagé entre organisations.

## Ce que la mère impose

Trois réglages descendent l'arbre, chacun avec sa règle propre.

### La politique Shadow AI

Une organisation fille peut marquer des sections « **Hériter** » et les recevoir de sa mère, section par section — y compris Enrôlement et Exploitation, que groupes et postes ne peuvent pas toucher. La provenance nomme l'organisation d'origine, et une section recouverte plus bas remonte à son écrivain réel. Voir [Héritage de la configuration](heritage-configuration.md).

### La confidentialité

:::note
Le verrouillage parental n'impose que des réglages **protecteurs** : pseudonymisation par défaut, rapports agrégés uniquement, k-anonymat, durée de liaison d'identité. Une organisation mère ne peut jamais donner son consentement à une collecte au nom d'une fille.
:::

Quand la mère active « **Imposer aux organisations filles** », la configuration verrouillée s'affiche telle quelle dans les filles avec la mention « La configuration est verrouillée. » et son origine — l'organisation mère ; les champs correspondants deviennent inertes.

### Les exports d'observabilité

Une organisation peut « **Imposer cette configuration aux organisations filles** » pour ses destinations d'export. La fille qui subit l'imposition lit « Configuration imposée par » suivie du nom de l'organisation mère — elle ne peut ni la personnaliser ni désactiver l'export, et sa personnalisation antérieure reste **conservée mais inactive** tant que la restriction s'applique. À défaut d'imposition, la fille peut hériter volontairement ou garder sa configuration propre ; les secrets de la mère ne sont jamais copiés chez la fille.

![Milvago - Les exports d'observabilité](/img/docs/fr/introduction-organisations-mere-fille-03.png)

## Les réglages réservés à la racine

Deux réglages d'instance ne sont modifiables que depuis l'organisation racine, par un propriétaire : l'**URL publique de l'agent** (celle que portent les installateurs) et la **langue par défaut** de la console. Une organisation fille les lit mais ne les change pas.

## Supprimer une organisation

Trois verrous, dans l'ordre du code :

- l'organisation **courante** de la session ne peut pas se supprimer elle-même ;
- l'organisation **racine** ne peut pas être supprimée ;
- une **mère** ne peut pas être supprimée tant qu'elle a des filles — l'écran invite à les supprimer d'abord, ou à les sélectionner ensemble : la suppression en masse part **des feuilles vers la racine**.

Voir aussi : [Héritage de la configuration](heritage-configuration.md), [Organisations](../administration/organisations.md).
