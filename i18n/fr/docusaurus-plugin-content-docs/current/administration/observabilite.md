---
sidebar_position: 8
title: Observabilité
tags: [Enterprise]
---

# Observabilité

Administration → Observabilité configure, pour chaque organisation, l'envoi des métriques et journaux vers vos outils d'analyse.

## Accéder à l’écran

Dans la barre latérale, cliquez sur **Administration**, puis sur **Observabilité**. Cette page est réservée à Milvago Enterprise et exige `observability.manage`.

Pour configurer une destination :

1. Activez-la, renseignez l’URL et, si nécessaire, l’en-tête **Authorization**.
2. Choisissez les flux à envoyer puis cliquez sur **Enregistrer l’observabilité**.
3. Cliquez sur **Tester la configuration enregistrée** pour envoyer des données synthétiques et contrôlez le tableau **État des livraisons**.

:::enterprise
Cette page concerne uniquement Milvago Enterprise.
:::

![Milvago - Observabilité](/img/docs/fr/administration-observabilite-01.png)

## Export OTLP et tableau de bord Grafana

Le bouton **Télécharger le tableau de bord** fournit un fichier à importer dans Grafana ; les sources de données restent à configurer dans Grafana.

**Export OTLP pour Grafana** configure l'URL de base d'un collecteur compatible OTLP/HTTP JSON. Milvago lui envoie les données ; le collecteur les transmet ensuite aux services utilisés par Grafana.

### Journaux dans Loki, métriques dans le tableau de bord

Pour explorer les journaux dans Grafana, configurez le collecteur qui reçoit les données de Milvago pour transmettre son flux de journaux au [point d'ingestion OTLP natif de Loki](https://grafana.com/docs/loki/latest/send-data/otel/otel-collector-getting-started/). Ajoutez ensuite la [source de données Loki intégrée à Grafana](https://grafana.com/docs/grafana/latest/datasources/loki/). Milvago ne fournit ni export Loki distinct ni plugin Grafana.

Le **tableau de bord téléchargeable** utilise, lui, une source de données de type **Prometheus**. Configurez séparément la sortie des métriques du collecteur vers un système compatible Prometheus, puis sélectionnez cette source lors de l'import du tableau de bord. Un branchement de Loki seul n'alimente pas ses graphiques.

## Destination personnalisée pour le SIEM

Le second encart, intitulé **Destination personnalisée (SIEM)**, est un emplacement OTLP personnalisé. Il n'implémente aucune API propre à un éditeur de SIEM, ni syslog. Il faut un récepteur OTLP/HTTP JSON compatible, par exemple un collecteur configuré pour transformer et transmettre les données au SIEM choisi. Le flux final, ses identifiants et son schéma dépendent de cette configuration externe.

Si votre SIEM exige Syslog/TLS ou une API spécifique, configurez cette conversion et l'authentification correspondante dans le collecteur. Le champ **Authorization** de Milvago authentifie uniquement son envoi au récepteur OTLP indiqué.

Quand cette destination est activée, les **audits sensibles de confidentialité** y sont aussi envoyés par une file dédiée, même si la case **Journal d'audit** est désactivée. L'état de cette file apparaît en bas de page.

## Protocole et authentification

Milvago envoie des requêtes HTTP POST avec `Content-Type: application/json` vers l'URL de base complétée par `/v1/metrics` ou `/v1/logs`. Il s'agit d'**OTLP/HTTP JSON** : ni OTLP/gRPC ni OTLP/HTTP Protobuf binaire. L'en-tête `Authorization`, s'il est nécessaire pour le récepteur, doit être saisi en entier sous la forme `Bearer …` ou `Basic …`. Le secret est scellé côté serveur et n'est jamais renvoyé par l'API. Changer l'URL du récepteur efface son secret enregistré.

Pour une connexion **directe au point d'ingestion OTLP Grafana Cloud**, Grafana demande `Basic` avec l'ID d'instance **OTLP** comme utilisateur et un jeton de politique d'accès comme mot de passe, encodés en Base64. Un jeton Bearer de l'API de gestion Grafana répond à une autre API. [Grafana Cloud précise](https://grafana.com/docs/grafana-cloud/observe-and-act/send-data/otlp/otlp-format-considerations/) que l'ingestion JSON convient surtout aux essais ou aux faibles volumes ; pour un déploiement de production, configurez un collecteur qui accepte le JSON de Milvago et exporte vers Grafana Cloud dans le format et avec l'authentification adaptés.

Les URL d'export utilisent HTTPS, sauf hôte HTTP explicitement autorisé par l'exploitant ; les destinations réseau interdites sont contrôlées à l'enregistrement et à la connexion. Le bouton **Tester la configuration enregistrée** envoie uniquement des données synthétiques sur les flux sélectionnés. Une acceptation par le récepteur ne prouve pas l'arrivée dans Grafana ou le SIEM.

![Milvago - Protocole et authentification](/img/docs/fr/administration-observabilite-02.png)

## Reprise après une panne du destinataire

Milvago conserve dans PostgreSQL les événements que le récepteur OTLP n'a pas acceptés. Après une erreur temporaire ou une coupure, il réessaie automatiquement le même travail ; une interruption autour de l'acquittement peut donc produire un doublon chez le destinataire.

Si l'URL configurée désigne un OpenTelemetry Collector qui relaie ensuite les données, activez une [file persistante](https://github.com/open-telemetry/opentelemetry-collector/blob/main/exporter/exporterhelper/README.md#persistent-queue) pour ses exporteurs et placez-la sur un volume chiffré qui survit à son redémarrage. Une réponse positive du Collector transfère la garde au Collector ; elle ne prouve toujours pas que le backend final a accepté les données. Le Collector doit refuser l'entrée lorsque sa file est pleine afin que Milvago conserve les événements et les réessaie depuis PostgreSQL.

Surveillez la taille et la capacité de la file, les échecs d'enqueue, les échecs d'envoi et l'espace libre du volume. Définissez sa capacité à partir du débit réel et de la durée de panne que vous souhaitez absorber, puis alertez avant 70 %. Configurez aussi dans les systèmes externes la rétention, les effacements, les sauvegardes et les contrôles d'accès applicables après ce transfert de garde.

## Données et suivi

- **Métriques** : jauges d'activité sur 24 heures, état du parc et inventaire local ; elles décrivent l'état actuel et sont envoyées périodiquement.
- **Événements Shadow AI** : métadonnées d'usage sélectionnées par le filtre du destinataire, à partir de l'activation. Le filtre ne touche ni les métriques ni l'audit.
- **Journal d'audit** : actions administratives et identifiants techniques. Les audits sensibles de confidentialité suivent en plus la file dédiée au SIEM.

L'export OTLP ne lit pas les prompts, réponses, contenus de conversation, URL, noms de postes ni adresses e-mail. Les identifiants techniques exportés restent à protéger chez le destinataire. La route `GET /api/shadow/metrics` est une API de consultation séparée, protégée par session et permission ; elle n'est pas l'URL de collecte OTLP.

Le tableau **État des livraisons** montre tentatives, acceptations, erreurs, rejets et prochain essai. Une réponse OTLP partielle compte les enregistrements rejetés et ne rejoue pas le lot ; les nouveaux lots continuent. Avec des exports dédiés, les journaux en attente sont envoyés automatiquement par lots limités en nombre d’événements et en taille, sans attendre leur remplissage ; les lots restants s’enchaînent sans attente volontaire après un succès. Les métriques suivent une cadence distincte. Les erreurs temporaires, notamment `429` et `503`, sont réessayées automatiquement en respectant `Retry-After` lorsque le destinataire le fournit. Une erreur permanente, notamment d'identifiants, exige une correction de configuration.

## Exports et mise à l'échelle Kubernetes

Lorsque les exports Enterprise s'exécutent dans des pods dédiés, ils traitent les lots en continu pour réduire le délai sous forte charge. PostgreSQL coordonne les livraisons : augmenter le nombre de pods n'autorise pas deux envois de la même partition au même moment.

La métrique `milvago_export_runnable_partitions` compte globalement les partitions exécutables. Elle sert au HPA du déploiement d'exports et n'inclut ni identifiant d'organisation ni donnée de conversation. Elle est absente si son observation complète a plus de 45 secondes ; son absence n'est pas un compteur à zéro. L'exploitant doit alors vérifier le chemin Prometheus et l'adaptateur de métriques avant d'interpréter l'état du HPA.

Pour dimensionner la chaîne de métriques et les réplicas, consultez [Dimensionner PostgreSQL et l’autoscaling](../avance/dimensionnement-postgresql-hpa.md).

## Organisations filles

Une fille hérite par défaut des deux destinations et de leurs filtres. Elle peut personnaliser toute la configuration sans copier les secrets de sa mère, ou désactiver les deux exports. L'option **Imposer cette configuration aux organisations filles** applique la configuration de l'ancêtre aux descendantes ; les configurations locales déjà enregistrées restent inactives jusqu'au retrait du verrou. Chaque organisation exporte seulement ses propres données, identifiées par `organization.id`. Pour une destination héritée, la fille voit l'hôte de l'adresse d'export, jamais son chemin ni ses paramètres, qui peuvent porter un secret de l'ancêtre.

Les accès aux données dans le collecteur, Loki, Prometheus et Grafana doivent être isolés par leurs propres règles. Un filtre sur `organization.id` dans un tableau de bord ne constitue pas un contrôle d'accès.

![Milvago - Organisations filles](/img/docs/fr/administration-observabilite-03.png)
