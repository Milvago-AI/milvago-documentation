---
sidebar_position: 2
title: Roles
---

# Roles

## Acceder a la pantalla

Haga clic en **Administración** > **Roles**. Necesita `roles.manage` para ver la pantalla — entre los roles integrados, solo el Propietario porta este permiso. Crear, editar o eliminar un rol, y listar quién lo ocupa, van más lejos: el servidor exige el rol Propietario en sí.

1. Haga clic en **Nuevo rol**.
2. Introduzca el nombre y seleccione los permisos que desea conceder.
3. Haga clic en **Guardar**.
4. Compruebe que el rol aparece en la lista con los permisos elegidos.

La pantalla Roles responde a la pregunta « **quién tiene derecho a hacer qué** ». Define los roles de la organización y, para cada uno, el conjunto de permisos que concede. El acceso exige el permiso `roles.manage` — entre los roles integrados, solo lo porta el Propietario; sin él, la pantalla muestra « Se requiere acceso de propietario ». La gestión de roles está reservada al rol Propietario por su nombre, no solo por un permiso: el servidor comprueba que el rol de quien llama sea `owner`, por lo que `roles.manage` ya no se ofrece al crear un rol personalizado — concedérselo no tendría ningún efecto.

## El principio: permisos, no etiquetas

Las autorizaciones las portan **permisos** verificados por el servidor en cada llamada, nunca el nombre de un rol. Un rol no es más que un conjunto nombrado de permisos: darle un nombre halagador no le otorga ningún derecho adicional, y una edición declarada por el cliente nunca otorga autorización.

Los permisos del catálogo, y su etiqueta en la consola:

| Permiso | Etiqueta |
| --- | --- |
| `overview.read` | Vista general |
| `events.read` | Eventos y cartografía |
| `devices.read` | Ver los dispositivos |
| `devices.manage` | Gestionar los dispositivos |
| `members.read` | Ver los miembros |
| `members.manage` | Gestionar los miembros |
| `roles.manage` | Gestionar los roles |
| `settings.manage` | Gestionar los ajustes |
| `policy.manage` | Gestionar la política (Shadow AI) |
| `installers.manage` | Gestionar los instaladores |
| `content.read` | Leer los contenidos |
| `content.purge` | Purgar los contenidos conservados |
| `audit.read` | Registro de auditoría |
| `organizations.manage` | Gestionar las organizaciones |
| `directory.manage` | Gestionar el directorio LDAP y el SSO |
| `reports.aggregate` | Leer los informes agregados |
| `identity.reveal` | Revelar identidades |
| `identity.erase` | Borrar identidades y renovar los alias |
| `observability.manage` | Gestionar la observabilidad (solo Enterprise) |

![Milvago - El principio: permisos, no etiquetas](/img/docs/en/administration-roles-01.png)

## Roles integrados y roles personalizados

Cuatro roles integrados existen en toda organización, portados con la mención « integrado » y en solo lectura:

- **Propietario** (`owner`): todos los permisos del catálogo.
- **Administrador** (`admin`): los permisos de operación — vista general, eventos, dispositivos (ver y gestionar), miembros (ver y gestionar), ajustes, política, instaladores, contenidos (lectura) e informes agregados — sin `roles.manage`, `observability.manage`, `content.purge`, `audit.read`, `organizations.manage`, `directory.manage`, `identity.reveal` ni `identity.erase`.
- **Lector** (`viewer`): vista general, eventos y dispositivos en lectura, e informes agregados.
- **Reporter** (`reporter`): solo vista general e informes agregados, el rol integrado más restringido. A diferencia de los tres primeros, `reporter` no tiene aún un nombre de visualización propio: las listas de selección de rol lo muestran con su nombre en bruto « reporter ».

El botón « Nuevo rol » crea un rol personalizado: un nombre, y los permisos marcados uno a uno. En la creación como en la edición, nada va premarcado — un rol empieza sin autorización y se amplía deliberadamente. Un nombre ya usado se señala antes de guardar.

Los roles integrados no se modifican; los roles personalizados portan « Editar » y « Eliminar », este último desactivado en su propio rol (« No puede eliminar el rol que ocupa actualmente. »).

![Milvago - Roles integrados y roles personalizados](/img/docs/en/administration-roles-02.png)

## Eliminar un rol todavía asignado

Una eliminación rechazada porque miembros portan aún el rol abre un diálogo dedicado: « El rol « … » no se puede eliminar mientras esté asignado. Reasigne o retire a los miembros de abajo y vuelva a intentar la eliminación. » Lista los portadores y ofrece dos salidas, sin abandonar la página: **Reasignar** cada miembro a otro rol, o **Retirar el acceso**. Mientras haya miembros que porten el rol, el botón « Eliminar el rol » permanece bloqueado (« Algunos miembros siguen ocupando este rol. »); sin ningún portador, se abre.

Un miembro sin derecho de gestión de miembros ve la lista de portadores pero no sus acciones, con el aviso que lo remite a un gestor de miembros.

:::enterprise

En Enterprise, la lista de miembros de un rol y las reasignaciones abarcan solo la organización actual; el rol en sí sigue siendo propio de cada organización. Los permisos `organizations.manage` (árbol de organizaciones) y `directory.manage` (directorio LDAP) solo se usan en multiorganización.

:::
