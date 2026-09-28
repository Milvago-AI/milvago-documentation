---
sidebar_position: 5
title: SSO (Google / Microsoft Entra ID)
---

# SSO (Google / Microsoft Entra ID)

Comment permettre aux membres de se connecter avec leur compte Google Workspace ou Microsoft Entra ID ?

L'authentification unique se configure entièrement depuis la console Milvago, dans **Administration** > **Paramètres** > **SSO**. Personne n'a besoin d'ouvrir le service d'identité derrière Milvago : son administration n'est pas accessible depuis le réseau, et la console écrit le fournisseur à votre place.

## Accéder à l'écran

1. Dans la barre latérale, ouvrez **Administration**, puis cliquez sur **Paramètres**.
2. Dans la navigation verticale, cliquez sur **SSO**.

La section affiche un bloc par fournisseur — **Google Workspace** et **Microsoft Entra ID** — chacun avec son **URI de redirection**, ses champs et un bouton **Enregistrer**.

![Configuration SSO pour Google Workspace et Microsoft Entra ID](/img/docs/fr/avance-sso-01.png)

## Qui peut le configurer

- La section **SSO** apparaît avec la permission `directory.manage` (« Gérer l'annuaire LDAP et le SSO ») et une licence hors mode restreint : une instance Community sans licence n'affiche ni la section, ni la connexion SSO.
- Enregistrer ou supprimer un fournisseur exige un second facteur vérifié à l'instant, et aucune des deux actions n'est accessible à une clé API.
- Le secret client n'est plus jamais réaffiché une fois enregistré : le champ reste vide, et le laisser vide conserve le secret stocké.

:::enterprise

Un fournisseur est proposé sur la page de connexion de toutes les organisations de l'instance. Seul un propriétaire de l'organisation racine peut le configurer ; toute autre personne qui ouvre la section lit « L'authentification unique s'applique à toutes les organisations de cette instance : seul un propriétaire de l'organisation racine peut la configurer. »

:::

## Principe : inviter d'abord, rattacher à la première connexion

**Une personne doit être invitée dans Milvago avant sa première connexion SSO** (Administration > Membres). Sans invitation préalable, la connexion est refusée (`membership_required`). Un compte SSO invité ne reçoit aucun e-mail d'activation : son premier geste est de se connecter par le fournisseur.

À cette première connexion, si un compte Milvago existe déjà avec le même e-mail — le compte invité, ou tout autre, y compris celui du propriétaire —, il n'est jamais rattaché sur la seule correspondance d'e-mail. La personne est invitée à confirmer le rattachement, puis à prouver qu'elle contrôle ce compte existant : en se connectant avec ses identifiants actuels, ou en confirmant un lien envoyé à son adresse e-mail. Ce n'est qu'alors que le compte devient une identité SSO ; son type passe à **SSO** dans Membres, et la personne se connecte désormais via le fournisseur.

Le rattachement n'est possible que de cette façon. Un utilisateur déjà connecté ne peut pas rattacher un compte externe au sien depuis sa page de sécurité de compte : cette option est désactivée dès qu'un fournisseur est enregistré.

L'obligation de second facteur de l'organisation s'applique aussi aux connexions SSO : Milvago lit la MFA à partir de la preuve attestée par le fournisseur sur la connexion, jamais à partir du type de compte. Quand l'organisation exige la MFA, imposez-la côté fournisseur (validation en deux étapes de Google Workspace, ou une stratégie d'accès conditionnel Microsoft Entra exigeant la MFA). Sur la page de profil Milvago, les actions liées au mot de passe, à l'e-mail, au profil et au second facteur restent verrouillées pour un compte SSO : elles se gèrent chez le fournisseur.

### Invitations du domaine de l’organisation

Quand un fournisseur est proposé, un nouveau membre invité avec une adresse de son domaine — le **Domaine Google Workspace**, ou le **Domaine des invitations** de Microsoft — reçoit une invitation sans mot de passe à créer. Le lien de l’e-mail confirme l’adresse ; la page « Votre compte est prêt » propose alors **Se connecter**, et la première connexion par le bouton du fournisseur rattache directement le compte du fournisseur, sans la preuve décrite ci-dessus : le lien d’invitation a déjà prouvé la boîte aux lettres, et le fournisseur répond de la même adresse.

Cela ne vaut qu’une fois, pour un compte créé par l’invitation et qui ne s’est jamais connecté. Dès sa première connexion, et pour tout autre compte, la preuve est de nouveau exigée. Un membre invité avec une autre adresse reçoit l’invitation habituelle, avec un mot de passe à choisir.

Pour Microsoft, le domaine des invitations est facultatif et doit appartenir à votre locataire : Microsoft Entra ne garantit pas que l’adresse e-mail d’une connexion a été vérifiée, donc sans ce domaine les invitations Microsoft gardent la preuve. Un fournisseur enregistré avant l’existence de cette option doit être enregistré une fois de plus pour qu’elle s’applique.

## Google Workspace

Sources officielles : [Google Cloud — Using OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server), [Google Cloud — Setting up OAuth 2.0](https://support.google.com/cloud/answer/6158849).

### 1. Créer le client OAuth chez Google

1. Dans la [Google Cloud Console](https://console.cloud.google.com/), ouvrez **APIs & Services > OAuth consent screen** et complétez l'écran de consentement.
2. Ouvrez **APIs & Services > Credentials**, puis **Create Credentials > OAuth client ID**.
3. Sélectionnez le type d'application **Web application**.
4. Dans **Authorized redirect URIs**, collez l'**URI de redirection** affichée dans le bloc **Google Workspace** de Milvago.
5. Créez le client : Google affiche le **Client ID** et le **Client secret**.

### 2. L'enregistrer dans Milvago

1. Dans le bloc **Google Workspace**, saisissez l'**ID client OAuth** et le **Secret client**.
2. Saisissez le **Domaine Google Workspace** de l'entreprise, par exemple `example.com`. Il est obligatoire : seuls les comptes de ce domaine peuvent se connecter. Les membres invités avec une adresse de ce domaine se connectent directement avec Google, sans créer de mot de passe.
3. Laissez **Proposer ce fournisseur sur la page de connexion** coché.
4. Cliquez sur **Enregistrer**, puis vérifiez le second facteur si demandé. « Fournisseur enregistré. » le confirme ; un bouton **Google** apparaît désormais sur la page de connexion.

## Microsoft Entra ID

Sources officielles : [Microsoft Learn — Register an application with the Microsoft identity platform](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app), [Microsoft Learn — Add and manage app credentials](https://learn.microsoft.com/en-us/entra/identity-platform/how-to-add-credentials), [Microsoft Learn — Provide optional claims](https://learn.microsoft.com/en-us/entra/identity-platform/optional-claims).

### 1. Enregistrer l'application chez Microsoft

1. Dans le [Microsoft Entra admin center](https://entra.microsoft.com), ouvrez **Entra ID > App registrations > New registration**.
2. Donnez un nom à l'application.
3. Sous **Supported account types**, choisissez l'option mono-tenant (comptes de votre annuaire organisationnel uniquement).
4. Sous **Redirect URI**, choisissez **Web** et collez l'**URI de redirection** affichée dans le bloc **Microsoft Entra ID** de Milvago, puis cliquez sur **Register**.
5. Sur la page **Overview**, relevez l'**Application (client) ID** et le **Directory (tenant) ID**.
6. Ouvrez **Certificates & secrets > Client secrets > New client secret**, choisissez une expiration — notez-la, le secret devra être renouvelé avant cette échéance — puis cliquez sur **Add**. La **Value** du secret ne s'affiche qu'une fois : notez-la immédiatement.
7. Ouvrez **Token configuration > Add optional claim**, choisissez le type de jeton **ID**, cochez **email** puis cliquez sur **Add**, afin que chaque connexion porte l'adresse e-mail de la personne.

### 2. L'enregistrer dans Milvago

1. Dans le bloc **Microsoft Entra ID**, saisissez l'**ID d'application (client)** et le **Secret client**.
2. Saisissez l'**ID de l'annuaire (locataire)**, une valeur de la forme `00000000-0000-0000-0000-000000000000`. Seuls les comptes de ce locataire peuvent se connecter ; les valeurs partagées comme `common` ou `organizations` sont refusées, car elles accepteraient d'autres locataires.
3. Facultatif : saisissez le **Domaine des invitations (facultatif)**, par exemple `example.com` : les membres invités avec une adresse de ce domaine se connectent directement avec Microsoft. N’indiquez qu’un domaine qui appartient à votre locataire, ou laissez vide.
4. Laissez **Proposer ce fournisseur sur la page de connexion** coché.
5. Cliquez sur **Enregistrer**, puis vérifiez le second facteur si demandé. « Fournisseur enregistré. » le confirme ; un bouton **Microsoft** apparaît désormais sur la page de connexion.

Milvago dérive chaque adresse Microsoft depuis l'ID du locataire et vérifie que chaque connexion a bien été émise par ce locataire.


## Changer, suspendre ou supprimer un fournisseur

- **Renouveler le secret** : saisissez la nouvelle valeur dans **Secret client**, puis cliquez sur **Enregistrer**. Changer l'ID client exige toujours son secret.
- **Suspendre** : décochez **Proposer ce fournisseur sur la page de connexion**, puis cliquez sur **Enregistrer**. La configuration est conservée.
- **Supprimer** : cliquez sur **Supprimer le fournisseur**, lisez l'avertissement « Les comptes qui se connectent par ce fournisseur ne pourront plus l'utiliser pour se connecter. », puis cliquez sur **Confirmer la suppression**. « Fournisseur supprimé. » le confirme.
- **Fournisseur créé hors de la console** : si le fournisseur d'identité contient déjà un fournisseur du même nom qui n'a pas été configuré ici (autre type, flux après connexion ou mappeurs), **Enregistrer** est refusé au lieu de le reprendre. Cliquez sur **Supprimer le fournisseur**, puis enregistrez à nouveau.

Chaque enregistrement et suppression est consigné dans le [journal d'audit](../administration/audit.md) (`sso.update`, `sso.remove`).

## Vérifier

1. Invitez un compte du domaine ou du tenant de l'entreprise (Administration > Membres), sans qu'il se soit encore connecté.
2. Connectez-vous avec ce compte via le bouton du fournisseur : la connexion doit aboutir, et son type de membre passe à **SSO** dans Membres.
3. Tentez une connexion avec un compte Google ou Microsoft **hors** du domaine ou du tenant : elle doit être refusée.

Ces vérifications valident la configuration du fournisseur ; elles ne remplacent pas un test des politiques MFA du fournisseur, qui restent de sa responsabilité.
