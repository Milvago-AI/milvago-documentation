---
sidebar_position: 2
title: Conversations
---

# Conversations

## Acceder a esta pantalla

En la barra lateral, haga clic en **Supervisión > Conversaciones**. Requiere `events.read` y no está disponible para consulta solo agregada.

1. Elija 24 h, 7 días, 30 días o **Personalizado**, complete los criterios y haga clic en **Aplicar**; la tabla vuelve a la primera página.
2. Abra una fila y cargue mensajes anteriores cuando sea necesario; guarde el perímetro con **Guardar esta vista**.
3. Elija JSON o CSV y haga clic en **Exportar**. El archivo y el informe de síntesis usan exactamente los filtros; las identidades reveladas requieren `identity.reveal`.

El registro de conversaciones agrupa los intercambios Shadow AI observados en los dispositivos de la organización: quién habló con qué servicio, desde qué dispositivo, con qué resultado (observado, bloqueado, enmascarado). Responde a la pregunta « **qué** » que la vista general deja abierta después del « cuánto ».

La línea de información bajo el título define el grano de la lectura: una conversación agrupa los registros de un mismo intercambio en un mismo dispositivo; un registro sin identificador de conversación queda aislado.

[IMAGEAMETTREICI 01]

## La barra de filtros

Se muestra de entrada, sin botón « Refinar ». Lleva:

- el **período**, en segmentos directos (24 h, 7 días, 30 días) o personalizado (del / al, ambas cotas siendo obligatorias y ordenadas);
- los **identificadores**: persona (actor) y dispositivo;
- las **dimensiones de uso**: navegador o aplicación, servicio, modelo, y una búsqueda de texto completo;
- la **acción** (observada, bloqueada, redirigida) y la **naturaleza** (prompt, respuesta, navegación);
- la presencia de un **adjunto**.

[IMAGEAMETTREICI 02]

Las **vistas guardadas** completan la barra: una vista lleva un nombre, puede estar **compartida con la organización** (entonces gestionable por los Propietarios y Admins), y aplicarla reinicia la paginación. Cambiar un filtro siempre vuelve a la página 1.

## La tabla

Cada línea es una conversación, y la línea entera la abre — con un botón real en la primera celda para la navegación con teclado. Columnas:

| Columna | Contenido |
| --- | --- |
| **Herramienta / servicio** | el proveedor (botón de apertura) y la herramienta precisa (navegador o aplicación local) |
| **Modelo** | el modelo utilizado, y su esfuerzo de razonamiento si lo hubiera; « desconocido » cuando nada pudo observarse |
| **Dispositivo** | nombre de máquina, o « nombre de máquina no disponible »; el identificador del dispositivo es visible al pasar el ratón |
| **Persona** | véase la regla de atribución más abajo |
| **Última actividad** | con la hora de inicio del intercambio |
| **Mensajes** | prompts + respuestas intercambiados |
| **Archivos adjuntos** | badge ámbar « con archivo adjunto » — un documento que salió con la conversación |
| **Acción** | badge rojo « N bloqueado(s) », badge ámbar « N redirigido(s) », si no, estado observado |
| **Sensibilidad** | Enterprise únicamente (véase más abajo) |

[IMAGEAMETTREICI 03]

### La regla de atribución de las personas

La columna Persona aplica la misma regla en la lista, en el filtro y en el detalle, y la fórmula es honesta sobre lo que sabe:

1. Una **asociación OIDC verificada** nombra a la persona, con la mención « persona verificada ».
2. En su defecto, la **cuenta OS** detrás del navegador o de la herramienta se muestra *a título informativo* — y se declara como tal. Para una herramienta nativa, es el perfil recopilado por la aplicación.
3. En su defecto, si el servidor sabe que una persona existe sin decir quién (seudónimo), la celda lee « seudonimizado »; sin ninguna pista, « no atribuido ». La expresión « no atribuido » no designa una cuenta oculta: designa la ausencia total de pista.

Una herramienta presente en un dispositivo nunca permite inferir a su usuario.

## El hilo de una conversación

Abrir una conversación despliega un diálogo a pantalla completa: resumen del intercambio (persona, herramienta, modelo, inicio, última actividad, número de mensajes) en cabeza, luego los mensajes representados del más antiguo al más reciente, como ocurrió el intercambio.

[IMAGEAMETTREICI 04]

- El hilo se **carga por páginas**: « Cargar los mensajes anteriores » retrocede en el tiempo. Cada página es una consulta independiente — si un derecho de revelación de identidad expira, las páginas siguientes ya no llevan el dato revelado, en lugar de un búfer que lo mantendría más allá de su vencimiento.
- El texto de los mensajes es un texto **bruto**, seleccionable y copiable, nunca reescrito ni interpretado. Un clic en la burbuja abre su detalle, salvo si un texto está en curso de selección (de lo contrario, resaltar para releer abriría un diálogo al soltar); la burbuja también se abre con Intro o Espacio cuando tiene el foco, y su pequeño icono de detalle sigue siendo accesible con el teclado.

### Lo que muestra una burbuja

- **PROMPT OCULTO / RESPUESTA OCULTA**, con la causa nombrada: « lectura no autorizada » (derecho faltante), « texto no conservado » (la recolección del texto está desactivada o el contenido purgado), « identidad no levantada ».
- Los **archivos adjuntos** se listan con un icono por tipo — leído en la extensión del nombre, la única información disponible: ningún byte de archivo se lee jamás.
- Un envío **acompañado de un archivo** produce dos registros (el archivo va hacia el proveedor desde el adjuntado); en la visualización, el archivo adjunto se une a la burbuja de su mensaje — un plegado de visualización solamente, cada registro conservando su marca de tiempo y su detalle.
- Una burbuja **bloqueada** lleva el motivo del rechazo, nombrado y no bruto: « rechazado por la política del modelo », « modelo no identificable », « control local no disponible ».
- Las **navegaciones** aparecen como líneas de referencia en el hilo, pulsables hacia su detalle.

[IMAGEAMETTREICI 05]

### El detalle de un registro

El detalle solo concierne a un sentido — un envío **o** una respuesta — y su título lo nombra. Reúne: marca de tiempo, persona, dispositivo, fuente (navegador o aplicación local), servicio y modelo, acción, motivo de rechazo si lo hubiera, plataforma, número de caracteres, categorías detectadas, archivos adjuntos, revisión de política aplicada, URL, identificadores de conversación y de correlación.

El texto conservado, si existe, se muestra con el aviso **« esta lectura de contenido fue auditada »**: toda consulta de un texto almacenado es trazada. Sin derecho de lectura explícito, la pantalla muestra un recuadro que lo dice en lugar de un marco vacío.

[IMAGEAMETTREICI 06]

## Exportaciones y paginación

- Las **exportaciones** contienen los metadatos correspondiendo exactamente a los filtros actuales; los textos eventuales exigen un derecho de lectura explícito, y cada consulta es auditada. La mención figura bajo la tabla, no en un aviso enterrado.
- La **paginación** está numerada (primera y última página siempre alcanzables, ellipsis en los saltos) con un selector de tamaño de página arriba a la derecha y el recuento total de resultados. A cero resultados, la pantalla propone ampliar el período o retirar un filtro.

[IMAGEAMETTREICI 07]

:::enterprise

El filtro y la columna de **sensibilidad de los usos** están reservados a Enterprise: Community nunca los muestra, en el registro como en la tarjeta. En Enterprise, un evento sensible lleva un badge ámbar, y los contenidos enmascarados llevan las etiquetas de las reglas de enmascaramiento que los detectaron.

:::

[IMAGEAMETTREICI 08]
