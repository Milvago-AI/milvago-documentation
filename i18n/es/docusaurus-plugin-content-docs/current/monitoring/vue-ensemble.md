---
sidebar_position: 1
title: Vista general
---

# Vista general

## Acceder a esta pantalla

En la barra lateral, haga clic en **Supervisión > Vista general**. Se requieren `overview.read` y `events.read`, salvo que una organización en consulta agregada exclusiva, un perfil sin `events.read`, o un perfil con `reports.aggregate` pero sin `devices.read`, vea Informes en su lugar si tiene `reports.aggregate`.

1. Use **Ver los dispositivos** para abrir **Parque > Dispositivos** y aprobar un dispositivo pendiente con `members.manage`.
2. Use **Abrir las conversaciones** o **Abrir la cartografía** para investigar; los accesos no aplican filtros.
3. Haga clic en **Actualizar** para recargar los indicadores.

La vista general es la primera pantalla de la consola, la que se muestra al conectar (`#overview`). Responde a una sola pregunta, en una ventana de 24 horas: **¿qué está pasando, ahora mismo, en los usos de IA de la organización?**

No sustituye ni al detalle (Conversations), ni a la geografía de los flujos (Cartografía), ni a la gestión (Fleet, Administración). Su función es permitir la decisión del día: ¿hay una anomalía que profundizar, un dispositivo por aprobar, una política por ajustar?

![Milvago - Acceder a esta pantalla](/img/docs/en/monitoring-vue-ensemble-01.png)

## El principio de lectura

Dos reglas guían toda la pantalla, y toda la plataforma:

1. **Las cifras son hechos observados.** La página no proyecta, ni estima, ni extrapola nada. Lo que un navegador no puede captar no se adivina — y la línea de información bajo el título lo recuerda en todas sus letras: un evento de navegador no es un inventario de software. Ver « 12 proveedores » no significa « 12 software instalados ».
2. **Dos familias de eventos, contadas por separado.** Una **navegación** (un dispositivo visita un sitio de IA) no es una **solicitud** (una solicitud salió). La tarjeta « Solicitudes » lleva el número de solicitudes y nombra las navegaciones aparte, en su índice.

Los números se formatean según el idioma de la consola (separadores, espacios) y permanecen tabulares.

## El recorrido de la página

La pantalla se lee en el orden del código, de lo más urgente a lo más analítico. Cada bloque solo aparece si su condición es verdadera.

### 1. El banner « Pendiente »

Si hay dispositivos en espera de aprobación **y** usted tiene el derecho de aprobarlos, un banner de alerta se muestra en cabeza: « N dispositivos están a la espera de su aprobación. », con un botón hacia Dispositivos. Mientras un dispositivo está en espera, nada se reporta de él: es el único bloqueo que vale un banner permanente.

![Milvago - 1. El banner « Pendiente »](/img/docs/en/monitoring-vue-ensemble-02.png)

### 2. La tarjeta de arranque

Si **ningún dispositivo** está registrado, la página muestra los tres pasos del primer recorrido, con un enlace de atajo hacia cada pantalla:

1. **Descargar el agente** — el paquete (MSI o RPM) es servido por el servidor.
2. **Aprobar el primer dispositivo** — un dispositivo aparece en espera tras su instalación, según la política de aprobación de la organización.
3. **Configurar los servicios** — en Shadow AI, elegir los servicios de IA observados, bloqueados o redirigidos.

Esta tarjeta desaparece en cuanto la flota existe. En lugar de la página vacía, la pantalla muestra entonces los indicadores de abajo, eventualmente a cero — un cero se muestra, no se oculta.

![Milvago - 2. La tarjeta de arranque](/img/docs/en/monitoring-vue-ensemble-03.png)

### 3. Los cuatro indicadores (KPI)

| Tarjeta | Valor | Índice | Lectura |
| --- | --- | --- | --- |
| **Solicitudes** | número de solicitudes recibidas en el período | « Últimas 24 horas · N navegaciones » | el volumen de uso real, navegaciones descontadas aparte |
| **Bloqueadas** | número de eventos bloqueados | « N % de las solicitudes » o « Según las reglas aplicadas » si cero solicitudes | toma una tonalidad de peligro en cuanto el valor es > 0 |
| **Dispositivos activos** | activos / total | « N inactivos, pendientes o revocados » | la relación de cobertura: un dispositivo inactivo es una ventana de medida cerrada |
| **Proveedores observados** | número de proveedores distintos | « Durante el periodo » | la extensión del perímetro efectivamente solicitado |

El porcentaje de bloqueo se calcula sobre la misma ventana de 24 h; el recuento de inactivos es la diferencia entre el parque total y los dispositivos activos.

![Milvago - 3. Los cuatro indicadores (KPI)](/img/docs/en/monitoring-vue-ensemble-04.png)

### 4. « Ritmo de uso » (columna izquierda)

Un histograma horario sobre la ventana de observación: cada barra lleva el volumen de la hora, apilamiento **observado** (gris) y **bloqueado** (rojo). Una infoburbuja por barra detalla « hora · eventos / bloqueados ». Dos lecturas se hacen en ella:

- la **forma** (crestas, valles, tramos muertos) cuenta cuándo la organización solicita la IA;
- la parte roja, en proporción, cuenta si la política frena o deja pasar.

El pie de la tarjeta recuerda la ventana exacta y propone el botón hacia **Conversations** para pasar del « cuánto » al « qué ». A cero eventos, la tarjeta muestra el estado vacío « Ningún evento recibido » y dice cuándo aparecerán los eventos.

![Milvago - 4. « Ritmo de uso » (columna izquierda)](/img/docs/en/monitoring-vue-ensemble-05.png)

### 5. « Proveedores observados » (columna derecha)

Una lista clasificada: una escala por proveedor, donde la parte **observada** (solicitudes no bloqueadas) y la parte **bloqueada** se leen lado a lado, con el recuento a la derecha. Es la distribución real de los usos en el período.

- Si usted dispone del rol de análisis, el pie de la tarjeta recuerda el alcance (« Personas → herramientas → servicios → modelos ») y abre la **Cartografía**, que detalla cada flujo dispositivo por dispositivo.
- Si la lista está vacía, la pantalla lo asume: « Esta lista refleja únicamente los eventos realmente recibidos. » — la ausencia de proveedor no es un fallo de medición, es una ausencia de tráfico.

![Milvago - 5. « Proveedores observados » (columna derecha)](/img/docs/en/monitoring-vue-ensemble-06.png)

## Quién ve qué

- La pantalla exige los permisos `overview.read` y `events.read`; está oculta de la navegación sin `overview.read`, y sin `events.read` da paso a Informes o a un acceso restringido.
- El banner de aprobación exige además la gestión de dispositivos.
- En Community, el perímetro observado se limita a ChatGPT y Claude; en Enterprise, se extiende a los nueve proveedores cubiertos y a las aplicaciones de IA locales — la página funciona de manera idéntica, solo cambia el dato que la alimenta.
- El botón **Actualizar** recarga los indicadores y la lista de dispositivos; la página no se refresca sola.
