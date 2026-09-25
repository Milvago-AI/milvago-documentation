---
sidebar_position: 2
title: Hardware Requirements
---

# Hardware Requirements

This page presents the components and resources to plan for when deploying Milvago Community or Enterprise. Sizing depends on the number of active endpoints, event volume, retained content, and its retention period.

## Server platform

| Element | Deployment requirement |
| --- | --- |
| Host | Linux x86-64 physical machine or virtual machine, with a Linux container engine |
| Application | Milvago image matching your edition; the Go server also serves the web console |
| Database | PostgreSQL, with persistent SSD storage and backups on separate storage |
| Identity | Keycloak, with a dedicated database, public URL, and TLS certificate |
| Access | DNS names and HTTPS for Milvago and the identity provider |
| Temporary storage | Writable directory for preparing installers and updates |

Deployment files reference **PostgreSQL 18.3** and **Keycloak 26.7.4**. Check version compatibility when changing these components. For an ARM64 host, first verify that an image compatible with that architecture is available.

Milvago does not host a language model: **no GPU or AI accelerator is required**. The console is integrated into the server and requires no Node.js service in production. Target systems for Enterprise exports, such as an OTLP collector or SIEM, must be sized separately.

## Sizing CPU and memory

Size **Milvago, PostgreSQL, and Keycloak** together, as well as the host system and container engine. These services can share one machine or be hosted separately.

| Component | Factors to consider |
| --- | --- |
| Milvago | Event throughput, simultaneous endpoint synchronisations, consultations, reports, and enabled exports |
| PostgreSQL | Retained volume, indexes, searches, concurrent writes, purges, and backups |
| Keycloak | Concurrent sign-ins, session renewals, and identity integrations |

Set capacity from a representative load for your deployment, then retain headroom for activity peaks, restarts, and maintenance. Measure repeated bursts with representative history, covering ingestion and export delivery; monitor CPU, PostgreSQL waits, and pools before changing resources or replicas. Endpoint count alone is insufficient: frequency of use and retained content directly affect requirements.

The [Keycloak sizing guide](https://www.keycloak.org/high-availability/single-cluster/concepts-memory-and-cpu-sizing) complements this assessment for the identity service. Resources for building images and agents must be planned separately from operating resources.

## Storage and retention

Plan persistent SSD storage for PostgreSQL. Its volume must cover application data, indexes, transaction logs (WAL), identity data, and the space needed for maintenance.

To estimate event volume, use the following formula:

**Active endpoints × events per endpoint per day × retention days × average database-stored size of an event.** The size of a transmitted OTLP message is distinct from this formula; it represents neither stored volume nor PostgreSQL growth.

Add retained content, inventories, audits, and indexes if they are not already included in that average size. Events and content can have different retention periods. Also plan space for images, installers, and operational logs.

Backups require separate storage and a verified restoration procedure. Keep free space for migrations and write peaks; purging data does not necessarily immediately reduce PostgreSQL volume size.

## Docker and Kubernetes

### Container deployment

For a production installation, configure TLS, DNS names, Keycloak in production mode, the SMTP relay, secrets, and persistent volumes. The supplied Compose file uses Keycloak in `start-dev` and a test mail server: adapt these services before production.

### Kubernetes deployment

The `deploy/kubernetes/milvago.yaml` manifest provides the API, maintenance, and their internal Services. PostgreSQL, Keycloak, HTTPS Ingress, secrets, and persistent volumes must be provisioned separately. In Enterprise, `deploy/kubernetes/exports.yaml` provides exports and their independent HPA. The [Helm chart](../installation/helm.md) is not yet available.

The workloads have the following initial values:

| Setting | Manifest value |
| --- | --- |
| API: initial replicas / HPA | 1 / 1 to 4 |
| API: requested / limited CPU | 100 mCPU / 500 mCPU |
| API: requested / limited memory | 128 MiB / 384 MiB |
| Enterprise exports: HPA | 1 to 4, independent |
| Maintenance | 1 stable replica |

These settings apply to Milvago workloads. Adjust resources to your load; they do not constitute complete platform sizing. Also reserve capacity for Kubernetes services, other workloads, and restarts. [Requests and limits](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) determine container resource placement and bounds.

To prepare the deployment:

- Use [persistent volumes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) and backups for Milvago and Keycloak databases.
- Configure public URLs, TLS certificates, and stable encryption and signing secrets.
- The manifest already provides writable `emptyDir` temporary storage of 128 MiB on `/tmp`. Keep this limit or deliberately adjust it if you customise the workload.
- Keep startup, readiness, and liveness probes, and monitor restarts, memory, and CPU throttling.

Quotas are shared and controlled in PostgreSQL: the API HPA can run from 1 to 4 replicas, while the Enterprise exports HPA is independent and maintenance remains at one stable replica. Adding replicas does not compensate for a saturated database and increases connections and SQL work. See [Sizing PostgreSQL and autoscaling](../avance/dimensionnement-postgresql-hpa.md).

## Endpoints equipped with the agent

Installation packages target **Windows x64** and **Linux x86_64**. The browser matrix and Windows/Linux service modes are detailed in [Technical architecture](architecture.md).

Plan space for binaries, local state, logs, and coexistence of the old and new version during an update. Endpoint memory requirements also include the browser and its extension. In Enterprise, account for enabled collection and filtering services.

The main offline queue defaults to **10,000 events and 8 MiB serialised**. It combines legacy and Shadow AI events; this limit does not apply to all agent memory or storage. The browser SYSTEM fallback cache remains separate, with its own limits of 1,000 events or health batches and 8 MiB. The four thresholds `queue.max_events`, `queue.max_size_mb`, `logging.max_file_mb`, and `logging.retained_files` can be adjusted in `milvago.toml`; by default, logs use one current file and five archives, rotating at 10 MiB. See [agent configuration](../avance/agent-configuration.md).

## Network and operational preparation

Endpoints must be able to reach Milvago's HTTPS URL. Browsers used for the console must also reach the identity provider. Plan DNS resolution and time synchronisation; keep PostgreSQL on a private network. Connections and ports are detailed in [Technical architecture](architecture.md).

Size bandwidth for event reporting, exports, and update downloads. Stage deployments across large fleets to limit transfer peaks.

Before production, check response times, storage growth, purge operations, backup restoration, and recovery after an outage. Use these results to adjust your environment's resources and monitoring thresholds.
