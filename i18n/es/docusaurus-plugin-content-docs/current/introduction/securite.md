---
sidebar_position: 4
title: Mecanismos de seguridad
---

# Mecanismos de seguridad

Las salvaguardas de Milvago se reparten en cuatro capas: **la integridad de las políticas**, **el endurecimiento local**, **el aislamiento del lado del servidor** y **el control de accesos**. Ninguna capa se apoya en la confianza en otra.

![Milvago - Mecanismos de seguridad](/img/docs/en/introduction-securite-01.png)

## Políticas firmadas y efímeras

Todo lo que pilota un dispositivo está **firmado del lado del servidor y verificado del lado del agente**:

- el **catálogo de detección** (motor + datos) lleva una revisión monótona y datos firmados; un catálogo más antiguo, con menos entradas, no es intercambiable dentro de su ventana de validez;
- la **política** aplicada por la extensión exige una revisión y una expiración (como máximo 15 minutos): una política fuera de expiración se rechaza, no se adapta;
- el **manifiesto de actualización** está firmado; una subida de versión rechaza el rejuego de una versión ya instalada y cualquier retrogradación firmada no reabre un downgrade — un aplicador SYSTEM local verifica la salud del servicio en curso antes de anunciar « instalado », y un recibo protegido permite probar una reversión.

## El endurecimiento local (dispositivo)

- **Fallo cerrándose en todas partes**: sin política válida, la extensión sella la superficie de IA cubierta; el relevo rechaza un canal IPC ocupado por un proceso de usuario (verificación sobre el **propietario del objeto**, no sobre un identificador de proceso falsificable).
- **Canal IPC endurecido**: descriptor restringido, anti-ocupación (`FIRST_PIPE_INSTANCE`, propietario SYSTEM), anti-suplantación (impersonación del cliente para leer su token, campos de autoridad reemplazados por el servicio), techo de conexiones **por llamador** — un proceso local no puede privar a todo el dispositivo de decisión.
- **El servicio no divulga su política**: la proyección `/v3/policy` retira palabras clave, excepciones, expresiones de enmascaramiento personalizadas y mensaje de bloqueo del canal visible por cualquier usuario local.
- **El colector no confía en nada del agente**: estado y ancla separados, canal reservado a los servicios, y lectura de archivos validada **sobre el descriptor abierto**, no sobre la ruta — una unión sustituida produce un error, no una lectura.
- **Actualizaciones privilegiadas sin primitiva de retrogradación**: el servicio aplicador ignora los argumentos del llamador, relee el `binPath` establecido en SYSTEM, y rechaza toda instalación cuyo alcance exceda el suyo.

## Aislamiento y controles del lado del servidor

- **Row-Level Security**: en Enterprise, cada organización solo accede a sus filas a nivel de base de datos — no un filtrado aplicativo; el aislamiento está probado por la suite de pruebas.
- **RBAC por permisos vivos**: las rutas exigen permisos verificados en cada llamada; la edición declarada por el cliente no otorga nada.
- **Bloqueos de confidencialidad**: nombres de máquinas, lectura de conversación, descubrimiento de los dominios candidatos — cada ruta exige sesión válida, **MFA reciente** y **motivo escrito**; el cambio de confidencialidad lleva su motivo y su revisión.
- **Registro de auditoría no purgable**: retención de 730 días aplicada por un desencadenador en la base — ningún camino de código, ni un rol comprometido, puede acortar la traza de las acciones.
- **Claves API con hash** (SHA-256, 256 bits de `crypto/rand`) y de autoridad acotada (`keyOnly` para el servidor MCP, solo lectura); expiraciones y revocaciones verificadas en cada llamada.
- **Contenido sellado**: todo texto conservado y todo secreto durable pasan por un cifrado **AES-256-GCM** cuyo sobre lleva su propia versión, ligada al cifrado — un sobre reetiquetado no puede abrir los bytes con otra clave; dos raíces de claves distintas separan la rotación barata (sesiones) del re-sellado (contenido).
- **Ingestión defensiva**: documentos JSON estrictos (campos desconocidos rechazados), límites de tamaño, sanitización del usuario OS (nunca la cuenta de servicio), validación Origin/CSRF del lado de la consola, límites de tasa por dispositivo y por ruta.

## La postura

![Milvago - La postura](/img/docs/en/introduction-securite-02.png)

Tres principios atraviesan todos estos mecanismos:

1. **Fallos cerrados.** Agente inaccesible, servicio detenido, canal sospechoso: la superficie de IA queda bloqueada, nunca abierta a la espera de algo mejor. Única excepción documentada: un canal que rechazara *todo* servidor no identificable rompería el registro legítimo — el caso está acotado y documentado, nunca extendido.
2. **La presencia no es el uso.** Ningún mecanismo transforma una detección en acusación: la atribución de una persona exige una asociación OIDC verificada; todo lo demás se declara « informativo ».
3. **El defecto de privilegio es una decisión, no un olvido.** Cada componente privilegiado posee su canal, su ancla y su almacén; el agente nunca recibe un poder que no haya solicitado.
