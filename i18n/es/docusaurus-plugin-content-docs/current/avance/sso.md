---
sidebar_position: 5
title: SSO (Google / Microsoft Entra ID)
---

# SSO (Google / Microsoft Entra ID)

¿Cómo permitir que los miembros inicien sesión con su cuenta de Google Workspace o Microsoft Entra ID?

El inicio de sesión único se configura enteramente desde la consola de Milvago, en **Administración** > **Ajustes** > **SSO**. Nadie necesita abrir el servicio de identidad detrás de Milvago: su administración no es accesible desde la red, y la consola escribe el proveedor por usted.

## Acceder a la pantalla

1. En la barra lateral, abra **Administración** y luego haga clic en **Ajustes**.
2. En la navegación vertical, haga clic en **SSO**.

La sección muestra un bloque por proveedor — **Google Workspace** y **Microsoft Entra ID** — cada uno con su **URI de redirección**, sus campos y un botón **Guardar**.

![Configuración de SSO para Google Workspace y Microsoft Entra ID](/img/docs/es/avance-sso-01.png)

## Quién puede configurarlo

- La sección **SSO** aparece con el permiso `directory.manage` (« Gestionar el directorio LDAP y el SSO ») y una licencia fuera del modo restringido: una instancia Community sin licencia no muestra ni la sección ni el inicio de sesión SSO.
- Guardar o eliminar un proveedor exige un segundo factor verificado hace un momento, y ninguna de las dos acciones está disponible para una clave API.
- El secreto de cliente nunca vuelve a mostrarse una vez guardado: el campo permanece vacío, y dejarlo vacío conserva el secreto almacenado.

:::enterprise

Un proveedor se ofrece en la página de inicio de sesión de todas las organizaciones de la instancia. Solo un propietario de la organización raíz puede configurarlo; cualquier otra persona que abra la sección lee « El inicio de sesión único se aplica a todas las organizaciones de esta instancia: solo un propietario de la organización raíz puede configurarlo. »

:::

## Principio: invitar primero, vincular en el primer inicio de sesión

**Una persona debe estar invitada en Milvago antes de su primer inicio de sesión SSO** (Administración > Miembros). Sin una invitación previa, el inicio de sesión se rechaza (`membership_required`). Una cuenta SSO invitada no recibe ningún correo de activación: su primera acción es iniciar sesión a través del proveedor.

En ese primer inicio de sesión, si ya existe una cuenta de Milvago con el mismo correo — la cuenta invitada, o cualquier otra, incluida la del propietario —, nunca se vincula por la simple coincidencia de correo. Se pide a la persona que confirme la vinculación, y luego que demuestre que controla esa cuenta existente: iniciando sesión con sus credenciales actuales, o confirmando un enlace enviado a su dirección de correo. Solo entonces la cuenta pasa a ser una identidad SSO; su tipo cambia a **SSO** en Miembros, y desde ese momento la persona inicia sesión a través del proveedor.

La vinculación solo es posible de esta manera. Un usuario que ya inició sesión no puede adjuntar una cuenta externa a la suya desde su página de seguridad de cuenta: esa opción se desactiva en cuanto se guarda un proveedor.

La exigencia de doble factor de la organización también se aplica a los inicios de sesión SSO: Milvago lee la MFA a partir de la prueba atestiguada por el proveedor en el inicio de sesión, nunca a partir del tipo de cuenta. Cuando la organización exige MFA, actívela del lado del proveedor (verificación en dos pasos de Google Workspace, o una política de acceso condicional de Microsoft Entra que exija MFA). En la página de perfil de Milvago, las acciones de contraseña, correo, perfil y segundo factor permanecen bloqueadas para una cuenta SSO: se gestionan en el proveedor.

### Invitaciones del dominio de la organización

Cuando se ofrece un proveedor, un nuevo miembro invitado con una dirección de su dominio — el **Dominio de Google Workspace**, o el **Dominio de las invitaciones** de Microsoft — recibe una invitación sin contraseña que crear. El enlace del correo confirma la dirección; la página « Su cuenta está lista » ofrece entonces **Iniciar sesión**, y el primer inicio de sesión con el botón del proveedor vincula directamente la cuenta del proveedor, sin la prueba descrita arriba: el enlace de invitación ya ha probado el buzón, y el proveedor responde de la misma dirección.

Esto vale una sola vez, para una cuenta creada por la invitación que nunca ha iniciado sesión. Desde su primer inicio de sesión, y para cualquier otra cuenta, se vuelve a exigir la prueba. Un miembro invitado con otra dirección recibe la invitación habitual, con una contraseña que elegir.

Para Microsoft, el dominio de las invitaciones es opcional y debe pertenecer a su inquilino: Microsoft Entra no garantiza que la dirección de correo de un inicio de sesión esté verificada, así que sin este dominio las invitaciones de Microsoft conservan la prueba. Un proveedor guardado antes de que existiera esta opción debe guardarse una vez más para que se aplique.

## Google Workspace

Fuentes oficiales: [Google Cloud — Using OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server), [Google Cloud — Setting up OAuth 2.0](https://support.google.com/cloud/answer/6158849).

### 1. Crear el cliente OAuth en Google

1. En la [Google Cloud Console](https://console.cloud.google.com/), abra **APIs & Services > OAuth consent screen** y complete la pantalla de consentimiento.
2. Abra **APIs & Services > Credentials**, luego **Create Credentials > OAuth client ID**.
3. Seleccione el tipo de aplicación **Web application**.
4. En **Authorized redirect URIs**, pegue la **URI de redirección** mostrada en el bloque **Google Workspace** de Milvago.
5. Cree el cliente: Google muestra el **Client ID** y el **Client secret**.

### 2. Guardarlo en Milvago

1. En el bloque **Google Workspace**, introduzca el **ID de cliente OAuth** y el **Secreto de cliente**.
2. Introduzca el **Dominio de Google Workspace** de la empresa, por ejemplo `example.com`. Es obligatorio: solo las cuentas de este dominio pueden iniciar sesión. Los miembros invitados con una dirección de este dominio inician sesión directamente con Google, sin crear contraseña.
3. Deje marcado **Ofrecer este proveedor en la página de inicio de sesión**.
4. Haga clic en **Guardar**, y verifique el segundo factor si se solicita. « Proveedor guardado. » lo confirma; ahora aparece un botón **Google** en la página de inicio de sesión.

## Microsoft Entra ID

Fuentes oficiales: [Microsoft Learn — Register an application with the Microsoft identity platform](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app), [Microsoft Learn — Add and manage app credentials](https://learn.microsoft.com/en-us/entra/identity-platform/how-to-add-credentials), [Microsoft Learn — Provide optional claims](https://learn.microsoft.com/en-us/entra/identity-platform/optional-claims).

### 1. Registrar la aplicación en Microsoft

1. En el [Microsoft Entra admin center](https://entra.microsoft.com), abra **Entra ID > App registrations > New registration**.
2. Asigne un nombre a la aplicación.
3. En **Supported account types**, elija la opción de tenant único (cuentas solo de su directorio organizativo).
4. En **Redirect URI**, elija **Web** y pegue la **URI de redirección** mostrada en el bloque **Microsoft Entra ID** de Milvago, y haga clic en **Register**.
5. En la página **Overview**, anote el **Application (client) ID** y el **Directory (tenant) ID**.
6. Abra **Certificates & secrets > Client secrets > New client secret**, elija una expiración — anótela, el secreto deberá renovarse antes de esa fecha — y haga clic en **Add**. El **Value** del secreto solo se muestra una vez: consérvelo de inmediato.
7. Abra **Token configuration > Add optional claim**, elija el tipo de token **ID**, marque **email** y haga clic en **Add**, para que cada inicio de sesión lleve la dirección de correo de la persona.

### 2. Guardarlo en Milvago

1. En el bloque **Microsoft Entra ID**, introduzca el **ID de aplicación (cliente)** y el **Secreto de cliente**.
2. Introduzca el **ID del directorio (inquilino)**, un valor con la forma `00000000-0000-0000-0000-000000000000`. Solo las cuentas de este inquilino pueden iniciar sesión; se rechazan valores compartidos como `common` u `organizations`, porque aceptarían otros inquilinos.
3. Opcional: introduzca el **Dominio de las invitaciones (opcional)**, por ejemplo `example.com`: los miembros invitados con una dirección de este dominio inician sesión directamente con Microsoft. Indique solo un dominio que pertenezca a su inquilino, o déjelo vacío.
4. Deje marcado **Ofrecer este proveedor en la página de inicio de sesión**.
5. Haga clic en **Guardar**, y verifique el segundo factor si se solicita. « Proveedor guardado. » lo confirma; ahora aparece un botón **Microsoft** en la página de inicio de sesión.

Milvago deriva cada dirección de Microsoft a partir del ID del inquilino y comprueba que cada inicio de sesión fue emitido por ese inquilino.


## Cambiar, suspender o eliminar un proveedor

- **Renovar el secreto**: introduzca el nuevo valor en **Secreto de cliente**, y haga clic en **Guardar**. Cambiar el ID de cliente siempre exige su secreto.
- **Suspender**: desmarque **Ofrecer este proveedor en la página de inicio de sesión**, y haga clic en **Guardar**. La configuración se conserva.
- **Eliminar**: haga clic en **Eliminar el proveedor**, lea la advertencia « Las cuentas que inician sesión con este proveedor ya no podrán usarlo para iniciar sesión. », y haga clic en **Confirmar la eliminación**. « Proveedor eliminado. » lo confirma.
- **Proveedor creado fuera de la consola**: si el proveedor de identidad ya contiene un proveedor con el mismo nombre que no se configuró aquí (otro tipo, un flujo posterior al inicio de sesión o mapeadores), **Guardar** se rechaza en lugar de apropiarse de él. Haga clic en **Eliminar el proveedor** y vuelva a guardar.

Cada guardado y eliminación queda registrado en el [registro de auditoría](../administration/audit.md) (`sso.update`, `sso.remove`).

## Verificar

1. Invite a una cuenta del dominio o tenant de la empresa (Administración > Miembros), sin que aún haya iniciado sesión.
2. Inicie sesión con esa cuenta a través del botón del proveedor: el inicio de sesión debe tener éxito, y su tipo de miembro pasa a **SSO** en Miembros.
3. Intente un inicio de sesión con una cuenta de Google o Microsoft **fuera** del dominio o tenant: debe ser rechazado.

Estas verificaciones validan la configuración del proveedor; no sustituyen una prueba de las políticas MFA del proveedor, que siguen siendo responsabilidad suya.
