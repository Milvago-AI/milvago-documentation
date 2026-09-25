---
sidebar_position: 4
title: Despliegue Kubernetes
---

# Despliegue Kubernetes

Los manifiestos incluidos separan la API, el mantenimiento y, en Enterprise, las exportaciones. Adáptelos a su entorno; todavía no constituyen un chart Helm.

## Preparar la plataforma

Prevea un namespace dedicado, una imagen identificada por su digest, servicios PostgreSQL y Keycloak accesibles y una entrada HTTPS mediante Ingress o Gateway API. Aprovisione por separado el almacenamiento persistente y las copias de seguridad de las bases. Para una operación tolerante a fallos, PostgreSQL debe contar con una replicación adaptada a su objetivo de disponibilidad, copias físicas con [archivado continuo de WAL y restauración a un momento dado](https://www.postgresql.org/docs/current/continuous-archiving.html) que se practique regularmente. Una cola de mensajes no sustituye estas protecciones después de que se haya reconocido un evento.

Cree los secretos Kubernetes fuera de los manifiestos versionados. La cuenta de migración posee los permisos necesarios sobre el esquema; las cuentas de ejecución no son propietarias ni tienen `BYPASSRLS`. Limite cada secreto al rol que lo utiliza y prevea su rotación.

El clúster debe aplicar las NetworkPolicy (Calico, Cilium o el equivalente de su proveedor); sin ello, las políticas se aceptan pero no tienen efecto. `networkpolicy.yaml` solo permite en salida de los pods de Milvago el DNS, PostgreSQL (5432), Keycloak (8080 u 8443) y, para la API y las exportaciones, el OpenTelemetry Collector (4318 o 443): un pod comprometido no puede abrir una conexión hacia Internet ni exfiltrar datos. Adapte los selectores a las etiquetas de sus despliegues de PostgreSQL, Keycloak y Collector, o sustitúyalos por la dirección de un servicio situado fuera del clúster. Haga que `OIDC_INTERNAL_URL` apunte al Service interno de Keycloak: una URL pública pasa por el balanceador de carga, que estas reglas rechazan. Si importa el catálogo firmado desde el servicio editor, active la regla comentada indicando su dirección.

El HPA de la API necesita Metrics Server. El HPA de exportaciones Enterprise necesita además Prometheus y un adaptador que publique la métrica externa de exportación. `servicemonitor.yaml` utiliza la CRD de Prometheus Operator; si utiliza otra recopilación, configure un scrape equivalente con el token de observabilidad. Mantenga `/metrics` en la red privada, fuera del Ingress público.

Si un OpenTelemetry Collector retransmite las exportaciones a Loki, Grafana Cloud o un SIEM, monte su cola persistente en un volumen cifrado que sobreviva al reemplazo del pod. El volumen y su replicación pertenecen al despliegue del Collector, no a los pods de Milvago. Una cola llena debe rechazar nuevas entradas para que Milvago conserve los eventos en PostgreSQL y los reintente.

## Roles y orden de arranque

| Archivo en `deploy/kubernetes/` | Función |
| --- | --- |
| `networkpolicy.yaml` | Restricción de los flujos de salida de los pods de Milvago: solo DNS, PostgreSQL, Keycloak y Collector |
| `migrate.yaml` | Job de migración del esquema e inicialización |
| `milvago.yaml` | API con HPA, una réplica de mantenimiento en régimen estable y Services internos |
| `exports.yaml` | Enterprise: exportaciones y su HPA independiente |
| `servicemonitor.yaml` | Recopilación Prometheus autenticada, si Prometheus Operator está instalado |
| `prometheus-adapter.example.yaml` | Fragmento para integrar en la configuración del adaptador, no un recurso que se aplique directamente |

1. Adapte el namespace, los digests de las imágenes, los secretos por rol y las conexiones PostgreSQL. Instale los componentes de métricas necesarios para el HPA elegido.
2. Adapte y aplique `networkpolicy.yaml` antes del primer pod de Milvago.
3. Aplique `migrate.yaml` y espere a que el Job `milvago-migrate` termine correctamente. Un fallo debe interrumpir el despliegue; la readiness no sustituye este paso.
4. Aplique `milvago.yaml` para los roles `api` y `maintenance`. En Enterprise, aplique también `exports.yaml`.
5. Configure la recopilación autenticada y, para las exportaciones, la regla del adaptador. Compruebe los pods Ready y las métricas HPA antes de confiarles el ajuste de capacidad.
6. En cada versión, vuelva a crear el Job terminado con el nuevo digest y espere su éxito antes de actualizar las cargas de trabajo. Con GitOps, represente esta dependencia mediante los mecanismos de ordenación de su herramienta.

El rol implícito `all` conserva el funcionamiento combinado de Compose o de una instalación de un solo proceso. Las réplicas Kubernetes utilizan roles dedicados: los pods API no ejecutan migraciones ni inicialización persistente; los pods de exportación no sirven la consola.

## Comprender el escalado

La API y las exportaciones Enterprise escalan de forma independiente entre 1 y 4 pods en los manifiestos incluidos. La API sigue el uso de CPU respecto a su solicitud de recursos; las exportaciones siguen el trabajo ejecutable observado en PostgreSQL. El Job de migración y el mantenimiento no tienen HPA.

El escalado necesita tiempo para medir la señal, crear pods y hacerlos disponibles. Un pico breve puede terminar antes de que los pods adicionales resulten útiles. La reducción es deliberadamente gradual. Los objetivos, los tiempos, el presupuesto de conexiones y las recomendaciones de ajuste se detallan en [Dimensionar PostgreSQL y el autoscaling](../avance/dimensionnement-postgresql-hpa.md).

Añadir pods no sustituye la capacidad de PostgreSQL ni aumenta las cuotas compartidas de admisión. Compruebe los recursos de la base y la suma de los pools antes de aumentar los límites de réplicas.

## Operar el despliegue

Conserve las sondas `/healthz` y `/readyz`, la sonda de arranque y el período de gracia de terminación de 120 segundos. La readiness verifica el acceso a PostgreSQL. Los manifiestos montan un volumen temporal `emptyDir` de 128 MiB en `/tmp` para operaciones que necesitan escribir con una raíz de solo lectura.

Compruebe el estado con `kubectl -n <namespace> get hpa,pods` y `kubectl -n <namespace> describe hpa milvago-api`; en Enterprise, examine también `milvago-exports`. Una métrica desconocida requiere comprobar la recopilación y su adaptador; no demuestra que no haya carga.

Supervise por separado los recursos de los nodos, los pods y las métricas de la aplicación. Añada alertas sobre la indisponibilidad de PostgreSQL, el retraso del archivado WAL, fallos de copias de seguridad y restauraciones de prueba, así como sobre el tamaño, la capacidad y los fallos de enqueue del Collector. Emita una advertencia antes de que su cola alcance el 70 % de capacidad y una alerta inmediata ante cualquier rechazo de enqueue. Una herramienta GitOps observa el estado Kubernetes; no sustituye las sondas ni la verificación de la ingestión y entrega a los destinos. Consulte [Observabilidad](../administration/observabilite.md) para las exportaciones Enterprise.
