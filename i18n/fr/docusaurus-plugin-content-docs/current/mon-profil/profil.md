---
sidebar_position: 1
title: Configurer mon profil
---

# Configurer mon profil

## Accéder à l’écran

Dans la barre latérale, cliquez sur votre bloc utilisateur en bas à gauche, puis sur **Mon profil**. Sur mobile, ouvrez d’abord le menu. Cette page est disponible dans Milvago Community et Milvago Enterprise, sans permission d’administration particulière.

1. Renseignez les champs d’identité qui sont modifiables.
2. Choisissez la **Langue de la console**.
3. Cliquez sur **Enregistrer mon profil**.
4. Vérifiez la confirmation « Profil enregistré. » ; les changements s’appliquent au compte et à la session en cours.

La page **Mon profil** permet à chaque personne connectée à Milvago Community ou Milvago Enterprise de consulter son identité et de choisir la langue de sa console.

Dans la barre latérale, cliquez sur votre bloc utilisateur, en bas à gauche. Sur mobile, ouvrez d'abord le menu, puis cliquez sur ce même bloc.

![Milvago - Configurer mon profil](/img/docs/fr/mon-profil-profil-01.png)

## Identité

Le bloc **Identité** affiche le prénom, le nom, l'adresse e-mail et le type de compte : Local, SSO ou LDAP. L'adresse e-mail est affichée en lecture seule.

Un compte local peut modifier son prénom et son nom, puis enregistrer le profil. Pour un compte SSO ou LDAP, ces champs viennent du fournisseur d'identité et ne sont pas modifiables dans Milvago.

La liste **Langue de la console** est disponible pour tous les types de compte : Français, English, Español et Português (Brasil). Avec le choix **Par défaut**, la console suit d'abord un choix explicite déjà mémorisé dans ce navigateur, puis la langue préférée du navigateur ; si aucune des quatre langues n'est demandée, elle s'affiche en anglais. Cliquez sur **Enregistrer mon profil** pour appliquer le choix au compte et à la session en cours.

![Milvago - Identité](/img/docs/fr/mon-profil-profil-02.png)

## Sécurité et accès

Le bloc **Sécurité et accès** indique l'état du second facteur : **état inconnu** lorsqu'il ne peut pas être obtenu, **configuré** ou **non configuré**.

Les actions proposées dépendent du type de compte :

- **Local** : modifier l'adresse e-mail, modifier le mot de passe et gérer le second facteur.
- **LDAP** : gérer le second facteur, qui peut être configuré localement.
- **SSO** : le nom, l'adresse e-mail, le mot de passe et le second facteur sont gérés par le fournisseur d'identité.

Lorsque le second facteur est **non configuré**, le bouton **Configurer mon second facteur** ouvre directement son enrôlement chez le fournisseur d'identité dans l'onglet courant. À la fin de l'enrôlement, vous revenez automatiquement à **Mon profil**. Lorsqu'il est **configuré** ou que son état est **inconnu**, le bouton **Gérer mes seconds facteurs** ouvre dans un nouvel onglet l'espace sécurisé du fournisseur d'identité, où vous pouvez consulter vos authentificateurs, en ajouter ou en supprimer.

**Mon profil** reste ouvert dans son onglet : revenez-y après la gestion chez le fournisseur d'identité ; son état est alors actualisé. Les actions de modification de l'adresse e-mail et du mot de passe reviennent elles aussi automatiquement à **Mon profil**.

Si vous utilisez **Mot de passe oublié** sur la page de connexion, le lien reçu par e-mail permet de choisir un nouveau mot de passe. L’application d’authentification déjà configurée reste en place et sera encore exigée à la prochaine connexion.

Dans une instance de démonstration en lecture seule, ces boutons sont masqués et un message l'indique.

![Milvago - Sécurité et accès](/img/docs/fr/mon-profil-profil-03.png)

Les clés personnelles se gèrent dans [Clés API et serveur MCP](cles-api.md).
