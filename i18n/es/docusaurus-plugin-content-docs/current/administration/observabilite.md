---
sidebar_position: 8
title: Observabilidad
tags: [Enterprise]
---

# Observabilidad

## Acceder a la pantalla

Haga clic en **Administración** > **Observabilidad**. Esta página Enterprise exige `observability.manage`.

1. Active un destino e introduzca la URL y **Authorization** si es necesario.
2. Elija los flujos y guarde la configuración.
3. Pruebe la configuración guardada.

Administración → Observabilidad configura, por organización, el envío de métricas y registros a sus herramientas de análisis.

:::enterprise
Esta página se aplica solo a Milvago Enterprise.
:::

[IMAGEAMETTREICI 01]

## Exportación OTLP y panel de Grafana

**Descargar el panel** proporciona un archivo para importar en Grafana; allí también deben configurarse las fuentes de datos.

**Exportación OTLP para Grafana** configura la URL base de un colector compatible con OTLP/HTTP JSON. Milvago le envía los datos y el colector los reenvía a los servicios utilizados por Grafana.

### Registros en Loki, métricas en el panel

Para explorar los registros en Grafana, configure el colector que recibe los datos de Milvago para reenviar su flujo de registros al [endpoint OTLP nativo de Loki](https://grafana.com/docs/loki/latest/send-data/otel/otel-collector-getting-started/). Después, añada la [fuente de datos Loki integrada en Grafana](https://grafana.com/docs/grafana/latest/datasources/loki/). Milvago no proporciona una exportación Loki independiente ni un plugin de Grafana.

El **panel descargable** utiliza una fuente de datos **Prometheus**. Configure por separado la salida de métricas del colector hacia un sistema compatible con Prometheus y seleccione esa fuente al importar el panel. Conectar solo Loki no alimenta sus gráficos.

## Destino SIEM personalizado

La segunda tarjeta es una ranura OTLP personalizada denominada «SIEM». No implementa ninguna API específica de un fabricante de SIEM ni syslog. Necesita un receptor OTLP/HTTP JSON compatible, como un colector configurado para transformar y reenviar los datos al SIEM elegido. El protocolo final, las credenciales y el esquema dependen de esa configuración externa.

Si su SIEM exige Syslog sobre TLS o una API específica, configure la conversión y la autenticación correspondiente en el colector. El campo **Authorization** de Milvago solo autentica su envío al receptor OTLP indicado.

Cuando se activa, este destino también recibe **auditorías sensibles de privacidad** mediante una cola específica, incluso si el flujo **Registro de auditoría** está desactivado. El estado de la cola aparece al final de la página.

## Protocolo y autenticación

Milvago envía solicitudes HTTP POST con `Content-Type: application/json` a la URL base seguida de `/v1/metrics` o `/v1/logs`. Se trata de **OTLP/HTTP JSON**, no de OTLP/gRPC ni de OTLP/HTTP Protobuf binario. Si el receptor exige la cabecera `Authorization`, introduzca su valor completo como `Bearer …` o `Basic …`. El secreto se sella en el servidor y la API nunca lo devuelve. Cambiar la URL del receptor borra el secreto guardado.

Para una **conexión directa al punto de ingesta OTLP de Grafana Cloud**, Grafana exige `Basic` con el ID de instancia **OTLP** como usuario y un token de política de acceso como contraseña, codificados en Base64. Un token Bearer de la API de gestión Grafana corresponde a otra API. [Grafana Cloud indica](https://grafana.com/docs/grafana-cloud/observe-and-act/send-data/otlp/otlp-format-considerations/) que la ingesta JSON conviene sobre todo para pruebas o poco tráfico; para producción, configure un colector que acepte el JSON de Milvago y exporte a Grafana Cloud con el formato y la autenticación adecuados.

Las URL de exportación usan HTTPS, salvo un host HTTP autorizado expresamente por el operador; los destinos de red prohibidos se comprueban al guardar y conectar. **Probar la configuración guardada** envía únicamente datos sintéticos de los flujos seleccionados. La aceptación por el receptor no prueba la llegada a Grafana o al SIEM.

[IMAGEAMETTREICI 02]

## Recuperación tras una caída del destino

Milvago conserva en PostgreSQL los eventos que el receptor OTLP no ha aceptado. Tras un error temporal o una interrupción, reintenta automáticamente el mismo trabajo; una interrupción alrededor del acuse puede por tanto producir un duplicado en el destino.

Si la URL configurada apunta a un OpenTelemetry Collector que luego retransmite los datos, active una [cola persistente](https://github.com/open-telemetry/opentelemetry-collector/blob/main/exporter/exporterhelper/README.md#persistent-queue) para sus exportadores y colóquela en un volumen cifrado que sobreviva a su reinicio. Una respuesta positiva del Collector transfiere la custodia al Collector; aun así no demuestra que el backend final haya aceptado los datos. El Collector debe rechazar la entrada cuando su cola esté llena para que Milvago conserve los eventos y los reintente desde PostgreSQL.

Supervise el tamaño y la capacidad de la cola, los fallos de enqueue, los fallos de envío y el espacio libre del volumen. Defina su capacidad a partir del rendimiento real y de la duración de caída que quiera absorber, y alerte antes del 70 %. Configure también en los sistemas externos la retención, las eliminaciones, las copias de seguridad y los controles de acceso aplicables después de esta transferencia de custodia.

## Datos y estado de entrega

- **Métricas**: indicadores de actividad de 24 horas, estado del parque e inventario local; describen el estado actual y se envían periódicamente.
- **Eventos Shadow AI**: metadatos de uso seleccionados por el filtro del destino, desde la activación. El filtro no afecta a las métricas ni a las auditorías.
- **Registro de auditoría**: acciones administrativas e identificadores técnicos. Las auditorías sensibles de privacidad utilizan además la cola específica del SIEM.

La exportación OTLP no lee prompts, respuestas, contenido de conversaciones, URL, nombres de dispositivos ni direcciones de correo. Los identificadores técnicos también deben protegerse en el destino. `GET /api/shadow/metrics` es una API de consulta separada, protegida por sesión y permiso; no es la URL de ingesta OTLP.

**Estado de la entrega** muestra intentos, aceptaciones, errores, registros rechazados y el siguiente intento. Una respuesta OTLP parcial cuenta los rechazos y no reenvía el lote; los lotes posteriores continúan. En el despliegue Kubernetes dedicado a las exportaciones, los registros pendientes se envían automáticamente en lotes limitados por número de eventos y tamaño, sin esperar a que se llenen; los lotes restantes continúan sin espera intencionada tras un éxito. Las métricas siguen una cadencia independiente. Los errores temporales, incluidos `429` y `503`, se reintentan automáticamente respetando `Retry-After` cuando el destino lo proporciona. Un error permanente, incluidas credenciales inválidas, requiere corregir la configuración.

## Exportaciones y escalado de Kubernetes

En un despliegue Kubernetes Enterprise, las exportaciones se ejecutan en pods dedicados. Para reducir el retraso de exportación con mucha carga, este despliegue procesa los lotes de forma continua. PostgreSQL coordina las entregas: aumentar el número de pods no permite dos entregas de la misma partición al mismo tiempo.

La métrica `milvago_export_runnable_partitions` es el recuento global de particiones ejecutables. Sirve al HPA del Deployment de exportaciones y no contiene identificador de organización ni datos de conversación. Está ausente cuando su observación completa tiene más de 45 segundos; la ausencia no es un recuento cero. El operador debe comprobar el camino de Prometheus y el adaptador de métricas antes de interpretar el estado del HPA.

Para instalar la cadena de métricas y ajustar las réplicas, consulte [Despliegue Kubernetes](../installation/helm.md) y [Dimensionar PostgreSQL y el autoscaling](../avance/dimensionnement-postgresql-hpa.md).

## Organizaciones hijas

Una organización hija hereda por defecto ambos destinos y sus filtros. Puede personalizar toda la configuración sin copiar los secretos de la madre o desactivar ambas exportaciones. **Imponer esta configuración a las organizaciones hijas** aplica la configuración del antepasado a sus descendientes; las configuraciones locales guardadas quedan inactivas hasta retirar el bloqueo. Cada organización exporta solo sus propios datos, identificados por `organization.id`. Para un destino heredado, la hija ve el host de la dirección de exportación, nunca su ruta ni sus parámetros, que pueden contener un secreto del antepasado.

El acceso a los datos en el colector, Loki, Prometheus y Grafana debe aislarse mediante los controles de esos sistemas. Un filtro de panel sobre `organization.id` no es un control de acceso.

[IMAGEAMETTREICI 03]
