---
sidebar_position: 2
title: Grupos de dispositivos
---

# Grupos de dispositivos

## Acceder a esta pantalla

En la barra lateral, haga clic en **Parque > Grupos**. Requiere `devices.read` y no está disponible en consulta solo agregada.

1. Con `devices.manage`, cree un grupo, abra su nombre, use **Añadir dispositivos**, selecciónelos y confirme.
2. Renombre, retire o elimine confirmando; los dispositivos retirados vuelven a la política de organización.
3. Con `policy.manage`, guarde la política de grupo: la revisión se distribuye en la próxima sincronización y la sensibilidad solo aparece en Enterprise.

Los grupos de dispositivos llevan una política Shadow AI común a varios dispositivos de golpe. Responden a la pregunta: cómo aplicar la misma excepción a un conjunto de máquinas sin reescribirla dispositivo por dispositivo.

La línea de información bajo el título lleva las dos reglas de lectura: « Un grupo aplica una misma política de Shadow AI a todos los dispositivos que contiene. La excepción propia de un dispositivo siempre prevalece sobre la de su grupo. »

![Milvago - Acceder a esta pantalla](/img/docs/en/fleet-groupes-01.png)

## Quién ve qué

| Acción | Condición |
| --- | --- |
| Ver los grupos y sus fichas | derecho `devices.read` |
| Crear, renombrar, eliminar, asignar dispositivos | derecho `devices.manage` |
| Regular la política del grupo | derecho `policy.manage` |

Los grupos existen en las dos ediciones: un grupo es una herramienta de organización del parque, no una función de inventario.

## La cadena de política

La política efectiva de un dispositivo se lee en tres niveles: **dispositivo > grupo > organización**. Un grupo solo sobrescribe las secciones que define; las secciones dejadas en herencia siguen a la organización. La excepción más cercana al dispositivo gana: una excepción propia al dispositivo prevalece sobre su grupo.

Un dispositivo pertenece a **un solo grupo** a la vez — no hay prioridad entre grupos que arbitrar. Retirarlo de un grupo lo devuelve a la política de la organización, y su historial se conserva.

## La lista de grupos

La tabla lleva cuatro columnas:

| Columna | Contenido |
| --- | --- |
| **Nombre** | pulsable hacia la ficha del grupo |
| **Descripción** | texto libre, o « — » |
| **Dispositivos** | número de dispositivos miembros |
| **Acciones** | « Renombrar » y « Eliminar » para quien tenga el derecho de gestión; « — » si no |

Un contador muestra el número de grupos. A falta de grupo, la pantalla lee « Aún no hay grupos de dispositivos ».

El botón « **Nuevo grupo** » abre un diálogo con dos campos: **Nombre del grupo** (obligatorio) y **Descripción**. Dos nombres no difieren solo por mayúsculas y minúsculas, y la descripción queda corta — ambas cotas se controlan en el guardado.

![Milvago - La lista de grupos](/img/docs/en/fleet-groupes-02.png)

## La ficha de un grupo

La ficha se abre por el nombre del grupo en la lista. Lleva dos pestañas: **Detalles**, siempre presente, y **Política del grupo** con el derecho `policy.manage`.

### Detalles

La tarjeta Detalles reúne el identificador del grupo, su descripción y su recuento de dispositivos. Bajo la tarjeta, la tabla de los dispositivos miembros retoma las columnas de la lista de dispositivos — Dispositivo (pulsable hacia su ficha), Plataforma, Estado, Última conexión — más la acción « **Retirar del grupo** », que devuelve el dispositivo a la política de la organización.

La tabla ofrece 10, 20, 50, 100 o 200 dispositivos por página y mantiene accesibles la primera página, la última y las páginas vecinas.

![Milvago - Detalles](/img/docs/en/fleet-groupes-03.png)

### Asignar dispositivos

El botón « **Añadir dispositivos** » abre un panel lateral que lista los dispositivos de la organización que todavía no pertenecen al grupo. Cada línea lleva una casilla de verificación, y un dispositivo ya miembro de otro grupo muestra el nombre de ese grupo: moverlo es un cambio que hay que ver antes de cometerlo. El botón de confirmación lleva su efectivo — « Añadir (N) » — y queda inactivo mientras nada esté marcado.

Este panel utiliza la misma paginación; los dispositivos marcados permanecen seleccionados al cambiar de página.

Dos estados vacíos se enuncian tal cual:

- ningún dispositivo miembro: « Ningún dispositivo en este grupo »;
- ningún candidato restante: « Todos los dispositivos pertenecen ya a este grupo. »

La asignación envía una consulta por dispositivo: un rechazo se señala dispositivo por dispositivo (« No se pudo actualizar: … ») en lugar de interrumpir a los demás. Reasignar a un dispositivo el grupo que ya porta no reescribe nada.

Asignar un dispositivo a un grupo cuya política conserva el texto de las solicitudes y las respuestas exige la misma verificación de segundo factor reciente que activarlo en Shadow AI.

### Política del grupo

La pestaña lleva la **excepción del grupo**. El editor es el mismo que el de [Shadow AI](../administration/shadow-ai.md), restringido a las secciones que un grupo puede sobrescribir: **Registro (enrollment) y recolección**, **Servicios**, **Protecciones**, **Enmascaramiento local**, y en Enterprise **Sensibilidad de los usos**. Las secciones dejadas en herencia siguen a la organización — la casilla « Heredar » la nombra.

El encabezado de sección muestra el alcance (« Excepción del grupo ») y la revisión actual. Cada guardado produce una nueva revisión; las instalaciones la reciben en su próxima sincronización, y la aplicación efectiva se observa en Monitoring.

![Milvago - Política del grupo](/img/docs/en/fleet-groupes-04.png)

## Revisiones y anti-retroceso

Cada cambio del lado del grupo — guardado de la política, asignación, retiro, eliminación — produce una revisión más reciente, y la política efectiva de un dispositivo la hereda. Un dispositivo nunca aplica una revisión más antigua que la que posee: pasar de un grupo a otro y luego volver solo hace crecer la revisión. Esta regla impide que un dispositivo quede bloqueado sobre una política superada por un juego de fechas desfavorable.

## Eliminar un grupo

La confirmación lleva la consecuencia exacta: « Los dispositivos de un grupo eliminado vuelven a la política de la organización. Su historial se conserva. » Los dispositivos se desvinculan primero — cada uno recibe una revisión fresca — luego el grupo desaparece con su política. El recuento de dispositivos del grupo figura en la confirmación. Eliminar un grupo cuyos dispositivos pasarían entonces a conservar el texto de las solicitudes y las respuestas — la organización lo conserva, el grupo no lo conservaba — exige la misma verificación de segundo factor reciente que asignar un dispositivo a un grupo así.

![Milvago - Eliminar un grupo](/img/docs/en/fleet-groupes-05.png)

Véase también: [Dispositivos](postes.md), [Shadow AI](../administration/shadow-ai.md).
