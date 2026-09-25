---
sidebar_position: 6
title: Organizaciones padre e hija
tags: [Enterprise]
---

# Organizaciones padre e hija

:::enterprise

Esta página solo concierne a la edición Enterprise, que permite varias organizaciones aisladas dentro de una misma instancia. En Community, solo existe una organización única.

:::

Milvago Enterprise aloja varias organizaciones en una misma instancia: una **organización raíz**, y debajo de ella un árbol de organizaciones hijas — la raíz no tiene padre, toda otra organización tiene uno. Cada organización conserva sus propios dispositivos, eventos, políticas y miembros; el árbol organiza el acceso y la herencia.

[IMAGEAMETTREICI 01]

## Recorrido de creación

1. Inicie sesión en Milvago Enterprise con `organizations.manage` en la organización padre.
2. En el menú lateral, abra **Administración → Organizaciones**.
3. Seleccione **Nueva organización**.
4. Introduzca el nombre, elija la organización padre y, si es necesario, exija la autenticación multifactor para todos sus miembros.
5. Cree la organización y compruebe que aparece bajo su padre en el árbol.

## Crear una organización hija

La pantalla **Organizaciones** lista las organizaciones accesibles, la raíz en cabeza, y agrupa las hijas bajo su padre. El diálogo « Nueva organización » pide:

- el **nombre** (obligatorio);
- la **organización padre**, elegida entre las organizaciones donde el creador es propietario — en su defecto, la raíz;
- la opción « **Exigir la autenticación multifactor a todos los miembros** ».

El creador se convierte en **propietario** de la nueva organización. El vínculo de filiación se fija en la creación y ya no se modifica; una organización se mueve recreándola, no cambiándole de padre.

La creación está autorizada por el derecho `organizations.manage` portado por la **organización padre** apuntada, no por la organización actual de la sesión. La hija queda operativa inmediatamente: sus roles integrados se establecen, y su **clave de despliegue** se emite desde su existencia — puede registrar dispositivos sin otra configuración.

## El acceso desciende por el árbol

Una pertenencia otorga el acceso a todo el subárbol:

- ser miembro (cualquiera que sea el rol) de una organización da acceso a **todas sus organizaciones hijas**, a todos los niveles;
- el rol aplicado en una organización es el de la **pertenencia de ascendencia más próxima** — una pertenencia directa gana sobre una heredada;
- a la inversa, una hija nunca accede a su padre: el acceso solo desciende.

La consola lista las organizaciones accesibles con el rol efectivo en cada una, y el cambio de organización se hace sin nueva conexión. Un administrador del padre puede así intervenir en una hija según sus permisos efectivos — por ejemplo, rotar la clave de despliegue de una hija desde su ficha, sin cambiarse hacia ella.

:::note
Una clave API está **fijada a la organización donde fue creada**: sea cual sea la pertenencia de su creador, nunca actúa fuera de esa organización, incluso en las rutas que nombran otra organización en la URL.
:::

[IMAGEAMETTREICI 02]

## El aislamiento de los datos

El aislamiento se apoya en **PostgreSQL Row-Level Security**: cada consulta lleva el contexto de una organización, y las filas de otra organización son invisibles — incluso para una cuenta que tendría derechos en otra parte. Los identificadores de una organización pasados en una consulta desde otra responden « no encontrado », sin diferencia entre « inexistente » y « fuera de alcance ».

La eliminación de una organización arrastra sus datos en cascada — dispositivos, eventos, políticas, grupos — pero no la cuenta de los usuarios, que se comparte entre organizaciones.

## Lo que el padre impone

Tres ajustes descienden por el árbol, cada uno con su regla propia.

### La política Shadow AI

Una organización hija puede marcar secciones « **Heredar** » y recibirlas de su padre, sección por sección — incluidos Registro (enrollment) y Explotación, que grupos y dispositivos no pueden tocar. La procedencia nombra la organización de origen, y una sección recubierta más abajo remonta a su escritor real. Véase [Herencia de la configuración](heritage-configuration.md).

### La confidencialidad

:::note
El bloqueo parental solo impone ajustes **protectores**: seudonimización por defecto, informes agregados únicamente, k-anonimato, duración de vinculación de identidad. Una organización padre nunca puede dar su consentimiento a una recolección en nombre de una hija.
:::

Cuando el padre activa « **Imponer a las organizaciones hijas** », la configuración bloqueada se muestra tal cual en las hijas con la mención « La configuración está bloqueada. » y su origen — la organización padre; los campos correspondientes se vuelven inertes.

### Las exportaciones de observabilidad

Una organización puede « **Imponer esta configuración a las organizaciones hijas** » para sus destinos de exportación. La hija que sufre la imposición lee « Configuración impuesta por » seguido del nombre de la organización padre — no puede ni personalizarla ni desactivar la exportación, y su personalización anterior queda **conservada pero inactiva** mientras la restricción se aplique. En ausencia de imposición, la hija puede heredar voluntariamente o conservar su configuración propia; los secretos del padre nunca se copian en la hija.

[IMAGEAMETTREICI 03]

## Los ajustes reservados a la raíz

Dos ajustes de instancia solo son modificables desde la organización raíz, por un propietario: la **URL pública del agente** (la que llevan los instaladores) y el **idioma por defecto** de la consola. Una organización hija los lee pero no los cambia.

## Eliminar una organización

Tres bloqueos, en el orden del código:

- la organización **actual** de la sesión no puede eliminarse a sí misma;
- la organización **raíz** no puede eliminarse;
- un **padre** no puede eliminarse mientras tenga hijas — la pantalla invita a eliminarlas primero, o a seleccionarlas juntas: la eliminación en masa va **de las hojas hacia la raíz**.

Véase también: [Herencia de la configuración](heritage-configuration.md), [Organizaciones](../administration/organisations.md).
