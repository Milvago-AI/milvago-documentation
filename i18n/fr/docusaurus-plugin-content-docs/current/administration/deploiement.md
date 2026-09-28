---
sidebar_position: 9
title: Déploiement
---

# Déploiement

## Accéder au déploiement

Il n’existe pas d’entrée de navigation **Déploiement**. Pour gérer une clé, cliquez sur **Administration**, puis sur **Paramètres**, et ouvrez **Clé de déploiement**. En Enterprise : **Administration** > **Organisations** > l’organisation concernée > **Clé de déploiement**. Vous devez disposer de `installers.manage` (« Gérer les installeurs »).

1. Cliquez sur **Générer une clé**, **Faire tourner** ou **Révoquer**, selon l’état affiché.
2. Lisez l’avertissement qui précise l’effet sur les installateurs déjà distribués.
3. Confirmez l’action.
4. Vérifiez l’état et la date de dernière rotation dans le panneau ; les postes déjà inscrits ne sont pas modifiés.

Cette page décrit comment les **postes** sont enrôlés : la clé de déploiement qui autorise l'inscription, les installateurs qui la portent, et ce qui arrive à un poste après son installation. Pour l'installation de la plateforme elle-même (serveur, base, images), voir [Installation des composants](../installation/composants.md).

## La clé de déploiement

La clé de déploiement autorise l'inscription d'un poste. Sous Windows, elle se trouve dans un fichier de provisionnement séparé ; le MSI ne contient aucun secret d'organisation. Le RPM Linux actuel porte encore la clé. Chaque poste reçoit ses propres identifiants après son inscription. Le panneau dans [Paramètres](parametres.md), et sur la page de chaque [organisation](organisations.md) en Enterprise, affiche l'état, la création, la dernière rotation et le nombre d'installations.

- **Générer une clé** ou **Faire tourner** : téléchargez ensuite un nouveau ZIP Windows. Les anciens fichiers et RPM Linux ne peuvent plus inscrire de postes. Les postes déjà inscrits restent inchangés.
- **Révoquer** : aucun nouveau poste ne peut s'inscrire avant la génération d'une nouvelle clé. Les postes déjà inscrits restent inchangés.

![Milvago - La clé de déploiement](/img/docs/fr/administration-deploiement-01.png)

## Télécharger l'agent

Confirmez l'**URL HTTPS publique** dans [Paramètres](parametres.md), puis cliquez sur **Windows ZIP**. Une seule archive contient le MSI immuable, son script PowerShell, le JSON de provisionnement de cette organisation et un `README.md` avec la commande d’installation. Le téléchargement exige `installers.manage`. Si votre compte utilise un second facteur, une nouvelle vérification peut être demandée ; le ZIP se télécharge automatiquement à son retour. Le ZIP et le JSON contiennent un jeton de déploiement : protégez-les jusqu'à leur suppression ou à la rotation ou révocation de la clé.

Extrayez `milvago-windows-package.zip` dans un dossier protégé. Dans ce dossier, exécutez le script en administrateur :

```powershell
powershell.exe -NoProfile -File .\milvago-windows-install.ps1 -MsiPath .\milvago-windows-installer.msi -ProvisionPath .\milvago-provision.json
```

Les trois chemins de la commande correspondent aux fichiers du ZIP. Conservez-les ensemble après extraction. Les deux paramètres du script sont obligatoires ; sans eux, PowerShell demande `MsiPath` et `ProvisionPath`. Le `README.md` inclus reprend les étapes d’installation.

Le script contrôle l'empreinte du MSI, vérifie la signature Authenticode de l'éditeur lorsqu'un certificat de signature est configuré, dépose le MSI et le JSON dans un répertoire réservé à SYSTEM et aux administrateurs, lance Windows Installer puis supprime ces fichiers temporaires. Ouvrir le MSI seul ne permet pas d'inscrire un nouveau poste, car il ne contient aucune clé d'organisation. Les paquets locaux fabriqués avant l'arrivée du certificat ne portent pas de signature Authenticode : réservez-les à un environnement de test contrôlé.

Linux télécharge encore un RPM propre à l'organisation. L'approbation manuelle ou selon le réseau s'applique après installation. L'extension navigateur doit également être distribuée.

## Après l'installation

Un poste inscrit demande son approbation selon le mode choisi, puis reçoit la politique Shadow AI et ses révisions suivantes. Les mises à jour de l'agent passent par des installateurs signés ; l'écran d'un poste expose son état de mise à jour, et la section « Exploitation » de [Shadow AI](shadow-ai.md) règle parc pilote et versions suspendues quand elle est ouverte au diagnostic.

:::enterprise

En Enterprise multi-organisations, chaque organisation porte **sa propre** clé de déploiement. L'administrateur d'une organisation mère la fait tourner ou la révoque depuis la page de la fille, sans basculer dans son contexte — c'est le premier bloc de cette page.

Les images Docker Enterprise embarquent le MSI immuable, son script de déploiement lié à la version et un manifeste de mise à jour signé. Le serveur sert les mêmes octets MSI à toutes les organisations.

:::
