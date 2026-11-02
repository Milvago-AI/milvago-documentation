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

## Sécurité et accès

Le bloc **Sécurité et accès** présente, une ligne chacun, votre adresse e-mail, votre mot de passe et votre second facteur. Chaque bouton **Changer**, **Ajouter un appareil** ou **Retirer** ouvre une page de connexion sécurisée de Milvago dans le même onglet, puis vous ramène à **Mon profil**, où un message confirme la modification.

Les actions proposées dépendent du type de compte :

- **Local** : modifier l'adresse e-mail, modifier le mot de passe et gérer le second facteur.
- **LDAP** : gérer le second facteur, qui peut être configuré localement.
- **SSO** : le nom, l'adresse e-mail, le mot de passe et le second facteur sont gérés par le fournisseur d'identité.

La ligne **Second facteur** liste vos appareils, chacun avec son nom et sa date d'ajout :

- Sans appareil, **Configurer mon second facteur** vous guide : scanner un QR code avec une application d'authentification (Microsoft Authenticator, Google Authenticator, FreeOTP…), puis saisir le code qu'elle affiche.
- **Ajouter un appareil** configure une autre application, par exemple sur un second téléphone ; à la connexion, vous choisissez l'appareil qui affiche le code.
- **Retirer** demande d'abord une confirmation, puis un code de l'un de vos appareils. Si votre connexion date de plus de quelques minutes, votre mot de passe vous est aussi redemandé. Sans plus aucun appareil, votre connexion ne demande que votre mot de passe, sauf si votre organisation exige un second facteur : vous en configurez alors un nouveau à la prochaine connexion.

Lorsque le second facteur ne peut pas être vérifié, la ligne l'indique et ne propose aucune action.

Si vous utilisez **Mot de passe oublié ?** sur la page de connexion, le lien reçu par e-mail permet de choisir un nouveau mot de passe. L’appareil déjà configuré reste en place et sera encore exigé à la prochaine connexion.

Dans une instance de démonstration en lecture seule, ces boutons sont masqués et un message l'indique.

![Milvago - Sécurité et accès](/img/docs/fr/mon-profil-profil-03.png)

Les clés personnelles se gèrent dans [Clés API et serveur MCP](cles-api.md).
