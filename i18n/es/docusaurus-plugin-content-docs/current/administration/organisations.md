---
sidebar_position: 5
title: Organizaciones
tags: [Enterprise]
---

# Organizaciones

## Acceder a la pantalla

Haga clic en **Administración** > **Organizaciones**. Es una página Enterprise; crear, renombrar o eliminar exige `organizations.manage`.

1. Haga clic en **Nueva organización**.
2. Complete los campos.
3. Confirme la creación.

:::enterprise

Esta página solo concierne a la edición Enterprise. En Community, la organización es única y esta entrada de navegación no existe.

:::

La pantalla Organizaciones responde a la pregunta « **qué organizaciones veo, y cuáles gobierno** ». Las organizaciones son las raíces de aislamiento de la plataforma: dispositivos, políticas, conversaciones, miembros e inventario solo existen en una organización, y el aislamiento lo asegura **PostgreSQL Row-Level Security** al nivel de las filas, no un filtrado aplicativo.

## El selector de organización

La barra lateral porta, por encima de la navegación, el selector de organización: la organización actual como botón, y un panel lateral « Elegir una organización » que dibuja el árbol — « Las organizaciones hijas se agrupan bajo su organización principal. » Cada entrada porta su nombre y su rol en la organización; la organización actual está marcada con una marca de verificación. Las organizaciones accesibles cuya principal no lo es se listan en la raíz del panel.

[IMAGEAMETTREICI 01]

## La lista de organizaciones

La pantalla lista las « Organizaciones accesibles »: nombre (badge « Raíz » para la raíz, « Actual » para la de la sesión), identificador, principal, y acciones. Una organización sin acceso lee « Ninguna organización accesible ».

Con el permiso `organizations.manage` (« Gestionar las organizaciones »), la pantalla gana la selección por casilla y las acciones:

- **Nueva organización** — un nombre, una **organización principal** (entre aquellas donde usted es propietario), y una casilla « Exigir autenticación de doble factor a todos los miembros », no modificable después de la creación. El aviso de creación porta la regla de acceso: « Los miembros de una organización principal pueden acceder a los datos de las organizaciones hijas según sus permisos. » Crear una organización le convierte en su propietario: por lo tanto, debe tener, en la organización principal, todos los permisos del rol Propietario; un rol personalizado o una clave de API que solo tenga « Gestionar las organizaciones » es rechazado. Las organizaciones se anidan hasta veinte niveles como máximo, incluida la raíz.
- **Renombrar** — cualquier organización accesible.
- **Eliminar** — sola, o « Eliminar la selección » para un lote. El servidor rechaza la eliminación de la organización actual, de la raíz, y de una organización que aún tiene hijas (« Elimine primero sus organizaciones hijas (o selecciónelas juntas). »). Una eliminación de lote ordena los objetivos de las más profundas a las menos profundas, para vaciar cada principal de sus hijas seleccionadas antes de retirarla. La confirmación nombra lo irreversible: « Esto elimina de forma permanente las siguientes organizaciones y todos sus datos (miembros, roles, dispositivos, eventos). Las cuentas de usuario no se eliminan. » Eliminar exige un segundo factor verificado hace un momento; la consola redirige a la verificación y repite la eliminación al volver. Mientras la organización aún tenga texto de solicitudes y respuestas conservado, eliminarla también exige el derecho a purgar contenidos (`content.purge`, reservado al propietario por defecto); si no, el servidor rechaza con « Esta organización todavía tiene texto de prompt conservado: eliminarla exige el derecho a purgar contenidos. »

Actuar sobre otra organización desde esta lista — renombrarla, eliminarla, o rotar su clave de despliegue — exige que su conexión porte una autenticación de doble factor en cuanto esa organización la exige a sus miembros: la misma regla que para cambiar a ella. Las entradas de auditoría de la creación y la eliminación de una organización se escriben en el registro de la organización principal; la de un renombrado se escribe en el registro de la organización renombrada.

[IMAGEAMETTREICI 02]

## La página de una organización

Cada línea abre la página propia de la organización: « La identidad de la organización y los medios de despliegue que le pertenecen. »

- **Informaciones** — identificador, organización principal (« Ninguna — organización raíz » para la raíz, enlace hacia la principal si no) y su rol en ella.
- **Clave de despliegue** — con `installers.manage`, el panel de la clave propia de esta organización. Existe para que un administrador de una principal pueda rotar o revocar la clave de una hija **sin cambiar a su contexto**. Véase [Despliegue](deploiement.md).

[IMAGEAMETTREICI 03]
