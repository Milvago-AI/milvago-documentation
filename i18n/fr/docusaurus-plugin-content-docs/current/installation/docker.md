---
sidebar_position: 2
title: Installation Docker
---

# Installer Milvago Community

## 1. Préparer le serveur

Utilisez un serveur Linux avec un accès Internet, Bash, `curl` et un compte `root` ou l'autorisation d'utiliser `sudo`. La commande `curl` doit être disponible avant de lancer la commande ci-dessous.

Pour un accès partagé, choisissez l'adresse à laquelle les utilisateurs ouvriront Milvago, par exemple `https://milvago.example.com`. Configurez son DNS et un reverse proxy HTTPS qui transmet les requêtes à l'adresse IP privée du serveur Milvago sur le port **4020**. Autorisez cette connexion dans le pare-feu du serveur. L'installateur configure l'URL de l'application ; il ne crée ni les enregistrements DNS ni votre certificat HTTPS.

Vérifiez que l'horloge du serveur est synchronisée, notamment avant de configurer l'authentification à deux facteurs.

### Exploitation de production

Le profil installé exécute Keycloak avec `start`, en mode production, derrière le reverse proxy HTTPS que vous fournissez. Laissez ce proxy devant le port `4020`, conservez l'en-tête `Host` et transmettez `X-Forwarded-Proto: https`.

Mailpit est désactivé dans le profil installé. Il reste accessible uniquement par le profil `development-mail`, pour un usage de développement volontaire ; ce n'est pas un service de messagerie de production. Configurez un vrai serveur SMTP pendant l'assistant ou plus tard dans **Administration > Paramètres**, puis envoyez un message de test avant de compter sur les invitations ou les e-mails de réinitialisation de mot de passe. Sans SMTP, ces messages ne sont pas disponibles.

À chaque exécution, l'installateur arrête un éventuel service Mailpit de développement déjà actif sans supprimer ses messages capturés. Il retire uniquement la configuration SMTP d'usine (`mail:1025` avec `no-reply@milvago.test`) et préserve les réglages SMTP configurés par un opérateur.

Les conteneurs gateway et development-mail s'exécutent en `65532:65532`, avec toutes les capacités Linux retirées ; gateway ajoute uniquement la capacité nécessaire à la liaison de son port. Utilisez un compte d'installation dédié, autorisé à employer `sudo` mais non membre du groupe `docker`. Conservez un propriétaire de volume propre au service qui le possède. Cette installation ne promet pas Docker rootless. Docker `userns-remap` n'est pas activé ni qualifié : testez la sonde de disponibilité sur le réseau hôte et les propriétaires de volumes avant de l'activer.

## 2. Lancer l'installation

```bash
curl -fsSL https://get.milvago.ai | bash
```

Aucun compte GitHub, jeton ou identifiant de registre n'est nécessaire. Cette adresse distribue le dernier installateur publié ; chaque installateur fixe une version précise du serveur et l'empreinte de son image.

L'installateur vérifie les utilitaires nécessaires, dont `tar`, `gzip` et les certificats CA. Il peut installer les prérequis manquants avec `apt-get`, `dnf` ou `yum`, ainsi que Docker Engine et Compose sur les distributions prises en charge. Il peut demander votre mot de passe `sudo`. Cela ne garantit pas la compatibilité avec toutes les distributions ou versions de Linux.

L'image du serveur est publique. L'installateur vérifie sa signature cosign, puis le SHA-256 du paquet de l'agent Community, ses manifestes de mise à jour signés Ed25519 et leur expiration avant de proposer le téléchargement des agents.

## 3. Choisir un accès local ou public

À l'invite suivante :

```text
Milvago public URL [http://localhost:4020]:
```

Pour un accès partagé, saisissez l'adresse publique complète :

```text
https://milvago.example.com
```

Le préfixe `https://` ou `http://` est obligatoire. Vous pouvez préciser un port, mais aucun chemin, paramètre de requête ou fragment. Une URL invalide arrête l'installateur avec un message explicatif. Il n'ajoute pas automatiquement le protocole. Ce mode public lie la passerelle au réseau de l'hôte sur le port `4020` ; gardez le reverse proxy HTTPS devant elle.

Laissez l'invite vide pour une installation locale. Elle utilise `http://localhost:4020` et lie le port `4020` uniquement à `127.0.0.1`. Une valeur explicite `http://localhost:4020` ou `http://127.0.0.1:4020` sélectionne le même mode local. Le mode local n'ouvre aucun port supplémentaire sur l'hôte ; l'application et le service d'identité restent internes.

Ouvrez une installation locale dans un navigateur sur le serveur lui-même. Depuis un autre ordinateur, créez d'abord un tunnel SSH, puis ouvrez `http://localhost:4020` localement :

```bash
ssh -L 4020:127.0.0.1:4020 utilisateur@serveur
```

La saisie se fait sur le terminal, même lorsque le script arrive dans Bash par un pipe. En l'absence de terminal de contrôle et d'URL fournie, l'installateur sélectionne le mode local.

### Fournir l'URL directement

Pour éviter la question sur l'URL, transmettez-la à Bash dans la même commande :

```bash
curl -fsSL https://get.milvago.ai | MILVAGO_PUBLIC_URL=https://milvago.example.com bash
```

Remplacez l'adresse d'exemple par la vôtre. Les mêmes validations s'appliquent. Cette variante supprime la question sur l'URL, mais pas une éventuelle authentification `sudo`.

Pour une installation locale non interactive, définissez la variable avec une valeur vide :

```bash
curl -fsSL https://get.milvago.ai | MILVAGO_PUBLIC_URL='' bash
```

Le mode localhost par défaut est disponible à partir de la version `1.0.2` de l’installateur.

Lors d'une exécution ultérieure, l'installateur conserve l'URL configurée. Il s'arrête si une URL fournie, y compris un passage entre mode local et public, entre en conflit avec elle ; modifiez-la plutôt dans **Administration > Paramètres**.

## 4. Terminer la configuration

À la fin de l'installation :

1. Ouvrez l'URL affichée par l'installateur.
2. Récupérez la valeur `MILVAGO_SETUP_TOKEN` dans le fichier `.env` au chemin indiqué. Le dossier d'installation par défaut est `$HOME/milvago-community` ; `MILVAGO_DIR` permet de le remplacer.
3. Saisissez ce jeton dans l'assistant du navigateur et terminez la configuration, dont la création du compte administrateur. Il s'agit d'un jeton de configuration Milvago, pas d'un jeton GitHub.
4. Suivez [Installation des composants](composants.md) pour inscrire votre premier poste.

Conservez le fichier `.env` confidentiel : il contient les secrets générés pour votre instance.

## Installer une version précise

Pour choisir explicitement une release et vérifier les fichiers téléchargés avant leur exécution, utilisez l'URL de cette version. Pour le serveur **1.0.2**, qui utilise l'agent et l'extension Community **0.6.4** :

```bash
mkdir -p milvago-install && cd milvago-install
release_url=https://github.com/Milvago-AI/milvago-server/releases/download/v1.0.2
curl -fLO "$release_url/install-private.sh"
curl -fLO "$release_url/SHA256SUMS"
curl -fLO "$release_url/release.json"
sha256sum --check SHA256SUMS
bash install-private.sh
```

Lancez l'installateur uniquement si les deux vérifications d'empreinte indiquent `OK`. Le nom `install-private.sh` est historique ; ces téléchargements ne nécessitent aucun identifiant GitHub.
