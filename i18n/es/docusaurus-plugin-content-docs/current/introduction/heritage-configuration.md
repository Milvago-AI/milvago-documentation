---
sidebar_position: 5
title: Herencia de la configuración
---

# Herencia de la configuración

La configuración Shadow AI de Milvago se lee en tres niveles: **organización → grupo de dispositivos → dispositivo**. Cada nivel solo define lo que quiere cambiar; una sección ausente se hereda del nivel superior, y la excepción más cercana al dispositivo gana.

![Milvago - Herencia de la configuración](/img/docs/en/introduction-heritage-configuration-01.png)

## El principio: secciones, no bloques

La configuración no es un bloque único sino una **lista de secciones**: registro (enrollment), recolección, servicios, protecciones, enmascaramiento local, sensibilidad de los usos, control de modelos, explotación. La herencia se regula **sección por sección**:

- una sección **definida** en un nivel se aplica a todo lo que está debajo;
- una sección **dejada en herencia** sigue el nivel superior;
- un nivel inferior puede reescribir una sección precisa sin copiar las demás.

Un grupo que solo quiere cambiar « Protecciones » define únicamente esa sección: servicios, enmascaramiento y el resto siguen siguiendo a la organización.

## Lo que cada nivel puede definir

| Nivel | Secciones posibles | Pantalla de edición |
| --- | --- | --- |
| **Organización** | todas, incluidas Registro (enrollment) y Explotación | Administration → Shadow AI |
| **Grupo de dispositivos** | recolección, servicios, protecciones, enmascaramiento local, sensibilidad de los usos, control de modelos | Parque → Grupos |
| **Dispositivo** | las mismas seis secciones que el grupo | ficha del dispositivo → Política del dispositivo |

Dos secciones quedan por naturaleza en la organización: **Registro (enrollment)** (quién puede unirse, según qué red) y **Explotación** (actualizaciones del agente). Un grupo o un dispositivo no puede ni sobrescribirlas ni debilitarlas — son decisiones de parque, no de uso.

Un dispositivo pertenece a un solo grupo a la vez: no hay prioridad que arbitrar entre varios grupos. Retirarlo de un grupo lo devuelve a la política de la organización.

## Quién ve la procedencia

El editor muestra el alcance actual (« Política de la organización », « Excepción del grupo », « Excepción del dispositivo ») y, para cada sección heredada, una casilla « **Heredar · nombre de la sección** » que nombra la pantalla de la que proviene la sección — el grupo en la ficha de un dispositivo, la organización en la ficha de un grupo. La procedencia sigue al **último escritor**: una sección heredada de la organización padre y luego recubierta por el grupo se atribuye al grupo.

![Milvago - Quién ve la procedencia](/img/docs/en/introduction-heritage-configuration-02.png)

## Las revisiones, en orden

Cada guardado produce una **revisión** más reciente, y la política efectiva de un dispositivo suma las revisiones de sus niveles. Un dispositivo nunca aplica una revisión más antigua que la que posee: mover un dispositivo de un grupo a otro y luego volverlo solo hace crecer la revisión. Esta regla de **no retroceso** garantiza que ninguna manipulación de asignación pueda hacer que un dispositivo vuelva a una política desactualizada — por ejemplo, reimponer un bloqueo retirado.

Reasignar a un dispositivo el grupo que ya posee no reescribe nada: la revisión no se mueve y el agente no ve ningún cambio.

## La cadena completa en Enterprise

:::enterprise

En Enterprise, la cadena cuenta con un nivel adicional **por encima** de la organización: la **organización padre**. Una organización hija puede marcar secciones « Heredar » y recibirlas de su padre — véase [Organizaciones padre e hija](organisations-mere-fille.md). La cadena efectiva de un dispositivo se convierte en: organización padre → organización → grupo → dispositivo, siempre sección por sección, y la procedencia nombra la pantalla de origen.

Dos reglas completan el conjunto:

- la **sensibilidad de los usos** solo existe en el editor si la edición sirve esta capacidad — la sección desaparece en lugar de mostrarse inutilizable;
- la profundidad del árbol de organizaciones está acotada: una ascendencia demasiado profunda se rechaza en lugar de leerse indefinidamente.

:::

## Quién puede escribir qué

| Edición | Derecho requerido |
| --- | --- |
| Política de la organización | `policy.manage` |
| Política de un grupo | `policy.manage` |
| Política de un dispositivo | `policy.manage` |

El derecho solo no siempre basta: los ajustes que exponen contenido — activar la recolección de texto, relajar una protección de confidencialidad — exigen una **autenticación MFA reciente**, sea cual sea el nivel desde el que parte la modificación.

Véase también: [Shadow AI](../administration/shadow-ai.md), [Grupos de dispositivos](../fleet/groupes.md), [Dispositivos](../fleet/postes.md).
