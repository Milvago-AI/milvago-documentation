---
sidebar_position: 2
title: Instalación con Docker
---

# Instalación con Docker

## Antes de empezar

Para acceso compartido, prepare un host Linux con acceso como `root` o mediante `sudo`. Instale `curl`, sincronice el reloj del host y prepare fuera de este instalador un DNS y un proxy inverso HTTPS que dirijan al puerto `4020` de la dirección IP privada del host de Milvago. El script no crea registros DNS ni certificados.

A partir del instalador 1.0.3, se comprueba cualquier comando Docker existente antes de instalar requisitos previos o paquetes Docker. En WSL, se rechaza un comando encontrado bajo `/mnt/` y se indica que debe activar **Docker Desktop > Settings > Resources > WSL integration** para esa distribución. Si falla `docker --version`, repare o elimine el comando existente antes de volver a intentarlo. Se conserva un comando Docker de Linux que funciona; Docker o Compose ausentes todavía pueden instalarse en distribuciones compatibles.

### Operación de producción

El perfil instalado ejecuta Keycloak con `start` en modo de producción detrás del proxy inverso HTTPS que usted proporciona. Mantenga ese proxy delante del puerto `4020`, conserve la cabecera `Host` y envíe `X-Forwarded-Proto: https`.

Mailpit está deshabilitado en el perfil instalado. Solo está disponible mediante el perfil `development-mail` para uso intencional de desarrollo; no es un servicio de correo de producción. Configure un servidor SMTP real durante la configuración o más tarde en **Administración > Configuración**, y envíe un mensaje de prueba antes de depender de las invitaciones de miembros o del correo de restablecimiento de contraseña. Sin SMTP, esos mensajes no están disponibles.

En cada ejecución, el instalador detiene un servicio Mailpit de desarrollo que ya estuviera en ejecución sin borrar sus mensajes capturados. Elimina únicamente la configuración SMTP de fábrica (`mail:1025` con `no-reply@milvago.test`) y conserva la configuración SMTP establecida por un operador.

Los contenedores gateway y development-mail se ejecutan como `65532:65532` con todas las capacidades Linux eliminadas; gateway solo añade la capacidad necesaria para enlazar su puerto. Use una cuenta de instalación dedicada con permiso para `sudo` que no pertenezca al grupo `docker`. Mantenga la propiedad de cada volumen específica del servicio que lo posee. Esta instalación no promete Docker rootless. Docker `userns-remap` todavía no está habilitado ni cualificado: pruebe el sondeo de disponibilidad de red del host y la propiedad de los volúmenes antes de habilitarlo.

## Instalar la versión publicada más reciente

Ejecute el siguiente comando:

```bash
curl -fsSL https://get.milvago.ai | bash
```

No se necesita un inicio de sesión de GitHub, un token de GitHub ni una credencial de registro. El instalador más reciente publicado fija una versión y un resumen exactos de la imagen. También verifica la firma cosign de la imagen, los hashes SHA-256 y las firmas Ed25519 de los agentes.

El instalador pregunta `Milvago public URL [http://localhost:4020]:`. Para acceso compartido, indique la URL pública que abrirán las personas, por ejemplo `https://milvago.example.com`. Debe usar `http` o `https` y no puede incluir ruta, consulta ni fragmento. Un valor no válido detiene la instalación. Este modo público enlaza la pasarela a la red del host en el puerto `4020`; mantenga el proxy inverso HTTPS delante de ella.

Deje la pregunta vacía para una instalación local. Usará `http://localhost:4020` y enlazará el puerto `4020` solo a `127.0.0.1`. Un valor explícito `http://localhost:4020` o `http://127.0.0.1:4020` selecciona el mismo modo local. El modo local no abre puertos adicionales en el host; la aplicación y el servicio de identidad siguen siendo internos.

Abra una instalación local en un navegador del propio servidor. Desde otro equipo, cree primero un túnel SSH y después abra `http://localhost:4020` localmente:

```bash
ssh -L 4020:127.0.0.1:4020 usuario@servidor
```

Para omitir esta pregunta, proporcione la URL al comando. Aún podría solicitarse `sudo` si se deben instalar paquetes:

```bash
curl -fsSL https://get.milvago.ai | MILVAGO_PUBLIC_URL=https://milvago.example.com bash
```

El instalador puede instalar automáticamente requisitos mediante `apt-get`, `dnf` o `yum`, y componentes de Docker en las distribuciones compatibles. No garantiza compatibilidad con todas las distribuciones o versiones de Linux. La pregunta sobre la URL se lee desde el terminal, incluso al ejecutar mediante una tubería. Sin terminal de control y sin URL indicada, selecciona el modo local.

Para una instalación local no interactiva, establezca la variable vacía:

```bash
curl -fsSL https://get.milvago.ai | MILVAGO_PUBLIC_URL='' bash
```

El modo localhost predeterminado está disponible a partir de la versión `1.0.2` del instalador.

En una ejecución posterior, el instalador conserva la URL configurada. Se detiene si una URL proporcionada, incluido un cambio entre modo local y público, entra en conflicto con ella; cámbiela en **Administración > Configuración**.

Cuando termine, abra la URL que indicó. Recupere `MILVAGO_SETUP_TOKEN` del archivo `.env` cuya ruta muestra el instalador; de forma predeterminada es `$HOME/milvago-community/.env`. Introduzca este token en el asistente del navegador, complete la configuración inicial del administrador y consulte [Componentes](./composants.md). Mantenga el archivo `.env` privado: contiene los secretos de la instancia.

## Instalar una versión fijada

En un servidor Linux, descargue anónimamente los recursos inmutables de la versión `v1.0.3`, compruébelos y ejecute el instalador:

```bash
mkdir -p milvago-install && cd milvago-install
release_url=https://github.com/Milvago-AI/milvago-server/releases/download/v1.0.3
curl -fLO "$release_url/install-private.sh"
curl -fLO "$release_url/SHA256SUMS"
curl -fLO "$release_url/release.json"
sha256sum --check SHA256SUMS
bash install-private.sh
```

Ejecute el instalador solo si ambas comprobaciones de checksum indican `OK`. El nombre `install-private.sh` es histórico; no requiere credenciales de GitHub.
