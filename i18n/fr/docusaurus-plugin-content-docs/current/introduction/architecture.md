---
sidebar_position: 3
title: Architecture technique
---

# Architecture technique

import ArchitectureDiagram from '@site/src/components/ArchitectureDiagram';

Milvago se compose de quatre parties, reliées par des canaux bornés et signés : l'**extension navigateur**, l'**agent local**, le **serveur** et la **console**.

<ArchitectureDiagram />

## Flux et ports

Les flèches du schéma indiquent **qui ouvre la connexion**. Les réponses utilisent le même canal. L'agent contacte le serveur ; le serveur ne se connecte pas aux postes. Le trafic du navigateur vers un site IA ne transite pas par le serveur Milvago.

### Réseau de la plateforme

| Initiateur → destination | Protocole et port | Usage et configuration |
| --- | --- | --- |
| Agent → entrée de l'instance | HTTPS, généralement TCP **443** | Politiques signées, événements, heartbeat, catalogue et mises à jour. Le port vient de l'URL de provisionnement. |
| Navigateur de la console → entrée de l'instance | HTTPS, généralement TCP **443** | Console React et API sur la même origine ; pas de serveur Node.js séparé. |
| Reverse proxy / Ingress / Gateway API → serveur Go | HTTP, TCP **4020** par défaut | Écoute `LISTEN_ADDR=:4020`. La terminaison TLS est à configurer en amont ; le binaire construit un `http.Server` et appelle `Serve` sur une écoute `net.Listen`, pas un serveur TLS intégré. |
| Serveur Go → PostgreSQL | PostgreSQL, TCP **5432** dans Compose | Connexions `DATABASE_URL` et `MIGRATION_DATABASE_URL`, sur réseau privé. |
| Navigateur de la console → Keycloak | HTTPS, généralement TCP **443** en production | Connexion, MFA et redirections OIDC via l'URL publique de l'émetteur. L'accès serveur seul à Keycloak ne suffit pas. |
| Serveur Go → Keycloak | HTTP **8080** dans Compose ; sinon port de l'URL choisie | Découverte OIDC, clés publiques, échange de code et administration d'identité. `OIDC_INTERNAL_URL` peut router ces appels sur le réseau privé en conservant l'émetteur public. |
| Keycloak → PostgreSQL | PostgreSQL, TCP **5432** dans Compose | Base d'identité dédiée, distincte des bases applicatives. |
| Client API / client MCP → instance | HTTPS, port de l'URL publique | API REST ; MCP Enterprise sur `/mcp`, sans port d'écoute supplémentaire. |
| Serveur → collecteur OTLP externe | OTLP/HTTP JSON, port de l'URL configurée | Enterprise : `/v1/logs` et `/v1/metrics`. **4318** est le port du collecteur d'exemple, pas une écoute Milvago ni un port obligatoire. HTTP interne exige l'autorisation `MILVAGO_OTEL_HTTP_HOSTS`. |
| Outil de supervision → serveur | HTTP(S), même port que l'instance | `/metrics` lorsqu'un jeton de supervision est configuré ; les sondes `/health/live` et `/health` utilisent aussi le port applicatif. |

Pour Kubernetes, prévoyez des rôles distincts pour l’API, la maintenance et les exports Enterprise. L’API et les exports peuvent utiliser des HPA indépendants ; gardez le **Service ClusterIP 4020 → 4020** de l’API sur le réseau interne. L’entrée HTTPS par Ingress ou Gateway API, les certificats, PostgreSQL et Keycloak sont à provisionner séparément. Les ports privés ci-dessus ne sont pas à publier sur Internet. Voir [Dimensionner PostgreSQL et l’autoscaling](../avance/dimensionnement-postgresql-hpa.md).

### Communications locales sur le poste

| Initiateur → destination | Transport / port local | Fonction |
| --- | --- | --- |
| Extension → relais Native Messaging | Entrée/sortie standard encadrée ; **aucun port TCP** | Échanges entre extension et binaire lancé par le navigateur. |
| Relais → service agent | Windows : named pipe `milvago-browser` ou `milvago-commercial` ; Linux : `/run/milvago/browser.sock` ou `commercial.sock` | Politique, décisions et événements via IPC ; aucune ouverture réseau à prévoir. |
| Navigateurs à base Chromium → agent | HTTP **127.0.0.1:17641** (Community), **:17642** (Enterprise) | CRX et manifeste `/ext/update.xml`, depuis le paquet embarqué. |
| Firefox → agent | HTTPS **127.0.0.1:17651** (Community), **:17652** (Enterprise) | XPI signé et `/ext/updates.json` ; certificat local géré par l'installation. |
| Navigateur → site IA | HTTPS, généralement TCP **443** | Trafic direct vers le fournisseur, contrôlé par l'extension sur les sites couverts. |
| Agent Enterprise → collecteur natif | IPC local, sans TCP | L'agent demande les observations puis acquitte leur persistance. Le collecteur ne pousse pas directement vers le serveur. |
| Outils natifs → collecteur natif Enterprise | OTLP/HTTP protobuf sur **127.0.0.1**, port attribué au premier démarrage puis conservé | `/v1/logs`, authentification et attribution au processus appelant ; ce port n'est pas fixé à 4318. |
| Clients natifs couverts → filtre Enterprise | Proxy TLS sur **127.0.0.1:47831–47834** | Respectivement Codex, Claude Code, Claude Desktop, Claude Desktop Agent ; connexions sortantes du filtre vers les fournisseurs sur **443**. Uniquement pour les clients configurés. |
| Détection Enterprise → services de modèles locaux | Sondes loopback **11434, 1234, 1337, 4891** | Ports cibles autorisés pour l'inventaire local ; ce ne sont pas des serveurs ouverts par Milvago. |

Les écoutes loopback restent accessibles uniquement sur le poste. Elles ne justifient aucune règle entrante depuis le LAN. La présence d'un port dans le tableau ne signifie pas que sa fonctionnalité optionnelle est active.

### Ports du Compose de développement

Toutes les publications sont liées à `127.0.0.1` : **4020 → 4020** pour Community, **4120 → 4020** pour Enterprise, **4080 → 8080** pour Keycloak, **55432 → 5432** pour PostgreSQL et **4081 → 8025** pour l'interface du serveur de courrier de test. Ces valeurs sont les défauts du Compose et peuvent être remplacées par ses variables. Elles ne constituent pas un plan de ports de production.

## L'extension navigateur

Un service worker dans Chrome, Edge, Brave, Vivaldi et Arc, et des scripts d'arrière-plan dans Firefox, appliquent la politique sur les sites IA couverts. L'extension est pilotée par un **catalogue de détection signé** — un moteur et des données : routes mesurées des sites (routes de prompt, routes de téléversement), sélecteurs DOM du composeur, chemins des champs. Elle n'applique aucune heuristique hors de ces routes mesurées, et la couverture dépend de l'édition servie.

Sans politique valable (agent arrêté, révocation), elle **échoue en fermeture** : la surface IA couverte est scellée, jamais laissée ouverte par défaut. La politique signée est persistée localement et relue au réveil du composant d'arrière-plan, révision et expiration vérifiées à chaque lecture.

## Navigateurs pris en charge

Le périmètre produit comprend six navigateurs : Google Chrome, Microsoft Edge, Brave, Vivaldi, Mozilla Firefox et Arc. Chromium autonome n'en fait pas partie, même s'il peut encore apparaître dans des scripts historiques. Aucun agent macOS, Safari ou mobile n'est déclaré.

| Navigateur | Famille | Windows | Linux |
| --- | --- | --- | --- |
| Google Chrome | Chromium | Politique MSI et CRX privé. Pour cette extension, le PC doit être joint à un domaine Active Directory ou à Microsoft Entra ID. | Intégration Native Messaging par le script système ; extension et profil à administrer. |
| Microsoft Edge | Chromium | Politique MSI et CRX local. | Intégration Native Messaging par le script système ; extension et profil à administrer. |
| Brave | Chromium | Politique MSI et CRX local. | Intégration Native Messaging par le script système ; extension et profil à administrer. |
| Vivaldi | Chromium | Politique MSI, CRX local et hôte Native Messaging. | Aucun chemin automatisé Vivaldi dédié ; extension et profil à administrer. |
| Mozilla Firefox | Gecko | Politique MSI, XPI signé et hôte Native Messaging. | Intégration Native Messaging par le script système ; extension et profil à administrer. |
| Arc | Chromium | Pris en charge : politique Arc et CRX local. L'installation par MSI et le contrôle de contenu restent à qualifier séparément. | Non déclaré. |

L'extension Chrome est privée et n'est pas publiée sur le Chrome Web Store. Pour le déploiement sous Windows décrit ici, le PC doit être joint à un domaine Active Directory ou à Microsoft Entra ID ; installer uniquement l'hôte Native Messaging ne suffit pas.

Firefox 140.0 ou ultérieur est requis sur tous les systèmes d'exploitation ; Firefox Release et Beta exigent un XPI signé. Les navigateurs Chromium n'ont pas de version minimale fixée dans le manifeste ; les versions stables cibles restent à qualifier. Le bundle Linux ne configure pas à lui seul les profils navigateur : `deploy/install-browser.sh` installe le service système et les manifestes Native Messaging. Le RPM distribué par la plateforme installe le même service systemd système, sous l'utilisateur `milvago-agent`, et les mêmes manifestes Native Messaging machine que `deploy/install-browser.sh`.

Les contrôles réseau utilisant `webRequestBlocking` exigent une extension administrée dans les navigateurs qui réservent cette capacité aux extensions installées par politique. Une installation manuelle ne démontre pas le même contrôle.

La couverture des sites IA est indépendante du navigateur. Community embarque la capture pour ChatGPT et Claude, tandis que les deux éditions signalent séparément la présence sur des plateformes connues sans réactiver la capture. Enterprise couvre neuf fournisseurs. Les résultats de qualification restent propres à l'édition, au navigateur, au système et au scénario exécuté : une note datée ou un artefact construit ne se généralise pas à un autre contexte.

## L'agent : un service, pas une tâche utilisateur

Le cœur de l'agent est un **service** (Rust) : `endpoint` en Community, `bridge` en Enterprise. Sous Windows, il tourne sans session utilisateur sous NetworkService, avec un jeu de privilèges réduit (`SeChangeNotifyPrivilege` et `SeCreateGlobalPrivilege` seulement) et des dossiers ProgramData dont l'ACL nomme désormais le SID propre au service, plutôt que NetworkService dans son ensemble. Sous Linux, le RPM et le script autonome `deploy/install-browser.sh` installent tous deux un service systemd système, sous l'utilisateur `milvago-agent`, avec les manifestes Native Messaging machine. Il exécute deux boucles :

- la boucle de **synchronisation** : politique, file d'événements, mises à jour, et l'inventaire en Enterprise ;
- un **serveur IPC local**, le seul point de contact du navigateur.

Le navigateur ne peut pas parler à un service (session 0). Le même binaire, lancé par le navigateur comme hôte Native Messaging, agit en **relais** : il transmet les trames au service via un canal local (named pipe Windows à descripteur durci, socket Unix). L'identité du poste reste celle du service, jamais celle du client.

L'état du poste vit dans un magasin **chiffré par la machine** (DPAPI sous Windows) : credentials, politique en cache, file d'événements. Une coupure entre l'agent et le serveur n'arrête pas le navigateur : tant que l'agent local répond par le canal authentifié, il applique sa dernière politique locale vérifiée et garde les événements avant leur synchronisation. La tolérance de **cinq minutes** ne commence que si le service SYSTEM ne peut plus joindre cet agent local ; à son échéance, la surface IA est scellée. Une révocation ou un refus explicite bloque immédiatement.

## Le serveur

Un backend **Go** servant :

- l'**ingestion** des agents : événements, heartbeats (utilisateur OS de la session active, pur informatif), inventaire, avec limites de débit par poste ;
- le **catalogue de détection** signé et sa publication versionnée ;
- la **console** et l'**API REST** avec RBAC par permissions ;
- les **mises à jour** : MSI immuable et manifeste de mise à jour signé, figés dans l'image ;
- le stockage : **PostgreSQL**, avec isolation par **Row-Level Security** en Enterprise.

La console (React) est servie par le même binaire ; **aucune ressource externe** n'est chargée à l'exécution — bundle, polices et thème sont embarqués. L'authentification passe par Keycloak (OIDC Authorization Code + PKCE) ; le thème de connexion suit les mêmes tokens.

## En Enterprise, trois composants privilégiés supplémentaires

- Le **collecteur natif** (`collector`, LocalSystem) lit les applications IA natives déclarées par la politique, sans jamais partager le magasin de l'agent : il a sa propre ancre, sa propre clé, et ne fait confiance à rien de ce que l'agent stocke. L'agent **tire** les enregistrements du collecteur, jamais l'inverse.
- Le **filtre réseau** (`filter`) observe le trafic des services couverts côté machine.
- L'**inventaire** fusionne les applications IA par poste (jamais un instantané destructif : un relevé vide n'efface rien), avec `first_seen` pour poser la question « qu'est-ce qui est apparu cette semaine ? ».


## Les canaux, en résumé

| Canal | Sens | Contenu |
| --- | --- | --- |
| `/v3/policy` | extension → agent → serveur | politique **projetée** : services, collection, contrôle des modèles ; les mots-clés et exceptions n'en sortent pas |
| `/v2/events` | agent → serveur | événements Shadow AI, par lots, acquittés |
| `/v2/heartbeat` | agent → serveur | utilisateur OS de la session active (information, jamais une autorité), extensions vues |
| `/v1/inventory` | agent → serveur | applications IA détectées (Enterprise) |

Pour `/v2/events`, l'agent écrit d'abord l'événement dans son magasin local chiffré. Le serveur ne renvoie l'identifiant dans `accepted_ids` qu'après validation du poste et commit PostgreSQL. Si PostgreSQL est indisponible, l'API répond temporairement `503` : l'agent conserve le même identifiant et réessaie. Un rejeu est attendu et reste idempotent ; un acquittement reçu signifie que PostgreSQL a pris la garde de l'événement.

Un échec de synchronisation ne se cache pas : l'agent journalise un état unique (`synchronisé`, `différé` avec autorisation en cache valable, `bloqué`), avec la cause classée et le remède proposé — jamais de détail de transport ni d'identifiant.
