# Proposal

## Why

Hoy la interfaz toma el tema de la preferencia del sistema operativo cuando el usuario no ha elegido uno. Esto hace que un docente o estudiante con modo oscuro activado vea SigmaLab en oscuro sin haberlo pedido, y que la presentación del estilo Educational Platform (pastel sobre fondo crema) no se vea como se diseñó. Se pide que el tema claro sea el predeterminado.

## What Changes

- El tema claro es el valor por defecto cuando no hay elección guardada, sin importar la preferencia del sistema.
- El selector de tema sigue permitiendo cambiar a oscuro y la elección se recuerda en el navegador, como hoy.
- Una vez que el usuario elige un tema, esa elección prevalece sobre cualquier cambio posterior del sistema.
- Cuando no hay elección guardada, un cambio de preferencia del sistema ya no cambia el tema de la interfaz.

Supuesto registrado: "tema blanco por defecto" se interpreta como tema claro predeterminado, no como un tema forzado. El usuario puede seguir cambiando a oscuro. Si se quisiera eliminar el tema oscuro por completo, sería otro cambio.

Fuera de alcance: cambios de colores, tipografía o componentes; el modo oscuro se mantiene como está.

## Capabilities

### New Capabilities
<!-- Ninguna. -->

### Modified Capabilities
- `diseno-interfaz`: el requisito de tema claro y oscuro cambia su valor por defecto de "preferencia del sistema" a "tema claro".

## Impact

- `src/app/core/estado/theme.service.ts`: valor inicial sin elección guardada pasa a claro; se retira el escucha de `prefers-color-scheme`.
- `src/app/core/estado/theme.service.spec.ts`: la prueba de valor por defecto ya no depende de la preferencia del sistema; se añade caso de preferencia del sistema en oscuro que debe ignorarse.
- `src/index.html`: `color-scheme` y `theme-color` iniciales coherentes con el claro por defecto.
- Spec principal `openspec/specs/diseno-interfaz/spec.md`: se actualiza el requisito al archivar.
