---
sidebar_position: 3
title: Primera instalación
---

# Primera instalación

¿Cómo se pone en marcha una instancia de Milvago totalmente nueva, sin ningún administrador? Esta página describe el asistente que crea la primera cuenta y configura su seguridad, la organización, el servidor de correo y los valores de privacidad predeterminados.

## Acceder a la pantalla

Una instancia iniciada **sin** la variable `BOOTSTRAP_EMAIL` no tiene administrador: en lugar de la pantalla de inicio de sesión, la consola muestra directamente el asistente **«Instalar esta instancia de Milvago»**. No hay nada que pulsar para abrirlo: sustituye a la página de entrada mientras no exista ninguna cuenta.

[IMAGEAMETTREICI 01]

## Qué protege el asistente

El asistente permanece cerrado mientras el servidor no disponga de dos cosas:

- **`MILVAGO_SETUP_TOKEN`** — un token de un solo uso de al menos 32 caracteres, proporcionado por variable de entorno o por un Secret de Kubernetes. El servidor solo conserva su huella SHA-256; no aparece en ningún registro. El script de Community `scripts/local-init.mjs` genera uno automáticamente en `.env`.
- **Una cuenta de servicio de administración de la identidad** — `OIDC_ADMIN_CLIENT_ID` y `OIDC_ADMIN_CLIENT_SECRET`.

Sin uno u otro, el asistente muestra **«El asistente de instalación está cerrado»** — «Proporcione al servidor MILVAGO_SETUP_TOKEN y la cuenta de administración de la identidad (OIDC_ADMIN_CLIENT_ID, OIDC_ADMIN_CLIENT_SECRET) y recargue esta página.» Véase [Variables de entorno](variables-environnement.md).

Nada se guarda antes del último paso: la contraseña y la licencia introducida permanecen en la memoria de la página hasta su envío, una sola vez, en el último paso, y nunca se escriben en un almacenamiento del navegador.

## Los nueve pasos

### 1. Token de instalación

Campo **Token de instalación** — «El valor de MILVAGO_SETUP_TOKEN proporcionado al servidor. No aparece en ningún registro.» Una vez validado, se abre una sesión de instalación.

### 2. Licencia

**Enterprise**: «La licencia la proporciona Milvago AI. Comparta el identificador de instancia a continuación al solicitarla y luego péguela aquí para continuar.» El asistente muestra el **identificador de instancia** de la futura instalación, con un botón para copiarlo, y luego un campo para pegar el texto de la licencia recibida. La licencia es obligatoria para continuar.

**Community**: tres opciones, «Continuar sin licencia» seleccionada de forma predeterminada:

- **Tengo una licencia** — un campo para pegar el texto de la licencia.
- **Solicitar una licencia gratuita** — una dirección de correo a escribir, luego **Enviar la solicitud**; «Solicitud enviada. Revise el correo de {`dirección`} y pegue a continuación la licencia recibida.», seguido del mismo campo para pegarla.
- **Continuar sin licencia** — el aviso «Sin licencia»: «Limitado a 5 dispositivos, una sola cuenta de administrador, sin gestión de roles, sin directorio LDAP y sin SSO. Se puede solicitar una licencia más adelante desde [Administración > Ajustes > Licencia](../administration/parametres.md#licencia).»

Elegir «Tengo una licencia» sin pegar texto, o permanecer en Enterprise sin pegar uno, bloquea el paso al siguiente con «Introduzca una licencia para continuar.» El texto pegado solo lo verifica el servidor al final del asistente, en el momento de crear la cuenta: una licencia no válida, o una licencia Community ofrecida a una instancia Enterprise, falla entonces con el error del servidor, mostrado en el Resumen, no en este paso. El Resumen enumera esta elección en primer lugar: «Licencia introducida» o «Ninguna».

[IMAGEAMETTREICI 02]

### 3. Idioma

**Idioma predeterminado de la instancia**: elegirlo cambia de inmediato el idioma del asistente.

### 4. Cuenta de administrador

«Esta cuenta se convierte en el propietario de la organización en su primer inicio de sesión.» Dirección de correo electrónico, nombre, apellido, y luego la contraseña escrita dos veces — «Al menos 12 caracteres, distinta de la dirección de correo electrónico. El proveedor de identidad puede exigir más.» La política de contraseñas del proveedor de identidad tiene la última palabra.

[IMAGEAMETTREICI 03]

### 5. Seguridad

Dos opciones:

- **Inscribir una aplicación de autenticación en el primer inicio de sesión** — activada de forma predeterminada. «Recomendado: esta cuenta tiene todos los permisos.»
- **Exigir autenticación de doble factor a todos los miembros** — «Los miembros que inician sesión con una contraseña necesitan un segundo factor. Las identidades de un proveedor de identidad externo dependen del suyo propio.»

### 6. Organización y acceso

**Nombre de la organización**, luego **URL HTTPS pública del agente** — «Dirección utilizada por los agentes y la extensión del navegador.» — precargada con la dirección actual. Una URL HTTP solo se acepta en un loopback explícito.

### 7. Servidor de correo electrónico

Un paso opcional — «Se usa para enviar las invitaciones de los miembros. También puede configurarse más tarde en el proveedor de identidad.» Al marcar **Configurar un servidor de correo electrónico ahora**: host, puerto, seguridad de la conexión (STARTTLS, TLS o ninguna), dirección y nombre del remitente, y luego usuario y contraseña opcionales. El botón **Enviar un correo de prueba** envía un mensaje real a la dirección del administrador con estos ajustes. Nunca se aceptan credenciales en una conexión remota sin cifrar. Estos ajustes se convierten en el servidor SMTP del proveedor de identidad, usado después para las invitaciones.

### 8. Privacidad

Los mismos ajustes que Administración > Privacidad, salvo **Atributo OIDC del equipo**, que se configura una vez que hay un proveedor de identidad — «Valores predeterminados de esta organización. Siguen siendo editables en Privacidad.»

### 9. Resumen

«Revise sus elecciones. La cuenta de administrador se crea al finalizar; después iniciará sesión con ella.» El botón final, **Crear el administrador y finalizar**, desencadena la creación.

[IMAGEAMETTREICI 04]

## Qué ocurre al final

La cuenta se crea en el proveedor de identidad con la contraseña elegida, correo marcado como verificado; se escriben los ajustes de organización, seguridad, servidor de correo y privacidad; el navegador se redirige después al inicio de sesión. Si se eligió un segundo factor en el paso Seguridad — inscripción de la aplicación de autenticación, o autenticación multifactor exigida para todos los miembros —, la contraseña y la inscripción TOTP ocurren en un único inicio de sesión. La cuenta se convierte en propietaria de la organización en ese primer inicio de sesión, no antes.

Una dirección de correo ya existente en el proveedor de identidad es rechazada: el asistente nunca toma el control de una cuenta existente.

## Sesión, límites y cierre definitivo

La sesión de instalación dura 30 minutos; pasado ese tiempo hay que volver a introducir el token. Adivinar el token está limitado por dirección. En cuanto existe un administrador, **todas** las rutas del asistente responden 404: el token deja de ser útil, y se recomienda retirarlo del entorno o del Secret.

## Modo automático (`BOOTSTRAP_EMAIL`)

Si `BOOTSTRAP_EMAIL` está definida al iniciar, el asistente nunca aparece: la cuenta con esa dirección, creada previamente en el proveedor de identidad, se convierte en propietaria de la organización en su primer inicio de sesión. Este modo sigue siendo útil para demostraciones y pruebas automatizadas. Véase [Variables de entorno](variables-environnement.md).

Ambos modos existen tanto en Milvago Community como en Milvago Enterprise.
