---
sidebar_position: 1
title: Miembros
---

# Miembros

## Acceder a la pantalla

En la barra lateral, haga clic en **Administración** y después en **Miembros**. Necesita `members.read`; para invitar, importar o cambiar un miembro también necesita `members.manage`.

1. Haga clic en **Invitar a un miembro**.
2. Introduzca su correo electrónico y elija el rol y el idioma de consola.
3. Envíe la invitación. El proveedor de identidad completa el proceso.

La pantalla Miembros responde a la pregunta « **quién puede entrar** en esta organización, y con qué rol ». Lista los miembros accesibles desde su organización — incluidos, en Enterprise, los de las organizaciones hijas de su subárbol — y sostiene las acciones de afiliación: invitación, cambio de rol, cambio de idioma, retirada del acceso.

El acceso exige el permiso `members.read`; sin él, la entrada de navegación no existe y la pantalla muestra « Acceso restringido ».

![Milvago - Acceder a la pantalla](/img/docs/en/administration-membres-01.png)

## La tabla de miembros

Cada línea es un miembro, con sus columnas:

El selector **Por página** ofrece 10, 20, 50, 100 o 200 miembros. El contador abarca todos los miembros visibles, y los controles numerados dan acceso a la primera página, la última y las páginas vecinas.

| Columna | Contenido |
| --- | --- |
| **Miembro** | nombre mostrado, o « — » cuando no tiene |
| **Dirección de correo electrónico** | la dirección de la cuenta |
| **Rol** | badge del rol actual (`owner`, `admin`, `viewer`, `reporter` o un rol personalizado) |
| **Tipo** | procedencia de la identidad: « Local », « SSO » o « LDAP » |
| **Idioma** | idioma de consola del miembro, o « Predeterminado » |
| **Organización** | nombre de la organización de afiliación, o « — » |
| **Acciones** | véase más abajo |

![Milvago - La tabla de miembros](/img/docs/en/administration-membres-02.png)

En vacío, la pantalla lee « Ningún miembro visible »: esto describe lo que sus derechos dejan ver, no una organización sin usuarios.

## Las acciones por miembro

Las tres acciones solo aparecen si usted porta `members.manage` (`members.manage`: « Gestionar los miembros »), si el miembro pertenece a la organización actual, si no es su propia cuenta, y — para un propietario — si usted mismo es propietario de la organización. En caso contrario, la celda muestra un candado con, al pasar el ratón, la razón exacta: « Este es usted: no puede cambiar su propio acceso. », « Propietario: solo un propietario puede cambiar a este miembro. », o « Cambie a esta organización para gestionar a este miembro. » Estas mismas acciones también exigen que sus propios permisos cubran cada uno de los del rol actual del miembro — la misma regla que para conceder un rol; una clave API está vinculada de la misma manera por sus propios permisos.

- **Cambiar el rol**: el nuevo rol se aplica tras una nueva conexión, y las sesiones actuales del miembro se invalidan. La lista de roles propuestos omite « Propietario » si usted no es propietario.
- **Cambiar el idioma**: el idioma se aplica a la próxima apertura de la consola por este miembro; « Predeterminado » sigue el idioma de su navegador, o el inglés si no se ofrece. Sus sesiones permanecen abiertas.
- **Retirar el acceso**: el miembro pierde el acceso a esta organización y sus sesiones se invalidan; su identidad en el proveedor de inicio de sesión se conserva. En su propia cuenta, un aviso precede a la confirmación.

El último propietario de una organización no puede ser ni degradado ni retirado: ya sea vía **Cambiar el rol** o **Retirar el acceso**, el servidor rechaza con « Asigne otro propietario antes de retirar o degradar al último propietario. » Asigne primero un segundo propietario.

:::enterprise

Una persona que llega a esta organización a través de su organización padre (acceso heredado) solo puede ser invitada, importada, reasignada o retirada aquí por alguien que gestione los miembros de la organización padre; si no, el servidor rechaza con « El acceso de esta persona proviene de la organización padre: gestiónelo desde allí. »

En Enterprise, una cuenta que ya pertenece a otra organización — una organización que la suya no contiene y que no contiene a la suya, como una organización hermana — no puede ser invitada ni importada aquí: el servidor rechaza con « Esta cuenta pertenece a otra organización. Invítela desde una organización que contenga a ambas. » Para una persona así, el idioma de consola solo puede cambiarlo ella misma, desde su perfil.

:::

![Milvago - Las acciones por miembro](/img/docs/en/administration-membres-03.png)

## Invitar a un miembro

El botón « Invitar a un miembro » abre un diálogo de tres campos: dirección de correo electrónico, rol (misma regla de omisión del rol Propietario) e idioma de consola. La invitación la envía el proveedor de identidad; la mención del pie lo dice y recuerda sus condiciones:

- Las identidades y las invitaciones las gestiona Keycloak. Enviar una invitación requiere una configuración SMTP operativa.
- Las cuentas SSO y LDAP invitadas por correo no reciben ninguno; su acceso se activa en su primer inicio de sesión.

Una cuenta local nueva recibe « Su invitación a Milvago », en el idioma de consola elegido para ella. Su enlace **Activar mi cuenta** confirma la dirección y luego pide una contraseña. La última página, « Su cuenta está lista », ofrece **Iniciar sesión**, que abre directamente el inicio de sesión de la consola. El enlace es válido durante un día. Cuando se ofrece el SSO y la dirección pertenece al dominio de la organización, la invitación no tiene contraseña que crear: tras el enlace, la persona inicia sesión con Google o Microsoft (véase [SSO](../avance/sso.md)).

## Importar del directorio

Cuando un directorio LDAP está configurado para la organización, aparece un segundo botón: « Importar del directorio ». Abre una búsqueda en el directorio, y la importación crea el miembro con el rol elegido. La importación exige `members.manage` y un directorio accesible en LDAPS o StartTLS verificado; una cuenta de directorio sin dirección de correo se rechaza.

El directorio en sí se configura en [Ajustes](parametres.md).
