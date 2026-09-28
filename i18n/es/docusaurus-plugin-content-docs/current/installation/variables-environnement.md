---
sidebar_position: 5
title: Variables de entorno
---

# Variables de entorno

Toda la configuración del servidor pasa por el entorno: la consola nunca lee una y nada se ajusta en caliente. Una variable ausente o inválida detiene el servidor con el mensaje exacto del problema — no hay repliegue silencioso. Las variables necesarias también dependen del rol del proceso.

## Roles de proceso

`MILVAGO_ROLE` selecciona la responsabilidad del proceso. Su valor predeterminado, `all`, conserva el proceso combinado para los despliegues existentes. En Kubernetes, separe los roles y monte solo los secretos que necesita cada pod.

| Valor | Responsabilidad | Particularidades |
| --- | --- | --- |
| `all` | API, mantenimiento, exportaciones Enterprise y migraciones | modo de compatibilidad; reúne los secretos de los roles correspondientes |
| `migrate` | migraciones e inicialización | usa `MIGRATION_DATABASE_URL`; se ejecuta como Job antes de la API |
| `api` | HTTP, consola y agentes | no recibe URL de migración ni identidad de inicialización |
| `exports` | exportaciones Enterprise | no sirve la consola ni ejecuta migraciones |
| `maintenance` | tareas de mantenimiento | no sirve la consola ni ejecuta migraciones |

## Obligatorias según el rol

| Variable | Función |
| --- | --- |
| `DATABASE_URL` | conexión PostgreSQL de runtime |
| `MIGRATION_DATABASE_URL` | conexión usada solo por `all` y `migrate` para las migraciones (rol privilegiado) |
| `APP_URL` | origen HTTP o HTTPS de la aplicación; HTTPS activa las cookies seguras |
| `OIDC_ISSUER` | emisor Keycloak (HTTP o HTTPS) |
| `OIDC_CLIENT_ID` / `OIDC_CLIENT_SECRET` | cliente OIDC de la consola |
| `SESSION_KEY` | raíz de cifrado de los tokens OIDC de sesión (AES-256-GCM, 32 bytes en base64 estándar) |
| `CONTENT_KEYS` | raíces del contenido sellado, formato `version:base64` (`1:<32 bytes base64>,2:…`); la versión más alta sella, las anteriores solo abren |
| `POLICY_SIGNING_KEY` | semilla Ed25519 de firma de las políticas y catálogos (32 bytes en base64) |

`DATABASE_URL` y `CONTENT_KEYS` siguen siendo necesarios para los roles que acceden a los datos. La API requiere `APP_URL`, la configuración OIDC, `SESSION_KEY` y `POLICY_SIGNING_KEY`. `migrate` también requiere `APP_URL`, y `maintenance` requiere el emisor OIDC. En Milvago Enterprise, `migrate` también requiere `OIDC_ISSUER`, salvo que el servidor MCP esté desactivado (`MILVAGO_MCP`). El rol `exports` solo se acepta en Milvago Enterprise y no necesita secretos de sesión de consola, URL de migración ni identidad de inicialización.

:::warning
`SESSION_KEY` y `CONTENT_KEYS` tienen funciones distintas **por construcción**: la sesión es desechable (una rotación cuesta reconexiones), el contenido sellado es durable. Una entrada `CONTENT_KEYS` igual a `SESSION_KEY` se rechaza en el arranque.
:::

## Con valor por defecto

| Variable | Por defecto | Función |
| --- | --- | --- |
| `DB_RUNTIME_ROLE` | `milvago_runtime` | rol PostgreSQL del runtime (RLS en Enterprise); formato `^[a-z_][a-z0-9_]{0,62}$` |
| `STATIC_DIR` | `../console/dist` | bundle de consola servido por el mismo binario |
| `LISTEN_ADDR` | `:4020` | puerto de escucha HTTP |
| `COMMUNITY_ORG_NAME` | `Milvago` | nombre de la organización Community creada en el arranque |
| `PUBLIC_URL` | valor de `APP_URL` | origen público mostrado a los agentes (solo origen: ni ruta, ni consulta, ni fragmento) |
| `OIDC_INTERNAL_URL` | — | emisor OIDC visto desde la red interna, si es diferente |
| `EDITION` | fijada en la compilación | debe corresponder a la composición compilada del binario; en caso contrario, rechazo en el arranque |
| `BOOTSTRAP_EMAIL` | vacía | dirección de la primera cuenta, creada automáticamente por `all` o `migrate` («modo automático»). Dejada vacía, es el asistente de [primera instalación](premiere-installation.md) quien crea esta cuenta en lugar de una importación. |
| `OIDC_ADMIN_CLIENT_ID` / `OIDC_ADMIN_CLIENT_SECRET` | — | necesario para las operaciones de perfil, invitaciones, directorio y SSO de los roles `api` o `all` (con un Keycloak existente, conceda a esta cuenta de servicio `manage-identity-providers` y `view-identity-providers`, y dé al cliente de la consola el ámbito `basic`, que lleva `auth_time`), para el asistente de [primera instalación](premiere-installation.md) y para las comprobaciones de mantenimiento de Keycloak; no se exige al iniciar y las exportaciones no lo usan |

## Facultativas `MILVAGO_*`

| Variable | Efecto |
| --- | --- |
| `MILVAGO_INSTALLER_DIRECTORY` | directorio de los MSI y manifiestos servidos a los dispositivos; las actualizaciones se sirven junto a los instaladores |
| `MILVAGO_UPDATE_PUBLIC_KEY` | clave de verificación de los manifiestos de actualización (32 bytes base64), separada de la clave de firma de las políticas |
| `MILVAGO_SETUP_TOKEN` | token de un solo uso de al menos 32 caracteres que abre el asistente de [primera instalación](premiere-installation.md) mientras `BOOTSTRAP_EMAIL` está vacía; el servidor solo conserva su huella SHA-256, nunca registrada |
| `MILVAGO_SHADOW_METRICS` | cierra `GET /api/shadow/metrics` en la instancia si `0`/`false`/`off`/`no`; abierta por defecto |
| `MILVAGO_MCP` | cierra el servidor MCP Enterprise si `0`/`false`/`off`/`no`; servido por defecto (la ausencia de la variable es el estado normal) |
| `MILVAGO_DEBUG` | abre el editor del catálogo de detección y sus rutas de escritura si `1`/`true`/`on`/`yes`; la publicación sigue sujeta al Propietario raíz y a una MFA reciente — es un ajuste de ruido, no una frontera de seguridad |
| `MILVAGO_DEMO_READONLY` | rechaza toda mutación de consola, sea cual sea el rol (instancia de demostración no supervisada); la ingestión de los dispositivos queda voluntariamente fuera del alcance |
| `MILVAGO_DEMO_MCP_KEY` | clave MCP mostrada en la página de perfil de una instancia de demostración — conservada únicamente si `MILVAGO_DEMO_READONLY` está activo: una instancia que acepta escrituras nunca muestra una clave que no ha servido |
| `MILVAGO_PUBLISHER_URL` + `MILVAGO_PUBLISHER_CREDENTIAL` + `MILVAGO_PUBLISHER_PUBLIC_KEY` | conexión al servicio del editor: los tres valores se proporcionan juntos; consulte [Conectar al servicio del editor](../avance/service-editeur.md) |
| `MILVAGO_METRICS_TOKEN` | token deliberado que expone la ruta de métricas más allá de la consola |
| `MILVAGO_OTEL_HTTP_HOSTS` | hosts HTTP OTLP autorizados, separados por comas; cada entrada se valida estrictamente (solo host, sin usuario, ruta, consulta ni fragmento) |
| `MILVAGO_EXPORT_CA_FILE` | archivo PEM (≤ 1 MB) de autoridades raíz para los destinos de exportación; debe contener al menos un certificado explotable |

## Funcionalidades de Keycloak que hay que desactivar

« Milvago desactiva en Keycloak las funcionalidades que no usa y que un cliente que se registra por sí mismo podría activar para obtener tokens sin dirección de redirección: `KC_FEATURES_DISABLED=device-flow,ciba,token-exchange-standard`. Un proveedor de identidad existente que sirva a Milvago debe aplicar el mismo ajuste. »

## Los rechazos de arranque son salvaguardas

La configuración se valida en bloque: raíces de 32 bytes exactamente, versiones `CONTENT_KEYS` positivas y únicas, claves de contenido distintas de `SESSION_KEY`, orígenes HTTP o HTTPS, emisor OIDC bien formado, roles de base bien formados. Un defecto de configuración es un error, no una sustitución silenciosa por una raíz de otro uso.
