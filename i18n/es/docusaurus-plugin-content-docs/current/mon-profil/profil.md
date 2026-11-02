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

![Milvago - Acceder a la pantalla](/img/docs/en/mon-profil-profil-01.png)

## Identidad

El bloque **Identidad** muestra el nombre, el apellido, la dirección de correo electrónico y el tipo de cuenta: Local, SSO o LDAP. La dirección de correo se muestra en solo lectura.

Una cuenta local puede modificar su nombre y apellido y guardar el perfil. Para una cuenta SSO o LDAP, esos campos proceden del proveedor de identidad y no se pueden modificar en Milvago.

La lista **Idioma de la consola** está disponible para todos los tipos de cuenta: Français, English, Español y Português (Brasil). Con **Predeterminado**, la consola sigue primero una elección explícita ya guardada en este navegador y luego el idioma preferido del navegador; si no se solicita ninguno de los cuatro idiomas, se muestra en inglés. Haga clic en **Guardar mi perfil** para aplicar la elección a la cuenta y a la sesión actual.

## Seguridad y acceso

El bloque **Seguridad y acceso** enumera, una fila por elemento, su dirección de correo, su contraseña y su segundo factor. Cada botón **Cambiar**, **Añadir un dispositivo** o **Eliminar** abre una página segura de inicio de sesión de Milvago en la misma pestaña y luego vuelve a **Mi perfil**, donde un mensaje confirma el cambio.

Las acciones disponibles dependen del tipo de cuenta:

- **Local**: modificar la dirección de correo, modificar la contraseña y gestionar el segundo factor.
- **LDAP**: gestionar el segundo factor, que se puede configurar localmente.
- **SSO**: el nombre, la dirección de correo, la contraseña y el segundo factor se gestionan en el proveedor de identidad.

La fila **Segundo factor** enumera sus dispositivos, cada uno con su nombre y la fecha en que se añadió:

- Sin ningún dispositivo, **Configurar mi segundo factor** le guía para escanear un código QR con una aplicación de autenticación (Microsoft Authenticator, Google Authenticator, FreeOTP…) y luego introducir el código que muestra.
- **Añadir un dispositivo** configura otra aplicación, por ejemplo en un segundo teléfono; al iniciar sesión, usted elige qué dispositivo muestra el código.
- **Eliminar** pide primero una confirmación y luego un código de uno de sus dispositivos. Si inició sesión hace más de unos minutos, también se vuelve a pedir su contraseña. Sin ningún dispositivo restante, su inicio de sesión solo pide la contraseña, salvo que su organización exija un segundo factor: en ese caso configura un nuevo dispositivo en su próximo inicio de sesión.

Cuando no se puede comprobar el segundo factor, la fila lo indica y no ofrece ninguna acción.

Si utiliza **¿Olvidó su contraseña?** en la página de inicio de sesión, el enlace enviado por correo le permite establecer una nueva contraseña. Un dispositivo ya configurado para la cuenta se conserva y seguirá siendo obligatorio en el siguiente inicio de sesión.

En una instancia de demostración de solo lectura, estos botones están ocultos y un aviso lo indica.

![Milvago - Seguridad y acceso](/img/docs/en/mon-profil-profil-03.png)

Gestione sus claves personales en [Claves de API y servidor MCP](cles-api.md).
