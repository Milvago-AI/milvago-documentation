---
sidebar_position: 2
title: Instalación Docker
---

# Instalación Docker

:::note[Coming soon]

Esta página está en preparación. El despliegue Docker ya existe en el producto (las imágenes servidor, consola y agente MSI alimentan el `compose` actual); esta página lo documentará paso a paso.

:::

Contenido previsto:

- las imágenes oficiales de las dos ediciones (servidor, consola, agente MSI + manifiesto de actualización);
- el archivo `compose` y las variables de entorno (`SESSION_KEY`, `CONTENT_KEYS`, `POLICY_SIGNING_KEY`, `MILVAGO_INSTALLER_DIRECTORY`);
- PostgreSQL y las migraciones de arranque;
- la puesta en servicio y las verificaciones tras el reemplazo de imagen.

## Primer arranque

Una vez iniciada la pila, abra la consola: sin administrador existente, muestra el asistente de [primera instalación](premiere-installation.md). Introduzca el valor de `MILVAGO_SETUP_TOKEN` generado en `.env` y siga el asistente.
