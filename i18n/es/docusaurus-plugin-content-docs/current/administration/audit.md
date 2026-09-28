---
sidebar_position: 6
title: Registro de auditoría
---

# Registro de auditoría

## Acceder a la pantalla

En la barra lateral, haga clic en **Administración** > **Registro de auditoría**. Necesita `audit.read`.

1. Haga clic en **Actualizar**.
2. Compruebe que la tabla se recarga o informa que no hay entradas visibles.

El registro de auditoría responde a la pregunta « **quién hizo qué** » sobre la plataforma. Traza las acciones de administración: cambio de rol, retirada de acceso, modificación de política, eliminación de un dispositivo, rotación de una clave, modificación de la confidencialidad — esta última con el motivo escrito que la autorizó, mostrado en la columna **Motivo**.

El acceso exige el permiso `audit.read` — entre los roles integrados, solo lo porta el Propietario; sin él, la pantalla muestra « Se requiere acceso de propietario ».

## La tabla

Cada línea porta cinco columnas: **Fecha**, **Autor**, **Acción** (código apuntado, tal como `directory.update` o `member.role`), **Objetivo** (identificador técnico, en fuente monospace) y **Motivo** — el motivo escrito que autorizó una modificación de la confidencialidad o una revelación de identidad, vacío para cualquier otra acción. En vacío, la pantalla lee « Ninguna acción registrada »; el botón « Actualizar » recarga la lista.

![Milvago - La tabla](/img/docs/en/administration-audit-01.png)

## Solo adición, por construcción

La línea bajo el título lo dice: « Registro del servidor de solo adición. » No es una política de interfaz, es un desencadenador en la base: toda modificación o eliminación de una línea de auditoría es rechazada por el propio PostgreSQL, por lo tanto ineludible incluso por un rol runtime comprometido. Un administrador no puede acortar la traza de sus propias acciones.

La **retención** sigue el mismo principio: el piso de 730 días está grabado en el desencadenador, no en un ajuste. Las purgas automáticas solo tocan líneas más viejas que ese piso — la retención no es configurable, y ese es el objetivo.
