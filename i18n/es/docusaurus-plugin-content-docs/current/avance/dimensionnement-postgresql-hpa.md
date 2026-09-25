---
sidebar_position: 6
title: Dimensionar PostgreSQL y el autoscaling
---

# Dimensionar PostgreSQL y el autoscaling

El HPA adapta el número de pods a la carga observada. PostgreSQL, los nodos Kubernetes y los destinatarios de exportación deben disponer de la capacidad correspondiente. Esta página explica los valores de los manifiestos proporcionados y el método para adaptarlos a su tráfico; estos valores no constituyen un mínimo de hardware ni una garantía de rendimiento.

## Separar los roles

| Rol | Réplicas en los manifiestos | Señal de escalado |
| --- | --- | --- |
| API | 1 al inicio, HPA de 1 a 4 | Uso medio de CPU |
| Exportaciones Enterprise | 1 al inicio, HPA independiente de 1 a 4 | Particiones de exportación ejecutables observadas en PostgreSQL |
| Mantenimiento | 1 en régimen estable | Sin HPA; tareas periódicas y observación global de las exportaciones |
| Migración | Job antes de las cargas de trabajo | Esperar a que termine correctamente antes de iniciar la versión correspondiente |

Los roles dedicados evitan ejecutar las migraciones y el mantenimiento en cada pod de API. Compose conserva el rol combinado `all`. El procedimiento, los secretos por rol y el orden de inicio se describen en [Despliegue Kubernetes](../installation/helm.md).

## Comprender las dos señales HPA

### API: CPU con respecto a la solicitud de recursos

El manifiesto solicita `100m` de CPU por pod de API y fija el objetivo HPA en el **60 % de esta solicitud**, es decir, un promedio objetivo de `60m`. Este porcentaje no se refiere ni a la CPU del nodo ni al límite de `500m`. Por tanto, modificar la solicitud de CPU también modifica el nivel de consumo que desencadena el ajuste.

Metrics Server debe proporcionar la medida de CPU. Un límite de CPU puede provocar throttling; una espera de PostgreSQL o de red puede, por el contrario, prolongar las respuestas sin un elevado consumo de CPU de la API. El HPA de CPU no corrige todas las causas de latencia.

### Exportaciones Enterprise: trabajo ejecutable

:::enterprise
El rol de exportación y su HPA corresponden a Milvago Enterprise.
:::

El rol de mantenimiento calcula `milvago_export_runnable_partitions` desde PostgreSQL y la expone en `/metrics`. Cuenta las particiones que pueden trabajar ahora, principalmente los pares organización/destino; la auditoría de privacidad dispone de una partición dedicada. Una entrega de métricas vencida también puede hacer que una partición sea ejecutable. Esta señal no cuenta los eventos ni procede de la cola local de un worker.

El objetivo externo `AverageValue: 4` busca **cuatro particiones por pod**. Varias particiones pueden procesarse en paralelo; multiplicar los pods no acelera una partición única, cuyo bloqueo PostgreSQL impide el procesamiento simultáneo. Las particiones desactivadas o a la espera de reanudación no representan trabajo inmediatamente ejecutable.

La señal es global. El ejemplo de adaptador toma el **máximo de las observaciones recientes**, no su suma, para evitar contar varias veces copias del mismo total. Una observación ausente, incompleta o caducada nunca se convierte en cero: solo puede exponerse la última lectura completa, durante un máximo de **45 segundos**.

### Aumento, inicio y vuelta al mínimo

Los dos HPA autorizan un aumento de como máximo **dos pods por período de 30 segundos**, sin ventana de estabilización durante el aumento. Al reducir, la recomendación más alta de los últimos **300 segundos** estabiliza la decisión; después, la reducción queda limitada a **un pod por minuto**.

Estos ajustes encuadran el ajuste, sin garantizar un plazo exacto. La recopilación de métricas, la planificación, la descarga de la imagen y las sondas requieren tiempo. Un pico breve puede terminar antes de que los nuevos pods sean útiles. Si su objetivo exige capacidad disponible desde el inicio, evalúe el mínimo de réplicas con los recursos y conexiones correspondientes. Consulte el [funcionamiento del HPA de Kubernetes](https://kubernetes.io/docs/concepts/workloads/autoscaling/horizontal-pod-autoscale/).

## Instalar y supervisar las métricas

Para la API, instale Metrics Server. Para las exportaciones, añada Prometheus y un adaptador de métricas externas. El `ServiceMonitor` proporcionado presupone Prometheus Operator; es posible una recopilación equivalente sin esta CRD. Conserve las etiquetas `namespace` y `pod`, el token de observabilidad en un secreto y `/metrics` en la red privada.

`prometheus-adapter.example.yaml` es un fragmento que debe integrarse en la configuración del adaptador, no un recurso Kubernetes que se aplique directamente. Su filtro de frescura utiliza `milvago_export_snapshot_timestamp_seconds` para descartar observaciones de 45 segundos o más, incluso si Prometheus conserva una muestra antigua. Compruebe las métricas y las condiciones de los HPA antes de confiar en su ajuste de capacidad.

## Prever las conexiones PostgreSQL

Los tamaños de pool propuestos en los secretos de despliegue son de **10 conexiones por API**, **4 por pod de exportación** y **4 para el mantenimiento**. Son configurables: calcule el presupuesto a partir de sus valores efectivos.

**Presupuesto estable = réplicas API × pool API + réplicas de exportación × pool de exportación + réplicas de mantenimiento × pool de mantenimiento.**

Con ambos HPA en su máximo propuesto, esto da **4 × 10 + 4 × 4 + 1 × 4 = 60 conexiones**. Es un límite acumulado de los pools de aplicación en régimen estable, no un valor suficiente para `max_connections`.

Añada los pods adicionales de las actualizaciones (`maxSurge`), los pods antiguos aún terminando durante el período de gracia de **120 segundos**, el Job de migración, la administración y la supervisión. El mantenimiento también puede tener dos pods durante una transición. Si Keycloak u otros servicios comparten la misma instancia PostgreSQL, incluya sus conexiones y las reservas de esta instancia.

Aumentar los pools o `max_connections` no crea CPU ni rendimiento de disco. Puede aumentar la competencia y las esperas. Prevea un margen de conexiones y memoria, y compruebe su uso real; consulte los [parámetros de conexión de PostgreSQL](https://www.postgresql.org/docs/current/runtime-config-connection.html).

## Preservar la capacidad y la durabilidad

Las cuotas de admisión de la API se comparten en PostgreSQL: añadir pods no multiplica el presupuesto autorizado. Los lotes de exportación están limitados por el número de eventos y el tamaño JSON; un lote parte sin esperar a estar lleno. Por tanto, los volúmenes pequeños no esperan un umbral de eventos.

El registro de entrega se valida después de la confirmación remota. Una interrupción entre esta confirmación y el commit puede provocar una retransmisión: la idempotencia del registro local no garantiza una recepción de red exactamente una vez. Consulte [Observabilidad](../administration/observabilite.md) para las reglas de entrega.

Dimensione la CPU, la memoria y el almacenamiento de PostgreSQL con el historial conservado, los índices, el WAL, las purgas y las copias de seguridad. Mantenga actualizados el autovacuum y las estadísticas; examine los planes de las consultas costosas y las esperas antes de modificar los recursos. Consulte el [mantenimiento de PostgreSQL](https://www.postgresql.org/docs/current/routine-vacuuming.html).

Conserve `fsync` y una política `synchronous_commit` compatible con la durabilidad esperada. Desactivarlos para mejorar una medición cambia las garantías de conservación; no es una optimización equivalente. La [documentación del WAL](https://www.postgresql.org/docs/current/runtime-config-wal.html) detalla estas compensaciones. Los tamaños y las retenciones deben estimarse a partir de los datos almacenados, según los [requisitos técnicos](../introduction/hardware-requirements.md).

### Distinguir las tres fallas

- **PostgreSQL temporalmente no disponible**: la API responde `503`. El agente conserva los eventos en su almacén cifrado y los reproduce con los mismos identificadores. La autorización, la revocación y las cuotas nunca pasan a un modo permisivo.
- **Pérdida del almacenamiento PostgreSQL**: los eventos ya reconocidos dependen de la replicación, de las copias físicas y del [archivado WAL con restauración a un momento dado](https://www.postgresql.org/docs/current/continuous-archiving.html). Prepare esta restauración y mida en la práctica su RPO y su RTO.
- **Destino OTLP no disponible**: Milvago conserva los eventos que el receptor no ha reconocido y los reintenta. Si un Collector acepta y luego retransmite los lotes, su propia cola persistente pasa a ser responsable de su custodia.

La retención configurada y las eliminaciones voluntarias siguen teniendo prioridad: una indisponibilidad prolongada no debe prolongar implícitamente la conservación. La entrega después de la recuperación puede repetirse; los destinos deben aceptar una semántica de al menos una vez.

### Dimensionar las colas de recuperación

Primero fije la duración de caída que quiere absorber. Para cada cola, estime `máximo rendimiento observado × tamaño alto de un evento × duración` y añada después el margen necesario para lotes, índices, escrituras temporales y variaciones de tráfico. Verifique el resultado en el volumen real: una capacidad expresada en lotes no garantiza ninguna duración sin estas mediciones.

Supervise la cola local de los agentes, la antigüedad de la exportación Milvago pendiente más antigua y, para el Collector, `otelcol_exporter_queue_size`, `otelcol_exporter_queue_capacity`, los fallos de enqueue y los fallos de envío. Alerte antes del 70 % de capacidad. Una cola que crece continuamente indica un destino más lento que la entrada; añadir pods puede entonces aumentar la presión sin resolver la causa.

Pruebe por separado la recuperación de PostgreSQL, la recuperación de un Collector tras reiniciarse y una restauración PITR en una base de datos desechable. Concilie los identificadores reconocidos, almacenados y entregados; que las sondas vuelvan a estar sanas no demuestra por sí solo la conservación de los eventos.

## Diagnosticar antes de ajustar

| Observación | Comprobación útil |
| --- | --- |
| Respuestas API `429` | Identificar la cuota alcanzada y respetar la reanudación indicada; aumentar el HPA no eleva las cuotas. |
| Respuestas API `503` | Examinar el código de error, los registros, la admisión, los pools y la disponibilidad de PostgreSQL. |
| Cola del Collector cerca de su capacidad | Comprobar el rendimiento del destino, el espacio persistente y los fallos de enqueue; no aumentar la cola a ciegas. |
| Archivado WAL retrasado o fallido | Restablecer el archivo y comprobar la cadena de restauración antes de considerar protegidos los eventos reconocidos. |
| CPU de API limitada, pods listos | Examinar el throttling y la capacidad de los nodos antes de modificar requests, limits o réplicas. |
| PostgreSQL saturado o esperas de pool | Distinguir CPU, entradas/salidas, bloqueos y planes SQL; más pods pueden agravar la contención. |
| Backlog con PostgreSQL disponible | Comprobar el número de particiones ejecutables y las respuestas del destinatario; sus `429`, `503` o plazos de reanudación también limitan el rendimiento. |
| Métrica HPA desconocida o caducada | Controlar mantenimiento, scrape autenticado, etiquetas, adaptador y frescura; no sustituir la ausencia por cero. |
| Pods adicionales Pending o no Ready | Controlar los recursos del clúster, los eventos Kubernetes, la imagen y las sondas. |
| Réplicas aún presentes después de un pico | Observar la ventana deslizante de 300 segundos y la reducción progresiva antes de concluir que hay un defecto. |

## Ajustar con una carga representativa

1. Fije sus objetivos de tiempo de respuesta de API y de plazo de entrega completo, así como el tráfico, los destinos y la retención previstos.
2. Reproduzca picos repetidos con un historial representativo. Mida por separado el final de la ingestión, la recepción en el destinatario y la validación del registro; compruebe los eventos faltantes, las reanudaciones y los duplicados.
3. Registre las réplicas realmente Ready, la CPU/throttling, la memoria, las conexiones, las esperas de PostgreSQL, los pools y el tiempo de red. Compruebe que los pods añadidos realizan trabajo.
4. Modifique una sola variable justificada por estas mediciones, y compárela con una carga y un historial idénticos. No oculte una saturación alargando simplemente los tiempos de espera.
5. Controle la vuelta natural al mínimo, una actualización con sustitución de pods y la reanudación tras una indisponibilidad antes de conservar sus ajustes.
