---
sidebar_position: 6
title: Connecter Milvago au service éditeur
---

# Connecter Milvago au service éditeur

La connexion se configure sur le **serveur Milvago**. Demandez à l'exploitant du service éditeur l'adresse du service, le jeton de connexion propre à votre instance et sa clé publique de vérification.

## Configurer le serveur

Fournissez ensemble ces trois variables d'environnement au conteneur du serveur Milvago :

- `MILVAGO_PUBLISHER_URL` — l'origine HTTPS du service, sans chemin ni paramètres d'URL ;
- `MILVAGO_PUBLISHER_CREDENTIAL` — le jeton de connexion fourni pour votre instance, d'au moins 32 caractères ;
- `MILVAGO_PUBLISHER_PUBLIC_KEY` — la clé publique Ed25519 fournie pour ce service, encodée en base64 (32 octets une fois décodée).

Ces valeurs sont transmises par votre déploiement, puis prises en compte au démarrage du serveur. Elles ne se saisissent pas dans la console. Si l'URL est fournie sans les deux autres valeurs valides, le serveur refuse de démarrer. Ne publiez pas le jeton dans la documentation ou dans un fichier versionné.

**Community requiert aussi ce credential.** Aucun ID client distinct n'est à renseigner : le service associe le credential à l'édition et fournit à Community uniquement les règles de détection ChatGPT et Claude.

## Choisir les fonctions dans la console

1. Connectez-vous avec le droit `settings.manage` et une MFA fraîche.
2. Dans le menu latéral, ouvrez **Administration → Confidentialité**.
3. Dans **Partages éditeur**, cochez les choix adaptés : **Importer automatiquement le catalogue éditeur**, **Partager la santé des détecteurs** ou **Partager les effectifs du parc**.
4. Saisissez le motif demandé, puis sélectionnez **Enregistrer**. L’import automatique du catalogue n’est proposé qu’à l’organisation racine.
5. Si vous êtes propriétaire de l’instance, consultez l’aperçu du service éditeur affiché sous ces choix.

La connexion serveur seule n'active pas ces choix.

Voir [Confidentialité](../administration/confidentialite.md) pour les droits et les réglages de l'écran.
