---
sidebar_position: 8
title: Autorizaciones de IA y NIST
---

# Autorizaciones de IA y NIST

Abra **Administración > Shadow AI > Gobernanza de IA** para decidir qué programas observados están permitidos en cada equipo. Community y Enterprise admiten reglas por organización, grupo o equipo. Enterprise también hereda reglas de organizaciones superiores.

Milvago usa NIST AI RMF como referencia. El inventario, las decisiones y las fechas de revisión apoyan su gobernanza; no constituyen una certificación ni evalúan todos los riesgos de IA. **Cobertura NIST y límites** distingue el apoyo parcial, la evaluación manual y los aspectos no evaluados, como la equidad o precisión de los modelos.

## Declarar un uso empresarial o sistema de IA

En la misma vista, abra **Usos y sistemas de IA declarados**. Con `policy.manage`, seleccione **Declarar un uso** o abra una fila existente. El panel derecho permite indicar el nombre, responsable, objetivo empresarial y ámbito: organización, grupo o dispositivo.

Puede vincular identificadores de aplicaciones del inventario y declarar proveedores y modelos, con hasta 16 valores por lista. Seleccione categorías de datos, describa impactos posibles y medidas de protección, y establezca una fecha de revisión. Describa categorías sin copiar datos reales ni conversaciones. El nivel de riesgo es una evaluación manual de su organización; **Sin evaluar** indica que la evaluación está pendiente.

Seleccione el ciclo de vida declarado: previsto, en revisión, en servicio o retirado. Declarar un sistema en servicio es un registro empresarial. No demuestra que el software haya sido observado o autorizado. Se señalan las revisiones vencidas. Busque por nombre, responsable, objetivo o aplicación relacionada.

Seleccione **Guardar registro** con un motivo y MFA reciente. El registro tiene su propia revisión: actualizarlo conserva las reglas de autorización y sus excepciones actuales. Si otro administrador guardó primero, vuelva a cargar el registro antes de aplicar los cambios. Retirar una declaración requiere confirmación y conserva observaciones y reglas. Cada organización admite hasta 128 declaraciones dentro de 256 KiB.

## Publicar una regla

Con `policy.manage`, añada una regla, indique el identificador del programa del inventario y elija **Presencia** o **Ejecución**. Una regla de ejecución requiere una ejecución observada; el nombre de un paquete o imagen no basta.

Seleccione organización, grupo o equipo; para los dos últimos, use la lista de selección. Elija **Permitir** o **Prohibir**, indique responsable, objetivo, condiciones y fecha de revisión. Puede definir un fin de validez. Escriba un motivo y publique con MFA reciente. Guardar las fuentes de recopilación no publica estas autorizaciones.

Normalmente prevalece la regla más específica: equipo, grupo y organización. Por ejemplo, prohíba `antigravity` para la organización y permítalo para ingeniería. Los demás equipos conservan la prohibición. Una restricción **obligatoria** impide que una autorización más específica la relaje. Una organización hija no puede relajar una prohibición obligatoria superior.

En modo Observación, las reglas evalúan pruebas sin bloquear programas ni comunicaciones. Active explícitamente el bloqueo de ejecutables en Enterprise como se indica a continuación. **Sin regla aplicable** nunca significa permiso automático. Las pruebas insuficientes permanecen indeterminadas y las revisiones vencidas se muestran aunque la regla permita la acción.

Los resultados corresponden a la hora de evaluación mostrada. Las ubicaciones y autorizaciones se actualizan cada 30 segundos mientras están visibles y al volver a la vista. Solo se acepta una excepción activa por equipo, regla y revisión; revóquela antes de reemplazarla.

## Bloqueo de ejecutables en Enterprise

La observación sigue siendo el modo predeterminado, también para las reglas existentes. Con un servidor y un agente Enterprise compatibles, elija **Ejecución**, **Prohibir** y **Bloquear los próximos inicios**. Publique con un motivo y MFA reciente. La decisión es prospectiva: no exige que el programa se haya ejecutado antes. No termina los procesos abiertos.

Este modo se dirige a Claude Desktop, Claude Code, Codex y Antigravity App, CLI e IDE mediante un catálogo de identidades cualificadas. Exige una regla permanente, sin vencimiento ni excepciones temporales. Retire las reglas temporales que cubran la misma aplicación antes de activarlo. La fecha de revisión es un recordatorio y no hace caducar la restricción. Los permisos permanentes más específicos conservan la prioridad habitual, salvo prohibición obligatoria.

El equipo necesita un catálogo instalado por el administrador para sus versiones exactas de aplicaciones y su sistema operativo. Windows utiliza AppLocker con el servicio Identidad de aplicación activo. Linux utiliza fapolicyd y una integración aprobada por el administrador con su política existente. Un catálogo ausente, una versión no cualificada o un mecanismo no disponible se muestra como no disponible; seleccionar Bloquear no basta. Las políticas GPO, MDM o de control de aplicaciones existentes requieren integración del administrador. Milvago no fusiona permisos generales en ellas automáticamente.

Abra la autorización de la aplicación en el equipo para consultar **Bloqueo de ejecutables** y las versiones cualificadas. **Aplicado a identidades cualificadas** confirma el mecanismo del sistema comunicado para esas identidades. Los estados **Pendiente**, **Parcial**, **No disponible**, **Integración del administrador necesaria**, **Conflicto de políticas** y una confirmación desactualizada no prueban una protección completa actual. El estado lo declara el equipo, sin atestación remota.

Las prohibiciones firmadas ya aplicadas se mantienen durante una caída del servidor y tras reiniciar el agente. Restablezca la conexión y publique un permiso permanente o el modo Observación para retirar una prohibición de Milvago. Para una recuperación sin conexión o desinstalación, el administrador debe restaurar la política del sistema gestionada antes de borrar su estado protegido. Un conflicto con una política externa requiere integración manual; no borre la caché para evitarlo.

La cobertura corresponde a hashes de ejecutables cualificados o identidades exactas de paquetes en el sistema gestionado directamente. Los hashes cualificados cubren copias idénticas y renombradas de ejecutables. Las identidades de paquetes cubren el paquete exacto; las copias desempaquetadas requieren hashes cualificados por separado. En Linux también se deniega el acceso al binario prohibido para impedir que lo abra un cargador ELF explícito. Los binarios modificados o nuevos no cualificados, los intérpretes compartidos Node/Python/Electron y los huéspedes sin agente propio quedan fuera. No se instala un controlador de kernel de Milvago. Bloqueo de ejecución, filtrado de comunicaciones y DLP son independientes: prohibir un inicio no demuestra inspección antes del envío, y el ajuste de comunicación **Bloquear** no demuestra que Claude Desktop, Claude Code o Codex no puedan iniciarse.

El catálogo Windows suministrado cubre Claude Code 2.1.303, Codex 0.166.0 y Antigravity App 2.24.0, CLI 1.4.0 e IDE 2.5.5. También incluye Claude Desktop 4.16336.0.0 para su inicio MSIX principal y su ejecutable principal desempaquetado. El catálogo Linux suministrado cubre Claude Code 2.1.303, Codex 0.166.0 y Antigravity CLI 1.4.0. La importación del catálogo es una operación independiente del administrador; activar una regla no lo instala.

Para Claude Desktop 4.16336.0.0, la integración local de Windows también desactiva la disponibilidad del paquete cualificado mediante la administración de paquetes de Windows. Esto impide futuros inicios del servicio Cowork sin modificar sus permisos ni su configuración de inicio. Se conservan las instancias activas. El bloqueo completo del servicio espera al cierre natural de los clientes del paquete y se indica como Parcial mientras tanto. Cierre Claude Desktop para completarlo; AppLocker sigue denegando nuevos inicios principales. Milvago registra la disponibilidad original antes de modificarla y la restaura al retirar la restricción, sin iniciar la aplicación ni el servicio. Un paquete previamente desactivado permanece desactivado. Un servicio ausente, modificado o no cualificado impide el estado Aplicado. En dispositivos administrados, integre el requisito de disponibilidad del paquete exportado y las denegaciones AppLocker con los controles existentes. Verificar solo el inicio principal no demuestra el bloqueo del servicio.

La cobertura por hash se aplica a ejecutables Windows desempaquetados y archivos ELF Linux, incluidas sus copias idénticas o renombradas. Los lanzamientos Windows empaquetados requieren una identidad de paquete cualificada por separado; el reempaquetado queda fuera de la cobertura basada solo en hash.

En Linux, un recurso de inicio cualificado identifica un archivo imprescindible de la aplicación en lugar de su motor Electron compartido. Linux deniega el acceso a ese archivo exacto, incluidas sus copias idénticas o renombradas, para impedir el inicio de la aplicación. El motor compartido sigue disponible. Los archivos de inicio modificados, extraídos o reempaquetados requieren una cualificación independiente y quedan fuera de esta cobertura. El estado del equipo distingue los recursos de inicio de los hashes de ejecutables.

El catálogo Linux suministrado también cubre Claude Desktop 4.16336.0, Antigravity App 2.23.1 y Antigravity IDE 2.5.5 mediante sus recursos de inicio cualificados. Sus motores Electron se comparten con otros programas: no añada sus hashes como identidades de aplicación.

En Linux, la cobertura también depende de los sistemas de archivos supervisados por fapolicyd. La ejecución anónima o solo en memoria y la inyección en procesos no están cubiertas.

En Linux, el administrador debe activar `allow_filesystem_mark = 1` en la configuración de fapolicyd y reiniciar ese servicio tras revisar la política existente para cargas con montajes enlazados. Este modo también supervisa el acceso desde espacios de nombres de montaje aislados en los sistemas de archivos supervisados. Milvago no modifica esa configuración. Comprueba la denegación efectiva con una sonda inerte en un montaje enlazado privado; si la configuración o los permisos del sistema impiden esta comprobación, el equipo no puede declarar la restricción como aplicada.

## Revisar un equipo y aprobar una excepción

En **Monitoring > Inventario de IA**, abra un programa y **Ubicaciones**. Cada fila agrupa todas las observaciones de un equipo y distingue presencia y ejecución. Seleccione un equipo para ver sus pruebas y autorización actual. La opción de ver pruebas de todos los equipos retira el filtro. Las relaciones de máquinas virtuales y contenedores permanecen en **Entornos**.

Una excepción corresponde a un equipo y una regla actual que acepte excepciones. Requiere `ai.governance.approve`, permisos de lectura, motivo, vencimiento dentro de tres meses y MFA reciente. El propietario tiene este permiso de aprobación de forma predeterminada; puede asignarlo explícitamente a un rol personalizado. Una nueva publicación invalida excepciones anteriores. Pueden vencer o revocarse con motivo. Una organización hija no puede aprobar una excepción a una restricción superior.

La **Revisión del inventario** es una anotación global y no reemplaza las reglas de cada equipo. El historial conserva revisiones publicadas y decisiones de excepción justificadas. La evaluación actual usa las reglas vigentes y no reescribe observaciones pasadas.

## Importar y automatizar

Puede validar YAML o JSON y usarlo como borrador antes de publicar. Validar no guarda ni activa reglas. Los documentos contienen datos, sin ejecutar scripts. Se admiten hasta 256 reglas por organización dentro del límite de tamaño.

Utilice la API de descubrimiento y el MCP Enterprise para las lecturas automatizadas. El MCP Enterprise no publica reglas ni aprueba excepciones. El [NIST AI RMF oficial](https://airc.nist.gov/airmf-resources/airmf/5-sec-core/) describe el marco organizativo completo.
