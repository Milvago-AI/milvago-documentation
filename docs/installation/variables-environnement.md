---
sidebar_position: 5
title: Variables d'environnement
---

# Variables d'environnement

Toute la configuration du serveur passe par l'environnement : la console n'en lit jamais un et rien ne se règle à chaud. Une variable manquante ou invalide arrête le serveur avec le message exact du problème — pas de repli silencieux. Les variables nécessaires dépendent aussi du rôle du processus.

![Milvago - Variables d'environnement](/img/docs/fr/installation-variables-environnement-01.png)

## Rôles de processus

`MILVAGO_ROLE` choisit la responsabilité du processus. Sa valeur par défaut, `all`, conserve le processus combiné pour les déploiements existants. Dans Kubernetes, séparez les rôles et ne montez à chaque pod que les secrets dont il a besoin.

| Valeur | Responsabilité | Particularités |
| --- | --- | --- |
| `all` | API, maintenance, exports Enterprise et migrations | mode de compatibilité ; réunit les secrets des rôles concernés |
| `migrate` | migrations et initialisation | utilise `MIGRATION_DATABASE_URL` ; s'exécute comme Job avant l'API |
| `api` | HTTP, console et agents | ne reçoit ni URL de migration ni identité d'initialisation |
| `exports` | exports Enterprise | ne sert pas la console et n'exécute pas de migration |
| `maintenance` | travaux d'entretien | ne sert pas la console et n'exécute pas de migration |

## Obligatoires selon le rôle

| Variable | Rôle |
| --- | --- |
| `DATABASE_URL` | connexion PostgreSQL de runtime |
| `MIGRATION_DATABASE_URL` | connexion utilisée uniquement par `all` et `migrate` pour les migrations (rôle privilégié) |
| `APP_URL` | origine HTTPS de l'application (HTTP toléré sur loopback explicite uniquement) ; pilote le mode cookies sécurisés |
| `OIDC_ISSUER` | émetteur Keycloak (HTTPS ou loopback explicite) |
| `OIDC_CLIENT_ID` / `OIDC_CLIENT_SECRET` | client OIDC de la console |
| `SESSION_KEY` | racine de chiffrement des jetons OIDC de session (AES-256-GCM, 32 octets en base64 standard) |
| `CONTENT_KEYS` | racines du contenu scellé, format `version:base64` (`1:<32 octets base64>,2:…`) ; la version la plus haute scelle, les antérieures ne font qu'ouvrir |
| `POLICY_SIGNING_KEY` | graine Ed25519 de signature des politiques et catalogues (32 octets en base64) |

`DATABASE_URL` et `CONTENT_KEYS` restent nécessaires aux rôles qui accèdent aux données. `APP_URL`, la configuration OIDC, `SESSION_KEY` et `POLICY_SIGNING_KEY` sont requis par l'API. `migrate` requiert également `APP_URL`, et `maintenance` requiert l'émetteur OIDC. Le rôle `exports` n'est accepté que dans Milvago Enterprise et n'a besoin ni des secrets de session de console, ni de l'URL de migration, ni de l'identité d'initialisation.

:::warning
`SESSION_KEY` et `CONTENT_KEYS` ont des rôles distincts **par construction** : la session est jetable (une rotation coûte des reconnexions), le contenu scellé est durable. Une entrée `CONTENT_KEYS` égale à `SESSION_KEY` est refusée au démarrage.
:::

## Avec valeur par défaut

| Variable | Défaut | Rôle |
| --- | --- | --- |
| `DB_RUNTIME_ROLE` | `milvago_runtime` | rôle PostgreSQL du runtime (RLS en Enterprise) ; format `^[a-z_][a-z0-9_]{0,62}$` |
| `STATIC_DIR` | `../console/dist` | bundle console servi par le même binaire |
| `LISTEN_ADDR` | `:4020` | port d'écoute HTTP |
| `COMMUNITY_ORG_NAME` | `Milvago` | nom de l'organisation Community créée au démarrage |
| `PUBLIC_URL` | valeur de `APP_URL` | origine publique affichée aux agents (origine seule : ni chemin, ni requête, ni fragment) |
| `OIDC_INTERNAL_URL` | — | émetteur OIDC vu depuis le réseau interne, si différent |
| `EDITION` | fixée à la compilation | doit correspondre à la composition compilée du binaire, sinon refus au démarrage |
| `BOOTSTRAP_EMAIL` | vide | adresse du premier compte, créé automatiquement par `all` ou `migrate` (« mode automatique »). Laissée vide, c'est l'assistant de [première installation](premiere-installation.md) qui crée ce compte au lieu d'un import. |
| `OIDC_ADMIN_CLIENT_ID` / `OIDC_ADMIN_CLIENT_SECRET` | — | requis pour les opérations de profil, d'invitations et d'annuaire des rôles `api` ou `all`, pour l'assistant de [première installation](premiere-installation.md), ainsi que pour les contrôles Keycloak de maintenance ; non exigé au démarrage et inutile aux exports |

## Facultatives `MILVAGO_*`

| Variable | Effet |
| --- | --- |
| `MILVAGO_INSTALLER_DIRECTORY` | répertoire des MSI et manifestes servis aux postes ; les mises à jour se servent à côté des installateurs |
| `MILVAGO_UPDATE_PUBLIC_KEY` | clé de vérification des manifestes de mise à jour (32 octets base64), séparée de la clé de signature des politiques |
| `MILVAGO_SETUP_TOKEN` | jeton à usage unique d'au moins 32 caractères qui ouvre l'assistant de [première installation](premiere-installation.md) tant que `BOOTSTRAP_EMAIL` est vide ; le serveur n'en conserve que l'empreinte SHA-256, jamais journalisée |
| `MILVAGO_SHADOW_METRICS` | ferme `GET /api/shadow/metrics` sur l'instance si `0`/`false`/`off`/`no` ; ouvert par défaut |
| `MILVAGO_MCP` | ferme le serveur MCP Enterprise si `0`/`false`/`off`/`no` ; servi par défaut (l'absence de la variable est l'état normal) |
| `MILVAGO_DEBUG` | ouvre l'éditeur du catalogue de détection et ses routes d'écriture si `1`/`true`/`on`/`yes` ; la publication reste soumise au Propriétaire racine et à une MFA fraîche — c'est un réglage de bruit, pas une frontière de sécurité |
| `MILVAGO_DEMO_READONLY` | refuse toute mutation console, quel que soit le rôle (instance de démonstration non supervisée) ; l'ingestion des postes reste volontairement hors périmètre |
| `MILVAGO_DEMO_MCP_KEY` | clé MCP affichée sur la page de profil d'une instance de démonstration — conservée uniquement si `MILVAGO_DEMO_READONLY` est actif : une instance qui accepte des écritures n'affiche jamais une clé qu'elle n'a pas servie |
| `MILVAGO_PUBLISHER_URL` + `MILVAGO_PUBLISHER_CREDENTIAL` + `MILVAGO_PUBLISHER_PUBLIC_KEY` | connexion au service éditeur : les trois valeurs sont fournies ensemble ; voir [Connexion au service éditeur](../avance/service-editeur.md) |
| `MILVAGO_METRICS_TOKEN` | jeton délibéré qui expose la route de métriques au-delà de la console |
| `MILVAGO_OTEL_HTTP_HOSTS` | hôtes HTTP OTLP autorisés, séparés par des virgules ; chaque entrée est validée strictement (hôte seul, sans utilisateur, chemin, requête ni fragment) |
| `MILVAGO_EXPORT_CA_FILE` | fichier PEM (≤ 1 Mo) d'autorités racines pour les destinations d'export ; doit contenir au moins un certificat exploitable |

![Milvago - Facultatives MILVAGO](/img/docs/fr/installation-variables-environnement-02.png)

## Fonctionnalités Keycloak à désactiver

« Milvago désactive dans Keycloak les fonctionnalités qu'il n'utilise pas et qu'un client inscrit de lui-même pourrait activer pour obtenir des jetons sans adresse de redirection : `KC_FEATURES_DISABLED=device-flow,ciba,token-exchange-standard`. Un fournisseur d'identité existant qui sert Milvago doit appliquer le même réglage. »

## Les refus de démarrage sont des garde-fous

La configuration est validée d'un bloc : racines de 32 octets exactement, versions `CONTENT_KEYS` positives et uniques, clés de contenu distinctes de `SESSION_KEY`, origines HTTPS (loopback explicite toléré pour les essais), émetteur OIDC sécurisé, rôles de base bien formés. Un défaut de configuration est une erreur, pas une substitution silencieuse par une racine d'un autre usage.
