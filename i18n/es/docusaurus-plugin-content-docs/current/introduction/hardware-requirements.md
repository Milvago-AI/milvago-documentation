---
sidebar_position: 2
title: Requisitos técnicos
---

# Requisitos técnicos

Esta página presenta los componentes y recursos que se deben prever para desplegar Milvago Community o Enterprise. El dimensionamiento depende del número de puestos activos, el volumen de eventos, los contenidos conservados y su período de retención.

## Plataforma de servidor

| Elemento | Requisito de despliegue |
| --- | --- |
| Host | Máquina física o virtual Linux x86-64, con un motor de contenedores Linux |
| Aplicación | Imagen de Milvago correspondiente a su edición; el servidor Go también sirve la consola web |
| Base de datos | PostgreSQL, con almacenamiento SSD persistente y copias de seguridad en un almacenamiento independiente |
| Identidad | Keycloak, con una base dedicada, una URL pública y un certificado TLS |
| Acceso | Nombres DNS y HTTPS para Milvago y el proveedor de identidad |
| Almacenamiento temporal | Directorio escribible para preparar instaladores y actualizaciones |

Los archivos de despliegue hacen referencia a **PostgreSQL 18.3** y **Keycloak 26.7.4**. Compruebe la compatibilidad de las versiones al actualizar estos componentes. Para un host ARM64, compruebe antes la disponibilidad de una imagen compatible con esta arquitectura.

Milvago no aloja ningún modelo de lenguaje: **no se necesita GPU ni acelerador de IA**. La consola está integrada en el servidor y no necesita un servicio Node.js en producción. Los sistemas destinatarios de las exportaciones Enterprise, como un recopilador OTLP o un SIEM, se dimensionan por separado.

## Dimensionar CPU y memoria

Dimensione conjuntamente **Milvago, PostgreSQL y Keycloak**, así como el sistema host y el motor de contenedores. Estos servicios pueden compartir una máquina o alojarse por separado.

| Componente | Factores que deben tenerse en cuenta |
| --- | --- |
| Milvago | Flujo de eventos, sincronizaciones simultáneas de puestos, consultas, informes y exportaciones activadas |
| PostgreSQL | Volumen conservado, índices, búsquedas, escrituras simultáneas, purgas y copias de seguridad |
| Keycloak | Inicios de sesión simultáneos, renovaciones de sesión e integraciones de identidad |

Defina la capacidad a partir de una carga representativa de su despliegue y conserve margen para los picos de actividad, reinicios y mantenimiento. Mida ráfagas repetidas con un historial representativo, que cubran la ingestión y la entrega de las exportaciones; siga la CPU, las esperas de PostgreSQL y los pools antes de modificar los recursos o las réplicas. El número de puestos por sí solo no basta: la frecuencia de uso y la conservación de contenidos influyen directamente en las necesidades.

La [guía de dimensionamiento de Keycloak](https://www.keycloak.org/high-availability/single-cluster/concepts-memory-and-cpu-sizing) completa esta evaluación para el servicio de identidad. Los recursos de compilación de imágenes y agentes se deben prever por separado de los recursos de explotación.

## Almacenamiento y retención

Prevea almacenamiento SSD persistente para PostgreSQL. Su volumen debe cubrir los datos de la aplicación, los índices, los registros de transacciones (WAL), los datos de identidad y el espacio necesario para el mantenimiento.

Para estimar el volumen de eventos, utilice la fórmula siguiente:

**Puestos activos × eventos por puesto y por día × días de retención × tamaño medio almacenado en base de datos de un evento.** El tamaño de un mensaje OTLP transmitido es distinto de esta fórmula; no representa ni el volumen almacenado ni el crecimiento de PostgreSQL.

Añada los contenidos conservados, inventarios, auditorías e índices si no están ya incluidos en ese tamaño medio. Los eventos y contenidos pueden tener períodos de retención diferentes. Prevea también espacio para las imágenes, los instaladores y los registros operativos.

Las copias de seguridad deben disponer de un almacenamiento distinto y de un procedimiento de restauración comprobado. Mantenga espacio libre para las migraciones y los picos de escritura; una purga de datos no reduce necesariamente de inmediato el tamaño del volumen PostgreSQL.

## Docker y Kubernetes

### Despliegue por contenedores

Para una instalación de producción, configure TLS, los nombres DNS, Keycloak en modo de producción, el relé SMTP, los secretos y los volúmenes persistentes. El archivo Compose proporcionado utiliza Keycloak en `start-dev` y un servidor de correo de prueba: adapte estos servicios antes de ponerlos en producción.

### Despliegue en Kubernetes

El manifiesto `deploy/kubernetes/milvago.yaml` proporciona la API, el mantenimiento y sus Services internos. PostgreSQL, Keycloak, el Ingress HTTPS, los secretos y los volúmenes persistentes deben aprovisionarse por separado. En Enterprise, `deploy/kubernetes/exports.yaml` proporciona las exportaciones y su HPA independiente. El [chart Helm](../installation/helm.md) todavía no está disponible.

Las cargas de trabajo tienen los siguientes valores iniciales:

| Parámetro | Valor del manifiesto |
| --- | --- |
| API: réplicas iniciales / HPA | 1 / 1 a 4 |
| API: CPU solicitada / límite | 100 mCPU / 500 mCPU |
| API: memoria solicitada / límite | 128 MiB / 384 MiB |
| Exportaciones Enterprise: HPA | 1 a 4, independiente |
| Mantenimiento | 1 réplica estable |

Estos parámetros se refieren a las cargas de trabajo de Milvago. Ajuste los recursos a su carga; no constituyen el dimensionamiento completo de la plataforma. Reserve también la capacidad necesaria para los servicios Kubernetes, otras cargas de trabajo y los reinicios. Los [requests y limits](https://kubernetes.io/docs/concepts/configuration/manage-resources-containers/) determinan la ubicación y el encuadre de los recursos de los contenedores.

Para preparar el despliegue:

- Utilice [volúmenes persistentes](https://kubernetes.io/docs/concepts/storage/persistent-volumes/) y copias de seguridad para las bases de datos de Milvago y Keycloak.
- Configure las URL públicas, los certificados TLS y los secretos estables de cifrado y firma.
- El manifiesto ya proporciona un volumen temporal escribible `emptyDir` de 128 MiB en `/tmp`. Conserve este límite o ajústelo de forma consciente si personaliza la carga de trabajo.
- Conserve las sondas de inicio, disponibilidad y vida, y supervise los reinicios, la memoria y la limitación de CPU.

Las cuotas se comparten y se controlan en PostgreSQL: el HPA de la API puede funcionar de 1 a 4 réplicas, mientras que el HPA de las exportaciones Enterprise es independiente y el mantenimiento se mantiene en una réplica estable. Añadir réplicas no compensa una base saturada y aumenta las conexiones y el trabajo SQL. Consulte [Dimensionar PostgreSQL y el autoscaling](../avance/dimensionnement-postgresql-hpa.md).

## Puestos equipados con el agente

Los paquetes de instalación están destinados a **Windows x64** y **Linux x86_64**. La matriz de navegadores y los modos de servicio Windows/Linux se detallan en [Arquitectura técnica](architecture.md).

Prevea espacio para los binarios, el estado local, los registros y la coexistencia de la versión antigua y la nueva durante una actualización. Las necesidades de memoria del puesto también incluyen el navegador y su extensión. En Enterprise, tenga en cuenta los servicios de recopilación y filtrado activados.

La cola principal sin conexión tiene por defecto un límite de **10 000 eventos y 8 MiB serializados**. Reúne eventos heredados y de Shadow AI; este límite no se aplica a toda la memoria ni a todo el almacenamiento del agente. La caché de respaldo SYSTEM del navegador sigue siendo distinta, con sus propios límites de 1000 eventos o lotes de estado y 8 MiB. Los cuatro umbrales `queue.max_events`, `queue.max_size_mb`, `logging.max_file_mb` y `logging.retained_files` se pueden ajustar en `milvago.toml`; los registros utilizan por defecto un archivo actual y cinco archivos archivados, con rotación a 10 MiB. Consulte la [configuración del agente](../avance/agent-configuration.md).

## Red y preparación de la explotación

Los puestos deben poder acceder a la URL HTTPS de Milvago. Los navegadores utilizados para la consola también deben poder acceder al proveedor de identidad. Prevea la resolución DNS y la sincronización horaria; mantenga PostgreSQL en una red privada. Las conexiones y los puertos se detallan en [Arquitectura técnica](architecture.md).

Dimensione el ancho de banda para la subida de eventos, las exportaciones y las descargas de actualizaciones. Escalone los despliegues en grandes flotas para limitar los picos de transferencia.

Antes de poner en producción, compruebe los tiempos de respuesta, el crecimiento del almacenamiento, las operaciones de purga, la restauración de las copias de seguridad y la recuperación tras una interrupción. Utilice estos resultados para ajustar los recursos y los umbrales de supervisión de su entorno.
