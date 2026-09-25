---
sidebar_position: 9
title: Despliegue
---

# Despliegue

## Acceder a los ajustes de despliegue

No hay entrada **Despliegue**. Haga clic en **Administración** > **Ajustes** > **Clave de despliegue**; en Enterprise también puede usar **Administración** > **Organizaciones** > la organización > **Clave de despliegue**. Necesita `installers.manage`.

1. Haga clic en **Generar una clave**, **Rotar** o **Revocar**, según el estado mostrado.
2. Lea la advertencia que describe el efecto sobre los instaladores ya distribuidos.
3. Confirme la acción.
4. Compruebe el estado y la fecha de la última rotación en el panel; los dispositivos ya inscritos no cambian.

Esta página describe cómo se inscriben los **dispositivos**: la clave de despliegue que autoriza la inscripción, los instaladores que la llevan, y lo que le llega a un dispositivo después de su instalación. Para la instalación de la plataforma misma (servidor, base, imágenes), véase [Instalación de los componentes](../installation/composants.md).

## La clave de despliegue

« Una clave aleatoria única para esta organización, incluida dentro de cada instalador descargado. Nunca se muestra: solo sirve para la inscripción de un dispositivo, que después recibe credenciales propias. » El panel, en [Ajustes](parametres.md) — y en Enterprise, en la página de cada [organización](organisations.md) — muestra lo que existe, nunca el secreto: estado, creación, última rotación, contador de instalaciones.

Tres acciones, cada una con su confirmación:

- **Generar una clave** / **Rotar** — « Será necesario un nuevo instalador: todos los MSI y RPM ya distribuidos dejan de instalar nuevos dispositivos de inmediato. Los dispositivos ya inscritos no cambian. »
- **Revocar** — « No será posible ninguna instalación en esta organización hasta que se genere una nueva clave. Los dispositivos ya inscritos no cambian. »

En estado sin clave, la pantalla lo enuncia: « Ninguna clave activa. Ningún instalador puede inscribir un dispositivo en esta organización hasta que se genere una clave. »

[IMAGEAMETTREICI 01]

## Descargar el agente

La descarga de los instaladores — Windows MSI, Linux RPM, ambos servicios para todo el dispositivo — está bloqueada mientras la **URL HTTPS pública** no esté confirmada en [Ajustes](parametres.md): « Defina y confirme la URL HTTPS pública en Administración → Ajustes antes de descargar un instalador. Los agentes se conectarán a esa URL. »

El diálogo recuerda tres cosas:

- « El paquete lleva la clave de despliegue de esta organización. Tras la instalación, el dispositivo se inscribe una vez y conserva su estado en una caché cifrada. Su administrador también debe distribuir la extensión del navegador. »
- Según el **modo de aprobación** elegido en la política Shadow AI: bajo aprobación manual, « Cada dispositivo instalado aparecerá como pendiente y no informará de nada hasta que lo apruebe en Dispositivos. »; en aprobación según la red, « Un dispositivo instalado desde una red autorizada informa de inmediato; los demás quedan pendientes de aprobación. »
- « El mismo paquete sirve a toda la organización. La clave de despliegue se gestiona en Administración → Ajustes: rotarla invalida de inmediato los instaladores ya distribuidos. »

La versión del instalador descargado se confirma después de la descarga. Si la clave fue revocada entretanto, la descarga falla con el aviso que remite a la rotación: « La clave de esta organización fue revocada. Rótela en Administración → Ajustes para reanudar los despliegues. »

[IMAGEAMETTREICI 02]

## Después de la instalación

Un dispositivo inscrito solicita su aprobación según el modo elegido, luego recibe la política Shadow AI y sus revisiones siguientes. Las actualizaciones del agente pasan por instaladores firmados; la pantalla de un dispositivo expone su estado de actualización, y la sección « Operaciones » de [Shadow AI](shadow-ai.md) configura parque piloto y versiones en pausa cuando está abierta al diagnóstico.

:::enterprise

En Enterprise multiorganización, cada organización porta **su propia** clave de despliegue. El administrador de una organización principal la rota o la revoca desde la página de la hija, sin cambiar a su contexto — es el primer bloque de esta página.

Las imágenes Docker Enterprise embarcan el MSI firmado y su manifiesto de actualización; el servidor sirve el MSI congelado de su directorio de instaladores, nunca un paquete reconstruido localmente. El orden de las compilaciones, las claves y la verificación de la huella servida corresponden a los procedimientos de fabricación del agente Windows.

:::
