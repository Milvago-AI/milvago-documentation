---
sidebar_position: 1
title: Configurar mi perfil
---

# Configurar mi perfil

## Acceder a la pantalla

Haga clic en su bloque de usuario abajo a la izquierda y después en **Mi perfil**; en móvil abra primero el menú.

1. Complete los campos de identidad editables.
2. Elija el **Idioma de la consola**.
3. Haga clic en **Guardar mi perfil**.
4. Compruebe la confirmación de guardado; los cambios se aplican a la cuenta y a la sesión actual.

La página **Mi perfil** permite a cada persona conectada a Milvago Community o Milvago Enterprise consultar su identidad y elegir el idioma de su consola.

En la barra lateral, haga clic en su bloque de usuario, abajo a la izquierda. En móvil, abra primero el menú y luego haga clic en ese mismo bloque.

[IMAGEAMETTREICI 01]

## Identidad

El bloque **Identidad** muestra el nombre, el apellido, la dirección de correo electrónico y el tipo de cuenta: Local, SSO o LDAP. La dirección de correo se muestra en solo lectura.

Una cuenta local puede modificar su nombre y apellido y guardar el perfil. Para una cuenta SSO o LDAP, esos campos proceden del proveedor de identidad y no se pueden modificar en Milvago.

La lista **Idioma de la consola** está disponible para todos los tipos de cuenta: Français, English, Español y Português (Brasil). Con **Predeterminado**, la consola sigue primero una elección explícita ya guardada en este navegador y luego el idioma preferido del navegador; si no se solicita ninguno de los cuatro idiomas, se muestra en inglés. Haga clic en **Guardar mi perfil** para aplicar la elección a la cuenta y a la sesión actual.

[IMAGEAMETTREICI 02]

## Seguridad y acceso

El bloque **Seguridad y acceso** muestra el estado del segundo factor: **estado desconocido** cuando no se puede obtener, **configurado** o **sin configurar**.

Las acciones disponibles dependen del tipo de cuenta:

- **Local**: modificar la dirección de correo, modificar la contraseña y gestionar el segundo factor.
- **LDAP**: gestionar el segundo factor, que se puede configurar localmente.
- **SSO**: el nombre, la dirección de correo, la contraseña y el segundo factor se gestionan en el proveedor de identidad.

Cuando el segundo factor está **sin configurar**, el botón **Configurar mi segundo factor** abre directamente su inscripción en el proveedor de identidad en la pestaña actual. Al finalizar la inscripción, vuelve automáticamente a **Mi perfil**. Cuando está **configurado** o su estado es **desconocido**, el botón **Gestionar mis segundos factores** abre en una nueva pestaña el espacio seguro del proveedor de identidad, donde puede consultar sus autenticadores, añadirlos o eliminarlos.

**Mi perfil** permanece abierto en su pestaña: vuelva a él después de gestionar los autenticadores en el proveedor de identidad y su estado se actualizará. Las acciones para modificar la dirección de correo y la contraseña también vuelven automáticamente a **Mi perfil**.

En una instancia de demostración de solo lectura, estos botones están ocultos y un aviso lo indica.

[IMAGEAMETTREICI 03]

Gestione sus claves personales en [Claves de API y servidor MCP](cles-api.md).
