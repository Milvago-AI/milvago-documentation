---
sidebar_position: 8
title: Observability
tags: [Enterprise]
---

# Observability

## Open the page

Click **Administration** > **Observability** in the sidebar. This Enterprise-only page requires `observability.manage`.

1. Enable a destination, then enter its URL and optional **Authorization** header.
2. Select streams and save the configuration.
3. Test the saved configuration.

Administration → Observability configures metrics and log delivery to your analysis tools for each organization.

:::enterprise
This page applies only to Milvago Enterprise.
:::

![Milvago - Open the page](/img/docs/en/administration-observabilite-01.png)

## OTLP export and Grafana dashboard

**Download dashboard** provides a file to import into Grafana; data sources still need to be configured there.

**OTLP export for Grafana** configures the base URL of an OTLP/HTTP JSON compatible collector. Milvago sends data to that collector, which forwards it to the services used by Grafana.

### Logs in Loki, metrics in the dashboard

To explore logs in Grafana, configure the collector receiving Milvago data to forward its log stream to [Loki's native OTLP endpoint](https://grafana.com/docs/loki/latest/send-data/otel/otel-collector-getting-started/). Then add Grafana's [built-in Loki data source](https://grafana.com/docs/grafana/latest/datasources/loki/). Milvago has no separate Loki export or Grafana plugin.

The **downloadable dashboard** uses a **Prometheus** data source. Configure the collector's metrics output separately for a Prometheus-compatible system, then select that data source when importing the dashboard. Connecting Loki alone does not populate its charts.

## Custom SIEM destination

The second card, titled **Custom destination (SIEM)**, is a custom OTLP slot. It implements neither a vendor-specific SIEM API nor syslog. It needs a compatible OTLP/HTTP JSON receiver, such as a collector configured to transform and forward the data to your SIEM. The final protocol, credentials and schema depend on that external configuration.

If your SIEM requires Syslog over TLS or a specific API, configure that conversion and its authentication in the collector. Milvago's **Authorization** field authenticates only its request to the specified OTLP receiver.

When enabled, this destination also receives **sensitive privacy audits** through a dedicated queue, even when the **Audit log** stream is off. The queue status appears at the bottom of the page.

## Protocol and authentication

Milvago sends HTTP POST requests with `Content-Type: application/json` to the base URL followed by `/v1/metrics` or `/v1/logs`. This is **OTLP/HTTP JSON**, not OTLP/gRPC or binary OTLP/HTTP Protobuf. If the receiver requires an `Authorization` header, enter its full value as `Bearer …` or `Basic …`. The secret is sealed on the server and never returned by the API. Changing the receiver URL clears its saved secret.

For a **direct connection to the Grafana Cloud OTLP ingestion endpoint**, Grafana requires `Basic` with the **OTLP** instance ID as username and an access policy token as password, encoded in Base64. A Grafana management API Bearer token serves a different API. [Grafana Cloud says](https://grafana.com/docs/grafana-cloud/observe-and-act/send-data/otlp/otlp-format-considerations/) JSON ingestion is best suited to testing or low traffic; for production, configure a collector to accept Milvago's JSON and export to Grafana Cloud with the appropriate format and authentication.

Export URLs use HTTPS unless the operator explicitly allows an HTTP host; prohibited network destinations are checked when saving and connecting. **Test saved configuration** sends synthetic data only for the selected streams. Receiver acceptance does not prove delivery to Grafana or the SIEM.

![Milvago - Protocol and authentication](/img/docs/en/administration-observabilite-02.png)

## Recovery after a destination outage

Milvago retains in PostgreSQL events that the OTLP receiver has not accepted. After a temporary error or interruption, it automatically retries the same work; an interruption around acknowledgement can therefore produce a duplicate at the destination.

If the configured URL points to an OpenTelemetry Collector that subsequently relays the data, enable a [persistent queue](https://github.com/open-telemetry/opentelemetry-collector/blob/main/exporter/exporterhelper/README.md#persistent-queue) for its exporters and place it on an encrypted volume that survives its restart. A positive response from the Collector transfers custody to the Collector; it still does not prove that the final backend accepted the data. The Collector must reject input when its queue is full so Milvago retains events and retries them from PostgreSQL.

Monitor queue size and capacity, enqueue failures, send failures, and free space on the volume. Set its capacity from actual throughput and the outage duration you want to absorb, then alert before 70%. Also configure retention, deletions, backups, and access controls that apply in external systems after this transfer of custody.

## Data and delivery status

- **Metrics**: gauges for activity over 24 hours, fleet status and local inventory; they describe the current state and are sent periodically.
- **Shadow AI events**: usage metadata selected by the destination's filter, from activation onward. The filter does not affect metrics or audits.
- **Audit log**: administrative actions and technical identifiers. Sensitive privacy audits additionally use the dedicated SIEM queue.

The OTLP export does not read prompts, responses, conversation content, URLs, device names or email addresses. Technical identifiers still need protection at the destination. `GET /api/shadow/metrics` is a separate session- and permission-protected read API; it is not the OTLP ingestion URL.

**Delivery status** shows attempts, acceptances, errors, rejected records and the next attempt. An OTLP partial response counts rejected records and does not replay the batch; later batches continue. For dedicated exports, pending logs are sent automatically in batches limited by event count and size, without waiting for a batch to fill; remaining batches continue without an intentional wait after a success. Metrics follow a separate cadence. Temporary errors, including `429` and `503`, are retried automatically while honoring `Retry-After` when the destination provides it. A permanent error, including invalid credentials, requires a configuration fix.

## Exports and Kubernetes scaling

When Enterprise exports run in dedicated pods, they process batches continuously to reduce export delay under heavy load. PostgreSQL coordinates deliveries: increasing the number of pods does not allow two deliveries of the same partition at the same time.

The `milvago_export_runnable_partitions` metric is the global count of runnable partitions. It serves the exports Deployment HPA and contains neither an organization identifier nor conversation data. It is absent when its complete observation is more than 45 seconds old; absence is not a zero count. The operator should then check the Prometheus path and metrics adapter before interpreting HPA state.

For metrics and replica sizing, see [Sizing PostgreSQL and autoscaling](../avance/dimensionnement-postgresql-hpa.md).

## Child organizations

A child inherits both destinations and their filters by default. It may customize the full configuration without copying the parent's secrets, or disable both exports. **Enforce this configuration on child organizations** applies the ancestor's configuration to descendants; saved local configurations stay inactive until the lock is removed. Each organization exports only its own data, identified by `organization.id`. For an inherited destination, the child sees the host of the export address, never its path or parameters, which may carry a secret belonging to the ancestor.

Access to data in the collector, Loki, Prometheus and Grafana must be isolated using those systems' own controls. A dashboard filter on `organization.id` is not an access control.

![Milvago - Child organizations](/img/docs/en/administration-observabilite-03.png)
