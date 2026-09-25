---
sidebar_position: 2
title: Installation Docker
---

# Installation Docker

:::note[Coming soon]

Cette page est en préparation. Le déploiement Docker existe déjà dans le produit (les images serveur, console et agent MSI alimentent le `compose` actuel) ; cette page le documentera pas à pas.

:::

Contenu prévu :

- les images officielles des deux éditions (serveur, console, agent MSI + manifeste de mise à jour) ;
- le fichier `compose` et les variables d'environnement (`SESSION_KEY`, `CONTENT_KEYS`, `POLICY_SIGNING_KEY`, `MILVAGO_INSTALLER_DIRECTORY`) ;
- PostgreSQL et les migrations de démarrage ;
- la mise en service et les vérifications après remplacement d'image.

## Premier démarrage

Une fois la pile démarrée, ouvrez la console : sans administrateur existant, elle affiche l'assistant de [première installation](premiere-installation.md). Saisissez la valeur de `MILVAGO_SETUP_TOKEN` générée dans `.env`, puis suivez l'assistant.
