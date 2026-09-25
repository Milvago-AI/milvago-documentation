---
sidebar_position: 5
title: Discovery
---

# Discovery

## Acceder a esta pantalla

En la barra lateral, haga clic en **Supervisión > Descubrimiento**; requiere `policy.manage`.

1. Para activar los dominios candidatos, vaya a **Administración > Shadow AI > Plataformas de IA**, active **Descubrir dominios candidatos**, escriba un motivo de al menos ocho caracteres y guarde tras la MFA reciente. También se requiere `settings.manage`; solo aparecen observaciones futuras.
2. Use **Promover** si el catálogo publicado lo ofrece, o **Ignorar** / **Reconsiderar**; la lista se recarga.
3. En Enterprise, haga clic en un servicio o dominio para buscar y abrir dispositivos. Community no muestra ese diálogo ni cuentas OS; una demo de solo lectura no muestra acciones.

Discovery responde a la pregunta que plantea un RSSI desde el primer día: **¿qué IA usan mis gentes sin que yo las mire?** La pantalla lista lo que la flota alcanzó **más allá de lo que el catálogo cubre**: las plataformas de IA conocidas visitadas, y los dominios candidatos observados por los detectores.

Exige la gestión de la política (`policy.manage`) — es una pantalla de decisión, no una consulta pasiva.

[IMAGEAMETTREICI 01]

## Plataformas conocidas

La primera tarjeta lleva las **plataformas de IA conocidas** que los dispositivos alcanzaron. El aviso de encabezado fija la frontera, en todas sus letras: **solo presencia** — el host fue alcanzado; ningún prompt, ninguna respuesta, ninguna dirección ni conversación se recopila en estas plataformas.

| Columna | Contenido |
| --- | --- |
| **Servicio** | la plataforma (botón « alcanzada por los dispositivos » en Enterprise) |
| **Visitas** | el número de visitas registradas |
| **Dispositivos** | el número de dispositivos distintos |
| **Cuentas OS** | Enterprise únicamente: las cuentas OS conectadas en el momento de las visitas |
| **Último señalamiento** | la fecha más reciente |

[IMAGEAMETTREICI 02]

Las dos tablas están acotadas del lado del servidor (500 dominios candidatos como máximo, plataformas del catálogo firmado): la paginación es una ayuda a la lectura, no un medio de ir a buscar menos. Una lista reducida bajo la página mostrada vuelve a la última página en lugar de presentar una tabla vacía.

## Dominios candidatos

La segunda tarjeta lista los **dominios de IA** que los dispositivos señalan y que el catálogo no cubre, con su número de observaciones y dos acciones por línea:

- **Marcar el candidato publicado como promovido** — ofrecida solo para un dominio que el catálogo publicado porta realmente; el servidor sigue siendo la autoridad y responde 409 si la publicación falta.
- **Ignorar / Reconsiderar** — retirar un dominio de la señal, o devolverlo.

[IMAGEAMETTREICI 03]

En una instancia en solo lectura, las acciones no aparecen en lugar de prometer botones rechazados.

A **cero candidatos, la pantalla es un estado normal, no un fallo**: el descubrimiento de los dominios candidatos está desactivado por defecto, y la pantalla lo dice con el enlace que la reactiva — « Actívela en Shadow AI, Plataformas IA, para que los dispositivos señalen los dominios de IA que alcanzan y que este catálogo no cubre. » El interruptor atraviesa la ruta de confidencialidad, con su motivo escrito y su MFA reciente.

[IMAGEAMETTREICI 04]

## ¿Quién alcanzó este dominio?

Cada línea abre un diálogo **« Dispositivos que alcanzaron este dominio en los últimos N días »**, con una búsqueda (nombre de máquina o identificador de dispositivo, lo que porta un lector llegado de una ficha de dispositivo), el número de observaciones por dispositivo y la última fecha. Los relevamientos del detector se purgan más allá de la ventana: una visita más antigua ya no se cuenta aquí.

Un solo diálogo responde a la misma pregunta desde las dos tablas, porque un lector que pregunta « quién fue » no se preocupa de saber qué tabla porta la respuesta.

[IMAGEAMETTREICI 05]

:::enterprise

El diálogo « alcanzada por los dispositivos » y la columna Cuentas OS solo existen en Enterprise: en Community, las líneas quedan en texto plano en lugar de llevar un control que respondería 404. El catálogo porta también la regla de higiene del descubrimiento: los dominios de los proveedores cubiertos — tras la reducción a la edición servida — nunca aparecen en Discovery, y una plataforma oculta por la organización sale de ella manteniendo sus visitas registradas.

:::

[IMAGEAMETTREICI 06]
