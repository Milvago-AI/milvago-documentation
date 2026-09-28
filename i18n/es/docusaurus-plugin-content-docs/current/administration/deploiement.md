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

La clave de despliegue autoriza la inscripción de un dispositivo. En Windows se entrega en un archivo de aprovisionamiento separado; el MSI no contiene secretos de la organización. El RPM actual de Linux aún incluye la clave. Cada dispositivo recibe sus propias credenciales tras la inscripción. El panel en [Ajustes](parametres.md), y en la página de cada [organización](organisations.md) en Enterprise, muestra el estado, la creación, la última rotación y el número de instalaciones.

- **Generar una clave** o **Rotar**: descargue después un nuevo ZIP de Windows. Los archivos anteriores y los RPM de Linux dejan de inscribir dispositivos. Los ya inscritos no cambian.
- **Revocar**: ningún dispositivo nuevo puede inscribirse hasta generar una nueva clave. Los ya inscritos no cambian.

![Milvago - La clave de despliegue](/img/docs/fr/administration-deploiement-01.png)

## Descargar el agente

Confirme la **URL HTTPS pública** en [Ajustes](parametres.md) y haga clic en **Windows ZIP**. Un solo archivo contiene el MSI inmutable, su script de PowerShell, el JSON de aprovisionamiento de esta organización y un `README.md` con el comando de instalación. La descarga requiere `installers.manage`. Si su cuenta utiliza un segundo factor, el ZIP exige una verificación de menos de 5 minutos: la consola la vuelve a pedir si hace falta y el ZIP se descarga automáticamente. Una clave API nunca puede descargarlo; el RPM de Linux no pide una nueva verificación. El ZIP y el JSON contienen un token de despliegue: protéjalos hasta eliminarlos o rotar o revocar la clave.

Extraiga `milvago-windows-package.zip` en una carpeta protegida. Allí, ejecute el script como administrador:

```powershell
powershell.exe -NoProfile -File .\milvago-windows-install.ps1 -MsiPath .\milvago-windows-installer.msi -ProvisionPath .\milvago-provision.json
```

Las tres rutas del comando corresponden a archivos del ZIP. Manténgalos juntos tras extraerlos. Los dos parámetros del script son obligatorios; sin ellos, PowerShell solicita `MsiPath` y `ProvisionPath`. El `README.md` incluido repite los pasos de instalación.

El script comprueba el hash del MSI, verifica la firma Authenticode del editor cuando se configura un certificado de firma, guarda el MSI y el JSON con acceso exclusivo de SYSTEM y administradores, ejecuta Windows Installer y elimina los archivos temporales. Abrir el MSI sin el archivo no puede inscribir un dispositivo nuevo porque no contiene la clave de la organización. Los paquetes locales fabricados antes de disponer del certificado carecen de firma Authenticode; úselos solo en un entorno de prueba controlado.

Linux aún descarga un RPM específico de la organización. La aprobación manual o basada en la red sigue aplicándose tras la instalación. También debe distribuirse la extensión del navegador.

## Después de la instalación

Un dispositivo inscrito solicita su aprobación según el modo elegido, luego recibe la política Shadow AI y sus revisiones siguientes. Las actualizaciones del agente pasan por instaladores firmados; la pantalla de un dispositivo expone su estado de actualización, y la sección « Operaciones » de [Shadow AI](shadow-ai.md) configura parque piloto y versiones en pausa cuando está abierta al diagnóstico.

:::enterprise

En Enterprise multiorganización, cada organización porta **su propia** clave de despliegue. El administrador de una organización principal la rota o la revoca desde la página de la hija, sin cambiar a su contexto — es el primer bloque de esta página.

Las imágenes Docker Enterprise incluyen el MSI inmutable, su script de despliegue correspondiente a la versión y un manifiesto de actualización firmado. El servidor entrega los mismos bytes MSI a todas las organizaciones.

:::
