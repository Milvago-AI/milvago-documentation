---
sidebar_position: 6
title: Reports
---

# Reports

## Acceder a esta pantalla

En la barra lateral, haga clic en **Supervisión > Informes**. Requiere `reports.aggregate` y existe en ambas ediciones.

1. Elija **Equipos** o **Grupos** cuando ambos existan, y después **Tabla** o **Cartografía**.
2. Haga clic en un nodo para aislar o retirar una selección.
3. Haga clic en **Exportar** para descargar todas las semanas publicadas del desglose actual; sin semanas, el botón no aparece.

Reports es la vista de síntesis **agregada y publicada** de los usos: semanas completas y fijas, publicadas una vez, jamás recalculadas. Responde a « ¿qué pasa, semana tras semana, por equipo o por parque? » sin exponer a los individuos: los grupos pequeños y los vínculos identificantes se omiten.

Exige el permiso `reports.aggregate` — es la única pantalla de Monitoring accesible a un lector de agregados sin lectura de los dispositivos ni de las conversaciones.

[IMAGEAMETTREICI 01]

## Dos desgloses de una misma semana

Cada semana publicada se lee según dos ejes, puestos lado a lado:

- **Equipos** — el atributo OIDC portado por las personas (configurado en Confidencialidad);
- **Grupos de dispositivos** — el desglose Fleet > Grupos.

La pestaña solo aparece si el desglose existe realmente; si ni el atributo de equipo ni los grupos existen, un aviso lo dice y propone dónde actuar: « todas las líneas salen como no atribuido — indique el atributo de equipo en Confidencialidad, o cree grupos en Parque ».

[IMAGEAMETTREICI 02]

Una semana publicada **antes** de la existencia del desglose por grupos no lo lleva: la pantalla muestra « sin desglose por grupo de dispositivos para esta semana » en lugar de un cero engañoso — la ausencia del dato nunca vale « cero solicitudes ».

## Tabla o tarjeta

Cada semana se lee en **tabla** (equipo o grupo, herramienta, servicio, modelo, solicitudes, respuestas, temas) o en **cartografía**: el mismo diagrama en cintas que la Cartografía de Monitoring, donde cada equipo (o grupo) se convierte en el punto de partida de los flujos. La selección de un nodo es posible, sin codificación de sensibilidad.

[IMAGEAMETTREICI 03]

## Lo que el k-anonimato hace a las líneas

Una fila (equipo o grupo, herramienta, servicio, modelo) solo se publica si al menos *k* personas distintas la usaron durante la semana. Este umbral se ajusta en [Confidencialidad](../administration/confidentialite.md). Las filas más pequeñas se retiran. También las que quedan por debajo del umbral en el otro desglose (equipos o grupos): de lo contrario, podrían deducirse por resta entre las dos vistas. La actividad que no está vinculada a ninguna persona también se excluye.

Las filas que superan el umbral siguen visibles. Una semana incompleta lleva la insignia **Filas ocultas**, y un aviso encima de las semanas explica por qué. Ciérrelo con la cruz: la elección se recuerda en su navegador, la insignia permanece en cada semana afectada y el enlace **¿Por qué hay filas ocultas?** vuelve a mostrar la explicación. Una fila ausente nunca es un cero: lo omitido se señala como omitido.

[IMAGEAMETTREICI 04]

## Exportación

El botón de exportación produce un **CSV** de todas las semanas según el desglose actual: semana, equipo (o grupo), herramienta, servicio, modelo, solicitudes, respuestas, temas. El archivo se abre correctamente bajo Excel sin asistente de importación (BOM UTF-8, separador anunciado), y los valores provenientes de un token de identidad o de un campo de consola se neutralizan contra la inyección de fórmulas — una celda que empieza por `=`, `+`, `-`, `@` nunca se interpreta.

[IMAGEAMETTREICI 05]

A cero semanas publicadas, la pantalla lee « Datos insuficientes »: los agregados se acumulan con las publicaciones, no se retrocalculan.

[IMAGEAMETTREICI 06]
