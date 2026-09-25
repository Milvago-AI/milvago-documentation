---
sidebar_position: 4
title: Kubernetes deployment
---

# Kubernetes deployment

The supplied manifests separate the API, maintenance and, in Enterprise, exports. Adapt them to your environment; they are not yet a Helm chart.

## Prepare the platform

Plan a dedicated namespace, an image identified by its digest, reachable PostgreSQL and Keycloak services, and an HTTPS entry point through Ingress or Gateway API. Provision persistent database storage and backups separately. For fault-tolerant operation, PostgreSQL must have replication suited to your availability objective, physical backups with [continuous WAL archiving and point-in-time recovery](https://www.postgresql.org/docs/current/continuous-archiving.html) that is regularly exercised. A message queue does not replace these safeguards once an event has been acknowledged.

Create Kubernetes secrets outside versioned manifests. The migration account has the schema privileges it needs; runtime accounts are neither owners nor holders of `BYPASSRLS`. Restrict each secret to the role that uses it and plan its rotation.

The cluster must enforce NetworkPolicy (Calico, Cilium, or your provider’s equivalent); without it, the policies are accepted but have no effect. `networkpolicy.yaml` only allows Milvago pods outbound access to DNS, PostgreSQL (5432), Keycloak (8080 or 8443), and, for the API and exports, the OpenTelemetry Collector (4318 or 443): a compromised pod can neither open a connection to the Internet nor exfiltrate data. Adapt the selectors to the labels of your PostgreSQL, Keycloak, and Collector deployments, or replace them with the address of a service outside the cluster. Point `OIDC_INTERNAL_URL` at the internal Keycloak Service: a public URL goes through the load balancer, which these rules refuse. If you import the signed catalog from the publisher service, enable the commented-out rule with its address.

The API HPA requires Metrics Server. The Enterprise exports HPA additionally requires Prometheus and an adapter publishing the external export metric. `servicemonitor.yaml` uses the Prometheus Operator CRD; with another collector, configure equivalent scraping with the observability token. Keep `/metrics` on the private network, outside the public Ingress.

If an OpenTelemetry Collector relays exports to Loki, Grafana Cloud, or a SIEM, mount its persistent queue on an encrypted volume that survives pod replacement. The volume and its replication belong to the Collector deployment, not to Milvago pods. A full queue must reject new input so Milvago retains events in PostgreSQL and retries them.

## Roles and startup order

| File in `deploy/kubernetes/` | Purpose |
| --- | --- |
| `networkpolicy.yaml` | Restricts outbound traffic from Milvago pods: DNS, PostgreSQL, Keycloak and the Collector only |
| `migrate.yaml` | Schema migration and initialization Job |
| `milvago.yaml` | API with HPA, one maintenance replica at steady state, and internal Services |
| `exports.yaml` | Enterprise: exports and their independent HPA |
| `servicemonitor.yaml` | Authenticated Prometheus scraping when Prometheus Operator is installed |
| `prometheus-adapter.example.yaml` | Fragment to merge into your adapter configuration, not a resource to apply directly |

1. Adapt the namespace, image digests, role-specific secrets and PostgreSQL connections. Install the metrics components required by the selected HPA.
2. Adapt and apply `networkpolicy.yaml` before the first Milvago pod.
3. Apply `migrate.yaml` and wait for the `milvago-migrate` Job to complete successfully. A failure must stop deployment; readiness does not replace this step.
4. Apply `milvago.yaml` for the `api` and `maintenance` roles. In Enterprise, also apply `exports.yaml`.
5. Configure authenticated scraping and, for exports, the adapter rule. Check Ready pods and HPA metrics before relying on them to adjust capacity.
6. For each version, recreate the completed Job with the new digest and wait for success before updating workloads. With GitOps, express this dependency through your tool’s ordering mechanisms.

The implicit `all` role retains the combined behavior of Compose or a single-process installation. Kubernetes replicas use dedicated roles: API pods run neither migrations nor durable initialization; export pods do not serve the console.

## Understand scaling

The API and Enterprise exports scale independently between 1 and 4 pods in the supplied manifests. The API follows CPU utilization relative to its resource request; exports follow runnable work observed in PostgreSQL. The migration Job and maintenance have no HPA.

Scaling up takes time to measure the signal, create pods and make them available. A short spike can therefore end before additional pods are useful. Scaling down is deliberately gradual. Targets, timing, connection budgets and tuning guidance are covered in [Sizing PostgreSQL and autoscaling](../avance/dimensionnement-postgresql-hpa.md).

Adding pods does not replace PostgreSQL capacity or raise shared admission quotas. Check database resources and the combined pools before increasing replica ceilings.

## Operate the deployment

Keep the `/healthz` and `/readyz` probes, startup probe and 120-second termination grace period. Readiness checks PostgreSQL access. The manifests mount a 128 MiB temporary `emptyDir` volume at `/tmp` for operations that need writes with a read-only root filesystem.

Check state with `kubectl -n <namespace> get hpa,pods` and `kubectl -n <namespace> describe hpa milvago-api`; in Enterprise, also inspect `milvago-exports`. An unknown metric calls for checking scraping and its adapter; it does not prove there is no load.

Monitor node resources, pods and application metrics separately. Add alerts for PostgreSQL unavailability, delayed WAL archiving, failed backups and test restores, as well as Collector queue size, capacity, and enqueue failures. Warn before its queue reaches 70% of capacity and alert immediately on any enqueue refusal. A GitOps tool observes Kubernetes state; it replaces neither probes nor verification of ingestion and delivery to destinations. See [Observability](../administration/observabilite.md) for Enterprise exports.
