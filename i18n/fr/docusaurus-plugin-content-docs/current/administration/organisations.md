---
sidebar_position: 5
title: Organisations
tags: [Enterprise]
---

# Organisations

## Accéder à l’écran

Dans la barre latérale, cliquez sur **Administration**, puis sur **Organisations**. Cet écran est réservé à Milvago Enterprise. La consultation dépend de vos organisations accessibles ; créer, renommer ou supprimer exige `organizations.manage` (« Gérer les organisations »).

Pour créer une organisation :

1. Cliquez sur **Nouvelle organisation**.
2. Renseignez le nom, l’organisation parente et l’option MFA.
3. Confirmez la création ; l’organisation apparaît dans la liste.

:::enterprise

Cette page ne concerne que l'édition Enterprise. En Community, l'organisation est unique et cette entrée de navigation n'existe pas.

:::

L'écran Organisations répond à la question « **quelles organisations je vois, et lesquelles je gouverne** ». Les organisations sont les racines d'isolation de la plateforme : postes, politiques, conversations, membres et inventaire n'existent que dans une organisation, et l'isolation est assurée par **PostgreSQL Row-Level Security** au niveau des lignes, pas par un filtrage applicatif.

## Le sélecteur d'organisation

La barre latérale porte, au-dessus de la navigation, le sélecteur d'organisation : l'organisation courante en bouton, et un panneau latéral « Choisir une organisation » qui dessine l'arbre — « Les organisations filles sont regroupées sous leur organisation mère. » Chaque entrée porte son nom et son rôle dans l'organisation ; l'organisation courante est marquée d'une coche. Les organisations accessibles mais dont la mère ne l'est pas sont listées à la racine du panneau.

![Milvago - Le sélecteur d'organisation](/img/docs/fr/administration-organisations-01.png)

## La liste des organisations

L'écran liste les « Organisations accessibles » : nom (badge « Racine » pour la racine, « Courante » pour celle de la session), identifiant, parent, et actions. Une organisation sans accès lit « Aucune organisation accessible ».

Avec la permission `organizations.manage` (« Gérer les organisations »), l'écran gagne la sélection par case et les actions :

- **Nouvelle organisation** — un nom, une **organisation parente** (parmi celles où vous êtes propriétaire), et une case « Imposer l'authentification multifacteur à tous les membres », non modifiable après la création. L'avis de création porte la règle d'accès : « Les membres de l'organisation parente accèdent aux données des organisations filles selon leurs permissions. » Créer une organisation vous en rend propriétaire : il faut donc détenir, dans l'organisation parente, toutes les permissions du rôle Propriétaire ; un rôle personnalisé ou une clé d'API qui n'a que « Gérer les organisations » est refusé. Les organisations s'imbriquent sur vingt niveaux au plus, racine comprise.
- **Renommer** — n'importe quelle organisation accessible.
- **Supprimer** — seule, ou « Supprimer la sélection » pour un lot. Le serveur refuse la suppression de l'organisation courante, de la racine, et d'une organisation qui a encore des filles (« Supprimez d'abord ses organisations filles (ou sélectionnez-les ensemble). »). Une suppression de lot ordonne les cibles des plus profondes aux moins profondes, pour vider chaque mère de ses filles sélectionnées avant de la retirer. La confirmation nomme l'irréversible : « Cette action supprime définitivement les organisations suivantes et toutes leurs données (membres, rôles, appareils, événements). Les comptes utilisateurs ne sont pas supprimés. » Supprimer exige un second facteur vérifié à l'instant ; la console redirige vers la vérification et rejoue la suppression au retour. Tant que l'organisation porte encore du texte de requêtes et réponses conservé, sa suppression exige aussi le droit de purger les contenus (`content.purge`, réservé au propriétaire par défaut) ; sinon le serveur refuse avec « Cette organisation porte encore du texte de prompt conservé : la supprimer exige le droit de purger les contenus. »

Agir sur une autre organisation depuis cette liste — la renommer, la supprimer, ou faire tourner sa clé de déploiement — exige que votre connexion porte une authentification multifacteur dès que cette organisation l'impose à ses membres : la même règle que pour y basculer. Créer une organisation inscrit une entrée d'audit dans le journal de l'organisation parente **et** une autre dans le journal propre de la nouvelle organisation ; une suppression ne s'inscrit que dans le journal de la parente ; un renommage s'inscrit dans le journal de l'organisation renommée.

![Milvago - La liste des organisations](/img/docs/fr/administration-organisations-02.png)

## La page d'une organisation

Chaque ligne ouvre la page propre à l'organisation : « Identité de l'organisation et moyens de déploiement qui lui sont propres. »

- **Informations** — identifiant, organisation mère (« Aucune — organisation racine » pour la racine, lien vers la mère sinon) et votre rôle dans elle.
- **Clé de déploiement** — avec `installers.manage`, le panneau de la clé propre à cette organisation. Il existe pour qu'un administrateur d'une mère puisse faire tourner ou révoquer la clé d'une fille **sans basculer dans son contexte**. Voir [Déploiement](deploiement.md).

![Milvago - La page d'une organisation](/img/docs/fr/administration-organisations-03.png)
