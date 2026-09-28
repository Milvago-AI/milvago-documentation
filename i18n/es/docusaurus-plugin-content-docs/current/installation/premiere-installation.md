---
sidebar_position: 3
title: Primera instalación
---

# Primera instalación

¿Cómo se pone en marcha una instancia de Milvago totalmente nueva, sin ningún administrador? Esta página describe el asistente que crea la primera cuenta y configura su seguridad, la organización, el servidor de correo y los valores de privacidad predeterminados.

## Acceder a la pantalla

Una instancia iniciada **sin** la variable `BOOTSTRAP_EMAIL` no tiene administrador: en lugar de la pantalla de inicio de sesión, la consola muestra directamente el asistente **«Instalar esta instancia de Milvago»**. No hay nada que pulsar para abrirlo: sustituye a la página de entrada mientras no exista ninguna cuenta.


## Qué protege el asistente

El asistente permanece cerrado mientras el servidor no disponga de dos cosas:

- **`MILVAGO_SETUP_TOKEN`** — un token de un solo uso de al menos 32 caracteres, proporcionado por variable de entorno o por un Secret de Kubernetes. El servidor solo conserva su huella SHA-256; no aparece en ningún registro.
- **Una cuenta de servicio de administración de la identidad** — `OIDC_ADMIN_CLIENT_ID` y `OIDC_ADMIN_CLIENT_SECRET`.

Para instalar con Docker, consulte [Instalación Docker](docker.md).

Sin uno u otro, el asistente muestra **«El asistente de instalación está cerrado»** — «Proporcione al servidor MILVAGO_SETUP_TOKEN y la cuenta de administración de la identidad (OIDC_ADMIN_CLIENT_ID, OIDC_ADMIN_CLIENT_SECRET) y recargue esta página.» Véase [Variables de entorno](variables-environnement.md).

No se guarda ninguna configuración antes del último paso. Una licencia introducida se envía al servidor para validarla en el paso 2 y se comprueba de nuevo al finalizar. La contraseña permanece en la memoria de la página hasta el final; ninguno de estos valores se escribe en el almacenamiento del navegador.

## Los nueve pasos

### 1. Token de instalación

Campo **Token de instalación** — «El valor de MILVAGO_SETUP_TOKEN proporcionado al servidor. No aparece en ningún registro.» Una vez validado, se abre una sesión de instalación.

![Asistente de instalación, paso 1](/img/docs/es/installmilvago/step1_es.png)

### 2. Licencia

**Enterprise**: «La licencia la proporciona Milvago AI. Comparta el identificador de instancia a continuación al solicitarla y luego péguela aquí para continuar.» El asistente muestra el **identificador de instancia** de la futura instalación, con un botón para copiarlo, y luego un campo para pegar el texto de la licencia recibida. La licencia es obligatoria para continuar.

**Community**: tres opciones, «Continuar sin licencia» seleccionada de forma predeterminada:

El asistente también aclara: «La licencia gratuita solo elimina los límites de Community. No desbloquea Enterprise, que requiere la edición Enterprise y una licencia distinta».

- **Tengo una licencia** — un campo para pegar el texto de la licencia.
- **Solicitar una licencia gratuita** — una dirección de correo a escribir, luego **Enviar la solicitud**; «Solicitud enviada. Revise el correo de {`dirección`} y pegue a continuación la licencia recibida.», seguido del mismo campo para pegarla.
- **Continuar sin licencia** — el aviso «Sin licencia»: «Limitado a 5 dispositivos, una sola cuenta de administrador, sin gestión de roles, sin directorio LDAP y sin SSO. Se puede solicitar una licencia más adelante desde [Administración > Ajustes > Licencia](../administration/parametres.md#licencia).»

Elegir «Tengo una licencia» sin pegar texto, o permanecer en Enterprise sin licencia, bloquea el avance con «Introduzca una licencia para continuar.» Si se introduce una licencia, «Siguiente» hace que el servidor compruebe su firma, instancia y edición. Una licencia no válida muestra un error en este paso y mantiene aquí al asistente. El servidor vuelve a comprobarla antes de crear la cuenta. El Resumen muestra esta elección primero: «Licencia introducida» o «Ninguna».

![Asistente de instalación, paso 2](/img/docs/es/installmilvago/step2_es.png)

### 3. Idioma

**Idioma predeterminado de la instancia**: elegirlo cambia de inmediato el idioma del asistente.

![Asistente de instalación, paso 3](/img/docs/es/installmilvago/step3_es.png)

### 4. Cuenta de administrador

«Esta cuenta se convierte en el propietario de la organización en su primer inicio de sesión.» Dirección de correo electrónico, nombre, apellido, y luego la contraseña escrita dos veces — «Al menos 12 caracteres, distinta de la dirección de correo electrónico. El proveedor de identidad puede exigir más.» La política de contraseñas del proveedor de identidad tiene la última palabra.

![Asistente de instalación, paso 4](/img/docs/es/installmilvago/step4_es.png)

### 5. Seguridad

Dos opciones:

- **Inscribir una aplicación de autenticación en el primer inicio de sesión** — activada de forma predeterminada. «Después de configurarlo, esta cuenta debe usar su aplicación de autenticación en cada inicio de sesión.»
- **Exigir autenticación de doble factor a todos los miembros** — «Los miembros que inician sesión con una contraseña necesitan un segundo factor. Las identidades de un proveedor de identidad externo dependen del suyo propio.»

Al configurar el autenticador, el segundo factor pasa a ser obligatorio para los próximos inicios de sesión de esa cuenta. Tras la contraseña, el mismo inicio de sesión solicita el código del autenticador sin volver a pedir la contraseña. La segunda opción extiende este requisito a todos los miembros.

![Asistente de instalación, paso 5](/img/docs/es/installmilvago/step5_es.png)

### 6. Organización y acceso

**Nombre de la organización**, luego **URL pública de Milvago** — la dirección utilizada por el inicio de sesión de la consola, Keycloak, los agentes y la extensión del navegador. Se rellena con la dirección de la página actual. Indique la dirección HTTPS del proxy frontal si utiliza uno; se acepta HTTP para pruebas en una red local de confianza.

![Asistente de instalación, paso 6](/img/docs/es/installmilvago/step6_es.png)

### 7. Servidor de correo electrónico

Un paso opcional — «Se usa para enviar las invitaciones de los miembros. También puede configurarse más tarde en el proveedor de identidad.» Al marcar **Configurar un servidor de correo electrónico ahora**: host, puerto, seguridad de la conexión (STARTTLS, TLS o ninguna), dirección y nombre del remitente, y luego usuario y contraseña opcionales. El botón **Enviar un correo de prueba** muestra la dirección del administrador introducida en el paso 4 y envía allí un mensaje real con estos ajustes. Si el servidor de correo responde `550 5.1.1`, compruebe que la dirección existe y corríjala en el paso 4. Nunca se aceptan credenciales en una conexión remota sin cifrar. Estos ajustes se convierten en el servidor SMTP del proveedor de identidad, usado después para las invitaciones.

![Asistente de instalación, paso 7](/img/docs/es/installmilvago/step7_es.png)

### 8. Privacidad

Los mismos ajustes que Administración > Privacidad, salvo **Atributo OIDC del equipo**, que se configura una vez que hay un proveedor de identidad — «Valores predeterminados de esta organización. Siguen siendo editables en Privacidad.»

![Asistente de instalación, paso 8](/img/docs/es/installmilvago/step8_es.png)

### 9. Resumen

«Revise sus elecciones. La cuenta de administrador se crea al finalizar; después iniciará sesión con ella.» El botón final, **Crear el administrador y finalizar**, desencadena la creación. Mientras se crea la cuenta, el asistente muestra un indicador de progreso y desactiva los controles hasta que se abre el inicio de sesión.


## Qué ocurre al final

La cuenta se crea en el proveedor de identidad con la contraseña elegida, correo marcado como verificado; se escriben los ajustes de organización, seguridad, servidor de correo y privacidad; el navegador se redirige después al inicio de sesión. Si se eligió un segundo factor en el paso Seguridad — inscripción de la aplicación de autenticación, o autenticación multifactor exigida para todos los miembros —, la contraseña y la inscripción TOTP ocurren en un único inicio de sesión. La cuenta se convierte en propietaria de la organización en ese primer inicio de sesión, no antes.

Una dirección de correo ya existente en el proveedor de identidad es rechazada: el asistente nunca toma el control de una cuenta existente.

## Sesión, límites y cierre definitivo

La sesión de instalación dura 30 minutos; pasado ese tiempo hay que volver a introducir el token. Adivinar el token está limitado por dirección. En cuanto existe un administrador, **todas** las rutas del asistente responden 404: el token deja de ser útil, y se recomienda retirarlo del entorno o del Secret.

## Modo automático (`BOOTSTRAP_EMAIL`)

Si `BOOTSTRAP_EMAIL` está definida al iniciar, el asistente nunca aparece: la cuenta con esa dirección, creada previamente en el proveedor de identidad, se convierte en propietaria de la organización en su primer inicio de sesión. Este modo sigue siendo útil para demostraciones y pruebas automatizadas. Véase [Variables de entorno](variables-environnement.md).

Ambos modos existen tanto en Milvago Community como en Milvago Enterprise.
