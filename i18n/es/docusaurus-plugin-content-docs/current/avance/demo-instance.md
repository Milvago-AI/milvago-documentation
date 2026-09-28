---
sidebar_position: 4
title: Instancia de demostración
---

# Instancia de demostración

Una instancia de demostración publica el producto en Internet: cualquiera puede visitarlo con un identificador simple, sin poder modificar nada, con datos que se mueven cada cinco minutos. Se apoya en dos variables de entorno y una pila Docker dedicada.

![Milvago - Instancia de demostración](/img/docs/en/avance-demo-instance-01.png)

## Poner la demostración en servicio

1. Desde el host de operaciones Docker, prepare las dos variables de demostración en los secretos del despliegue.
2. Inicie la pila dedicada `compose.demo.yaml` sin exponer ningún servicio salvo su proxy.
3. Abra la URL pública e inicie sesión con la cuenta de demostración.
4. Compruebe que se rechaza una acción de modificación y que los datos sintéticos son visibles antes de compartir la URL.

## Las dos variables

| Variable | Efecto |
| --- | --- |
| `MILVAGO_DEMO_READONLY` | rechaza **toda** mutación de consola en la instancia, sea cual sea el rol del llamante, **antes del enrutamiento** — una ruta añadida más tarde queda cubierta sin pensarlo. Segunda guardia, más grosera, por encima del rol: dos rutas de consola están registradas sin permiso (`PUT /api/profile`, `POST /auth/logout`), por lo tanto un rol en solo lectura no cubre todo |
| `MILVAGO_DEMO_MCP_KEY` | clave MCP de demostración mostrada en la página de perfil — **y en ningún otro lugar**, y solo si la instancia está en solo lectura: una instancia que acepta escrituras puede fabricarse sus propias claves, y una instancia de cliente nunca debe mostrar una credencial que no ha creado |

La **ingestión de los dispositivos** (`/v1`, `/v2`, `/v3`) queda voluntariamente fuera del alcance de la bandera: es por ahí por donde llegan los datos, y exige una credencial de aparato que ningún visitante posee.

## La pila

`compose.demo.yaml` es una pila autónoma, distinta del compose principal: ningún puerto publicado salvo los del **proxy**, sin instancia Community, y todo lo que no es el proxy está cortado de Internet. Cuatro capas hacen respetar la lectura sola:

1. **La arista**: solo pasan `GET`/`HEAD`, más la desconexión; los caminos de ingestión, `/metrics` y `/ext` responden 404 públicamente. `/mcp` es el único punto de entrada público para una máquina: solo acepta `POST` — cualquier otro método ahí también responde 404 — reenviado a la aplicación, siempre sujeto a su propia credencial de solo lectura o token OAuth.
2. **El servidor**: `MILVAGO_DEMO_READONLY`.
3. **El rol**: un rol `demo` con ocho permisos de lectura — `overview.read`, `events.read`, `devices.read`, `members.read`, `content.read`, `reports.aggregate`, `policy.manage`, `audit.read`. `policy.manage` es lo que habilita la lectura de las pantallas de configuración de Shadow AI y de la lista de candidatos de Discovery; la consola sigue ocultando toda acción que escriba, y las otras tres capas la rechazan de todos modos.
4. **La identidad**: cambio de contraseña y registro desactivados — de lo contrario, un visitante cambia la contraseña compartida y bloquea a los siguientes.

![Milvago - La pila](/img/docs/en/avance-demo-instance-02.png)

## Ningún agente descargable

Una demostración muestra el producto; **no distribuye un agente** capaz de registrar una máquina real. Las rutas de instalador y de clave de despliegue exigen un permiso que el rol no porta, y la arista rechaza explícitamente los caminos de extensiones e instaladores con 404 — una regla que no depende ni del rol, ni del contenido de la imagen. Consecuencia asumida: las pantallas de configuración de Shadow AI y la lista de candidatos de Discovery son visibles, en solo lectura, gracias a `policy.manage`; las pantallas que requieren un permiso de escritura `*.manage` que el rol no porta — Ajustes, Miembros, Roles, Organizaciones, Directorio LDAP — permanecen ocultas.

## Los datos de demostración

El generador aprovisiona lo que una credencial de aparato no puede alcanzar, luego habla el **protocolo agente real**: nada se escribe en las tablas de eventos a espaldas del servidor — sellado, clasificación, atribución y retención pasan por el código que ejerce la flota de un cliente.

- Historial de 30 días enviado una vez, luego una **ola cada cinco minutos**: la retención acota la base, nada se borra en bloque.
- Contenido totalmente inventado (rangos de documentación, dominios de ejemplo), por lo tanto presentado en claro: el visitante ve la extensión de lo que el producto puede retener.
- Una flota sintética por defecto de 25 dispositivos, un cuarto nativos (los dos canales de recolección lado a lado), sin ningún nombre de persona.
- Doce temas rotan en una hora — pico de cargas de archivos bloqueadas, secretos detectados, plataforma no cubierta, modelo rechazado… — por lo tanto un visitante que se queda ve la **forma** cambiar, no solo los contadores subir.

![Milvago - Los datos de demostración](/img/docs/en/avance-demo-instance-03.png)
