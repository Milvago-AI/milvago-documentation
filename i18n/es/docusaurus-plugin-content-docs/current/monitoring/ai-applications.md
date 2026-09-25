---
sidebar_position: 4
title: AI applications
tags: [Enterprise]
---

# AI applications

## Acceder a esta pantalla

En la barra lateral, haga clic en **Supervisión > Aplicaciones de IA**. Requiere Milvago Enterprise, `events.read` y una organización sin consulta solo agregada.

1. Elija **Por página** para recorrer la lista.
2. Haga clic en **En qué dispositivos** y después en el nombre de un dispositivo para abrir su ficha.
3. Cierre el diálogo al terminar; no modifica datos.

:::enterprise

Esta página solo concierne a la edición Enterprise: aparece en la navegación únicamente con el rol de análisis. Community se limita al navegador — el código y las dependencias de inventario están ausentes del binario entregado.

:::

La página lista las **aplicaciones de IA** detectadas en los dispositivos: software nativo, asistentes integrados, aplicaciones de IA locales, relevadas por el inventario del agente y descritas por el **catálogo firmado**. Completa los usos de navegador de Monitoring con el parque de software.

La frase de encabezado fija la regla de lectura: **una presencia detectada no establece ni un uso, ni un envío.** Las solicitudes se leen en Shadow AI; una herramienta instalada pero jamás solicitada no es un evento Shadow AI.

[IMAGEAMETTREICI 01]

## La tabla de las aplicaciones observadas

Una línea por **herramienta** detectada (todas las observaciones se agrupan por herramienta, no por dispositivo), clasificadas de la más extendida a la más rara, luego por orden alfabético:

El selector **Por página** ofrece 10, 20, 50, 100 o 200 herramientas. Una herramienta y todas sus observaciones permanecen en la misma página; los controles numerados dan acceso a la primera página, la última y las páginas vecinas.

| Columna | Contenido |
| --- | --- |
| **Aplicación** | el nombre del catálogo (o el identificador bruto si la herramienta es desconocida del catálogo) |
| **Editor** | el nombre del editor, « — » si el catálogo no lo conoce |
| **Riesgo** | badge de tonalidad según el nivel del catálogo |
| **Dispositivos** | número de dispositivos donde la herramienta fue encontrada |
| **En qué dispositivos** | los tres primeros nombres de máquinas, luego « y N otras »; la celda es un **botón** (véase abajo) |
| **Reconocida por** | cómo fue identificada la herramienta (extensión de navegador, aplicación local…) |
| **Primera observación** | la fecha de detección más antigua de la herramienta |

[IMAGEAMETTREICI 02]

A cero detecciones, la pantalla lo asume: « Ninguna aplicación de IA observada — los dispositivos Enterprise reportan las aplicaciones descritas por el catálogo firmado. Una presencia no es un uso. »

## ¿En qué dispositivos?

Un recuento solo obligaba a reabrir cada máquina para saber en cuál intervenir. La celda abre por tanto un diálogo que lista **todos** los dispositivos que portan la herramienta — sin segunda consulta, la lista completa ya está en la carga de la página: dispositivo (enlace hacia su ficha), forma de ser reconocida, primera observación. Este diálogo utiliza la misma lista ancha y de altura limitada que Discovery: su encabezado permanece visible y la tabla se desplaza dentro de la ventana. El dispositivo aparece allí con su nombre real para quien porte `devices.read` fuera de la consulta solo agregada; los demás lectores ven el alias del dispositivo. En consulta solo agregada, la API y el servidor MCP solo devuelven recuentos: número de dispositivos por herramienta y por forma de ser reconocida, primera y última observación de la herramienta; no se designa ningún dispositivo, y se rechaza la lista de herramientas de un dispositivo concreto.

[IMAGEAMETTREICI 03]

Lo que esta página no dice: no deduce un uso de una presencia. Una herramienta señalada, luego suprimida del dispositivo, desaparece de la lista en el señalamiento siguiente — su historial queda en las conversaciones.
