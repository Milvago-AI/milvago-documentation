---
sidebar_position: 2
title: Configuration de l'agent
---

# Configuration de l'agent (Windows / Linux)

L'agent se configure par un fichier **TOML**, `milvago.toml`, écrit par l'installateur et édité par l'administrateur. Il est **réglé en quelques secondes, sans redémarrer le service** : le fichier est relu au plus une fois toutes les 5 secondes.

![Milvago - Configuration de l'agent (Windows / Linux)](/img/docs/fr/fleet-postes-03.png)

## Modifier la configuration

1. Ouvrez le chemin correspondant à votre édition et à votre système dans le tableau ci-dessous, avec un compte administrateur.
2. Modifiez le fichier `milvago.toml` à ce chemin, sans changer ses droits d’accès.
3. Enregistrez le fichier : ne redémarrez pas le service.
4. Attendez au plus cinq secondes, puis vérifiez `agent.log` dans le répertoire voisin `logs` pour confirmer l’application de la configuration ou lire l’erreur.

## Où se trouve le fichier

Sous Windows, le fichier vit dans le répertoire `config`, **à côté du magasin chiffré, jamais dedans**. Sous Linux, il vit désormais directement sous `/etc`, à l'écart du magasin chiffré et des journaux qui restent sous `/var/lib` :

| | Windows | Linux (installation packagée) |
| --- | --- | --- |
| Community | `%ProgramData%\Milvago\Browser\config\milvago.toml` | `/etc/milvago-browser/milvago.toml` |
| Enterprise | `%ProgramData%\Milvago\Commercial\config\milvago.toml` | `/etc/milvago-commercial/milvago.toml` |

Les règles d'accès font partie du mécanisme. Sous Windows, le répertoire `config` appartient aux **Administrateurs et SYSTEM**, et le compte de service n'a que la **lecture** — ses dossiers ProgramData nomment désormais le SID propre au service (`NT SERVICE\Milvago Agent Logger Community` / `NT SERVICE\Milvago Agent Logger`), plutôt que le compte NetworkService dans son ensemble, partagé par d'autres services. Sous Linux, le fichier appartient à **root** (mode `0640`, groupe `milvago-agent` en lecture). L'agent peut écrire son propre état chiffré ; il ne doit pas pouvoir choisir les autorités de certification auxquelles il fait confiance, ni ouvrir son écoute au réseau. C'est le fichier qui encaisse cette frontière.

Une réinstallation avec `install-browser.sh`, ou une mise à jour du paquet RPM, déplace une fois le fichier existant depuis l'ancien emplacement (`/var/lib/milvago-browser/config/milvago.toml` ou `/var/lib/milvago-commercial/config/milvago.toml`) vers le nouveau — uniquement s'il s'agit d'un fichier régulier, jamais au travers d'un lien symbolique. Une fois ce déplacement effectué, l'ancien emplacement n'est plus lu.

## Le fichier tel que l'installateur le crée

```toml
# Milvago agent configuration. Edited by administrators; the service can only read it.
# Applies within a few seconds, no restart needed.

[queue]
# Main offline event queue only, not total agent memory or disk usage.
# max_events: 1..100000; max_size_mb: 1..128 MiB.
max_events = 10000
max_size_mb = 8

[logging]
# off | error | warn | info | debug. The log is agent.log in the logs directory
# beside this one. It never contains prompt text, response text, file names,
# tokens, credentials or policy content.
level = "info"
# max_file_mb: 1..100 MiB; retained_files: 0..20 archives plus the current file.
max_file_mb = 10
retained_files = 5

[tls]
# HTTPS verification is always on. This only adds one certificate authority to
# the agent's own HTTP client: the server name and the certificate validity are
# still checked, and neither the Windows certificate store nor the browser is
# affected. A declared authority that cannot be read is an error that blocks the
# call; it never falls back to an unverified connection.
allow_private_ca = false
ca_file = ""
# Also trust the root store of the operating system (for instance a TLS-inspection
# authority your organization deploys by policy). Off unless you decide it.
system_store = false

[network]
# One explicit HTTP(S) proxy, "http://host:port", without credentials. Empty means
# direct connections; environment proxy variables are never used.
proxy = ""
bind_address = "127.0.0.1"
allowed_peers = []
```

Le fichier généré par l'installateur provient de l'agent lui-même : ce que l'opérateur trouve sur le disque et ce que l'agent applique sont la même chose, pas deux textes tenus à la main.

## `[queue]` — file d'événements hors connexion

| Paramètre | Défaut | Borne | Ce qu'il fait |
| --- | --- | --- | --- |
| `max_events` | `10000` | 1 à 100000 | nombre maximal d'événements dans la file principale hors connexion |
| `max_size_mb` | `8` | 1 à 128 Mio | taille sérialisée maximale de cette file |

Cette file principale réunit les événements historiques et Shadow AI. Elle ne limite ni la mémoire totale ni le stockage total de l'agent, et elle est distincte du cache de secours SYSTEM du navigateur, qui conserve ses propres limites de 1000 événements ou lots de santé et 8 Mio.

Quand l'un des plafonds est atteint, l'agent refuse le nouvel événement et ne l'acquitte pas. Une réduction de plafond ne supprime pas les événements déjà en file : leur livraison continue jusqu'à ce que la file revienne sous la nouvelle limite.

Pour augmenter la file à 20000 événements et 16 Mio, et garder des journaux de 20 Mio avec 10 archives, fusionnez les valeurs suivantes dans les sections existantes ; ne dupliquez ni `[queue]` ni `[logging]` :

```toml
[queue]
max_events = 20000
max_size_mb = 16

[logging]
# Conservez votre niveau existant s'il diffère.
level = "info"
max_file_mb = 20
retained_files = 10
```

Une installation mise à jour conserve son fichier existant. Ajoutez donc manuellement la section `[queue]` au fichier `milvago.toml` après la mise à jour si elle n'y est pas ; une section `[queue]` ou l'un de ses champs absent emploie son défaut. Les modifications sont prises en compte sans redémarrage, lors de la relecture qui intervient au plus toutes les 5 secondes.

## `[logging]` — verbosité et rétention

| Paramètre | Défaut | Borne | Ce qu'il fait |
| --- | --- | --- | --- |
| `level` | `"info"` | `off`, `error`, `warn`, `info`, `debug` | verbosité du journal `agent.log` dans le répertoire `logs` voisin. Le journal **ne contient jamais** de texte de prompt, de réponse, de nom de fichier, de jeton, d'identifiant ni de contenu de politique |
| `max_file_mb` | `10` | 1 à 100 Mio | taille maximale d'un fichier de journal avant rotation |
| `retained_files` | `5` | 0 à 20 archives | nombre d'archives conservées, en plus du fichier courant `agent.log` |

Les valeurs impossibles (niveau inconnu, taille hors bornes, rétention > 20) ne sont ni corrigées ni ignorées : le fichier entier retombe sur les défauts documentés, avec la raison écrite dans le journal.

## `[tls]` — autorité de certification privée

| Paramètre | Défaut | Ce qu'il fait |
| --- | --- | --- |
| `allow_private_ca` | `false` | ajoute **une** autorité de certification privée au client HTTP de l'agent, pour un serveur Milvago servi derrière une PKI interne |
| `ca_file` | `""` | chemin du fichier PEM **relatif au répertoire qui contient `milvago.toml`** (par exemple `"certs/ca.pem"`), requis si `allow_private_ca = true` |
| `system_store` | `false` | fait aussi confiance aux autorités du magasin de certificats racine du système d'exploitation, en plus des autorités publiques |

**`allow_private_ca` ne désactive jamais la vérification.** Le nom de serveur et la validité du certificat restent vérifiés, le magasin de certificats Windows n'est pas touché, la confiance du navigateur non plus. Une autorité déclarée mais illisible est une **erreur qui bloque l'appel** — jamais un repli silencieux vers une connexion non vérifiée. Un fichier présent sur le disque mais non demandé (`allow_private_ca = false`) est ignoré.

`system_store` élargit la confiance autrement : activé, l'agent fait aussi confiance à chaque autorité que les administrateurs de la machine ont installée dans le magasin système — par exemple une autorité d'inspection TLS déployée par stratégie de groupe — en plus des autorités publiques. Il reste **désactivé par défaut** : cet élargissement de la confiance à toute autorité installée par un administrateur de la machine ne revient qu'à un administrateur d'en décider. La vérification n'est jamais désactivée, quel que soit ce réglage.

## `[network]` — proxy sortant et écoute locale

| Paramètre | Défaut | Ce qu'il fait |
| --- | --- | --- |
| `proxy` | `""` | une unique adresse de proxy HTTP(S) explicite, écrite `http://hôte:port` (ou `https://`), sans identifiants, sans chemin ni requête |
| `bind_address` | `"127.0.0.1"` | l'interface sur laquelle les propres écouteurs de l'agent acceptent des connexions : le serveur d'extension local (qui sert les paquets signés de l'extension navigateur aux navigateurs de ce poste) et, en Enterprise, le récepteur de télémétrie native (OTLP) du collecteur |
| `allowed_peers` | `[]` | plages CIDR (IPv4 ou IPv6, 50 au maximum) des pairs distants acceptés quand `bind_address = "0.0.0.0"` |

Vide, l'agent se connecte directement : les variables d'environnement de proxy (`HTTPS_PROXY` et les autres) ne sont **jamais** utilisées — le compte de service Windows ne les reçoit d'ailleurs pas. Une valeur de `proxy` invalide (schéma autre que `http`/`https`, identifiants dans l'URL, hôte absent, chemin ou requête après le port) **bloque les appels réseau** au lieu de basculer en connexion directe ; la raison est écrite dans `agent.log`. Comme le reste du fichier, ce réglage s'applique en quelques secondes, sans redémarrage.

Seules deux valeurs de `bind_address` sont acceptées : `127.0.0.1` (ce poste seulement, recommandé) ou `0.0.0.0` (toutes les interfaces). Toute autre valeur, ou une liste `allowed_peers` invalide, garde les écouteurs locaux et la raison est écrite dans `agent.log`. Modifier `bind_address` exige de redémarrer le service de l'agent.

L'hôte local est toujours accepté ; avec une liste `allowed_peers` vide, aucun pair distant n'est accepté même une fois `0.0.0.0` ouvert, et `"0.0.0.0/0"` accepte toute machine IPv4 qui peut joindre ce poste.

:::warning

Ouvrir l'écoute expose ces ports au réseau : une règle de pare-feu doit être ouverte par l'administrateur (Windows Defender Firewall / nftables), et c'est rarement nécessaire — par exemple pour des conteneurs ou WSL sur le même poste, avec `["172.16.0.0/12"]`.

:::

Limite importante : le récepteur OTLP attribue chaque lot de télémétrie au compte du système d'exploitation propriétaire de la connexion locale ; un émetteur distant n'a pas de processus local, il reste donc refusé même si son adresse est autorisée. Ouvrir l'écoute ne change donc que qui peut joindre le serveur d'extension.

Le filtre de modèles (Enterprise) ne suit jamais ce réglage : son confinement exige qu'il reste local.

## Ce que le fichier refuse, et pourquoi

Chaque règle de validation ferme une voie de détournement :

- **Chemin relatif uniquement** : un chemin absolu, un `..`, un lien symbolique ou une jonction permettraient à celui qui écrit la valeur de faire lire à l'agent un fichier qu'il n'est pas censé lire. Le fichier est de plus **régulier** (pas un lien), limité à 256 Kio (une autorité est quelques blocs PEM), et le chemin résolu doit rester **dans le répertoire qui contient `milvago.toml`** — une jonction placée plus haut dans l'arborescence est refusée.
- **Champs inconnus refusés** (`deny_unknown_fields`) : une coquille dans un nom de paramètre ne devient pas une valeur ignorée.
- **Lecture seule, jamais d'écriture** : un fichier absent ou endommagé résout vers les défauts documentés, jamais vers une tentative d'écriture que le compte de service n'a pas le droit de faire. Une configuration cassée peut donc **abaisser la verbosité, jamais desserrer TLS**.
- **Le TLS d'un ancien install n'est pas réinterprété** : la verbosité d'une installation antérieure (`state\milvago.conf`, clé `log_level`) survit à la mise à jour, mais ce fichier n'a jamais porté de section TLS et ne peut jamais devenir un réglage de confiance.

## Auto-mise à jour sous un outil de déploiement (Windows)

Quand un outil de déploiement (Intune, SCCM/ConfigMgr, installation logicielle par GPO) possède déjà les versions de l'agent, l'auto-mise à jour de l'agent s'arrête pour ne pas entrer en conflit avec lui — sans quoi cet outil réinstallerait l'ancien paquet après chaque mise à jour automatique. L'une ou l'autre des deux valeurs de registre suivantes suffit à la désactiver ; les deux sont sous `HKLM`, modifiables uniquement par un administrateur :

| Emplacement | Valeur | Origine |
| --- | --- | --- |
| `HKLM\SOFTWARE\Policies\Milvago` | `DisableSelfUpdate` (DWORD) = `1` | stratégie GPO / Intune |
| `HKLM\SOFTWARE\Milvago\community` (Community) ou `HKLM\SOFTWARE\Milvago\commercial` (Enterprise) | `SelfUpdate` (DWORD) = `0` | installateur |

L'applicateur de mise à jour privilégié refuse lui aussi d'agir tant que l'une des deux valeurs est active. L'agent inscrit une seule ligne dans `agent.log` au moment où l'auto-mise à jour se désactive.

Cet applicateur est le service Windows **Milvago Update Applier** (**Milvago Update Applier Community** en Community). Il démarre avec le poste et reste actif en permanence, même sans mise à jour en cours : il réserve ainsi dès le démarrage les canaux locaux par lesquels l'agent et le navigateur le joignent. Ne le désactivez pas ; il ne fait rien tant que l'agent ne lui demande pas d'appliquer une version signée.

C'est alors l'outil de déploiement qui possède les versions : détectez le produit par son **UpgradeCode** ou par le fichier `installation.json`, jamais par le **ProductCode**, qui change à chaque nouvelle version.

## Auto-mise à jour (Linux, installation par archive)

Pour une installation faite avec l'archive et `install-browser.sh` — pas le RPM —, l'auto-mise à jour de l'agent est appliquée par un **applicateur de mise à jour racine** (`<service>-updater.service`), démarré par `<service>-updater.path` dès que l'agent dépose une demande de mise à jour. Cet applicateur ne fait confiance qu'à `/etc/<nom>/release.json` — écrit par l'installateur à partir du fichier de provisionnement (clé publique de mise à jour et origine du serveur). L'agent lui-même reste sans privilège : il ne peut ni remplacer son propre binaire ni modifier cette ancre.

Une installation faite avec une version d'`install-browser.sh` antérieure à ce changement ne se met pas à jour elle-même : réinstallez une fois avec le nouveau script pour créer ces unités systemd. Les installations faites par le paquet **RPM** continuent d'être mises à jour par le gestionnaire de paquets, sans changement.

## Dérive des stratégies navigateur (Windows)

Toutes les 60 secondes, l'agent vérifie que les stratégies machine forcent toujours l'installation de son extension :

| Famille | Registre |
| --- | --- |
| Chromium (Chrome, Edge, Brave, Chromium, Vivaldi, Arc) | `HKLM\SOFTWARE\Policies\<éditeur>\ExtensionInstallForcelist` |
| Firefox | `HKLM\SOFTWARE\Policies\Mozilla\Firefox`, valeur `ExtensionSettings` |

Si une stratégie de groupe de l'organisation qui gère elle-même ces listes les remplace, les entrées écrites à l'installation disparaissent et les navigateurs désinstallent l'extension. L'agent inscrit une seule erreur nommant les navigateurs concernés à chaque changement de cet ensemble, jamais à chaque vérification ; il ne réécrit jamais la stratégie lui-même.

**Correction** : ajoutez les entrées Milvago à la stratégie de groupe propre de l'organisation qui gère ces listes. L'identifiant d'extension et l'URL de mise à jour écrits par l'installateur se lisent dans ces mêmes clés de registre sur une machine déjà installée.

## Images clonées (VDI, sysprep, clone de machine virtuelle) — Windows et Linux

L'agent lie son identité à la machine : sous Windows, le `MachineGuid` et le SID du compte machine ; sous Linux, `/etc/machine-id`.

Quand une copie d'un disque déjà installé démarre sur une autre machine, cette copie archive l'identité qu'elle portait et se réenregistre comme un nouveau poste, sous son propre nom de machine, en utilisant la clé de déploiement de l'organisation conservée dans son état chiffré (soumise à la règle habituelle d'approbation d'inscription). La machine d'origine garde son identité.

Si aucune clé de déploiement utilisable n'est disponible — par exemple un poste inscrit avant cette version et jamais réparé avec le paquet de l'organisation, ou une clé remplacée depuis (rotation) — la copie **abandonne son identité** et reste non inscrite jusqu'à la réinstallation du paquet de l'organisation sur cette machine : deux machines ne partagent jamais une identité.

Quels outils de clonage modifient effectivement ces identifiants reste en cours de mesure ; la voie prise en charge est de sceller l'image comme le prévoit la plateforme : `sysprep /generalize` sous Windows, vider `/etc/machine-id` sous Linux.

## En résumé

| | Windows | Linux |
| --- | --- | --- |
| Service | nom affiché `Milvago Agent Logger Community` / `Milvago Agent Logger Enterprise` ; nom de service inchangé, `Milvago Agent Logger Community` / `Milvago Agent Logger`, compte NetworkService, SID propre au service sur les dossiers ProgramData | `systemd` système, utilisateur `milvago-agent` |
| État chiffré | `config` et `logs` sont **frères** du répertoire `state` | `logs` reste **enfant** du répertoire d'état (`/var/lib`) ; `config` en est désormais séparé, sous `/etc` |
| Fichier | `config\milvago.toml`, Administrateurs + SYSTEM en écriture, service en lecture | `milvago.toml`, root en écriture, groupe `milvago-agent` en lecture (mode `0640`) |

Un `sync` ponctuel en ligne de commande honore `[tls]` exactement comme le service : la même configuration s'applique à chaque chemin qui parle au serveur.
