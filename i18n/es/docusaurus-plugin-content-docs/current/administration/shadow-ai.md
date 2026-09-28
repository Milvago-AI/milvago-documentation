---
sidebar_position: 3
title: Shadow AI
---

# Shadow AI

## Acceder a la pantalla

Haga clic en **Administración** > **Shadow AI**. Necesita `policy.manage`.

1. Seleccione una sección.
2. Cambie los campos.
3. Guarde los cambios; la confirmación anuncia la próxima sincronización.

La pantalla « Administración de Shadow AI » porta la **política aplicada a los usos de IA**: lo que se recopila, qué servicios son observados, bloqueados o redirigidos, lo que se enmascara en origen del dispositivo, lo que Descubrimiento tiene derecho a nombrar. Responde a la pregunta « **qué reglas aplican mis dispositivos** ». El acceso exige el permiso `policy.manage` (« Gestionar la política (Shadow AI) »).

La línea bajo el título fija el marco: « Recolección, protección y operaciones en una única política coherente. » La política está **firmada y revisada** — cada guardado produce una nueva revisión, distribuida a las instalaciones en su próxima sincronización; un dispositivo nunca aplica una revisión más antigua que la suya.

## Las secciones

Una navegación vertical divide la pantalla, numerada en el orden de la política:

1. **Inscripción y recolección** — cómo un dispositivo obtiene el derecho a transmitir, y lo que la recolección conserva.
2. **Servicios** — los servicios cubiertos y su comportamiento; en Enterprise, el control de modelos.
3. **Protecciones** — bloqueo de los archivos adjuntos y palabras protegidas.
4. **Enmascaramiento local** — sustitución de los datos detectados antes de todo envío.
5. **Sensibilidad de los usos** — Enterprise únicamente; la sección no existe en el resto.
6. **Plataformas de IA** — lo que Descubrimiento señala, al nivel de la organización.
7. **Operaciones** — actualizaciones firmadas y parque piloto, bajo bandera de diagnóstico.

Cada guardado lee « Configuración guardada. Las instalaciones la recibirán en su próxima sincronización. » Mientras haya campos cambiados, un badge « Borrador » señala el estado no guardado.

![Milvago - Las secciones](/img/docs/en/administration-shadow-ai-01.png)

## Inscripción y recolección

### Aprobación de los dispositivos

« Elija cómo una nueva instalación recibe permiso para informar. » Tres modos:

- **Aprobación manual** — cada dispositivo instalado aparece pendiente y no transmite nada antes de la aprobación en Dispositivos.
- **Aprobación automática** — el dispositivo transmite desde su inscripción.
- **Redes y dominios autorizados** — una lista de reglas, hasta 50 (**Añadir una regla** / **Eliminar la regla**). Cada regla lleva una **Red (CIDR)** obligatoria y un **Dominio de la máquina (opcional)**. Un dispositivo se aprueba automáticamente cuando su dirección de conexión, tal como la constata el servidor, está en la red de una regla y, si la regla indica un dominio, la máquina declaró ese dominio en la inscripción.

  Una solicitud recibida detrás de un proxy inverso, un Ingress o una Gateway — que porta un encabezado `Forwarded`, `X-Forwarded-For` o `X-Real-IP` — nunca se aprueba por red: el dispositivo espera la aprobación manual en Dispositivos. Detrás de un intermediario así, use la aprobación manual o la aprobación automática.

  Dominios declarados: dominio DNS de Active Directory (Windows unido a un AD), identificador de tenant de Entra ID (Windows unido a Entra) o realm Kerberos de Linux (`realm join`, `default_realm` de `/etc/krb5.conf`). La comparación es exacta e insensible a mayúsculas, sin coincidencia parcial ni de sufijo.

  Un dominio nunca aprueba por sí solo: una regla siempre exige un CIDR, porque el dominio lo declara la propia máquina y el servidor no puede verificarlo — alguien con el instalador de la organización en una máquina fuera del parque podría declarar cualquier dominio. Las reglas escritas antes de esta versión (simple lista de redes) siguen funcionando como reglas sin dominio. Los agentes anteriores a la versión 0.5.45 no declaran ningún dominio: solo las reglas sin dominio pueden aprobarlos.

Esta sección solo existe al nivel de la organización: ni un grupo, ni un dispositivo redefinen la inscripción.

### Recolección en el navegador

- **Activar la recolección** — los usos en el navegador. La desactivación detiene las nuevas recolecciones.
- **Conservar el texto de las solicitudes y las respuestas** — « Desactivado por defecto. Activarlo requiere un segundo factor verificado hace un momento, nunca una clave de API. Leerlo requiere un permiso aparte. » La consola redirige entonces a la verificación del segundo factor y repite el cambio al volver. La conservación de los textos está acotada por « Conservación del texto (días) », de 1 a 30. Desactivar el contenido detiene las nuevas recolecciones y elimina los textos en cola en la próxima actualización de la política; no borra los metadatos ya recibidos.
- **Conservar los nombres de los archivos enviados** — « Solo nombres, nunca contenidos. » Se recogen allí donde un archivo entra realmente en el redactor — selección, arrastre, pegado; un archivo añadido por una vía que la página no expone permanece invisible.

La descripción de la sección porta el límite de edición: « Community conecta la extensión al puente Rust abierto. Las conversaciones de aplicaciones locales siguen siendo una capacidad Enterprise. »

![Milvago - Recolección en el navegador](/img/docs/en/administration-shadow-ai-02.png)

## Servicios

« El catálogo y los dominios autorizados provienen del servidor. Un servicio activado no implica una cobertura exhaustiva de su interfaz. » Cada servicio cubierto porta:

- una casilla de activación;
- sus dominios, mostrados tal como el catálogo los declara;
- un **comportamiento**: Observar, Bloquear, Redirigir;
- en redirección, un **destino de la redirección** obligatorio.

:::enterprise

El paquete Community solo construye los adaptadores ChatGPT y Claude: su catálogo de fábrica y su ejecución nunca nombran los demás servicios. Enterprise cubre nueve proveedores — ChatGPT, Claude, Le Chat, Copilot, Gemini, NotebookLM, DeepSeek, Perplexity, Grok.

### Control de modelos

Cuando la edición califica el control de modelos, la sección Servicios gana un bloque « Controles de modelos »: « Las restricciones de servicio tienen prioridad. Estas reglas afinan los modelos autorizados o denegados en cada plataforma. » Cada plataforma, por canal (Navegador o Aplicación local), porta una regla — « Ninguna restricción », « Permitir todos salvo los indicados », « Denegar todos salvo los indicados » — y, en su caso, una lista de identificadores exactos de modelos: un identificador por línea, 100 como máximo, sin aproximación. « Los modelos Unknown o Auto no verificables se bloquean mientras haya una restricción activa. »

Una tabla « Estado aplicado en los dispositivos » recuenta, por dispositivo y plataforma, el estado (Requiere actualización, Pendiente, Aplicada, No disponible), la revisión esperada y la razón eventual: « Las reglas guardadas siguen siendo distintas de las revisiones realmente aplicadas. » El dispositivo aparece allí con su nombre real para quien porte `devices.read` fuera de la consulta solo agregada; los demás lectores ven el alias del dispositivo. En consulta solo agregada, la tabla solo cuenta los dispositivos por plataforma, canal y estado, sin designar ningún dispositivo. La observación del nombre del modelo que respondió sigue abierta a ambas ediciones; la decisión de autorizar o denegar un modelo es Enterprise.

El confinamiento a nivel de sistema (WFP en Windows, SELinux en Linux) solo cubre los ejecutables registrados en su ruta de instalación. Una copia del ejecutable colocada en otro lugar no está confinada.

:::

![Milvago - Control de modelos](/img/docs/en/administration-shadow-ai-03.png)

## Protecciones

### Archivos adjuntos

**Bloquear el envío de archivos** sella las rutas de carga **medidas** del catálogo (`kind:"file"`) — las URL que un envío desencadena realmente en el sitio, relevadas en el lugar y publicadas en el catálogo firmado, nunca adivinadas. Ninguna heurística sobre el método, el host o la forma del cuerpo: solo quedan selladas las rutas de carga medidas, para no interceptar nunca un envío legítimo. « La interceptación depende del navegador y de las interfaces compatibles. »

### Palabras y frases protegidas

« Las detecciones se aplican localmente según la política firmada. » El bloque porta:

- **Frases protegidas** — una frase por línea; no ponga en ellas credenciales de acceso.
- Tres niveles de coincidencia, ajustados por separado: **Coincidencia exacta**, **Variantes Unicode**, **Coincidencia aproximada** (este último puede estar Desactivado).
- **Excepciones** — una por línea; reducen el perímetro de detección.
- **Mensaje mostrado al bloquear**.

![Milvago - Palabras y frases protegidas](/img/docs/en/administration-shadow-ai-04.png)

## Enmascaramiento local

« Actúa sobre el texto capturado, en el dispositivo, antes de cualquier envío: cada elemento detectado se sustituye por su etiqueta, por ejemplo [email]. Es independiente de la sensibilidad de los usos (paneles) y de la conservación del texto. La detección es heurística y se limita a los formatos compatibles; revise los resultados antes de ampliar el despliegue. » Dos interruptores: **Activar el enmascaramiento**, y **Exigir una revisión antes del envío**.

:::enterprise

Las **categorías integradas** — Correo electrónico, Teléfono, IBAN, Tarjeta de pago, Identificador social (Francia), Número de la Seguridad Social (Estados Unidos), Dirección IP — son una capacidad Enterprise. La guardia de red solo retiene lo que porta un prompt: una ruta de prompt del catálogo, o un cuerpo con la forma de un prompt — el redactor ya detuvo o enmascaró el texto en origen. Los marcadores portan la **etiqueta de la regla** y un número por valor distinta en cuanto hay varias: `[IP]`, o `[IP1]` y `[IP2]`.

:::

### Reglas de enmascaramiento personalizadas

Las dos ediciones definen reglas personalizadas: una **etiqueta**, una **expresión regular** acotada (sin retrorreferencias ni aserciones — el servidor rechaza los patrones inseguros), **Activada**, **Ignorar mayúsculas**. Una etiqueta que su propia expresión reconoce se señala y se bloquea al guardar: la etiqueta se convierte en el marcador insertado en el texto enmascarado (`[ETIQUETA]`, `[ETIQUETA1]`…), y una expresión que la capturara enmascararía sus propios marcadores en cada pasada, sin fin.

En Community, sin categorías integradas, la pantalla lo explicita: « Esta edición no incluye patrones de detección integrados: defina sus propias expresiones regulares en « Reglas de enmascaramiento personalizadas » más abajo. »

![Milvago - Reglas de enmascaramiento personalizadas](/img/docs/en/administration-shadow-ai-05.png)

:::enterprise

## Sensibilidad de los usos

La sección solo existe en Enterprise si la edición califica la sensibilidad — si no, no se muestra en absoluto, nunca vacía. « Decide qué categorías detectadas marcan un evento como sensible en el registro, la cartografía y las exportaciones. No modifica el texto capturado: el enmascaramiento se configura en Enmascaramiento local. Las categorías indican sensibilidad; no certifican conformidad. »

Tres bloques:

- **Sensibilidad de los usos en el navegador** y **Sensibilidad de las aplicaciones locales** — las categorías que marcan un evento como sensible: los datos personales, más Código fuente, Datos médicos y Palabras clave.
- **Términos médicos** — « Un texto que contenga uno de estos términos recibe la etiqueta « Datos médicos ». Búsqueda de subcadena sin distinguir mayúsculas, en el dispositivo. » Un término por línea, 100 como máximo, 60 caracteres cada uno; lista vacía, ninguna detección.

Las palabras clave vienen de las frases protegidas de « Protecciones ».

:::

## Plataformas de IA

Esta sección se configura **al nivel de la organización**: Descubrimiento se lee allí, las plataformas que tiene derecho a nombrar se eligen allí. Porta dos ajustes distintos:

- **Descubrir dominios candidatos** — « Al activarse, se inspecciona localmente en memoria la estructura de las solicitudes, sin conservarlas. » El interruptor escribe en los ajustes de confidencialidad: exige `settings.manage`, una MFA reciente y un motivo escrito de al menos 8 caracteres, conservado en el registro de auditoría. Desactivado por defecto, la pantalla Descubrimiento permanece vacía con el aviso que remite aquí.
- **La lista de plataformas conocidas** — agrupadas por categoría (Asistentes generales, Asistentes de programación, Agregadores de múltiples modelos…), con búsqueda y recuento « Plataformas: N · ocultas de Descubrimiento: N ». Desmarcar una plataforma la **oculta de Descubrimiento**: « Solo presencia: estas plataformas se informan como alcanzadas y no se lee nada de sus páginas. Ocultar una mantiene el registro de las visitas y la retira de Descubrimiento; volver a mostrarla recupera su historial. » El ocultamiento no atraviesa el catálogo firmado: es una elección de lectura, no un cambio de detección, y no produce una nueva revisión de política.

Una plataforma que la edición ya captura nunca aparece en la lista: el servidor solo envía lo que esta edición no captura en su totalidad, y una plataforma capturada no puede alcanzar Descubrimiento.

![Milvago - Plataformas de IA](/img/docs/en/administration-shadow-ai-06.png)

## Operaciones

Bajo bandera de diagnóstico de la instancia, la sección « Actualizaciones y dispositivos piloto » configura las **actualizaciones firmadas**: activación, porcentaje de dispositivos piloto, identificadores de los dispositivos piloto, versiones en pausa. Sin cadena de entrega firmada anunciada, la casilla está inerte con el aviso « No se informa de ninguna cadena de entrega de actualizaciones firmadas como operativa. » La desactivación porta su propia advertencia: « Los agentes se quedan en su versión instalada, incluso en caso de corrección de seguridad. »

Un bloque « Estado informado por el servidor » muestra el estado anunciado y las versiones firmadas disponibles.

## Herencia y excepciones

La política se lee en cascada: **organización → grupo de dispositivos → dispositivo**. Al nivel de la organización, cada sección puede ser **impuesta** a los descendientes que heredan; un grupo o un dispositivo puede exceptuarse sección por sección, la excepción más cercana al dispositivo gana. Véase [Herencia de la configuración](../introduction/heritage-configuration.md), [Grupos de dispositivos](../fleet/groupes.md) y [Dispositivos](../fleet/postes.md).
