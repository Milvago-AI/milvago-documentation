---
sidebar_position: 4
title: Confidencialidad
---

# Confidencialidad

## Acceder a la pantalla

En la barra lateral, haga clic en **Administración** > **Confidencialidad**. Necesita `settings.manage` para cambiar ajustes; con solo el derecho de borrar identidad, está disponible la rotación de alias.

1. Modifique los ajustes necesarios.
2. Indique un motivo de al menos 8 caracteres.
3. Haga clic en **Guardar** y complete la verificación MFA si se solicita.
4. Al volver a la consola, compruebe que se muestran los nuevos valores; se aplican sin volver a introducir los campos.

La pantalla Privacidad responde a la pregunta « **hasta dónde identifica la plataforma a las personas** ». Configura la seudonimización predeterminada, la agregación de los informes, la conservación de los vínculos de identidad y los envíos al editor. El acceso exige el permiso `settings.manage` (« Gestionar los ajustes »); una cuenta que solo porta el derecho de revelar una identidad ve aquí la única rotación de alias.

Toda modificación exige un **motivo escrito** de al menos 8 caracteres — « Este motivo se conserva en el registro de auditoría. » — y una **autenticación multifacto reciente**: si falta, el servidor la rechaza y la consola redirige a la verificación, luego aplica la modificación al volver sin hacerla reintroducir.

[IMAGEAMETTREICI 01]

## Los ajustes

- **Seudonimización predeterminada** — muestra por defecto un alias en las vistas individuales. Aún puede autorizarse una revelación de identidad.
- **Solo informes agregados** — activa el modo de informes agregados y desactiva el acceso individual a los usos.
- **Umbral de agregación** — de 1 a 100: los grupos de informe por debajo del umbral de personas distintas se ocultan.
- **Conservación de vínculos de identidad (días)** — de 7 a 365 días para la asociación entre persona y eventos; después, revelar la identidad es imposible.
- **Motivo de conservación ampliada** — justifica la conservación de eventos configurada en Ajustes más allá de 180 días. Se exige por encima de esa duración y no la cambia.
- **Atributo OIDC del equipo** — el nombre exacto del atributo OIDC de equipo, no un nombre de equipo; sirve para repartir los informes.

:::enterprise

**Aplicar a las organizaciones filiales** — una organización principal puede imponer a sus filiales solo la seudonimización, el modo agregado, el umbral y la conservación de los vínculos de identidad. Los compartidos y la rotación de alias siguen siendo propios de cada organización. Los campos impuestos quedan bloqueados en las filiales.

:::

[IMAGEAMETTREICI 02]

## Renovar los alias

Un alias vincula los eventos de una misma persona sin mostrar su nombre. La rotación cambia los alias de **la organización seleccionada**, por ejemplo después de compartir una exportación seudonimizada. No se propaga a las organizaciones filiales ni elimina los eventos.

La **rotación de los alias** recalcula los seudónimos de todas las personas y revoca los levantamientos de identidad activos. Exige el derecho de eliminación de identidad, un motivo escrito, y porta su propia advertencia: « Recalcular los alias y revocar las revelaciones activas. La rotación no garantiza el anonimato; los datos ya exportados y las correlaciones siguen siendo posibles. » La confirmación lee « Alias recalculados: N. Revelaciones activas revocadas. »

## El levantamiento de identidad, en otras partes de la consola

La rotación no es más que un lado del equilibrio: una identidad se **levanta** desde el detalle de una conversación (15 minutos, motivo obligatorio, lectura auditada) y se **recompone** sola al vencimiento de los vínculos de identidad. Véase [Conversaciones](../monitoring/conversations.md).

## Datos compartidos con el editor

Cualquier cuenta con `settings.manage` ve el panel **Datos compartidos con el editor**. Permite elegir por separado:

- **Importar automáticamente el catálogo del editor** — importa el catálogo firmado si hay una conexión configurada. Esta opción solo aparece para la organización raíz y se aplica a toda la instancia. Por sí sola no envía telemetría.
- **Compartir el estado de los detectores** — consentimiento propio de la organización que comparte el estado agregado de los detectores por proveedor y revisión, sin texto de conversaciones.
- **Compartir el número de equipos** — consentimiento propio de la organización que comparte solo los recuentos de equipos inscritos y activos durante 30 días, sin nombres de equipos.

Las vistas previas y los estados están reservados al propietario de la instancia.

Consulte [Conectar al servicio del editor](../avance/service-editeur.md) para la configuración del servidor.
