---
sidebar_position: 5
title: SSO (Google / Microsoft Entra ID)
---

# SSO (Google / Microsoft Entra ID)

Comment brancher Milvago sur la connexion unique (SSO) de l'organisation, avec Google ou Microsoft Entra ID comme fournisseur d'identité ?

Le SSO de Milvago est du **courtage d'identité Keycloak** (*identity brokering*) : le fournisseur externe se configure dans la console d'administration Keycloak du realm `milvago`, jamais dans la console Milvago. Cette page suppose un déploiement `compose` local ou de démonstration, avec le compte d'amorçage `bootstrap-admin` (mot de passe `IDENTITY_ADMIN_PASSWORD` de `.env`) pour se connecter à Keycloak.

:::warning Hypothèse de confiance
Le rattachement automatique (`idp-auto-link`) n'est pas réservé aux comptes invités jamais encore connectés : toute identité d'un fournisseur fédéré qui présente le même e-mail se rattache à **n'importe quel** compte Keycloak local portant cet e-mail — y compris un compte déjà actif, y compris le compte administrateur ou propriétaire. C'est pourquoi la restriction de domaine ou de tenant, et **Trust Email** activé seulement une fois cette restriction posée, sont vitales : sans elles, un fournisseur non restreint permettrait à un tiers de s'approprier le compte propriétaire en présentant simplement son e-mail. Ne fédérez que des fournisseurs dont l'e-mail est fiable.
:::

## Principe : rattachement au premier login

Milvago définit son propre flux de première connexion via un fournisseur externe, `milvago-v1-first-broker-login` : s'il n'existe aucun compte Keycloak avec le même e-mail, il en crée un ; si un compte Keycloak local existe déjà avec cet e-mail — un compte **invité** dans Milvago (Administration > Membres) est l'usage prévu, mais le rattachement s'applique à **tout** compte local portant cet e-mail, quel que soit son état — il le rattache automatiquement au fournisseur externe. Après ce rattachement, la personne se connecte toujours via le fournisseur externe ; le type de compte affiché dans Membres passe à **SSO**.

Conséquence directe : **une personne doit être invitée dans Milvago avant sa première connexion SSO**. Sans invitation préalable, la connexion est refusée (`membership_required`), et un compte SSO invité ne reçoit aucun e-mail d'activation — son premier geste est de se connecter par le fournisseur.

Les identités SSO sont exemptées de l'obligation Milvago de second facteur : leur MFA relève du fournisseur (l'activer dans Google Workspace ou dans les stratégies d'accès conditionnel de Microsoft Entra). Dans la page de profil Milvago, les actions de libre-service — modification du mot de passe, de l'e-mail, du profil, enrôlement MFA — restent verrouillées pour un compte SSO : elles se gèrent chez le fournisseur.

## Préparer Keycloak

Dans la console d'administration Keycloak (realm `milvago`), ouvrez **Identity providers** dans le menu de gauche, puis **Add provider**. Choisissez Google ou OpenID Connect v1.0 selon le fournisseur (détails ci-dessous). Chaque fournisseur ajouté affiche une **Redirect URI** au format :

```
https://<hôte-keycloak>/realms/milvago/broker/<alias>/endpoint
```

C'est cette valeur qu'il faut coller dans la configuration du fournisseur externe (Google Cloud Console ou Microsoft Entra admin center) — jamais l'inverse.

## Google

Sources officielles consultées : [Google Cloud — Using OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server), [Google Cloud — Setting up OAuth 2.0](https://support.google.com/cloud/answer/6158849), documentation du fournisseur Google de Keycloak.

### 1. Créer les identifiants OAuth côté Google

1. Dans [Google Cloud Console](https://console.cloud.google.com/), ouvrez **APIs & Services > OAuth consent screen** et complétez l'écran de consentement.
2. Ouvrez **APIs & Services > Credentials**, puis **Create Credentials > OAuth client ID**.
3. Sélectionnez le type d'application **Web application**.
4. Dans **Authorized redirect URIs**, collez la **Redirect URI** affichée par Keycloak pour ce fournisseur.
5. Créez le client : Google affiche le **Client ID** et le **Client secret** (le secret n'est montré qu'une fois).

### 2. Ajouter le fournisseur dans Keycloak

Dans **Identity providers > Add provider**, choisissez **Google**, puis renseignez :

- **Client ID** et **Client Secret** obtenus à l'étape précédente ;
- **Hosted Domain** — le domaine Google Workspace de l'entreprise. C'est ce champ qui **restreint l'accès aux membres de l'organisation** ; sans lui, tout compte Google peut se présenter au courtier.
- **Trust Email** — à activer uniquement une fois le domaine renseigné : sans la restriction de domaine, faire confiance à l'e-mail Google reviendrait à laisser n'importe quel compte Google revendiquer un compte Milvago invité au même e-mail.

## Microsoft Entra ID

Sources officielles consultées : [Microsoft Learn — Register an application with the Microsoft identity platform](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app), [Microsoft Learn — Add and manage app credentials](https://learn.microsoft.com/en-us/entra/identity-platform/how-to-add-credentials), documentation du fournisseur OpenID Connect v1.0 de Keycloak.

### 1. Enregistrer l'application côté Microsoft Entra

1. Dans le [Microsoft Entra admin center](https://entra.microsoft.com), ouvrez **Entra ID > App registrations > New registration**.
2. Donnez un nom à l'application.
3. Sous **Supported account types**, choisissez **Single tenant only — &lt;votre tenant&gt;** — c'est cette option qui limite l'inscription au tenant de l'entreprise ; les autres options (multi-tenant, comptes personnels) l'ouvrent à des tenants ou des comptes hors de l'entreprise.
4. Cliquez sur **Register**, puis relevez l'**Application (client) ID** affiché sur la page **Overview**.
5. Ouvrez **Authentication > Add a platform > Web**, et collez la **Redirect URI** affichée par Keycloak.
6. Ouvrez **Certificates & secrets > Client secrets > New client secret**, ajoutez une description, choisissez une durée d'expiration (24 mois au maximum — préférez une durée plus courte et notez l'échéance pour la renouveler), puis **Add**. La **Value** du secret ne s'affiche qu'une fois : conservez-la immédiatement.

### 2. Ajouter le fournisseur dans Keycloak — préférer OpenID Connect v1.0 avec le point de découverte propre au tenant

Le fournisseur social **Microsoft** intégré à Keycloak ne propose pas de champ limitant l'inscription à un tenant Entra particulier : il faudrait alors compter uniquement sur la restriction posée côté Entra (compte à tenant unique). Pour ne pas dépendre d'un seul verrou, préférez un fournisseur générique **OpenID Connect v1.0**, avec le point de découverte spécifique au tenant :

```
https://login.microsoftonline.com/<tenant-id>/v2.0/.well-known/openid-configuration
```

**Jamais** `common` ou `organizations` à la place de `<tenant-id>` : ces alias visent les applications multi-tenant, leur émetteur n'est pas propre à votre tenant, et Keycloak ne peut alors pas vérifier que le jeton provient bien de votre tenant — utilisez toujours l'URL de découverte propre au tenant.

Dans **Identity providers > Add provider > OpenID Connect v1.0**, importez la configuration depuis cette URL de découverte (Keycloak remplit alors Authorization URL, Token URL et les autres points de terminaison), puis renseignez le **Client ID** et le **Client Secret** obtenus à l'étape précédente.

## Vérifier

1. Invitez un compte du domaine ou du tenant de l'entreprise (Administration > Membres), sans qu'il se soit encore connecté.
2. Connectez-vous avec ce compte via le fournisseur SSO : la connexion doit aboutir, et son type de membre passe à **SSO** dans Membres.
3. Tentez une connexion avec un compte Google ou Microsoft **hors** du domaine ou du tenant restreint : le fournisseur (Google) ou Keycloak (Microsoft, via le point de découverte propre au tenant) doit la refuser.

Ces vérifications valident la configuration du fournisseur ; elles ne remplacent pas un test complet des politiques MFA du fournisseur, qui restent sous sa responsabilité.
