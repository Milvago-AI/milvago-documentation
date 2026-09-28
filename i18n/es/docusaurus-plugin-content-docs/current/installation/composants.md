---
sidebar_position: 1
title: Componentes
---

# Instalación de los componentes

## Recorrido de instalación

1. Despliegue el servidor Milvago y abra la consola con una cuenta administradora.
2. En **Administración → Ajustes**, defina y confirme la URL HTTPS pública que llevarán los agentes.
3. Abra **Parque → Dispositivos** y seleccione **Descargar el agente** para obtener el paquete de su edición.
4. Instale ese paquete en el dispositivo y distribuya la extensión específica del navegador mediante su política empresarial.
5. Vuelva a **Parque → Dispositivos**: apruebe el dispositivo si está pendiente y compruebe su último contacto y sus extensiones de navegador.

## Extensión de navegador

La extensión se distribuye en dos variantes de edición. En Community, solo los adaptadores ChatGPT y Claude están incorporados: ningún catálogo ni script de contenido de los otros proveedores está presente en el paquete.

![Milvago - Extensión de navegador](/img/docs/en/installation-composants-01.png)

- **Chrome / Edge / Brave / Vivaldi**: paquete CRX, desplegado en Windows mediante política de empresa (`ExtensionInstallForcelist`). Vivaldi no tiene una ruta automática dedicada en Linux.
- **Arc (Windows)**: paquete CRX compatible y política empresarial Arc. La instalación por MSI y el control de contenido siguen pendientes de calificación separada.
- **Firefox**: XPI firmado, requerido incluso bajo política de empresa; Firefox 140.0 o posterior es obligatorio en todos los sistemas operativos. Sin el paquete firmado esperado, el servicio de actualizaciones de la extensión responde 503.

:::info

Para instalar en Windows, mediante `ExtensionInstallForcelist`, la extensión privada de Google Chrome según el procedimiento descrito aquí, el equipo debe estar unido a un dominio de Active Directory o a Microsoft Entra ID. La extensión no está publicada en Chrome Web Store; instalar únicamente el agente o el host de Native Messaging no es suficiente.

:::

Chromium independiente no es compatible. Consulte [Arquitectura técnica](../introduction/architecture.md) para la matriz de integración por sistema operativo, los modos de despliegue Linux y el alcance de las calificaciones.

La extensión es pilotada por un **catálogo de detección firmado** (motor + datos) que describe las rutas medidas de los sitios cubiertos: rutas de prompt, rutas de carga de archivos. No aplica ninguna heurística fuera de esas rutas.

En ambas ediciones, las **plataformas conocidas** señalan la presencia en una plataforma alcanzada, nunca su contenido, sin reabrir la captura fuera de los proveedores calificados.

:::enterprise

El catálogo de fábrica Enterprise cubre **nueve proveedores**. El control de modelos y la sensibilidad de los usos también están reservados a Enterprise.

:::

## Agente Windows

El agente de Windows se distribuye como MSI inmutable. Su manifiesto de actualización está firmado; la firma Authenticode del MSI espera el certificado del editor:

1. Descargue el ZIP de Windows desde la consola. Contiene el MSI inmutable, el script de instalación correspondiente y el JSON de aprovisionamiento de esta organización. Si su cuenta tiene activado un segundo factor, la descarga se reanuda después de una nueva verificación.
2. Extraiga el ZIP y ejecute el script como administrador con las rutas del MSI y el JSON. El servicio se ejecuta bajo una cuenta local y transmite políticas a la extensión por canales loopback. Proteja y elimine el ZIP y el JSON cuando ya no sean necesarios.

Las actualizaciones se distribuyen mediante la imagen Docker que contiene el MSI y su manifiesto: reconstruir y volver a poner en servicio la imagen, luego verificar la huella del MSI efectivamente servido, la firma y la versión anunciada. La aplicación en los dispositivos depende de la política de actualización configurada.

![Milvago - Agente Windows](/img/docs/fr/installation-composants-02.png)

## Consola

La consola se entrega con el backend (AGPL-3.0). Para instalarla con Docker, consulte [Instalación Docker](docker.md).

Por defecto en Community: una organización, sin control de modelos, sin motivos de enmascaramiento integrados ni sensibilidad de los usos. La observación del nombre del modelo que respondió está abierta en ambas ediciones (inventario); la decisión de control sigue limitada a los proveedores cubiertos. La gestión de roles y miembros, el directorio LDAP y el inicio de sesión SSO dependen en Community de una **licencia**: mientras no se acepte ninguna, la instancia permanece en modo restringido — 5 dispositivos, una sola cuenta de administrador, ninguna de estas tres funciones. Véase [Ajustes > Licencia](../administration/parametres.md#licencia).

:::enterprise

En Enterprise, la consola gestiona varias organizaciones aisladas (PostgreSQL RLS), los grupos de dispositivos, las claves de despliegue y el servidor MCP. Véase la sección Administración. Siempre se requiere una licencia Enterprise válida y propia de la instancia, sin modo restringido: véase [Ajustes > Licencia](../administration/parametres.md#licencia).

:::

![Milvago - Consola](/img/docs/en/installation-composants-03.png)
