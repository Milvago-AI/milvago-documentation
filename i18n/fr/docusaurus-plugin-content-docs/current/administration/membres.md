---
sidebar_position: 1
title: Membres
---

# Membres

## Accéder à l’écran

Dans la barre latérale, cliquez sur **Administration**, puis sur **Membres**. Vous devez disposer de `members.read` ; pour inviter, importer ou modifier un membre, vous devez aussi disposer de `members.manage`.

Pour inviter une personne :

1. Cliquez sur **Inviter un membre**.
2. Saisissez l’adresse e-mail, choisissez le rôle et la langue de console.
3. Envoyez l’invitation ; le fournisseur d’identité prend ensuite le relais et le membre apparaît après son affiliation.

L'écran Membres répond à la question « **qui peut entrer** dans cette organisation, et avec quel rôle ». Il liste les membres accessibles depuis votre organisation — y compris, en Enterprise, ceux des organisations filles de votre sous-arbre — et porte les actions d'affiliation : invitation, changement de rôle, changement de langue, retrait d'accès.

L'accès exige la permission `members.read` ; sans elle, l'entrée de navigation n'existe pas et l'écran affiche « Accès réservé ».

![Milvago - Membres](/img/docs/fr/administration-membres-01.png)

## Le tableau des membres

Chaque ligne est un membre, avec ses colonnes :

Le sélecteur **Par page** propose 10, 20, 50, 100 ou 200 membres. Le compteur porte sur tous les membres visibles et les boutons numérotés donnent accès à la première, à la dernière et aux pages voisines.

| Colonne | Contenu |
| --- | --- |
| **Membre** | nom affiché, ou « — » quand il n'en a pas |
| **Adresse e-mail** | l'adresse du compte |
| **Rôle** | badge du rôle courant (`owner`, `admin`, `viewer`, `reporter` ou un rôle personnalisé) |
| **Type** | provenance de l'identité : « Local », « SSO » ou « LDAP » |
| **Langue** | langue de console du membre, ou « Par défaut » |
| **Organisation** | nom de l'organisation d'affiliation, ou « — » |
| **Actions** | voir ci-dessous |

![Milvago - Le tableau des membres](/img/docs/fr/administration-membres-02.png)

À vide, l'écran lit « Aucun membre visible » : cela décrit ce que vos droits laissent voir, pas une organisation sans utilisateur.

## Les actions par membre

Les trois actions n'apparaissent que si vous portez `members.manage` (`members.manage` : « Gérer les membres »), que le membre appartient à l'organisation courante, que ce n'est pas votre propre compte, et — pour un propriétaire — que vous êtes vous-même propriétaire de l'organisation. Sinon la cellule montre un verrou avec, au survol, la raison exacte : « C'est vous : vous ne pouvez pas modifier votre propre accès. », « Propriétaire : seul un propriétaire peut le modifier. », ou « Basculez sur cette organisation pour gérer ce membre. » Ces mêmes actions exigent aussi que vos propres permissions couvrent chacune de celles du rôle actuel du membre — la même règle que pour accorder un rôle ; une clé API est liée de la même façon par ses propres permissions.

- **Modifier le rôle** : le nouveau rôle s'applique après une nouvelle connexion, et les sessions actuelles du membre sont invalidées. La liste des rôles proposés omet « Propriétaire » si vous n'êtes pas propriétaire.
- **Modifier la langue** : la langue s'applique à la prochaine ouverture de la console par ce membre ; « Par défaut » suit la langue de son navigateur, ou l'anglais si elle n'est pas servie. Ses sessions restent ouvertes.
- **Retirer l'accès** : le membre perd l'accès à cette organisation et ses sessions sont invalidées ; son identité chez le fournisseur de connexion est conservée. Sur votre propre compte, un avertissement précède la confirmation.

Le dernier propriétaire d'une organisation ne peut être ni rétrogradé ni retiré : que ce soit via **Modifier le rôle** ou **Retirer l'accès**, le serveur refuse avec « Attribuez un autre propriétaire avant de retirer ou de rétrograder le dernier propriétaire. » Attribuez d'abord un second propriétaire.

:::enterprise

Une personne qui atteint cette organisation par son organisation parente (accès hérité) ne peut être invitée, importée, réattribuée ou retirée ici que par quelqu'un qui gère les membres de l'organisation parente ; sinon le serveur refuse avec « L'accès de cette personne vient de l'organisation parente : gérez-le depuis là. »

En Enterprise, un compte qui appartient déjà à une autre organisation — une organisation que la vôtre ne contient pas et qui ne la contient pas, comme une organisation sœur — ne peut être ni invité ni importé ici : le serveur refuse avec « Ce compte appartient à une autre organisation. Invitez-le depuis une organisation qui contient les deux. » Pour une telle personne, la langue de console ne peut être changée que par elle-même, depuis son profil.

:::

![Milvago - Les actions par membre](/img/docs/fr/administration-membres-03.png)

## Inviter un membre

Le bouton « Inviter un membre » ouvre un dialogue à trois champs : adresse e-mail, rôle (même règle d'omission du rôle Propriétaire) et langue de console. L'invitation est envoyée par le fournisseur d'identité ; la mention de pied de page le dit et rappelle ses conditions :

- Les identités et invitations sont gérées par Keycloak. L'envoi d'une invitation exige une configuration SMTP opérationnelle.
- Les comptes SSO et LDAP invités par e-mail n'en reçoivent pas ; leur accès s'active à la première connexion.

Un nouveau compte local reçoit « Votre invitation à Milvago », dans la langue de console choisie pour lui. Son lien **Activer mon compte** confirme l’adresse, puis demande un mot de passe. La dernière page, « Votre compte est prêt », propose **Se connecter**, qui ouvre directement la connexion à la console. Le lien est valable un jour. Quand le SSO est proposé et que l’adresse appartient au domaine de l’organisation, l’invitation n’a pas de mot de passe à créer : après le lien, la personne se connecte avec Google ou Microsoft (voir [SSO](../avance/sso.md)).

## Importer depuis l'annuaire

Quand un annuaire LDAP est configuré pour l'organisation, un second bouton apparaît : « Importer depuis l'annuaire ». Il ouvre une recherche sur l'annuaire, et l'import crée le membre avec le rôle choisi. L'import exige `members.manage` et un annuaire joignable en LDAPS ou StartTLS vérifié ; un compte d'annuaire sans adresse e-mail est refusé.

L'annuaire lui-même se configure dans [Paramètres](parametres.md).
