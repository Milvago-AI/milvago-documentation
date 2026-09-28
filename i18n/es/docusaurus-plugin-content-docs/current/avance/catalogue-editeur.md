---
sidebar_position: 3
title: Catálogo de detección
---

# Catálogo de detección

El catálogo es el **motor y los datos** que dicen a la extensión qué medir en los sitios cubiertos: rutas de prompt y de carga de archivos, cuerpos, selectores DOM del compositor, plataformas conocidas. Está firmado, versionado, y su cobertura depende de la edición servida: dos proveedores en Community, nueve en Enterprise.

Para abrir la pantalla de edición, seleccione **Administración → Catálogo de detección**. Se reserva a las dos condiciones acumuladas:

- la variable `MILVAGO_DEBUG` está establecida en la instancia (véase [Variables de entorno](../installation/variables-environnement.md));
- usted porta `policy.manage` y la consola de administración no está oculta.

`MILVAGO_DEBUG` es más que un interruptor de visibilidad en la consola: el servidor la comprueba primero en cada importación manual y en cada solicitud de publicación, antes incluso de comprobar la propiedad, y rechaza la solicitud sin más — el mismo rechazo genérico que ya recibe alguien que no es propietario, de modo que sondear una instancia nunca revela si la bandera está activada. La publicación en sí exige además el Propietario de la organización raíz y una MFA reciente. La importación automática desde el editor sigue otra ruta y permanece abierta sea cual sea esta bandera: debe poder corregir los detectores en una instancia en funcionamiento.

![Milvago - Catálogo de detección](/img/docs/en/avance-catalogue-editeur-01.png)

## Importar y publicar

1. Active `MILVAGO_DEBUG` en el despliegue del servidor y reinícielo o vuelva a desplegarlo.
2. Inicie sesión con `policy.manage`; publicar también exige el rol Propietario de la organización raíz y MFA reciente.
3. Abra **Administración → Catálogo de detección** e importe el catálogo medido.
4. Compruebe las entradas y la revisión antes de seleccionar **Publicar**.
5. Tras la publicación, consulte la salud de los detectores y el aviso de cobertura en las pantallas de Supervisión.

## Importar y publicar

- La **importación manual** pasa por la ruta de consola, cerrada sin `MILVAGO_DEBUG`: un catálogo medido (relevado en el sitio, jamás adivinado) se carga, se valida, luego se publica.
- La publicación produce una **revisión monótona**: una importación se rechaza salvo que su revisión sea estrictamente mayor que la revisión actual de la instancia, sean cuales sean las entradas que porte. Esta regla cierra el caso de un catálogo más antiguo o sin cambios, con menos entradas, reproducido dentro de su ventana de validez.
- Un catálogo **publicado conserva sus bytes firmados**: la reedición no los reescribe.
- El servidor sigue siendo la autoridad: promover o publicar algo que no porta responde un error explícito, no un éxito silencioso.

## La salud de los detectores

La pantalla muestra el veredicto del servidor por proveedor **y por revisión**: servicio, estado, revisión aplicada, dispositivos, solicitudes vistas por el detector de red y por el detector DOM. Los estados leen en términos de catálogo — una regla de red que ya no corresponde, selectores renombrados por el sitio:

| Estado | Lectura |
| --- | --- |
| **Señales disponibles coherentes** | regla y DOM coinciden |
| **Solo DOM: captura de red no disponible** | las solicitudes ya no se ven, el DOM sí |
| **Sin transporte de detección** / **Transporte de detección parcial** | los dispositivos ya no reportan la cobertura, total o parcialmente |
| **Detección DOM degradada** / **Cobertura por revisar** | el desvío red–DOM supera los umbrales |
| **Datos insuficientes para publicar** | servicio no visitado en la ventana — **no medido, no es un fallo**; este estado y «Señales disponibles coherentes» nunca desencadenan un banner |

![Milvago - La salud de los detectores](/img/docs/en/avance-catalogue-editeur-02.png)

## El banner de cobertura

En las pantallas de Monitoring, un aviso se muestra para los portadores de `policy.manage` cuando la cobertura se degrada, nombrando los servicios concernidos: el peor estado primero. Su función es simple — **decir que las cifras están incompletas** — porque una flota que ya no captura se parece exactamente a una flota que ya no usa la IA, y la página que muestra la cifra más pequeña no lo dice por sí sola. En modo depuración, el banner lleva el enlace hacia los detalles.

:::note
El catálogo sigue siendo la única fuente de rutas: la extensión nunca sella, enmascara ni bloquea un sitio fuera de las rutas medidas que porta. Véase [Shadow AI](../administration/shadow-ai.md) para la política, [Discovery](../monitoring/discovery.md) para lo que el catálogo todavía no cubre.
:::
