---
sidebar_position: 6
title: Sizing PostgreSQL and autoscaling
---

# Sizing PostgreSQL and autoscaling

The HPA adjusts the number of pods to the observed load. PostgreSQL, Kubernetes nodes, and export recipients must have corresponding capacity. This page explains the values in the supplied manifests and how to adapt them to your traffic; these values are neither a hardware minimum nor a throughput guarantee.

## Separating roles

| Role | Replicas in the manifests | Scaling signal |
| --- | --- | --- |
| API | 1 initially, HPA from 1 to 4 | Average CPU utilisation |
| Enterprise exports | 1 initially, independent HPA from 1 to 4 | Runnable export partitions observed in PostgreSQL |
| Maintenance | 1 in steady state | No HPA; periodic tasks and overall export observation |
| Migration | Job before workloads | Wait for it to succeed before starting the corresponding version |

Dedicated roles prevent migrations and maintenance from running in every API pod. Compose retains the combined `all` role.

## Understanding the two HPA signals

### API: CPU relative to the resource request

The manifest requests `100m` of CPU per API pod and sets the HPA target to **60% of that request**, which is an average target of `60m`. This percentage applies neither to node CPU nor to the `500m` limit. Changing the CPU request therefore also changes the consumption level that triggers adjustment.

Metrics Server must provide the CPU measurement. A CPU limit can cause throttling; PostgreSQL or network waits can instead lengthen responses without high API CPU use. The CPU HPA does not correct every cause of latency.

### Enterprise exports: runnable work

:::enterprise
The export role and its HPA apply to Milvago Enterprise.
:::

The maintenance role calculates `milvago_export_runnable_partitions` from PostgreSQL and exposes it on `/metrics`. It counts partitions that can work now, primarily organisation/destination pairs; the privacy audit has a dedicated partition. A metrics delivery that has become due can also make a partition runnable. This signal does not count events and does not come from a worker's local queue.

The external target `AverageValue: 4` aims for **four partitions per pod**. Several partitions can be processed in parallel; multiplying pods does not speed up a single partition, whose PostgreSQL lock prevents simultaneous processing. Disabled partitions or those awaiting retry do not represent immediately runnable work.

The signal is global. The adapter example uses the **maximum of fresh observations**, rather than their sum, to avoid counting multiple copies of the same total. A missing, incomplete, or stale observation never becomes zero: only the last complete reading may be exposed, for at most **45 seconds**.

### Scaling up, startup, and returning to the minimum

Both HPAs allow an increase of at most **two pods per 30-second period**, without a stabilisation window when scaling up. When scaling down, the highest recommendation over the last **300 seconds** stabilises the decision; the decrease is then capped at **one pod per minute**.

These settings constrain adjustment without guaranteeing an exact delay. Metrics collection, scheduling, image download, and probes take time. A brief peak may end before new pods are useful. If your objective requires capacity available from the start, assess the minimum replica count together with the corresponding resources and connections. See [how Kubernetes HPA works](https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/).

## Installing and monitoring metrics

For the API, install Metrics Server. For exports, add Prometheus and an external metrics adapter. The supplied `ServiceMonitor` assumes Prometheus Operator; equivalent collection is possible without that CRD. Keep the `namespace` and `pod` labels, the observability token in a secret, and `/metrics` on the private network.

`prometheus-adapter.example.yaml` is a fragment to incorporate into the adapter configuration, not a Kubernetes resource to apply directly. Its freshness filter uses `milvago_export_snapshot_timestamp_seconds` to discard observations that are 45 seconds old or older, even if Prometheus retains an earlier sample. Check the metrics and HPA conditions before relying on their capacity adjustment.

## Planning PostgreSQL connections

The pool sizes proposed in the deployment secrets are **10 connections per API**, **4 per export pod**, and **4 for maintenance**. They are configurable: calculate the budget from your actual values.

**Steady-state budget = API replicas × API pool + export replicas × export pool + maintenance replicas × maintenance pool.**

With both HPAs at their proposed maximum, this gives **4 × 10 + 4 × 4 + 1 × 4 = 60 connections**. This is a cumulative ceiling for application pools in steady state, not a sufficient value for `max_connections`.

Add the additional pods from updates (`maxSurge`), old pods still terminating during the **120-second** grace period, the migration Job, administration, and monitoring. Maintenance can also have two pods during a transition. If Keycloak or other services share the same PostgreSQL instance, include their connections and that instance's reserves.

Increasing pools or `max_connections` does not create CPU or disk throughput. It can increase contention and waits. Allow a connection and memory margin, then verify actual use; see [PostgreSQL connection settings](https://www.postgresql.org/docs/current/runtime-config-connection.html).

## Preserving capacity and durability

API admission quotas are shared in PostgreSQL: adding pods does not multiply the permitted budget. Export batches are bounded by event count and JSON size; a batch leaves without waiting to fill. Low volumes therefore do not wait for an event threshold.

The delivery register is committed after remote acknowledgement. An interruption between that acknowledgement and the commit can cause retransmission: local register idempotency does not guarantee exactly-once network receipt. See [Observability](../administration/observabilite.md) for delivery rules.

Size PostgreSQL CPU, memory, and storage for retained history, indexes, WAL, purges, and backups. Keep autovacuum and statistics up to date; inspect expensive query plans and waits before changing resources. See [PostgreSQL maintenance](https://www.postgresql.org/docs/current/routine-vacuuming.html).

Keep `fsync` and a `synchronous_commit` policy compatible with the expected durability. Disabling them to improve a measurement changes data-retention guarantees; it is not an equivalent optimisation. The [WAL documentation](https://www.postgresql.org/docs/current/runtime-config-wal.html) details these trade-offs. Estimate sizes and retention from stored data, according to the [hardware requirements](../introduction/hardware-requirements.md).

### Distinguishing the three outages

- **PostgreSQL temporarily unavailable**: the API returns `503`. The agent retains events in its encrypted store and replays them with the same identifiers. Authorization, revocation, and quotas never become permissive.
- **Loss of PostgreSQL storage**: events already acknowledged depend on replication, physical backups, and [WAL archiving with point-in-time recovery](https://www.postgresql.org/docs/current/continuous-archiving.html). Prepare this recovery and measure its RPO and RTO in practice.
- **OTLP destination unavailable**: Milvago retains events not acknowledged by the receiver and retries. If a Collector accepts and then relays batches, its own persistent queue becomes responsible for their custody.

Configured retention and intentional deletions remain the priority: a prolonged outage must not implicitly extend retention. Delivery after recovery may be repeated; destinations must accept at-least-once semantics.

### Sizing recovery queues

First set the outage duration you want to absorb. For each queue, estimate `maximum observed throughput × high event size × duration`, then add the margin needed for batches, indexes, temporary writes, and traffic variation. Verify the result on the actual volume: capacity expressed in batches guarantees no duration without these measurements.

Monitor the agents' local queue, the age of the oldest pending Milvago export and, for the Collector, `otelcol_exporter_queue_size`, `otelcol_exporter_queue_capacity`, enqueue failures, and send failures. Alert before 70% capacity. A queue that continuously grows indicates a destination slower than the input; adding pods can then increase pressure without resolving the cause.

Test PostgreSQL recovery, Collector recovery after restart, and PITR restoration on a disposable database separately. Reconcile acknowledged, stored, and delivered identifiers; probes merely becoming healthy again do not prove event retention.

## Diagnosing before adjusting

| Observation | Useful check |
| --- | --- |
| API `429` responses | Identify the quota reached and follow the indicated retry; increasing the HPA does not raise quotas. |
| API `503` responses | Examine the error code, logs, admission, pools, and PostgreSQL availability. |
| Collector queue near capacity | Check the destination throughput, persistent space, and enqueue failures; do not blindly increase the queue. |
| WAL archiving delayed or failed | Restore the archive and check the recovery chain before considering acknowledged events protected. |
| API CPU limited, pods ready | Examine throttling and node capacity before changing requests, limits, or replicas. |
| PostgreSQL saturated or pool waits | Distinguish CPU, I/O, locks, and SQL plans; more pods can worsen contention. |
| Backlog with PostgreSQL available | Check the number of runnable partitions and recipient responses; its `429`, `503`, or retry delays also limit throughput. |
| Unknown or stale HPA metric | Check maintenance, authenticated scraping, labels, adapter, and freshness; do not replace absence with zero. |
| Additional pods Pending or not Ready | Check cluster resources, Kubernetes events, image, and probes. |
| Replicas still present after a spike | Observe the 300-second rolling window and gradual scale-down before concluding there is a fault. |

## Adjusting with representative load

1. Set your API response-time and end-to-end delivery-delay objectives, as well as expected traffic, destinations, and retention.
2. Replay repeated peaks with representative history. Measure ingestion completion, recipient receipt, and register commit separately; check missing events, retries, and duplicates.
3. Record actually Ready replicas, CPU/throttling, memory, connections, PostgreSQL waits, pools, and network time. Verify that added pods perform work.
4. Change one variable justified by those measurements, then compare with identical load and history. Do not conceal saturation by merely extending timeouts.
5. Check the natural return to the minimum, an update with pod replacement, and recovery after an outage before adopting your settings.
