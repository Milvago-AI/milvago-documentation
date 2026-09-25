---
sidebar_position: 6
title: Conectar Milvago al servicio del editor
---

# Conectar Milvago al servicio del editor

La conexión se configura en el **servidor de Milvago**. Solicite al operador del servicio del editor la dirección del servicio, la credencial de conexión de su instancia y su clave pública de verificación.

## Configurar el servidor

Proporcione juntas estas tres variables de entorno al contenedor del servidor de Milvago:

- `MILVAGO_PUBLISHER_URL` — el origen HTTPS del servicio, sin ruta ni parámetros de URL;
- `MILVAGO_PUBLISHER_CREDENTIAL` — la credencial de conexión emitida para su instancia, de al menos 32 caracteres;
- `MILVAGO_PUBLISHER_PUBLIC_KEY` — la clave pública Ed25519 emitida para este servicio, codificada en base64 (32 bytes una vez decodificada).

El despliegue proporciona estos valores y el servidor los tiene en cuenta al iniciarse. No se introducen en la consola. Si se proporciona la URL sin los otros dos valores válidos, el servidor se niega a iniciar. No publique la credencial de conexión en la documentación ni en un archivo versionado.

Milvago Community también requiere estas tres variables, pero no se introduce un ID de cliente distinto. El servicio del editor utiliza la credencial de conexión para seleccionar el catálogo apropiado; en Community, ese catálogo solo contiene ChatGPT y Claude.

## Elegir las funciones en la consola

1. Inicie sesión con `settings.manage` y MFA reciente.
2. En el menú lateral, abra **Administración → Privacidad**.
3. En **Datos compartidos con el editor**, seleccione las opciones adecuadas: **Importar automáticamente el catálogo del editor**, **Compartir el estado de los detectores** o **Compartir el número de equipos**.
4. Introduzca el motivo requerido y seleccione **Guardar**. La importación automática del catálogo solo se ofrece a la organización raíz.
5. Si es propietario de la instancia, consulte la vista previa del servicio del editor mostrada bajo estas opciones.

La conexión del servidor por sí sola no activa estas opciones.

Consulte [Privacidad](../administration/confidentialite.md) para los permisos y ajustes de la pantalla.
