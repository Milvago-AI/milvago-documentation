---
sidebar_position: 3
title: Première installation
---

# Première installation

Comment une instance Milvago toute neuve, sans aucun administrateur, se met-elle en service ? Cette page décrit l'assistant qui crée le premier compte, règle la sécurité, l'organisation, le serveur e-mail et les valeurs de confidentialité par défaut.

## Accéder à l'écran

Une instance démarrée **sans** la variable `BOOTSTRAP_EMAIL` n'a pas d'administrateur : à la place de l'écran de connexion, la console affiche directement l'assistant « **Installer cette instance Milvago** ». Rien à cliquer pour l'ouvrir, il remplace la page d'entrée tant qu'aucun compte n'existe.

[IMAGEAMETTREICI 01]

## Ce qui protège l'assistant

L'assistant est fermé tant que le serveur ne dispose pas de deux choses :

- **`MILVAGO_SETUP_TOKEN`** — un jeton à usage unique d'au moins 32 caractères, fourni par variable d'environnement ou par un Secret Kubernetes. Le serveur n'en conserve que l'empreinte SHA-256 ; il n'apparaît dans aucun journal. Le script Community `scripts/local-init.mjs` en génère un automatiquement dans `.env`.
- **Un compte de service d'administration de l'identité** — `OIDC_ADMIN_CLIENT_ID` et `OIDC_ADMIN_CLIENT_SECRET`.

Sans l'une ou l'autre, l'assistant affiche « **L'assistant d'installation est fermé** » — « Fournissez au serveur MILVAGO_SETUP_TOKEN et le compte d'administration de l'identité (OIDC_ADMIN_CLIENT_ID, OIDC_ADMIN_CLIENT_SECRET), puis rechargez cette page. » Voir [Variables d'environnement](variables-environnement.md).

Rien n'est enregistré avant la dernière étape : le mot de passe et la licence saisie restent en mémoire de la page jusqu'à leur envoi, une seule fois, à la dernière étape, et ne sont jamais écrits dans un stockage du navigateur.

## Les neuf étapes

### 1. Jeton d'installation

Champ **Jeton d'installation** — « La valeur de MILVAGO_SETUP_TOKEN fournie au serveur. Elle n'apparaît dans aucun journal. » Une fois validé, une session d'installation s'ouvre.

### 2. Licence

**Enterprise** : « La licence est fournie par Milvago AI. Partagez l'identifiant d'instance ci-dessous lorsque vous en demandez une, puis collez-la ici pour continuer. » L'assistant affiche l'**identifiant d'instance** de la future installation, avec un bouton pour le copier, puis un champ pour coller le texte de la licence reçue. La licence est obligatoire pour continuer.

**Community** : trois choix, « Continuer sans licence » sélectionné par défaut :

- **J'ai une licence** — un champ pour coller le texte de la licence.
- **Demander une licence gratuite** — une adresse e-mail à saisir, puis **Envoyer la demande** ; « Demande envoyée. Consultez la boîte de réception de {`adresse`} et collez ci-dessous la licence reçue. », suivi du même champ pour la coller.
- **Continuer sans licence** — l'avis « Aucune licence » : « Limité à 5 postes, un seul compte administrateur, aucune gestion des droits, aucun annuaire LDAP et aucun SSO. Une licence peut être demandée plus tard depuis [Administration > Paramètres > Licence](../administration/parametres.md#licence). »

Choisir « J'ai une licence » sans coller de texte, ou rester en Enterprise sans en coller un, bloque le passage à l'étape suivante avec « Saisissez une licence pour continuer. » Le texte collé n'est vérifié par le serveur qu'à la toute fin de l'assistant, au moment de créer le compte : une licence invalide, ou une licence Community proposée à une instance Enterprise, échoue alors avec l'erreur du serveur, affichée sur le Récapitulatif — pas sur cette étape. Le Récapitulatif liste ce choix en premier : « Licence saisie » ou « Aucune ».

[IMAGEAMETTREICI 02]

### 3. Langue

**Langue par défaut de l'instance** : la choisir bascule immédiatement la langue de l'assistant.

### 4. Compte administrateur

« Ce compte devient propriétaire de l'organisation à sa première connexion. » Adresse e-mail, prénom, nom, puis le mot de passe saisi deux fois — « Au moins 12 caractères, différent de l'adresse e-mail. Le fournisseur d'identité peut en exiger davantage. » Le fournisseur d'identité a le dernier mot sur la politique de mot de passe.

[IMAGEAMETTREICI 03]

### 5. Sécurité

Deux réglages :

- **Enrôler une application d'authentification à la première connexion** — coché par défaut. « Recommandé : ce compte détient toutes les permissions. »
- **Exiger l'authentification multifacteur pour tous les membres** — « Les membres qui se connectent par mot de passe doivent utiliser un second facteur. Les identités d'un fournisseur externe s'appuient sur le sien. »

### 6. Organisation et accès

**Nom de l'organisation**, puis **URL HTTPS publique (agent)** — « Adresse utilisée par les agents et l'extension navigateur. » — préremplie avec l'adresse actuelle. Une URL HTTP n'est acceptée que sur un loopback explicite.

### 7. Serveur e-mail

Étape facultative — « Sert à envoyer les invitations des membres. Il peut aussi être configuré plus tard dans le fournisseur d'identité. » Une fois **Configurer un serveur e-mail maintenant** cochée : hôte, port, sécurité de connexion (STARTTLS, TLS ou aucune), adresse et nom d'expéditeur, puis utilisateur et mot de passe facultatifs. Le bouton **Envoyer un e-mail de test** envoie un message réel à l'adresse de l'administrateur avec ces réglages. Des identifiants ne sont jamais acceptés sur une connexion distante non chiffrée. Ces réglages deviennent le serveur SMTP du fournisseur d'identité, utilisé ensuite pour les invitations.

### 8. Confidentialité

Les mêmes réglages que Administration > Confidentialité, sauf **Attribut OIDC de l’équipe**, qui ne se règle qu’une fois un fournisseur d’identité en place — « Valeurs par défaut de l'organisation. Elles restent modifiables dans Confidentialité. »

### 9. Récapitulatif

« Vérifiez vos choix. Le compte administrateur est créé quand vous terminez ; vous vous connectez ensuite avec lui. » Le bouton final, **Créer l'administrateur et terminer**, déclenche la création.

[IMAGEAMETTREICI 04]

## Ce qui se passe à la fin

Le compte est créé dans le fournisseur d'identité avec le mot de passe choisi, e-mail marqué comme vérifié ; les réglages d'organisation, de sécurité, de serveur e-mail et de confidentialité sont écrits ; le navigateur est ensuite redirigé vers la connexion. Si un second facteur a été retenu à l'étape Sécurité — enrôlement de l'application d'authentification, ou authentification multifacteur exigée pour tous les membres — mot de passe et enrôlement TOTP se font en une seule connexion. Le compte devient propriétaire de l'organisation à cette première connexion — pas avant.

Une adresse e-mail déjà présente chez le fournisseur d'identité est refusée : l'assistant ne prend jamais la main sur un compte existant.

## Session, limites et fermeture définitive

La session d'installation dure 30 minutes ; passé ce délai, il faut ressaisir le jeton. Deviner le jeton est limité par adresse. Dès qu'un administrateur existe, **toutes** les routes de l'assistant répondent 404 : le jeton devient inutile, et il est recommandé de le retirer de l'environnement ou du Secret.

## Mode automatique (`BOOTSTRAP_EMAIL`)

Si `BOOTSTRAP_EMAIL` est définie au démarrage, l'assistant ne s'affiche jamais : le compte portant cette adresse, préalablement créé dans le fournisseur d'identité, devient propriétaire de l'organisation dès sa première connexion. Ce mode reste utile pour les démonstrations et les tests automatisés. Voir [Variables d'environnement](variables-environnement.md).

Ces deux modes existent dans Milvago Community comme dans Milvago Enterprise.
