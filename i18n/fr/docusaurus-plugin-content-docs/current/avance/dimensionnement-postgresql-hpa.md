---
sidebar_position: 6
title: Dimensionner PostgreSQL et l'autoscaling
---

# Dimensionner PostgreSQL et l'autoscaling

Le HPA adapte le nombre de pods à la charge observée. PostgreSQL, les nœuds Kubernetes et les destinataires d’export doivent disposer de la capacité correspondante. Cette page explique les valeurs des manifestes fournis et la méthode pour les adapter à votre trafic ; ces valeurs ne constituent pas un minimum matériel ni une garantie de débit.

## Séparer les rôles

| Rôle | Réplicas dans les manifestes | Signal de mise à l’échelle |
| --- | --- | --- |
| API | 1 au départ, HPA de 1 à 4 | Utilisation CPU moyenne |
| Exports Enterprise | 1 au départ, HPA indépendant de 1 à 4 | Partitions d’export exécutables observées dans PostgreSQL |
| Maintenance | 1 en régime stable | Pas de HPA ; tâches périodiques et observation globale des exports |
| Migration | Job avant les workloads | Attendre sa réussite avant de démarrer la version correspondante |

Les rôles dédiés évitent de lancer migrations et maintenance dans chaque pod API. Compose conserve le rôle combiné `all`.

## Comprendre les deux signaux HPA

### API : CPU rapporté à la requête de ressources

Le manifeste demande `100m` de CPU par pod API et fixe la cible HPA à **60 % de cette requête**, soit une moyenne cible de `60m`. Ce pourcentage ne porte ni sur le CPU du nœud ni sur la limite de `500m`. Modifier la requête CPU modifie donc aussi le niveau de consommation qui déclenche l’ajustement.

Metrics Server doit fournir la mesure CPU. Une limite CPU peut entraîner du throttling ; une attente PostgreSQL ou réseau peut au contraire allonger les réponses sans forte consommation CPU de l’API. Le HPA CPU ne corrige pas toutes les causes de latence.

### Exports Enterprise : travail exécutable

:::enterprise
Le rôle d’export et son HPA concernent Milvago Enterprise.
:::

Le rôle maintenance calcule `milvago_export_runnable_partitions` depuis PostgreSQL et l’expose sur `/metrics`. Il compte les partitions qui peuvent travailler maintenant, principalement les couples organisation/destination ; l’audit de confidentialité dispose d’une partition dédiée. Une livraison de métriques arrivée à échéance peut également rendre une partition exécutable. Ce signal ne compte pas les événements et ne provient pas de la file locale d’un worker.

La cible externe `AverageValue: 4` vise **quatre partitions par pod**. Plusieurs partitions peuvent être traitées en parallèle ; multiplier les pods n’accélère pas une partition unique, dont le verrou PostgreSQL empêche le traitement simultané. Les partitions désactivées ou en attente de reprise ne représentent pas du travail immédiatement exécutable.

Le signal est global. L’exemple d’adaptateur prend le **maximum des observations fraîches**, et non leur somme, pour éviter de compter plusieurs fois des copies du même total. Une observation manquante, incomplète ou périmée ne devient jamais un zéro : seul le dernier relevé complet peut être exposé, pendant au plus **45 secondes**.

### Montée, démarrage et retour au minimum

Les deux HPA autorisent une hausse d’au plus **deux pods par période de 30 secondes**, sans fenêtre de stabilisation à la montée. À la descente, la recommandation la plus haute des **300 dernières secondes** stabilise la décision ; la baisse est ensuite plafonnée à **un pod par minute**.

Ces réglages encadrent l’ajustement, sans garantir un délai exact. La collecte des métriques, l’ordonnancement, le téléchargement d’image et les sondes prennent du temps. Un pic bref peut se terminer avant que les nouveaux pods soient utiles. Si votre objectif impose une capacité disponible dès le départ, évaluez le minimum de réplicas avec les ressources et les connexions correspondantes. Voir le [fonctionnement du HPA Kubernetes](https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/).

## Installer et surveiller les métriques

Pour l’API, installez Metrics Server. Pour les exports, ajoutez Prometheus et un adaptateur de métriques externes. Le `ServiceMonitor` fourni suppose Prometheus Operator ; une collecte équivalente est possible sans cette CRD. Conservez les labels `namespace` et `pod`, le jeton d’observabilité dans un secret et `/metrics` sur le réseau privé.

`prometheus-adapter.example.yaml` est un fragment à intégrer à la configuration de l’adaptateur, pas une ressource Kubernetes à appliquer directement. Son filtre de fraîcheur utilise `milvago_export_snapshot_timestamp_seconds` pour écarter les observations âgées de 45 secondes ou plus, même si Prometheus conserve un ancien échantillon. Vérifiez les métriques et les conditions des HPA avant de vous fier à leur ajustement de capacité.

## Prévoir les connexions PostgreSQL

Les tailles de pool proposées dans les secrets de déploiement sont de **10 connexions par API**, **4 par pod d’export** et **4 pour la maintenance**. Elles sont configurables : calculez le budget à partir de vos valeurs effectives.

**Budget stable = réplicas API × pool API + réplicas export × pool export + réplicas maintenance × pool maintenance.**

Avec les deux HPA à leur maximum proposé, cela donne **4 × 10 + 4 × 4 + 1 × 4 = 60 connexions**. Il s’agit d’un plafond cumulé des pools applicatifs en régime stable, pas d’une valeur suffisante pour `max_connections`.

Ajoutez les pods supplémentaires des mises à jour (`maxSurge`), les anciens pods encore en terminaison pendant le délai de grâce de **120 secondes**, le Job de migration, l’administration et la supervision. La maintenance peut elle aussi avoir deux pods pendant une transition. Si Keycloak ou d’autres services partagent la même instance PostgreSQL, incluez leurs connexions et les réserves de cette instance.

Augmenter les pools ou `max_connections` ne crée pas de CPU ni de débit disque. Cela peut accroître la concurrence et les attentes. Prévoyez une marge de connexions et de mémoire, puis vérifiez leur usage réel ; voir les [paramètres de connexion PostgreSQL](https://www.postgresql.org/docs/current/runtime-config-connection.html).

## Préserver la capacité et la durabilité

Les quotas d’admission de l’API sont partagés dans PostgreSQL : ajouter des pods ne multiplie pas le budget autorisé. Les lots d’export sont bornés par nombre d’événements et par taille JSON ; un lot part sans attendre son remplissage. Les petits volumes n’attendent donc pas un seuil d’événements.

Le registre de livraison est validé après l’acquittement distant. Une interruption entre cet acquittement et le commit peut provoquer une retransmission : l’idempotence du registre local ne garantit pas une réception réseau exactement une fois. Consultez [Observabilité](../administration/observabilite.md) pour les règles de livraison.

Dimensionnez CPU, mémoire et stockage PostgreSQL avec l’historique conservé, les index, le WAL, les purges et les sauvegardes. Maintenez l’autovacuum et les statistiques à jour ; examinez les plans des requêtes coûteuses et les attentes avant de modifier les ressources. Voir la [maintenance PostgreSQL](https://www.postgresql.org/docs/current/routine-vacuuming.html).

Conservez `fsync` et une politique `synchronous_commit` compatible avec la durabilité attendue. Les désactiver pour améliorer une mesure change les garanties de conservation ; ce n’est pas une optimisation équivalente. La [documentation du WAL](https://www.postgresql.org/docs/current/runtime-config-wal.html) précise ces compromis. Les tailles et rétentions sont à estimer à partir des données stockées, selon les [prérequis techniques](../introduction/hardware-requirements.md).

### Distinguer les trois pannes

- **PostgreSQL temporairement indisponible** : l'API répond `503`. L'agent conserve les événements dans son magasin chiffré et les rejoue avec les mêmes identifiants. L'autorisation, la révocation et les quotas ne passent jamais en mode permissif.
- **Perte du stockage PostgreSQL** : les événements déjà acquittés dépendent de la réplication, des sauvegardes physiques et de [l'archivage WAL avec restauration à un instant précis](https://www.postgresql.org/docs/current/continuous-archiving.html). Préparez cette restauration et mesurez réellement son RPO et son RTO.
- **Destination OTLP indisponible** : Milvago conserve les événements non acquittés par le récepteur et réessaie. Si un Collector accepte puis relaie les lots, sa propre file persistante devient responsable de leur garde.

La rétention configurée et les effacements volontaires restent prioritaires : une indisponibilité prolongée ne doit pas prolonger implicitement la conservation. Une livraison après reprise peut être répétée ; les destinations doivent accepter une sémantique au moins une fois.

### Dimensionner les files de reprise

Fixez d'abord la durée de panne que vous voulez absorber. Pour chaque file, estimez `débit maximal observé × taille haute d'un événement × durée`, puis ajoutez la marge nécessaire aux lots, index, écritures temporaires et variations de trafic. Vérifiez le résultat sur le volume réel : une capacité exprimée en lots ne garantit aucune durée sans ces mesures.

Surveillez la file locale des agents, l'âge du plus ancien export Milvago en attente et, pour le Collector, `otelcol_exporter_queue_size`, `otelcol_exporter_queue_capacity`, les échecs d'enqueue et les échecs d'envoi. Alertez avant 70 % de capacité. Une file continuellement croissante signale un destinataire plus lent que l'entrée ; ajouter des pods peut alors augmenter la pression sans résoudre la cause.

Testez séparément le retour de PostgreSQL, la reprise d'un Collector après redémarrage et une restauration PITR sur une base jetable. Rapprochez les identifiants acquittés, stockés et livrés ; un simple retour au vert des sondes ne prouve pas la conservation des événements.

## Diagnostiquer avant d’ajuster

| Observation | Vérification utile |
| --- | --- |
| Réponses API `429` | Identifier le quota atteint et respecter la reprise indiquée ; augmenter le HPA ne relève pas les quotas. |
| Réponses API `503` | Examiner le code d’erreur, les journaux, l’admission, les pools et la disponibilité PostgreSQL. |
| File du Collector proche de sa capacité | Vérifier le débit du destinataire, l'espace persistant et les échecs d'enqueue ; ne pas augmenter aveuglément la file. |
| Retard ou échec d'archivage WAL | Rétablir l'archive et vérifier la chaîne de restauration avant de considérer les événements acquittés comme protégés. |
| CPU API limité, pods prêts | Examiner le throttling et la capacité des nœuds avant de modifier requests, limits ou réplicas. |
| PostgreSQL saturé ou attentes de pool | Distinguer CPU, entrées/sorties, verrous et plans SQL ; davantage de pods peut aggraver la contention. |
| Backlog avec PostgreSQL disponible | Vérifier le nombre de partitions exécutables et les réponses du destinataire ; ses `429`, `503` ou délais de reprise limitent aussi le débit. |
| Métrique HPA inconnue ou périmée | Contrôler maintenance, scrape authentifié, labels, adaptateur et fraîcheur ; ne pas remplacer l’absence par zéro. |
| Pods supplémentaires Pending ou non Ready | Contrôler ressources du cluster, événements Kubernetes, image et sondes. |
| Réplicas encore présents après une pointe | Observer la fenêtre glissante de 300 secondes et la baisse progressive avant de conclure à un défaut. |

## Ajuster avec une charge représentative

1. Fixez vos objectifs de temps de réponse API et de délai de livraison complet, ainsi que le trafic, les destinations et la rétention attendus.
2. Rejouez des pointes répétées avec un historique représentatif. Mesurez séparément la fin d’ingestion, la réception chez le destinataire et la validation du registre ; vérifiez les événements manquants, les reprises et les doublons.
3. Relevez les réplicas réellement Ready, CPU/throttling, mémoire, connexions, attentes PostgreSQL, pools et temps réseau. Vérifiez que les pods ajoutés effectuent du travail.
4. Modifiez une seule variable justifiée par ces mesures, puis comparez à charge et historique identiques. Ne masquez pas une saturation par un simple allongement des délais d’attente.
5. Contrôlez le retour naturel au minimum, une mise à jour avec remplacement de pods et la reprise après indisponibilité avant de retenir vos réglages.
