---
sidebar_position: 3
title: Arquitectura técnica
---

# Arquitectura técnica

import ArchitectureDiagram from '@site/src/components/ArchitectureDiagram';

Milvago se compone de cuatro partes, conectadas por canales acotados y firmados: la **extensión de navegador**, el **agente local**, el **servidor** y la **consola**.

<ArchitectureDiagram />

## Flujos y puertos

Las flechas del diagrama indican **quién abre la conexión**. Las respuestas usan el mismo canal. El agente contacta al servidor; el servidor no se conecta a los puestos. El tráfico del navegador hacia un sitio de IA no transita por el servidor Milvago.

### Red de la plataforma

| Iniciador → destino | Protocolo y puerto | Uso y configuración |
| --- | --- | --- |
| Agente → entrada de la instancia | HTTPS, generalmente TCP **443** | Políticas firmadas, eventos, heartbeat, catálogo y actualizaciones. El puerto procede de la URL de aprovisionamiento. |
| Navegador de la consola → entrada de la instancia | HTTPS, generalmente TCP **443** | Consola React y API en el mismo origen; sin servidor Node.js independiente. |
| Proxy inverso / Ingress / Gateway API → servidor Go | HTTP, TCP **4020** de forma predeterminada | Escucha en `LISTEN_ADDR=:4020`. La terminación TLS se debe configurar aguas arriba; el binario llama a `ListenAndServe`, no a un servidor TLS integrado. |
| Servidor Go → PostgreSQL | PostgreSQL, TCP **5432** en Compose | Conexiones `DATABASE_URL` y `MIGRATION_DATABASE_URL`, en red privada. |
| Navegador de la consola → Keycloak | HTTPS, generalmente TCP **443** en producción | Inicio de sesión, MFA y redirecciones OIDC mediante la URL pública del emisor. El acceso de solo servidor a Keycloak no es suficiente. |
| Servidor Go → Keycloak | HTTP **8080** en Compose; de otro modo, el puerto de la URL elegida | Descubrimiento OIDC, claves públicas, intercambio de código y administración de identidad. `OIDC_INTERNAL_URL` puede enrutar estas llamadas por la red privada conservando el emisor público. |
| Keycloak → PostgreSQL | PostgreSQL, TCP **5432** en Compose | Base de identidad dedicada, distinta de las bases de datos de la aplicación. |
| Cliente API / cliente MCP → instancia | HTTPS, puerto de la URL pública | API REST; MCP Enterprise en `/mcp`, sin puerto de escucha adicional. |
| Servidor → colector OTLP externo | OTLP/HTTP JSON, puerto de la URL configurada | Enterprise: `/v1/logs` y `/v1/metrics`. **4318** es el puerto del colector de ejemplo, no una escucha Milvago ni un puerto obligatorio. HTTP interno requiere la autorización `MILVAGO_OTEL_HTTP_HOSTS`. |
| Herramienta de supervisión → servidor | HTTP(S), mismo puerto que la instancia | `/metrics` cuando hay un token de supervisión configurado; las sondas `/health/live` y `/health` también usan el puerto de la aplicación. |

Los manifiestos Kubernetes separan la API, el mantenimiento y las exportaciones Enterprise. La API y las exportaciones tienen HPA independientes; el **Service ClusterIP 4020 → 4020** de la API sigue siendo interno. Aprovisione por separado la entrada HTTPS mediante Ingress o Gateway API, los certificados, PostgreSQL y Keycloak. No publique los puertos privados anteriores en Internet. Consulte [Despliegue Kubernetes](../installation/helm.md) y [Dimensionar PostgreSQL y el autoscaling](../avance/dimensionnement-postgresql-hpa.md).

### Comunicaciones locales en el puesto

| Iniciador → destino | Transporte / puerto local | Función |
| --- | --- | --- |
| Extensión → relé Native Messaging | Entrada/salida estándar enmarcada; **sin puerto TCP** | Intercambios entre la extensión y el binario lanzado por el navegador. |
| Relé → servicio del agente | Windows: named pipe `milvago-browser` o `milvago-commercial`; Linux: `/run/milvago/browser.sock` o `commercial.sock` | Política, decisiones y eventos mediante IPC; no hay ninguna apertura de red que prever. |
| Navegadores basados en Chromium → agente | HTTP **127.0.0.1:17641** (Community), **:17642** (Enterprise) | CRX y manifiesto `/ext/update.xml`, desde el paquete incorporado. |
| Firefox → agente | HTTPS **127.0.0.1:17651** (Community), **:17652** (Enterprise) | XPI firmado y `/ext/updates.json`; certificado local gestionado por la instalación. |
| Navegador → sitio de IA | HTTPS, generalmente TCP **443** | Tráfico directo al proveedor, controlado por la extensión en los sitios cubiertos. |
| Agente Enterprise → colector nativo | IPC local, sin TCP | El agente solicita las observaciones y después confirma su persistencia. El colector no envía directamente al servidor. |
| Herramientas nativas → colector nativo Enterprise | OTLP/HTTP protobuf en **127.0.0.1**, puerto asignado en el primer inicio y después conservado | `/v1/logs`, autenticación y atribución al proceso que llama; este puerto no está fijado a 4318. |
| Clientes nativos cubiertos → filtro Enterprise | Proxy TLS en **127.0.0.1:47831–47834** | Respectivamente Codex, Claude Code, Claude Desktop, Claude Desktop Agent; conexiones salientes del filtro hacia los proveedores en **443**. Solo para los clientes configurados. |
| Detección Enterprise → servicios de modelos locales | Sondas loopback **11434, 1234, 1337, 4891** | Puertos de destino autorizados para el inventario local; no son servidores abiertos por Milvago. |

Las escuchas loopback solo permanecen accesibles en el puesto. No justifican ninguna regla entrante desde la LAN. La presencia de un puerto en la tabla no significa que su funcionalidad opcional esté activa.

### Puertos del Compose de desarrollo

Todas las publicaciones están vinculadas a `127.0.0.1`: **4020 → 4020** para Community, **4120 → 4020** para Enterprise, **4080 → 8080** para Keycloak, **55432 → 5432** para PostgreSQL y **4081 → 8025** para la interfaz del servidor de correo de prueba. Estos valores son los predeterminados de Compose y sus variables pueden sustituirlos. No constituyen un plan de puertos de producción.

## La extensión de navegador

Un service worker en Chrome, Edge, Brave, Vivaldi y Arc, y scripts de segundo plano en Firefox, aplican la política en los sitios de IA cubiertos. La extensión está controlada por un **catálogo de detección firmado** — un motor y datos: rutas medidas de los sitios (rutas de prompt, rutas de carga de archivos), selectores DOM del compositor, rutas de los campos. No aplica ninguna heurística fuera de esas rutas medidas, y la cobertura depende de la edición servida.

Sin una política válida (agente detenido, revocación), **falla cerrándose**: la superficie de IA cubierta queda sellada, nunca abierta por defecto. La política firmada se persiste localmente y se relee mediante el componente de segundo plano, con revisión y expiración verificadas en cada lectura.

## Navegadores compatibles

El alcance del producto incluye seis navegadores: Google Chrome, Microsoft Edge, Brave, Vivaldi, Mozilla Firefox y Arc. Chromium independiente no forma parte de él, aunque todavía aparezca en scripts históricos. No se declara ningún agente para macOS, Safari o dispositivos móviles.

| Navegador | Familia | Windows | Linux |
| --- | --- | --- | --- |
| Google Chrome | Chromium | Política MSI y CRX local. Un CRX fuera de Chrome Web Store depende de las condiciones de administración Active Directory del equipo. | Integración Native Messaging mediante el script de sistema; la extensión y el perfil se administran aparte. |
| Microsoft Edge | Chromium | Política MSI y CRX local. | Integración Native Messaging mediante el script de sistema; la extensión y el perfil se administran aparte. |
| Brave | Chromium | Política MSI y CRX local. | Integración Native Messaging mediante el script de sistema; la extensión y el perfil se administran aparte. |
| Vivaldi | Chromium | Política MSI, CRX local y host Native Messaging. | No hay ruta automática dedicada para Vivaldi; la extensión y el perfil se administran aparte. |
| Mozilla Firefox | Gecko | Política MSI, XPI firmado y host Native Messaging. | Integración Native Messaging mediante el script de sistema; la extensión y el perfil se administran aparte. |
| Arc | Chromium | Compatible: política Arc y CRX local. La instalación por MSI y el control de contenido siguen pendientes de calificación separada. | No declarado. |

Firefox 140.0 o posterior es obligatorio en todos los sistemas operativos; Firefox Release y Beta requieren un XPI firmado. Los navegadores Chromium no tienen una versión mínima fijada en el manifiesto; las versiones estables objetivo siguen pendientes de calificación. El bundle Linux no configura por sí mismo los perfiles del navegador: `deploy/install-browser.sh` instala el servicio de sistema y los manifiestos Native Messaging. El RPM distribuido por la plataforma instala el mismo servicio systemd de sistema, bajo el usuario `milvago-agent`, y los mismos manifiestos Native Messaging de máquina que `deploy/install-browser.sh`.

Los controles de red que usan `webRequestBlocking` requieren una extensión administrada en los navegadores que reservan esa capacidad a extensiones instaladas por política. Una instalación manual no demuestra el mismo control.

La cobertura de los sitios de IA es independiente del navegador. Community incorpora la captura para ChatGPT y Claude, mientras ambas ediciones informan por separado la presencia en plataformas conocidas sin reactivar la captura. Enterprise cubre nueve proveedores. Los resultados de calificación solo se aplican a la edición, el navegador, el sistema operativo y el escenario ejecutado: una nota fechada o un artefacto construido no se generaliza a otro contexto.

## El agente: un servicio, no una tarea de usuario

El núcleo del agente es un **servicio** (Rust): `endpoint` en Community y `bridge` en Enterprise. En Windows se ejecuta sin sesión de usuario bajo NetworkService, con un conjunto de privilegios reducido (solo `SeChangeNotifyPrivilege` y `SeCreateGlobalPrivilege`) y carpetas ProgramData cuya ACL nombra ahora el SID propio del servicio en lugar de NetworkService en su conjunto. En Linux, el RPM y el script autónomo `deploy/install-browser.sh` instalan ambos un servicio systemd de sistema, bajo el usuario `milvago-agent`, con los manifiestos Native Messaging de máquina. Ejecuta dos bucles:

- el bucle de **sincronización**: política, cola de eventos, actualizaciones, y el inventario en Enterprise;
- un **servidor IPC local**, el único punto de contacto del navegador.

El navegador no puede hablar con un servicio (sesión 0). El mismo binario, lanzado por el navegador como host de Native Messaging, actúa como **relevo**: transmite las tramas al servicio a través de un canal local (named pipe de Windows con descriptor endurecido, socket Unix). La identidad del dispositivo sigue siendo la del servicio, nunca la del cliente.

El estado del dispositivo reside en un almacén **cifrado por la máquina** (DPAPI en Windows): credenciales, política en caché, cola de eventos. Un corte entre el agente y el servidor no detiene el navegador: mientras el agente local responda por el canal autenticado, aplica su última política local verificada y conserva los eventos hasta que se reanude la sincronización. El periodo de tolerancia de **cinco minutos** solo comienza cuando el servicio SYSTEM ya no puede comunicarse con ese agente local; al agotarse, la superficie de IA queda sellada. Una revocación o una denegación explícita bloquea de inmediato.

## El servidor

Un backend **Go** que sirve:

- la **ingestión** de los agentes: eventos, heartbeats (usuario OS de la sesión activa, puramente informativo), inventario, con límites de tasa por dispositivo;
- el **catálogo de detección** firmado y su publicación versionada;
- la **consola** y la **API REST** con RBAC por permisos;
- las **actualizaciones**: MSI firmado y manifiesto de actualización firmado, congelados en la imagen;
- el almacenamiento: **PostgreSQL**, con aislamiento por **Row-Level Security** en Enterprise.

La consola (React) es servida por el mismo binario; **ningún recurso externo** se carga en ejecución — bundle, fuentes y tema están incorporados. La autenticación pasa por Keycloak (OIDC Authorization Code + PKCE); el tema de conexión sigue los mismos tokens.

## En Enterprise, tres componentes privilegiados adicionales

- El **colector nativo** (`collector`, LocalSystem) lee las aplicaciones de IA nativas declaradas por la política, sin compartir jamás el almacén del agente: tiene su propio ancla, su propia clave, y no confía en nada de lo que el agente almacena. El agente **extrae** los registros del colector, nunca al revés.
- El **filtro de red** (`filter`) observa el tráfico de los servicios cubiertos del lado de la máquina.
- El **inventario** fusiona las aplicaciones de IA por dispositivo (nunca una instantánea destructiva: un relevamiento vacío no borra nada), con `first_seen` para plantear la pregunta « ¿qué apareció esta semana? ».

## Los canales, en resumen

Para `event_v2`, el agente escribe primero el evento en su almacén local cifrado. El servidor solo devuelve el identificador en `accepted_ids` después de validar el puesto y confirmar la transacción en PostgreSQL. Si PostgreSQL no está disponible, la API responde temporalmente `503`: el agente conserva el mismo identificador y lo reintenta. La repetición es esperada y sigue siendo idempotente; un acuse recibido significa que PostgreSQL ha asumido la custodia del evento.

| Canal | Sentido | Contenido |
| --- | --- | --- |
| `policy_v3` | extensión → agente → servidor | política **proyectada**: servicios, recolección, control de modelos; las palabras clave y excepciones no salen de ella |
| `event_v2` | agente → servidor | eventos Shadow AI, por lotes, confirmados |
| `/v2/heartbeat` | agente → servidor | usuario OS de la sesión activa (informativo, nunca una autoridad), extensiones vistas |
| `/v1/inventory` | agente → servidor | aplicaciones de IA detectadas (Enterprise) |

Un fallo de sincronización no se oculta: el agente registra un estado único (`sincronizado`, `diferido` con autorización en caché válida, `bloqueado`), con la causa clasificada y el remedio propuesto — nunca un detalle de transporte ni un identificador.
