---
sidebar_position: 1
title: Qué es Milvago
---

# Qué es Milvago

Milvago da a una organización una vista exacta de los usos de IA: qué servicios se solicitan, desde qué dispositivos, con qué frecuencia, y qué autoriza o bloquea la política. Es una plataforma de **detección y gobernanza del « Shadow AI »**: el recorrido previsto es comprender los usos, identificar los dispositivos, definir la política, verificar los efectos.

La consola, la página de inicio de sesión y la documentación comparten una paleta más suave: fondos azul pizarra en modo oscuro, fondos gris azulado claro y tarjetas blancas en modo claro. El azul identifica las acciones; el verde, el ámbar y el rojo acompañan las etiquetas de estado.

[IMAGEAMETTREICI 01]

## Lo que el producto conserva — y lo que no conserva

Por defecto, solo se conservan los **hechos**: un servicio fue alcanzado, una solicitud salió, se produjo un bloqueo. Se añaden los **nombres de los archivos** enviados a un servicio de IA, nunca sus bytes.

La **captura del texto de las solicitudes y de las respuestas** existe, pero está **desactivada por defecto** y sujeta a una autorización explícita en la herramienta. Cuando está activada, la lectura de un contenido sigue sujeta a bloqueos de confidencialidad (sesión válida, MFA reciente, motivo escrito) y cada lectura es auditada. El producto declara esta facultad francamente, en el lugar donde surge la pregunta: una formulación absoluta (« nunca recopilado ») contradicha por una opción del producto sería una falta, no una simplificación.

## Lo que cada componente puede ver

La honestidad sobre los límites forma parte del producto, y cada pantalla la recuerda: un evento de navegador no es un inventario de software; una presencia detectada no establece ni un uso ni un envío; una herramienta presente en un dispositivo no permite inferir a su usuario. Un servicio visitado sin solicitud observada es una **señal** de que un detector pide una actualización, no una prueba de uso.

## Los tres gestos del producto

1. **Observar** — la extensión y el agente reportan eventos factuales: navegaciones, solicitudes, decisiones, plataformas alcanzadas.
2. **Comprender** — la consola pone esos hechos en perspectiva: vista general, conversaciones, cartografía, informes agregados.
3. **Decidir** — la política Shadow AI observa, bloquea o enmascara; el control de modelos autoriza o rechaza un modelo; Fleet distribuye la política a los dispositivos.

## Las ediciones

- **Community**: extensión limitada a ChatGPT y Claude, agente Windows y Linux, consola de una sola organización. El paquete construido ni siquiera incorpora los adaptadores de los otros proveedores.
- **Enterprise**: multiorganización aislada por PostgreSQL, nueve proveedores cubiertos, inventario nativo de las aplicaciones de IA, grupos de dispositivos, control de modelos, sensibilidad de los usos, servidor MCP, observabilidad OTLP.

Una edición declarada por el cliente nunca otorga autorización: las guardias están en el servidor, nunca en un campo del cliente.

## El tono

Sobrio, factual, preciso. Los estados vacíos y los errores son visibles y explicados, nunca disimulados; ningún dato ficticio se presenta como real. La promesa: **ver con precisión, actuar con confianza**.

[IMAGEAMETTREICI 02]
