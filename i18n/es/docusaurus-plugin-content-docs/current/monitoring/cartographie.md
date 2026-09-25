---
sidebar_position: 3
title: Cartografía
---

# Cartografía de las solicitudes

## Acceder a esta pantalla

En la barra lateral, haga clic en **Supervisión > Cartografía**. Requiere `events.read` y no está disponible para consulta solo agregada.

1. Haga clic en **Afinar filtros**, defina período y criterios, y después en **Aplicar**.
2. Seleccione o excluya valores en los rieles; retire una etiqueta o use **Borrar**. **Ocultar personas** muestra una vista global.
3. Un nodo, cinta o **Ver estas solicitudes** abre Conversaciones con el alcance dibujado. La exportación y el informe conservan filtros, selecciones y exclusiones; la identidad revelada requiere `identity.reveal`.

La cartografía responde a una sola pregunta: **quién habla con qué**. Dibuja, sobre el período elegido, los flujos entre las personas, las herramientas, los servicios y los modelos, en cintas cuya anchura representa las solicitudes y cuyo color representa al editor del servicio.

No responde a « ¿estoy observando bien? »: la salud de la captura vive en Discovery, con el resto de lo que habla de cobertura. Navegaciones e inventarios no se convierten en solicitudes — el pie de la tarjeta lo dice cuando el período está vacío.

[IMAGEAMETTREICI 01]

## Lo que la pantalla cuenta

Cuatro indicadores bajo la barra de filtros: **solicitudes**, **respuestas**, **conversaciones identificadas**, y, en Enterprise, **eventos sensibles** (tonalidad ámbar en cuanto el valor es > 0). Una línea de información nombra lo que la tarjeta no puede hacer: « N eventos sin persona verificada » — la identidad verificada proviene de una asociación OIDC; en su defecto, la cuenta OS detrás de la herramienta se muestra a título informativo. Las navegaciones se cuentan aparte.

[IMAGEAMETTREICI 02]

## La tarjeta: rieles y cintas

El diagrama está organizado en cuatro columnas conectadas por cintas:

- a la izquierda, **Personas** y **Navegadores / aplicaciones**;
- al centro, las **cintas** mismas, una por flujo (persona × herramienta × servicio × modelo);
- a la derecha, **Servicios** y **Modelos**.

Cada columna lleva su recuento de valores presentes en el período (« 10 / 47 »). Al pasar el ratón sobre una cinta o un nodo, una infoburbuja detalla el volumen, los bloqueados y, en Enterprise, el número de eventos sensibles.

[IMAGEAMETTREICI 03]

- **Ocultar las personas (uso global)**: una casilla de la barra de filtros cambia la vista a « herramientas, servicios, modelos » — el polo personas desaparece, el uso se vuelve global. Es una vista de cliente: los filtros laterales **nunca amplían** lo que el servidor devolvió, solo deciden lo que se dibuja.
- Los **filtros laterales** (rieles, plegables) excluyen o aíslan valores de cada columna. Una selección que la nueva vista ya no dibuja se retira automáticamente en lugar de falsear el enlace hacia el registro.
- Pulsar un nodo o una cinta **profundiza en Conversations**: el enlace transmite el período y la selección actual, naturaleza « prompt ». La selección se lee en el pie de la tarjeta (pastillas removibles, botón « Borrar »), con un « Ver estas solicitudes » que lleva exactamente lo que la pantalla muestra — selección y exclusiones incluidas.

[IMAGEAMETTREICI 04]

## Leyenda y estados

- La leyenda lleva « No atribuido » (los flujos sin persona) y, en Enterprise, « Sensible ».
- A cero solicitudes en el período, la tarjeta lo asume: « Ninguna solicitud en este período », con la precisión de que las navegaciones e inventarios no se convierten en solicitudes.
- La barra de filtros es plegable aquí (la tarjeta queda compacta); el botón « Refinar los filtros » la abre, y un « Restablecer » dedicado retira los filtros laterales.

[IMAGEAMETTREICI 05]

:::enterprise

En Enterprise, la anchura de las cintas se duplica con una codificación de **sensibilidad detectada**: rayado en las cintas, contador por nodo, KPI dedicado y riel de filtrado. En Community, la tarjeta se limita al par solicitudes/bloqueadas — nada se nombra sensibilidad, ni en la tarjeta ni en el registro.

:::

[IMAGEAMETTREICI 06]

## Exportaciones

La exportación cubre lo que usted mira, no la barra de filtros desnuda: las pastillas de selección y las exclusiones de los rieles se recogen en el informe, exactamente como los enlaces de detalle. Como en el registro, la exportación contiene los metadatos correspondiendo exactamente a los filtros; los textos eventuales exigen un derecho de lectura explícito, y cada consulta es auditada.

[IMAGEAMETTREICI 07]
