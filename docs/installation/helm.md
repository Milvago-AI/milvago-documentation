---
sidebar_position: 4
title: Déploiement Kubernetes
---

# Déploiement Kubernetes

Les manifestes fournis séparent l’API, la maintenance et, en Enterprise, les exports. Ils sont à adapter à votre environnement ; ils ne constituent pas encore un chart Helm.

## Préparer la plateforme

Prévoyez un namespace dédié, une image identifiée par son digest, PostgreSQL et Keycloak accessibles, ainsi qu’une entrée HTTPS par Ingress ou Gateway API. Provisionnez les volumes persistants et les sauvegardes des bases séparément. Pour une exploitation tolérante aux pannes, PostgreSQL doit disposer d'une réplication adaptée à votre objectif de disponibilité, de sauvegardes physiques avec [archivage continu du WAL et restauration à un instant précis](https://www.postgresql.org/docs/current/continuous-archiving.html) régulièrement exercée. Une file de messages ne remplace pas ces protections après qu'un événement a été acquitté.

Créez les secrets Kubernetes hors des manifestes versionnés. Le compte de migration possède les droits nécessaires au schéma ; les comptes de runtime ne sont ni propriétaires ni détenteurs de `BYPASSRLS`. Limitez chaque secret au rôle qui l’utilise et prévoyez sa rotation.

Le cluster doit appliquer les NetworkPolicy (Calico, Cilium ou l’équivalent de votre fournisseur) ; sans cela, les politiques sont acceptées mais sans effet. `networkpolicy.yaml` n’autorise en sortie des pods Milvago que le DNS, PostgreSQL (5432), Keycloak (8080 ou 8443) et, pour l’API et les exports, l’OpenTelemetry Collector (4318 ou 443) : un pod compromis ne peut ni ouvrir de connexion vers Internet ni exfiltrer de données. Adaptez les sélecteurs aux libellés de vos déploiements PostgreSQL, Keycloak et Collector, ou remplacez-les par l’adresse d’un service situé hors du cluster. Faites pointer `OIDC_INTERNAL_URL` vers le Service Keycloak interne : une URL publique passe par l’équilibreur de charge, que ces règles refusent. Si vous importez le catalogue signé depuis le service éditeur, activez la règle commentée en y indiquant son adresse.

Le HPA de l’API nécessite Metrics Server. Le HPA des exports Enterprise nécessite en plus Prometheus et un adaptateur publiant la métrique externe d’export. Le fichier `servicemonitor.yaml` utilise la CRD de Prometheus Operator ; si vous utilisez une autre collecte, configurez un scrape équivalent avec le jeton d’observabilité. Gardez `/metrics` sur le réseau privé, hors de l’Ingress public.

Si un OpenTelemetry Collector relaie les exports vers Loki, Grafana Cloud ou un SIEM, montez sa file persistante sur un volume chiffré qui survit au remplacement du pod. Le volume et sa réplication appartiennent au déploiement du Collector, pas aux pods Milvago. Une file saturée doit refuser de nouvelles entrées afin que Milvago conserve les événements dans PostgreSQL et les réessaie.

## Rôles et ordre de démarrage

| Fichier dans `deploy/kubernetes/` | Rôle |
| --- | --- |
| `networkpolicy.yaml` | Restriction des flux sortants des pods Milvago : DNS, PostgreSQL, Keycloak et Collector uniquement |
| `migrate.yaml` | Job de migration du schéma et d’initialisation |
| `milvago.yaml` | API avec HPA, maintenance à un réplica en régime stable et Services internes |
| `exports.yaml` | Enterprise : exports et leur HPA indépendant |
| `servicemonitor.yaml` | Collecte Prometheus authentifiée, si Prometheus Operator est installé |
| `prometheus-adapter.example.yaml` | Fragment à intégrer à la configuration de votre adaptateur, pas une ressource à appliquer directement |

1. Adaptez le namespace, les digests d’image, les secrets par rôle et les connexions PostgreSQL. Installez les composants de métriques nécessaires au HPA choisi.
2. Adaptez puis appliquez `networkpolicy.yaml` avant le premier pod Milvago.
3. Appliquez `migrate.yaml` et attendez la fin réussie du Job `milvago-migrate`. Un échec doit interrompre le déploiement ; la readiness ne remplace pas cette étape.
4. Appliquez `milvago.yaml` pour les rôles `api` et `maintenance`. En Enterprise, appliquez aussi `exports.yaml`.
5. Configurez la collecte authentifiée et, pour les exports, la règle de l’adaptateur. Vérifiez les pods Ready et les métriques des HPA avant de leur confier l’ajustement de capacité.
6. À chaque version, recréez le Job terminé avec le nouveau digest et attendez son succès avant d’actualiser les workloads. Avec GitOps, représentez cette dépendance par les mécanismes d’ordonnancement de votre outil.

Le rôle implicite `all` garde le fonctionnement combiné de Compose ou d’une installation monoprocessus. Les réplicas Kubernetes utilisent les rôles dédiés : les pods API n’exécutent ni migration ni initialisation durable ; les pods d’export ne servent pas la console.

## Comprendre la mise à l’échelle

L’API et les exports Enterprise évoluent indépendamment entre 1 et 4 pods dans les manifestes fournis. L’API suit l’utilisation CPU rapportée à sa requête de ressources ; les exports suivent le travail exécutable observé dans PostgreSQL. Le Job de migration et la maintenance n’ont pas de HPA.

Une montée en charge demande le temps de mesurer le signal, de créer les pods et de les rendre disponibles. Un pic court peut donc se terminer avant que des pods supplémentaires soient utiles. La descente est volontairement progressive. Les cibles, les délais, le budget de connexions et les réglages conseillés sont détaillés dans [Dimensionner PostgreSQL et l’autoscaling](../avance/dimensionnement-postgresql-hpa.md).

Ajouter des pods ne remplace pas la capacité PostgreSQL et ne relève pas les quotas partagés d’admission. Vérifiez les ressources de la base et la somme des pools avant d’augmenter les plafonds de réplicas.

## Exploiter le déploiement

Conservez les sondes `/healthz` et `/readyz`, la sonde de démarrage et le délai de terminaison de 120 secondes. La readiness teste l’accès à PostgreSQL. Les manifestes montent un volume temporaire `emptyDir` de 128 Mio sur `/tmp` pour les traitements nécessitant des écritures avec une racine en lecture seule.

Contrôlez l’état avec `kubectl -n <namespace> get hpa,pods` et `kubectl -n <namespace> describe hpa milvago-api` ; en Enterprise, examinez aussi `milvago-exports`. Une métrique inconnue demande de vérifier sa collecte et son adaptateur ; elle ne prouve pas l’absence de charge.

Surveillez séparément les ressources des nœuds, les pods et les métriques applicatives. Ajoutez des alertes sur l'indisponibilité PostgreSQL, le retard d'archivage WAL, l'échec des sauvegardes et des restaurations de contrôle, ainsi que sur la taille, la capacité et les échecs d'enqueue du Collector. Déclenchez un avertissement avant que sa file atteigne 70 % de sa capacité et une alerte immédiate sur tout refus d'enqueue. Un outil GitOps observe l’état Kubernetes ; il ne remplace ni les sondes ni la vérification de l’ingestion et de la livraison aux destinataires. Consultez [Observabilité](../administration/observabilite.md) pour les exports Enterprise.
