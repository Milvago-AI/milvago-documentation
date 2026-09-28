---
sidebar_position: 2
title: Prérequis technique
---

# Prérequis technique

Cette page présente les composants et les ressources à prévoir pour déployer Milvago Community ou Enterprise. Le dimensionnement dépend du nombre de postes actifs, du volume d'événements, des contenus conservés et de leur durée de rétention.

## Plateforme serveur

| Élément | Prérequis de déploiement |
| --- | --- |
| Hôte | Machine physique ou virtuelle Linux x86-64, avec un moteur de conteneurs Linux |
| Application | Image Milvago correspondant à votre édition ; le serveur Go sert également la console web |
| Base de données | PostgreSQL, avec stockage persistant sur SSD et sauvegardes sur un stockage distinct |
| Identité | Keycloak, avec une base dédiée, une URL publique et un certificat TLS |
| Accès | Noms DNS et HTTPS pour Milvago et le fournisseur d'identité |
| Stockage temporaire | Répertoire inscriptible pour la préparation des installateurs et des mises à jour |

Les fichiers de déploiement référencent **PostgreSQL 18.4** et **Keycloak 26.7.4**. Vérifiez la compatibilité des versions lors d'une évolution de ces composants. Pour un hôte ARM64, vérifiez au préalable la disponibilité d'une image compatible avec cette architecture.

Milvago n'héberge pas de modèle de langage : **aucun GPU ni accélérateur IA n'est nécessaire**. La console est intégrée au serveur et ne nécessite pas de service Node.js en production. Les systèmes destinataires des exports Enterprise, tels qu'un collecteur OTLP ou un SIEM, se dimensionnent séparément.

## Dimensionner CPU et mémoire

Dimensionnez l'ensemble **Milvago, PostgreSQL et Keycloak**, ainsi que le système hôte et le moteur de conteneurs. Ces services peuvent partager une machine ou être hébergés séparément.

| Environnement | vCPU | RAM | Espace disque |
| --- | ---: | ---: | ---: |
| Laboratoire | 1 | 2 Go | 50 Go |
| Production, moins de 1 000 postes | 2 | 4 Go | 150 Go |
| Production, à partir de 1 000 postes | 4 | 8 Go | 300 Go |

Ces valeurs sont des points de départ pour un hôte partagé. Adaptez-les au nombre d'événements envoyés par poste, à la durée de rétention et aux pointes d'activité. Conservez le stockage PostgreSQL sur SSD, comme indiqué dans la section [Stockage et rétention](#stockage-et-rétention).

| Composant | Facteurs à prendre en compte |
| --- | --- |
| Milvago | Débit d'événements, synchronisations simultanées des postes, consultations, rapports et exports activés |
| PostgreSQL | Volume conservé, index, recherches, écritures simultanées, purges et sauvegardes |
| Keycloak | Connexions simultanées, renouvellements de session et intégrations d'identité |

Définissez la capacité à partir d'une charge représentative de votre déploiement, puis conservez une marge pour les pointes d'activité, les redémarrages et la maintenance. Mesurez des salves répétées avec un historique représentatif, couvrant ingestion et livraison des exports ; suivez CPU, attentes PostgreSQL et pools avant de modifier ressources ou répliques. Le nombre de postes seul ne suffit pas : la fréquence des usages et la conservation des contenus influencent directement les besoins.

Le [guide de dimensionnement Keycloak](https://www.keycloak.org/high-availability/single-cluster/concepts-memory-and-cpu-sizing) complète cette évaluation pour le service d'identité. Les ressources de compilation des images et des agents se prévoient séparément des ressources d'exploitation.

## Stockage et rétention

Prévoyez un stockage persistant sur SSD pour PostgreSQL. Son volume doit couvrir les données applicatives, les index, les journaux de transactions (WAL), les données d'identité et l'espace nécessaire à la maintenance.

Pour estimer le volume des événements, utilisez la formule suivante :

**Postes actifs × événements par poste et par jour × jours de conservation × taille moyenne stockée en base d'un événement.** La taille d’un message OTLP transmis est distincte de cette formule ; elle ne représente ni le volume stocké ni la croissance de PostgreSQL.

Ajoutez les contenus conservés, les inventaires, les audits et les index s'ils ne sont pas déjà inclus dans cette taille moyenne. Les événements et les contenus peuvent avoir des durées de conservation différentes. Prévoyez également l'espace des images, des installateurs et des journaux d'exploitation.

Les sauvegardes doivent disposer d'un stockage distinct et d'une procédure de restauration vérifiée. Gardez de l'espace libre pour les migrations et les pics d'écriture ; une purge de données ne réduit pas nécessairement immédiatement la taille du volume PostgreSQL.

## Déploiement Docker

Pour une installation de production, configurez TLS, les noms DNS, Keycloak en mode production, le relais SMTP, les secrets et les volumes persistants. Le fichier Compose fourni utilise Keycloak en `start-dev` et un serveur de courrier de test : adaptez ces services avant une mise en production.

## Postes équipés de l'agent

Les paquets d'installation ciblent **Windows x64** et **Linux x86_64**. La matrice des navigateurs et les modes de service Windows/Linux sont détaillés dans [Architecture technique](architecture.md).

Prévoyez de l'espace pour les binaires, l'état local, les journaux et la coexistence de l'ancienne et de la nouvelle version pendant une mise à jour. Les besoins mémoire du poste incluent également le navigateur et son extension. En Enterprise, tenez compte des services de collecte et de filtrage activés.

La file principale hors connexion est limitée par défaut à **10 000 événements et 8 Mio sérialisés**. Elle réunit les événements historiques et Shadow AI ; cette limite ne porte ni sur toute la mémoire ni sur tout le stockage de l'agent. Le cache de secours SYSTEM du navigateur reste distinct, avec ses propres limites de 1000 événements ou lots de santé et 8 Mio. Les quatre seuils `queue.max_events`, `queue.max_size_mb`, `logging.max_file_mb` et `logging.retained_files` sont ajustables dans `milvago.toml` ; les journaux utilisent par défaut un fichier courant et cinq archives, avec rotation à 10 Mio. Voir la [configuration de l'agent](../avance/agent-configuration.md).

## Réseau et préparation de l'exploitation

Les postes doivent pouvoir joindre l'URL HTTPS de Milvago. Les navigateurs utilisés pour la console doivent également joindre le fournisseur d'identité. Prévoyez la résolution DNS et la synchronisation horaire ; conservez PostgreSQL sur un réseau privé. Les connexions et les ports sont détaillés dans [Architecture technique](architecture.md).

Dimensionnez la bande passante pour les remontées d'événements, les exports et les téléchargements de mises à jour. Échelonnez les déploiements sur les grandes flottes pour limiter les pointes de transfert.

Avant la mise en production, vérifiez les temps de réponse, la croissance du stockage, les opérations de purge, la restauration des sauvegardes et la reprise après une coupure. Utilisez ces résultats pour ajuster les ressources et les seuils de supervision de votre environnement.
