---
sidebar_position: 5
title: SSO (Google / Microsoft Entra ID)
---

# SSO (Google / Microsoft Entra ID)

¿Cómo se conecta Milvago al inicio de sesión único (SSO) de la organización, con Google o Microsoft Entra ID como proveedor de identidad?

El SSO de Milvago es **intermediación de identidad de Keycloak** (*identity brokering*): el proveedor externo se configura en la consola de administración de Keycloak del realm `milvago`, nunca en la consola de Milvago. Esta página supone un despliegue `compose` local o de demostración, con la cuenta de arranque `bootstrap-admin` (contraseña `IDENTITY_ADMIN_PASSWORD` de `.env`) para iniciar sesión en Keycloak.

:::warning Suposición de confianza
La vinculación automática (`idp-auto-link`) no se limita a cuentas invitadas que nunca han iniciado sesión: cualquier identidad de un proveedor federado que presente el mismo correo se vincula a **cualquier** cuenta local de Keycloak con ese correo — incluida una cuenta ya activa, incluida la cuenta de administrador o propietario. Por eso la restricción de dominio o de tenant, y **Trust Email** activado solo una vez fijada esa restricción, son vitales: sin ellas, un proveedor sin restringir permitiría que un tercero se apropiara de la cuenta propietaria con solo presentar su correo. Federe únicamente proveedores cuyo correo sea fiable.
:::

## Principio: vinculación en el primer inicio de sesión

Milvago define su propio flujo de primer inicio de sesión vía un proveedor externo, `milvago-v1-first-broker-login`: si ninguna cuenta de Keycloak comparte el mismo correo, crea una; si ya existe una cuenta local de Keycloak con ese correo — una cuenta de Milvago **invitada** (Administración > Miembros) es el uso previsto, pero la vinculación se aplica a **cualquier** cuenta local con ese correo, sea cual sea su estado — la vincula automáticamente al proveedor externo. Tras esa vinculación, la persona siempre inicia sesión a través del proveedor externo; el tipo de cuenta mostrado en Miembros pasa a **SSO**.

Consecuencia directa: **una persona debe estar invitada en Milvago antes de su primer inicio de sesión SSO**. Sin una invitación previa, el inicio de sesión se rechaza (`membership_required`), y una cuenta SSO invitada no recibe ningún correo de activación — su primera acción es iniciar sesión a través del proveedor.

Las identidades SSO están exentas de la exigencia de doble factor de Milvago: su MFA es responsabilidad del proveedor (actívela en Google Workspace o en las políticas de acceso condicional de Microsoft Entra). En la página de perfil de Milvago, las acciones de autoservicio — cambiar la contraseña, el correo, el perfil o inscribir MFA — permanecen bloqueadas para una cuenta SSO: se gestionan en el proveedor.

## Preparar Keycloak

En la consola de administración de Keycloak (realm `milvago`), abra **Identity providers** en el menú izquierdo y luego **Add provider**. Elija Google u OpenID Connect v1.0 según el proveedor (detalles a continuación). Cada proveedor añadido muestra una **Redirect URI** con este formato:

```
https://<host-keycloak>/realms/milvago/broker/<alias>/endpoint
```

Ese es el valor que hay que pegar en la configuración del proveedor externo (Google Cloud Console o Microsoft Entra admin center) — nunca al revés.

## Google

Fuentes oficiales consultadas: [Google Cloud — Using OAuth 2.0 for Web Server Applications](https://developers.google.com/identity/protocols/oauth2/web-server), [Google Cloud — Setting up OAuth 2.0](https://support.google.com/cloud/answer/6158849), documentación del proveedor Google de Keycloak.

### 1. Crear las credenciales OAuth en Google

1. En [Google Cloud Console](https://console.cloud.google.com/), abra **APIs & Services > OAuth consent screen** y complete la pantalla de consentimiento.
2. Abra **APIs & Services > Credentials**, luego **Create Credentials > OAuth client ID**.
3. Seleccione el tipo de aplicación **Web application**.
4. En **Authorized redirect URIs**, pegue la **Redirect URI** que muestra Keycloak para este proveedor.
5. Cree el cliente: Google muestra el **Client ID** y el **Client secret** (el secreto solo se muestra una vez).

### 2. Añadir el proveedor en Keycloak

En **Identity providers > Add provider**, elija **Google** y complete:

- el **Client ID** y el **Client Secret** obtenidos en el paso anterior;
- **Hosted Domain** — el dominio de Google Workspace de la empresa. Este campo es el que **restringe el acceso a los miembros de la organización**; sin él, cualquier cuenta de Google puede presentarse ante el intermediario.
- **Trust Email** — actívelo solo una vez definido el dominio: sin la restricción de dominio, confiar en el correo de Google permitiría que cualquier cuenta de Google reclame una cuenta de Milvago invitada con la misma dirección.

## Microsoft Entra ID

Fuentes oficiales consultadas: [Microsoft Learn — Register an application with the Microsoft identity platform](https://learn.microsoft.com/en-us/entra/identity-platform/quickstart-register-app), [Microsoft Learn — Add and manage app credentials](https://learn.microsoft.com/en-us/entra/identity-platform/how-to-add-credentials), documentación del proveedor OpenID Connect v1.0 de Keycloak.

### 1. Registrar la aplicación en Microsoft Entra

1. En el [Microsoft Entra admin center](https://entra.microsoft.com), abra **Entra ID > App registrations > New registration**.
2. Asigne un nombre a la aplicación.
3. En **Supported account types**, elija **Single tenant only — &lt;su tenant&gt;** — esta opción limita el registro al tenant de la empresa; las demás opciones (multitenant, cuentas personales) lo abren a tenants o cuentas ajenos a la empresa.
4. Seleccione **Register** y anote el **Application (client) ID** que aparece en la página **Overview**.
5. Abra **Authentication > Add a platform > Web**, y pegue la **Redirect URI** que muestra Keycloak.
6. Abra **Certificates & secrets > Client secrets > New client secret**, añada una descripción, elija una duración de expiración (24 meses como máximo — prefiera una duración más corta y anote el vencimiento para renovarlo) y luego **Add**. El **Value** del secreto solo se muestra una vez: consérvelo de inmediato.

### 2. Añadir el proveedor en Keycloak — preferir OpenID Connect v1.0 con el punto de descubrimiento propio del tenant

El proveedor social **Microsoft** integrado en Keycloak no ofrece ningún campo que restrinja el inicio de sesión a un tenant de Entra concreto: habría que depender únicamente de la restricción fijada en Entra (cuenta de tenant único). Para no depender de un único candado, prefiera un proveedor genérico **OpenID Connect v1.0**, con el punto de descubrimiento propio del tenant:

```
https://login.microsoftonline.com/<tenant-id>/v2.0/.well-known/openid-configuration
```

**Nunca** `common` ni `organizations` en lugar de `<tenant-id>`: esos alias están pensados para aplicaciones multitenant, su emisor no es propio de su tenant, y Keycloak no puede entonces comprobar que el token proviene realmente de su tenant — use siempre la URL de descubrimiento propia del tenant.

En **Identity providers > Add provider > OpenID Connect v1.0**, importe la configuración desde esta URL de descubrimiento (Keycloak completa entonces Authorization URL, Token URL y los demás puntos de conexión), y luego introduzca el **Client ID** y el **Client Secret** obtenidos en el paso anterior.

## Verificar

1. Invite a una cuenta del dominio o tenant de la empresa (Administración > Miembros), sin que aún haya iniciado sesión.
2. Inicie sesión con esa cuenta a través del proveedor SSO: el inicio de sesión debe tener éxito, y su tipo de miembro pasa a **SSO** en Miembros.
3. Intente un inicio de sesión con una cuenta de Google o Microsoft **fuera** del dominio o tenant restringido: el proveedor (Google) o Keycloak (Microsoft, mediante el punto de descubrimiento propio del tenant) debe rechazarlo.

Estas verificaciones validan la configuración del proveedor; no sustituyen una prueba completa de las políticas MFA del proveedor, que siguen siendo responsabilidad suya.
