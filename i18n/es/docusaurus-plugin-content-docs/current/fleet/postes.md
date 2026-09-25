---
sidebar_position: 1
title: Dispositivos
---

# Dispositivos

## Acceder a esta pantalla

En la barra lateral, haga clic en **Parque > Dispositivos**. Requiere `devices.read` y no está disponible en consulta solo agregada.

1. Con `installers.manage`, haga clic en **Descargar agente**, elija MSI o RPM, instálelo, vuelva y actualice. Con `members.manage`, apruebe un dispositivo pendiente cuando corresponda.
2. Abra un dispositivo y elija Información, política o, en Enterprise con `events.read`, herramientas locales. Cambie el grupo desde su etiqueta; la revisión se aplica en la próxima sincronización.
3. Aprobar, revocar y eliminar requieren `members.manage` y confirmación; la eliminación masiva informa los fallos por dispositivo.

La pantalla **Dispositivos** recensa los aparatos registrados ante el servidor y responde a la pregunta: qué dispositivos reportan información, y cuáles todavía tienen el derecho de hacerlo. Se encuentra en la sección **Parque** de la navegación, con [Grupos de dispositivos](groupes.md).

La línea de información bajo el título fija el alcance del agente, según la edición:

- **Community**: « El agente Community cubre los usos de navegador. Ningún inventario de aplicaciones instaladas está incluido. Un dispositivo en espera o revocado no puede enviar eventos. »
- **Enterprise**: « El agente Enterprise cubre el navegador y el inventario dirigido de las herramientas. Un dispositivo en espera o revocado no puede enviar eventos. »

[IMAGEAMETTREICI 01]

## Quién ve qué

| Acción | Condición |
| --- | --- |
| Ver la lista y las fichas | derecho `devices.read`, y no una consulta agregada sola |
| Descargar el agente | derecho `installers.manage` |
| Aprobar, revocar, eliminar | derecho `members.manage` |
| Cambiar el grupo de un dispositivo | derecho `devices.manage` |
| Regular la política del dispositivo | derecho `policy.manage` |

## La lista de dispositivos

La sección se titula **Dispositivos registrados**, con la regla de lectura « Una identidad revocable por dispositivo »: cada dispositivo posee su propia identidad, que la consola puede retirar individualmente. Un contador muestra el número de dispositivos correspondientes a los filtros.

El selector **Por página** ofrece 10, 20, 50, 100 o 200 dispositivos. Los filtros se aplican a todo el parque antes de la paginación, y los controles numerados dan acceso a la primera página, la última y las páginas vecinas.

La barra de filtros solo aparece si existe al menos un dispositivo. Lleva tres criterios acumulativos:

- **Nombre del dispositivo** — contiene el texto introducido;
- **Usuario** — contiene el texto introducido, sobre la cuenta OS señalada;
- **Sistema** — lista desplegable de las plataformas efectivamente presentes en el parque (« Todos los sistemas » por defecto).

[IMAGEAMETTREICI 02]

Columnas de la tabla:

| Columna | Contenido |
| --- | --- |
| **Dispositivo** | nombre de máquina pulsable hacia la ficha, o « Nombre de máquina no disponible »; los primeros caracteres del identificador aparecen debajo |
| **Usuario** | cuenta OS conectada, o « — » mientras nada se haya señalado |
| **Grupo** | etiqueta pulsable hacia el grupo, o « — » |
| **Plataforma** | sistema del dispositivo, con la versión del agente en detalle |
| **Estado** | badge **En espera**, **Activo** o **Revocado** |
| **Último contacto** | marca de tiempo del último señalamiento |
| **Acciones** | « Aprobar » (dispositivo en espera) y « Revocar » (dispositivo no revocado) para quien tenga el derecho; « — » si no |

Dos pantallas vacías distintas, que no dicen lo mismo:

- ningún dispositivo en absoluto: « **Su primer dispositivo le espera** » — « Descargue el MSI o el RPM preconfigurado. El dispositivo aparece automáticamente tras la instalación y la conexión. »;
- ningún dispositivo correspondiente a los filtros: « **Ningún dispositivo corresponde** » — « Modifique los criterios de búsqueda. »

## Descargar el agente

El botón « **Descargar el agente** » abre un diálogo de descarga solamente: no crea nada, la organización ya posee una clave de despliegue. Tres salvaguardas, en el orden del código:

1. **URL pública confirmada**: sin ella, el diálogo muestra un recuadro de advertencia — « Defina y confirme la URL HTTPS pública en Administración → Parámetros antes de descargar un instalador. Los agentes se conectarán a esta URL. » — o pide la intervención de un propietario cuando la URL no es modificable.
2. **Clave de despliegue activa**: si la clave fue revocada, el recuadro « Ninguna clave de despliegue activa » invita a rotarla en Administración → Parámetros.
3. **Modo de aprobación anunciado antes de la descarga**:
   - aprobación manual — recuadro ámbar « Aprobación manual activa »: « Cada dispositivo instalado aparecerá en espera y no transmitirá nada antes de su aprobación en Dispositivos. » Un dispositivo en espera no recibe ninguna política: desde la instalación del agente y hasta la aprobación, **ningún acceso a las plataformas de IA** está permitido en ese dispositivo: la extensión falla cerrada y sella la superficie de IA cubierta, en lugar de dejarla abierta por defecto;
   - aprobación según la red — « Un dispositivo instalado desde una red autorizada transmite inmediatamente; los demás quedan en espera de aprobación. »

El diálogo propone dos paquetes lado a lado: **Windows MSI** (servicio Windows para todo el dispositivo) y **Linux RPM** (servicio systemd para todo el dispositivo). El paquete lleva la clave de despliegue de la organización; tras la instalación, el dispositivo se inscribe una sola vez y conserva su estado en una caché cifrada. La versión realmente descargada se recuerda en el pie de la tarjeta.

El mismo paquete vale para toda la organización: rotar la clave de despliegue invalida inmediatamente los instaladores ya distribuidos.

[IMAGEAMETTREICI 03]

## La ficha de un dispositivo

Abrir un dispositivo en la lista muestra su ficha. La línea de información bajo el título resume el contenido: « Identidad revocable del dispositivo, excepciones y observaciones locales. »

Las acciones de la ficha dependen del estado: « Aprobar » sobre un dispositivo en espera, « Revocar » sobre todo dispositivo no revocado, « Eliminar » en todos los casos para quien tenga el derecho. Pestañas se añaden cuando sus condiciones están reunidas:

- **Información** — siempre presente;
- **Política del dispositivo** — derecho `policy.manage`, en las dos ediciones;
- **Herramientas locales** — Enterprise, con un acceso de analista.

[IMAGEAMETTREICI 04]

### Información

| Campo | Contenido |
| --- | --- |
| **Identificador** | identificador único del dispositivo, en fuente de ancho fijo |
| **Plataforma** | sistema señalado por el agente |
| **Agente** | versión del agente instalada |
| **Actualización** | badge « Por actualizar », « En espera », « Aplicado » o « No disponible », con la fecha del último señalamiento cuando existe |
| **Usuario conectado** | cuenta OS en el momento del señalamiento, o « No señalado » |
| **Dominio declarado** | dominio de máquina declarado en la inscripción y su tipo (Active Directory, Entra ID, realm Linux), o ausente si el dispositivo no declaró ninguno — caso de los agentes anteriores a la versión 0.5.45 |
| **Grupo** | etiqueta de asignación, detallada abajo |
| **Colectores nativos** | Enterprise únicamente: estado de cada colector de inventario, versión, último éxito, árboles ignorados y modificaciones de la configuración gestionada detectadas |
| **Extensiones de navegador** | presencia viva de la extensión por navegador, detallada abajo |
| **Estado** | En espera / Activo / Revocado |
| **Último contacto** | marca de tiempo |

[IMAGEAMETTREICI 05]

#### El grupo de un dispositivo

La línea Grupo se lee en dos tiempos. Cerrada, muestra la asignación actual — la etiqueta del grupo, pulsable hacia su ficha, o « Ningún grupo » — seguida del enlace « Abrir el grupo ». Un clic en la etiqueta transforma la línea en lista de selección: una etiqueta por grupo de la organización, más « Ningún grupo » para desvincular el dispositivo. Pulsar el grupo ya portado cierra la línea sin registrar nada.

#### Las extensiones de navegador

Un navegador se presenta **activo** solo si su extensión ha hablado con el agente recientemente; todo contacto más antiguo se fecha (« Silenciosa desde » con la fecha) en lugar de presentarse como presente. La regla separa dos situaciones que la columna Usuario no puede distinguir: una extensión desactivada por el usuario, y un dispositivo que sencillamente no usa herramientas de IA. A falta de todo señalamiento, la línea lee « Ninguna extensión señalada ».

### Política del dispositivo

La pestaña lleva la **excepción del dispositivo** a la política de la organización — o a la de su grupo. El editor es el mismo que el de [Shadow AI](../administration/shadow-ai.md), restringido a las secciones que un dispositivo puede sobrescribir: **Registro (enrollment) y recolección**, **Servicios**, **Protecciones**, **Enmascaramiento local**, y en Enterprise **Sensibilidad de los usos**. Las secciones dejadas en herencia siguen al grupo si existe, si no a la organización — la casilla « Heredar » nombra la pantalla de la que la sección se hereda.

El encabezado de sección muestra el alcance (« Excepción del dispositivo ») y la revisión actual. Cada guardado produce una nueva revisión, distribuida a los dispositivos en su próxima sincronización; la aplicación efectiva se observa en Monitoring.

:::enterprise

La sección **Sensibilidad de los usos** solo existe en el editor si la edición sirve esta capacidad: sin ella, la sección no se muestra en absoluto, en lugar de una cuadrícula inutilizable.

:::

[IMAGEAMETTREICI 06]

### Herramientas locales

:::enterprise

Esta pestaña solo existe en Enterprise, para un acceso de analista. Lista las aplicaciones locales observadas en este dispositivo por el módulo de inventario: herramienta, tipo de observación (proceso, ejecutable, instalación, extensión, puerto), primera y última observación.

Dos reglas de lectura, asumidas por la pantalla misma:

- las observaciones « no prueban la utilización de una herramienta »;
- « una presencia local detectada es distinta de un evento de navegador o de un prompt emitido » — una aplicación instalada no es un uso.

A falta de observación, la pantalla lo enuncia: « Ninguna herramienta local señalada », y las observaciones del módulo de inventario aparecerán aquí.

:::

[IMAGEAMETTREICI 07]

## Aprobar, revocar, eliminar

Tres acciones diferentes, que no hay que confundir:

- **Aprobar**: dar acceso. Reservada al dispositivo en espera; el dispositivo pasa al estado activo y empieza a transmitir.
- **Revocar**: cortar el acceso conservando el historial. La confirmación lo enuncia: el dispositivo « perderá su acceso al envío de eventos y a las nuevas políticas. Será necesario un nuevo registro (enrollment) para restablecer su acceso. »
- **Eliminar**: ir más lejos que la revocación, definitivamente. La confirmación lleva el texto completo: « La eliminación retira la identidad del dispositivo: pierde inmediatamente el derecho de enviar, como si estuviera revocado, y su agente abandona su cola local. Es definitiva y va más lejos que una revocación: el dispositivo desaparece de la consola con sus eventos, su excepción de política y sus observaciones locales. La revocación, por su parte, corta el envío conservando el historial. » Eliminar un dispositivo exige un segundo factor verificado hace un momento y nunca está disponible para una clave API, porque la eliminación borra todo su historial — eventos y el texto de las solicitudes y respuestas conservado incluido. Mientras el dispositivo aún tenga texto conservado, eliminarlo también exige el derecho a purgar contenidos (`content.purge`, reservado al propietario por defecto); si no, el servidor rechaza con « Este dispositivo todavía tiene texto de prompt conservado: eliminarlo exige el derecho a purgar contenidos. »

[IMAGEAMETTREICI 08]

La eliminación funciona también en masa: marcar varios dispositivos en la lista muestra el botón « Eliminar (N) », y la confirmación lista los nombres (diez mostrados, luego « y N otras »). Cada dispositivo se elimina por una consulta propia: un fallo se señala dispositivo por dispositivo (« Eliminación imposible para: … ») en lugar de interrumpir toda la selección, y los éxitos se cuentan aparte.
