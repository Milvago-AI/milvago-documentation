---
sidebar_position: 2
title: Configuración del agente
---

# Configuración del agente (Windows / Linux)

El agente se configura por un archivo **TOML**, `milvago.toml`, escrito por el instalador y editado por el administrador. Se **regula en unos segundos, sin reiniciar el servicio**: el archivo se relee como máximo una vez cada 5 segundos.

![Milvago - Configuración del agente (Windows / Linux)](/img/docs/es/fleet-postes-03.png)

## Modificar la configuración

1. Abra con una cuenta administradora la ruta de su edición y sistema operativo indicada en la tabla siguiente.
2. Modifique el archivo `milvago.toml` en esa ruta, sin cambiar sus permisos de acceso.
3. Guarde el archivo; no reinicie el servicio.
4. Espere como máximo cinco segundos y consulte `agent.log` en el directorio vecino `logs` para confirmar la aplicación o leer el error.

## Dónde se encuentra el archivo

En Windows, el archivo reside en el directorio `config`, **junto al almacén cifrado, nunca dentro**. En Linux, ahora reside directamente bajo `/etc`, separado del almacén cifrado y de los registros, que permanecen bajo `/var/lib`:

| | Windows | Linux (instalación empaquetada) |
| --- | --- | --- |
| Community | `%ProgramData%\Milvago\Browser\config\milvago.toml` | `/etc/milvago-browser/milvago.toml` |
| Enterprise | `%ProgramData%\Milvago\Commercial\config\milvago.toml` | `/etc/milvago-commercial/milvago.toml` |

Las reglas de acceso forman parte del mecanismo. En Windows, el directorio `config` pertenece a los **Administradores y SYSTEM**, y la cuenta de servicio solo tiene la **lectura** — sus carpetas ProgramData nombran ahora el SID propio del servicio (`NT SERVICE\Milvago Agent Logger Community` / `NT SERVICE\Milvago Agent Logger`), en lugar de la cuenta NetworkService en su conjunto, compartida con otros servicios. En Linux, el archivo pertenece a **root** (modo `0640`, grupo `milvago-agent` en lectura). El agente puede escribir su propio estado cifrado; no debe poder elegir las autoridades de certificación en las que confía, ni abrir su escucha a la red. Es el archivo el que asume esta frontera.

Una reinstalación con `install-browser.sh`, o una actualización del paquete RPM, traslada una vez el archivo existente desde la ubicación anterior (`/var/lib/milvago-browser/config/milvago.toml` o `/var/lib/milvago-commercial/config/milvago.toml`) a la nueva — solo si se trata de un archivo regular, nunca a través de un enlace simbólico. Una vez realizado ese traslado, la ubicación anterior deja de leerse.

## El archivo tal como lo crea el instalador

```toml
# Milvago agent configuration. Edited by administrators; the service can only read it.
# Applies within a few seconds, no restart needed.

[queue]
# Main offline event queue only, not total agent memory or disk usage.
# max_events: 1..100000; max_size_mb: 1..128 MiB.
max_events = 10000
max_size_mb = 8

[logging]
# off | error | warn | info | debug. The log is agent.log in the logs directory
# beside this one. It never contains prompt text, response text, file names,
# tokens, credentials or policy content.
level = "info"
# max_file_mb: 1..100 MiB; retained_files: 0..20 archives plus the current file.
max_file_mb = 10
retained_files = 5

[tls]
# HTTPS verification is always on. This only adds one certificate authority to
# the agent's own HTTP client: the server name and the certificate validity are
# still checked, and neither the Windows certificate store nor the browser is
# affected. A declared authority that cannot be read is an error that blocks the
# call; it never falls back to an unverified connection.
allow_private_ca = false
ca_file = ""
# Also trust the root store of the operating system (for instance a TLS-inspection
# authority your organization deploys by policy). Off unless you decide it.
system_store = false

[network]
# One explicit HTTP(S) proxy, "http://host:port", without credentials. Empty means
# direct connections; environment proxy variables are never used.
proxy = ""
bind_address = "127.0.0.1"
allowed_peers = []
```

El archivo generado por el instalador proviene del propio agente: lo que el operador encuentra en el disco y lo que el agente aplica son la misma cosa, no dos textos mantenidos a mano.

## `[queue]` — cola de eventos sin conexión

| Parámetro | Predeterminado | Límite | Lo que hace |
| --- | --- | --- | --- |
| `max_events` | `10000` | 1 a 100000 | número máximo de eventos en la cola principal sin conexión |
| `max_size_mb` | `8` | 1 a 128 MiB | tamaño serializado máximo de esa cola |

Esta cola principal reúne eventos heredados y de Shadow AI. No limita toda la memoria ni todo el almacenamiento del agente, y es distinta de la caché de respaldo SYSTEM del navegador, que conserva sus propios límites de 1000 eventos o lotes de estado y 8 MiB.

Cuando se alcanza uno de los límites, el agente rechaza el evento nuevo y no lo confirma. Reducir un límite no elimina los eventos ya en cola: la entrega continúa hasta que la cola vuelva a estar por debajo del nuevo límite.

Para aumentar la cola a 20000 eventos y 16 MiB, y conservar registros de 20 MiB con 10 archivos, fusione estos valores en las secciones existentes; no duplique ni `[queue]` ni `[logging]`:

```toml
[queue]
max_events = 20000
max_size_mb = 16

[logging]
# Conserve su nivel actual si es distinto.
level = "info"
max_file_mb = 20
retained_files = 10
```

Una instalación actualizada conserva su archivo existente. Después de actualizar, añada manualmente la sección `[queue]` al archivo `milvago.toml` si no está presente; una sección `[queue]` ausente o uno de sus campos ausente usa su valor predeterminado. Los cambios se aplican sin reiniciar, cuando el archivo se relee como máximo cada 5 segundos.

## `[logging]` — verbosidad y retención

| Parámetro | Por defecto | Cota | Lo que hace |
| --- | --- | --- | --- |
| `level` | `"info"` | `off`, `error`, `warn`, `info`, `debug` | verbosidad del registro `agent.log` en el directorio `logs` vecino. El registro **nunca contiene** texto de prompt, de respuesta, nombre de archivo, token, identificador ni contenido de política |
| `max_file_mb` | `10` | 1 a 100 MiB | tamaño máximo de un archivo de registro antes de rotación |
| `retained_files` | `5` | 0 a 20 archivos | número de archivos archivados conservados, además del archivo actual `agent.log` |

Los valores imposibles (nivel desconocido, tamaño fuera de cotas, retención > 20) no se corrigen ni se ignoran: el archivo entero vuelve a los defectos documentados, con la razón escrita en el registro.

## `[tls]` — autoridad de certificación privada

| Parámetro | Por defecto | Lo que hace |
| --- | --- | --- |
| `allow_private_ca` | `false` | añade **una** autoridad de certificación privada al cliente HTTP del agente, para un servidor Milvago servido tras una PKI interna |
| `ca_file` | `""` | ruta del archivo PEM **relativa al directorio que contiene `milvago.toml`** (por ejemplo `"certs/ca.pem"`), requerida si `allow_private_ca = true` |
| `system_store` | `false` | confía también en las autoridades del almacén de certificados raíz del sistema operativo, además de las autoridades públicas |

**`allow_private_ca` nunca desactiva la verificación.** El nombre de servidor y la validez del certificado siguen verificados, el almacén de certificados Windows no se toca, la confianza del navegador tampoco. Una autoridad declarada pero ilegible es un **error que bloquea la llamada** — nunca un repliegue silencioso hacia una conexión no verificada. Un archivo presente en el disco pero no solicitado (`allow_private_ca = false`) se ignora.

`system_store` amplía la confianza de otra manera: activado, el agente confía también en cada autoridad que los administradores de la máquina instalaron en el almacén del sistema —por ejemplo una autoridad de inspección TLS desplegada por directiva de grupo— además de las autoridades públicas. Permanece **desactivado por defecto**: ampliar la confianza a lo que un administrador de la máquina haya instalado solo le corresponde decidir a él. La verificación en sí nunca se desactiva, sea cual sea este ajuste.

## `[network]` — proxy saliente y escucha local

| Parámetro | Predeterminado | Lo que hace |
| --- | --- | --- |
| `proxy` | `""` | una única dirección de proxy HTTP(S) explícita, escrita `http://host:puerto` (o `https://`), sin credenciales, ruta ni consulta |
| `bind_address` | `"127.0.0.1"` | la interfaz en la que los propios oyentes del agente aceptan conexiones: el servidor de extensión local (que sirve los paquetes firmados de la extensión de navegador a los navegadores de esta máquina) y, en Enterprise, el receptor de telemetría nativa (OTLP) del colector |
| `allowed_peers` | `[]` | rangos CIDR (IPv4 o IPv6, 50 como máximo) de los pares remotos aceptados cuando `bind_address = "0.0.0.0"` |

Vacío, el agente se conecta directamente: las variables de entorno de proxy (`HTTPS_PROXY` y las demás) **nunca** se usan —la cuenta de servicio de Windows no las recibe de todos modos—. Un valor de `proxy` inválido (un esquema distinto de `http`/`https`, credenciales en la URL, host ausente, ruta o consulta tras el puerto) **bloquea las llamadas de red** en lugar de pasar a una conexión directa; el motivo se escribe en `agent.log`. Como el resto del archivo, este ajuste se aplica en unos segundos, sin reinicio.

Solo se aceptan dos valores de `bind_address`: `127.0.0.1` (solo esta máquina, recomendado) o `0.0.0.0` (todas las interfaces). Cualquier otro valor, o una lista `allowed_peers` inválida, mantiene los oyentes locales y el motivo se escribe en `agent.log`. Cambiar `bind_address` exige reiniciar el servicio del agente.

El bucle local siempre se acepta; con una lista `allowed_peers` vacía, no se acepta ningún par remoto aunque se abra `0.0.0.0`, y `"0.0.0.0/0"` acepta cualquier máquina IPv4 que pueda alcanzar esta.

:::warning

Abrir la escucha expone estos puertos a la red: el administrador debe abrir una regla de cortafuegos (Windows Defender Firewall / nftables), y rara vez es necesario —por ejemplo para contenedores o WSL en la misma máquina, con `["172.16.0.0/12"]`.

:::

Límite importante: el receptor OTLP atribuye cada lote de telemetría a la cuenta del sistema operativo propietaria de la conexión local; un emisor remoto no tiene proceso local, así que se rechaza igualmente aunque su dirección esté permitida. Abrir la escucha, por tanto, solo cambia quién puede alcanzar el servidor de extensión.

El filtro de modelos (Enterprise) nunca sigue este ajuste: su confinamiento exige que permanezca local.

## Lo que el archivo rechaza, y por qué

Cada regla de validación cierra una vía de desvío:

- **Solo ruta relativa**: una ruta absoluta, un `..`, un enlace simbólico o una unión permitirían a quien escribe el valor hacer leer al agente un archivo que no se supone que lea. El archivo es además **regular** (no un enlace), limitado a 256 KiB (una autoridad son unos bloques PEM), y la ruta resuelta debe permanecer **dentro del directorio que contiene `milvago.toml`** — una unión colocada más arriba en el árbol se rechaza.
- **Campos desconocidos rechazados** (`deny_unknown_fields`): una errata en un nombre de parámetro no se convierte en un valor ignorado.
- **Solo lectura, nunca escritura**: un archivo ausente o dañado resuelve hacia los defectos documentados, nunca hacia un intento de escritura que la cuenta de servicio no tiene derecho a hacer. Una configuración rota puede por lo tanto **reducir la verbosidad, jamás relajar TLS**.
- **El TLS de una instalación antigua no se reinterpreta**: la verbosidad de una instalación anterior (`state\milvago.conf`, clave `log_level`) sobrevive a la actualización, pero este archivo nunca llevó una sección TLS y nunca puede convertirse en un ajuste de confianza.

## Auto-actualización bajo una herramienta de despliegue (Windows)

Cuando una herramienta de despliegue (Intune, SCCM/ConfigMgr, instalación de software por GPO) ya posee las versiones del agente, la auto-actualización del propio agente se desactiva para no entrar en conflicto con ella —de lo contrario, esa herramienta reinstalaría el paquete antiguo después de cada actualización automática—. Cualquiera de los dos valores de registro siguientes basta para desactivarla; ambos están bajo `HKLM`, modificables solo por un administrador:

| Ubicación | Valor | Origen |
| --- | --- | --- |
| `HKLM\SOFTWARE\Policies\Milvago` | `DisableSelfUpdate` (DWORD) = `1` | directiva GPO / Intune |
| `HKLM\SOFTWARE\Milvago\community` (Community) o `HKLM\SOFTWARE\Milvago\commercial` (Enterprise) | `SelfUpdate` (DWORD) = `0` | instalador |

El aplicador de actualizaciones privilegiado tampoco actúa mientras uno de los dos valores esté activo. El agente escribe una sola línea en `agent.log` en el momento en que la auto-actualización se desactiva.

Este aplicador es el servicio de Windows **Milvago Update Applier** (**Milvago Update Applier Community** en Community). Se inicia con el equipo y permanece activo en todo momento, incluso sin actualización en curso: así reserva, desde el arranque, los canales locales por los que el agente y el navegador lo contactan. No lo deshabilite; no hace nada mientras el agente no le pida aplicar una versión firmada.

Es entonces la herramienta de despliegue la que posee las versiones: detecte el producto por su **UpgradeCode** o por el archivo `installation.json`, nunca por el **ProductCode**, que cambia en cada nueva versión.

## Auto-actualización (Linux, instalación por archivo)

Para una instalación hecha con el archivo e `install-browser.sh` —no el RPM—, la auto-actualización del agente la aplica un **aplicador de actualización con privilegios de root** (`<servicio>-updater.service`), iniciado por `<servicio>-updater.path` en cuanto el agente presenta una solicitud de actualización. Ese aplicador solo confía en `/etc/<nombre>/release.json` —escrito por el instalador a partir del archivo de aprovisionamiento (clave pública de actualización y origen del servidor)—. El propio agente permanece sin privilegios: no puede reemplazar su propio binario ni modificar esa ancla.

Una instalación hecha con una versión de `install-browser.sh` anterior a este cambio no se actualiza a sí misma: reinstale una vez con el nuevo script para crear estas unidades de systemd. Las instalaciones hechas con el paquete **RPM** siguen actualizándose mediante el gestor de paquetes, sin cambios.

## Deriva de las directivas del navegador (Windows)

Cada 60 segundos, el agente comprueba que las directivas de máquina sigan forzando la instalación de su extensión:

| Familia | Registro |
| --- | --- |
| Chromium (Chrome, Edge, Brave, Chromium, Vivaldi, Arc) | `HKLM\SOFTWARE\Policies\<proveedor>\ExtensionInstallForcelist` |
| Firefox | `HKLM\SOFTWARE\Policies\Mozilla\Firefox`, valor `ExtensionSettings` |

Si una directiva de grupo de la organización que gestiona estas listas las reemplaza, las entradas escritas en la instalación desaparecen y los navegadores desinstalan la extensión. El agente escribe un único error nombrando los navegadores afectados en cada cambio de ese conjunto, nunca en cada comprobación; nunca reescribe la directiva por sí mismo.

**Corrección**: añada las entradas de Milvago a la propia directiva de grupo de la organización que gestiona estas listas. El identificador de extensión y la URL de actualización que escribió el instalador se leen en esas mismas claves de registro en una máquina ya instalada.

## Imágenes clonadas (VDI, sysprep, clon de máquina virtual) — Windows y Linux

El agente vincula su identidad a la máquina: en Windows, el `MachineGuid` y el SID de la cuenta de máquina; en Linux, `/etc/machine-id`.

Cuando una copia de un disco ya instalado arranca en otra máquina, esa copia archiva la identidad que portaba y se reregistra como un nuevo equipo, con su propio nombre de máquina, usando la clave de despliegue de la organización conservada en su estado cifrado (sujeta a la regla habitual de aprobación de inscripción). La máquina original conserva su identidad.

Si no hay ninguna clave de despliegue utilizable disponible —por ejemplo, un equipo inscrito antes de esta versión y nunca reparado con el paquete de la organización, o una clave sustituida desde entonces (rotación)— la copia **abandona su identidad** y permanece sin inscribir hasta que se reinstale el paquete de la organización en ella: dos máquinas nunca comparten una identidad.

Qué herramientas de clonado modifican realmente estos identificadores sigue en fase de medición; la vía admitida es sellar la imagen como lo documenta la plataforma: `sysprep /generalize` en Windows, vaciando `/etc/machine-id` en Linux.

## En resumen

| | Windows | Linux |
| --- | --- | --- |
| Servicio | nombre visible `Milvago Agent Logger Community` / `Milvago Agent Logger Enterprise`; nombre de servicio sin cambios, `Milvago Agent Logger Community` / `Milvago Agent Logger`, cuenta NetworkService, SID propio del servicio en las carpetas ProgramData | `systemd` del sistema, usuario `milvago-agent` |
| Estado cifrado | `config` y `logs` son **hermanos** del directorio `state` | `logs` permanece **hijo** del directorio de estado (`/var/lib`); `config` queda ahora separado, bajo `/etc` |
| Archivo | `config\milvago.toml`, Administradores + SYSTEM en escritura, servicio en lectura | `milvago.toml`, root en escritura, grupo `milvago-agent` en lectura (modo `0640`) |

Un `sync` puntual en línea de comandos honra `[tls]` exactamente como el servicio: la misma configuración se aplica a cada camino que habla con el servidor.
