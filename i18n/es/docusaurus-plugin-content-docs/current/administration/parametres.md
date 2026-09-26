---
sidebar_position: 7
title: Ajustes
---

# Ajustes

## Acceder a la pantalla

Haga clic en **Administración** > **Ajustes**. Las secciones dependen de sus permisos.

1. Abra **Directorio LDAP** en la navegación vertical.
2. Complete los parámetros de conexión y atributos.
3. Haga clic en **Probar la conexión** y corrija cualquier etapa indicada como fallida.
4. Después de una prueba correcta, haga clic en **Guardar el directorio**.
5. Compruebe que el estado confirma la conexión guardada.

La pantalla Ajustes responde a la pregunta « **cómo se configuran esta organización y esta instancia** ». Su línea bajo el título lo anuncia: « Ajustes de la organización y de la instancia. » Una navegación vertical divide las secciones, y **cada sección solo aparece con el permiso que la gobierna**: lo que usted no puede configurar no se muestra.

[IMAGEAMETTREICI 01]

## Organización

Siempre presente. Cuatro campos, guardados juntos:

- **Nombre de la organización** — modificable por el propietario de la organización.
- **URL HTTPS pública (agente)** — « URL anunciada a los agentes y a la extensión del navegador (inscripción, instaladores, update.xml). Cambiarla tras el despliegue no afecta a los dispositivos ya inscritos: conservan su URL y deben volver a inscribirse para cambiarla. » Solo el propietario de la organización raíz puede modificarla; para los demás, el campo porta el aviso « Solo el propietario de la organización raíz puede cambiar esta URL. » Su confirmación condiciona la descarga de los instaladores.
- **Idioma predeterminado de la instancia** — « Se aplica a la página de inicio de sesión a la que se llega sin idioma. Los usuarios sin preferencia personal siguen su navegador y luego el inglés. » Solo el propietario raíz lo modifica.
- **Conservación de eventos (días)** — de 1 a 3650; « El servidor valida y aplica el periodo de conservación. » Acortar esta duración exige un segundo factor verificado hace un momento y nunca está disponible para una clave API: la siguiente purga horaria elimina de inmediato el historial que quede más antiguo que la nueva duración, textos conservados incluidos. Alargarla no cambia.

Un banner « Completar la configuración » aparece mientras la URL pública no esté confirmada en una instancia instalada en modo automático (`BOOTSTRAP_EMAIL`) — el asistente de [primera instalación](../installation/premiere-installation.md) fija directamente estos valores y nunca deja este banner detrás. Abre un asistente en dos pasos: idioma predeterminado de la instancia, luego nombre de la organización y URL HTTPS pública. El mismo banner lo recuerda de otro modo: « Los agentes y la extensión del navegador se conectarán a esta URL. Confírmela en Administración antes de desplegar. »

## Licencia

Siempre presente para quien pueda abrir Ajustes: no es un permiso el que la gobierna, sino el rol de propietario de la instancia el que autoriza a modificarla. Su descripción en pantalla: « Estado de la licencia de esta instancia. »

En Community, el panel también indica: «La licencia gratuita solo elimina los límites de Community. No desbloquea Enterprise, que requiere la edición Enterprise y una licencia distinta».

- **Estado** — insignia Ninguna, Válida, Período de gracia o Expirada.
- **Tipo** — Enterprise, Community, o « — » si la instancia nunca recibió una licencia.
- **Dispositivos máximos** — un número, o « Ilimitado » si la licencia no fija ninguno (valor 0).
- **Expira** — visible solo cuando la licencia lleva una fecha de expiración (las licencias Enterprise; la licencia gratuita Community es perpetua y no muestra ninguna).
- **Período de gracia hasta el** — visible solo durante el período de gracia que sigue a una expiración Enterprise.
- **Identificador de instancia** — con el botón **Copiar el identificador**, para transmitir a Milvago AI y obtener una licencia.

Bajo esta información, el propietario de la instancia ve un campo para pegar el texto de una nueva licencia y el botón **Guardar la licencia** — « Licencia guardada. » confirma el guardado. Para cualquier otro lector, la pantalla porta el aviso « Solo el propietario de la instancia puede cambiar la licencia. »

En **Community**, el propietario de la instancia ve también, bajo ese campo, una zona **Solicitar una licencia gratuita**: una dirección de correo (precargada con la suya) y el botón **Enviar la solicitud**; « Solicitud enviada. Revise el correo de {`dirección`} y pegue a continuación la licencia recibida. » confirma el envío. La solicitud va a Milvago AI, que responde por correo con el texto a pegar aquí. Esta licencia gratuita es perpetua y levanta todos los límites del modo restringido descritos a continuación.

[IMAGEAMETTREICI 02]

### Modo restringido (Community sin licencia)

Mientras no se acepte ninguna licencia, una instancia Community funciona en **modo restringido**: 5 dispositivos como máximo (los revocados no cuentan), la única cuenta de administrador creada en la instalación, ninguna gestión de roles ni de miembros — la entrada **Roles** desaparece de la navegación de Administración —, ningún directorio LDAP — la sección **Directorio LDAP** de más abajo desaparece de esta misma página — y ninguna conexión SSO. Un banner de advertencia « Sin licencia » aparece entonces en cada página de la consola, con un enlace para abrir los ajustes. Inscribir un dispositivo por encima del límite falla con « Esta instancia alcanzó su límite de dispositivos para su licencia actual. »

### Enterprise: expiración y bloqueo

En **Enterprise**, la instancia nunca funciona sin una licencia válida propia: una licencia Community se rechaza allí con « Esta es una licencia Community; esta instancia es Enterprise. » La licencia siempre lleva una fecha de expiración y un número máximo de dispositivos (0 = ilimitado). Tras la expiración, la instancia entra en un **período de gracia de 10 días**: un banner « Licencia por expirar » permanece visible, la consola sigue funcionando con normalidad. Pasado ese plazo, toda la consola se sustituye por la única pantalla de licencia — « Licencia requerida » — « Esta instancia no tiene una licencia válida. Un propietario debe introducir una a continuación para continuar. » — y los agentes son rechazados hasta que se introduzca una nueva licencia válida.

### Licencia vinculada a la instancia

Una licencia está vinculada al identificador de esta instancia (mostrado arriba): reinstalar Milvago sobre una nueva base de datos cambia ese identificador e invalida la licencia anterior; entonces hay que obtener una nueva.

## Directorio LDAP

Presente con el permiso `directory.manage` (« Gestionar el directorio LDAP ») y una licencia fuera del modo restringido: en una instancia Community sin licencia, esta sección no se muestra. Un directorio LDAP propio de la organización, materializado en el proveedor de identidad: tipo de directorio (Active Directory, y las convenciones prellenadas para los demás, editables), URL de conexión `ldap://` o `ldaps://`, DN de conexión, DN de usuarios, atributos, filtro, ámbito, tiempos de espera, paginación. La pantalla impone un transporte verificado — LDAPS o StartTLS — antes de toda transmisión de credenciales: « LDAP requires LDAPS or StartTLS », la validación lo rechaza si no.

El botón **Probar la conexión** repite las dos etapas (« La conexión y la autenticación funcionaron. » o la etapa en fallo); **Guardar el directorio** activa la conexión LDAP; **Eliminar el directorio** advierte: « Los usuarios de este directorio ya no podrán iniciar sesión. » Probar, guardar y eliminar el directorio exigen cada uno un segundo factor verificado hace un momento; ninguna de estas tres acciones está disponible para una clave API.

Las cuentas de directorio se importan luego en [Miembros](membres.md).

:::enterprise

Crear, probar, modificar o eliminar un directorio está reservado a un propietario de la organización raíz, para la organización raíz o, tras cambiar a ella, para una organización hija — el inicio de sesión de toda organización consulta cada directorio del proveedor de identidad compartido. En una organización hija, las demás personas ven en su lugar el aviso « Solo un propietario de la organización raíz puede configurar un directorio, porque el inicio de sesión de todas las organizaciones lo consulta. » o, cuando ya hay uno configurado, « El directorio de esta organización lo configura un propietario de la organización raíz, porque el inicio de sesión de todas las organizaciones lo consulta. Sus usuarios se importan en Miembros. »

:::

## Clave de despliegue

Presente con el permiso `installers.manage` (« Gestionar los instaladores »). Véase [Despliegue](deploiement.md), que la describe en detalle.

## Registro automático de conectores

:::enterprise

Sección reservada a Enterprise, y al **propietario de la organización raíz**: la decisión se escribe en el proveedor de identidad de la instancia, no en la base de Milvago — lo que la pantalla muestra es lo que se aplica realmente.

Configura la manera en que un conector MCP obtiene sus propias credenciales: « Un conector pide al proveedor de identidad un cliente propio, para que nadie tenga que pegar un identificador. Cerrado mientras no lo abra, y abrirlo siempre nombra los hosts a los que puede volver un inicio de sesión. »

- **Permitir que un conector se registre solo** — cerrado por defecto.
- **Hosts autorizados a recibir un inicio de sesión** — « Un host por línea, sin esquema, puerto ni ruta: claude.ai, o *.ejemplo.com. Un registro se rechaza si alguna dirección solicitada no está en estos hosts, de modo que un código nunca puede entregarse en otro sitio. » Un host genérico conserva al menos dos etiquetas después de `*.` — `*.ejemplo.com` se acepta, `*.com` se rechaza. Un estado « abierto a todos los hosts » puesto a mano en el proveedor de identidad se señala como tal, y no puede ser producido por esta pantalla.
- **Límite de clientes registrados** — « Un registro que superara este número se rechaza. Acota el desorden, no el riesgo. »

Lo que no se negocia: « Una persona siempre ve una pantalla de consentimiento antes de que un modelo alcance nada, un cliente registrado está limitado a sus derechos declarados, y nunca lee más que los derechos de quien inicia sesión. » Todo cliente público del proveedor de identidad debe usar PKCE, conectores registrados incluidos, y Milvago limita al arrancar la duración de las conexiones largas de los conectores — siete días sin uso, treinta días como máximo — sin alargar nunca una duración ya más corta. Véase [Claves de API y servidor MCP](../mon-profil/cles-api.md).

:::
