---
sidebar_position: 2
title: Claves de API y servidor MCP
---

# Claves de API y servidor MCP

## Acceder a la pantalla

Haga clic en su bloque de usuario abajo a la izquierda y después en **Mi perfil**. **Claves de API** es una tarjeta separada después de **Seguridad y acceso**.

1. Cree una clave.
2. Copie el secreto mostrado una sola vez.
3. Compruebe la tabla.

Las claves de API se encuentran en la página **Mi perfil**, bajo el bloque « Seguridad y acceso ». Responden a la pregunta « **cómo llama un script o una herramienta externa a la API** »: « Para que un script o una herramienta externa llame a la API con sus permisos, sin compartir su contraseña. »

## Crear una clave

El botón « Nueva clave de API » abre el diálogo de creación, limitado a 5 claves activas por cuenta (« Límite de 5 claves activas alcanzado »). Cuatro ajustes:

- **Nombre de la clave** — una frase humana, por ejemplo « Exportación SIEM ».
- **Periodo de validez** — 30, 90 o 365 días; más allá, la clave caduca y la pantalla la marca « Caducada ».
- **Permisos** — la lista de derechos que **usted** porta, nada premarcado, y nada que el servidor no le concedería: « Limitados a sus propios permisos y recalculados en cada llamada: la clave pierde un permiso en cuanto usted lo pierde. »
- **Permitir la lectura del contenido de los prompts** — una casilla aparte, que solo se presenta si su instancia la propone: « Actívelo solo si la herramienta lo necesita: sin esta casilla, la clave solo ve metadatos. »

[IMAGEAMETTREICI 01]

Dos advertencias se presentan en el momento en que se toma la decisión, no después:

- Al marcar `installers.manage` (« Gestionar los instaladores ») se lee « Este permiso sobrevive a la clave »: « Una clave que puede descargar el instalador puede leer la clave de despliegue de la organización, que no caduca. La capacidad de inscribir dispositivos sobrevivirá por tanto a esta clave: para retirarla, rote la clave de despliegue en Ajustes. »
- En Enterprise, activar la lectura del contenido lee « El texto de los prompts podrá salir hacia un LLM externo »: « Esta clave también abre el servidor MCP. Un modelo conectado con ella podrá leer el texto que enviaron sus usuarios, y ese texto se transmitirá al proveedor de ese modelo. »

La clave secreta se muestra **una sola vez**, en un diálogo que sobrevive a la recarga de la lista: « Copie esta clave ahora: no volverá a mostrarse, a nadie. » Si la pierde, revoque la clave y cree otra.

## La tabla de claves

Columnas: **Nombre** (con el badge ámbar « Contenido » si la clave lee los contenidos), **Permisos** (hasta dos en letras, más allá un badge « N permisos » con el detalle al pasar el ratón), **Creada**, **Caducidad** (« Caduca en N días », « Caduca mañana », o « Caducada »), **Último uso** (« Nunca utilizada » en caso contrario). **Revocar** pide confirmación y surte efecto de inmediato: « Cualquier herramienta que use « … » dejará de autenticarse de inmediato. Esto es definitivo. »

[IMAGEAMETTREICI 02]

:::enterprise

## Servidor MCP

Bajo la tabla de claves, la tarjeta « Servidor MCP » solo aparece en Enterprise: « Para conectar un modelo de lenguaje a Milvago. Lee el mismo ámbito que la consola: con los derechos de quien inicia sesión, o los de una de las claves de arriba. » Da los tres elementos de configuración:

- **Punto de entrada** — `<URL de su consola>/mcp`, a declarar como servidor MCP remoto por HTTP; « El punto de entrada solo acepta POST. »
- **Iniciar sesión con su cuenta** — el identificador de cliente público `milvago-mcp-client`, para un cliente que lo reclame; « La mayoría de los clientes solo necesitan la dirección de arriba: abren una página de inicio de sesión, le piden su consentimiento y el modelo lee después con sus propios derechos, en su propia organización. » El intercambio está protegido por PKCE.
- **Encabezado de autenticación** — `Authorization: Bearer <clave de API>`: « Obligatorio en todos los métodos, incluido el descubrimiento: sin credencial el servidor no responde nada. Una cookie de sesión se rechaza, nunca se acepta en su lugar. »

Se sirven dos revisiones del protocolo — la del producto y la revisión publicada — y el aviso lo dice para que un cliente que empieza por « initialize » sepa cuál recibe.

Una conexión con su cuenta no es permanente: un conector que permanezca sin usar siete días, y todo conector al cabo de treinta días, le pedirá volver a iniciar sesión. El servidor también rechaza un token emitido para la propia consola, y un conector que se registra por sí mismo debe solicitar explícitamente el acceso `milvago:mcp` en el momento de la conexión — lo que hacen los conectores habituales. Lo mismo vale para cualquier otra aplicación declarada en el proveedor de identidad: al iniciarse, Milvago retira el acceso `milvago:mcp` de los accesos concedidos por defecto a esas aplicaciones, incluidas las creadas antes de esta regla.

### Solo lectura, y datos no confiables

« Ninguna herramienta modifica una política, un dispositivo, un miembro ni un ajuste. Las respuestas sí contienen datos escritos por sus usuarios — nombres de dispositivos, etiquetas, y el texto de los prompts si la clave tiene acceso: salen hacia el proveedor del modelo. » El servidor MCP no es una vía de escape: atraviesa el mismo RBAC y el mismo aislamiento por organización, y una clave MCP nunca puede escribir. Una clave API o un token de conector MCP solo lista los miembros de su propia organización, nunca los de una organización hija, aunque su propio rol abarque un subárbol más amplio en Enterprise.

### El registro automático de los conectores

Cuando un conector debe obtener sus propias credenciales en lugar de una clave personal, el registro se configura en [Ajustes](../administration/parametres.md), en el proveedor de identidad, con sus hosts autorizados y su límite de clientes.

« En una organización que exige la autenticación multifactor, un conector que se registra por sí mismo solo se acepta si su token certifica un segundo factor mediante su lista de métodos de autenticación (`amr`); su nivel declarado (`acr`) solo se confía para el conector proporcionado por Milvago. Se rechaza un token válido durante más de una hora, así como un cliente que se haya dado a sí mismo mappers, una cuenta de servicio, o un flujo distinto del código de autorización con consentimiento. »

:::
