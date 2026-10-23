# Design

## Context

`ThemeService` (`src/app/core/estado/theme.service.ts`) hoy calcula el valor inicial con `leer()` (elección guardada en `localStorage` bajo `sigmalab-tema`) y, si no existe, con `preferenciaSistema()` (`matchMedia('(prefers-color-scheme: dark)')`). Además registra un escucha de cambios del sistema que, sin elección guardada, cambia el tema. Los tokens CSS ya son claros en `:root` y solo cambian bajo `:root[data-theme='dark']`, así que el tema claro es el estado base de la hoja de estilos. See proposal.md - Why.

## Goals / Non-Goals

**Goals:**
- Sin elección guardada, el tema es claro, sin consultar la preferencia del sistema.
- Mantener intactos el selector manual y la persistencia.

**Non-Goals:**
- Cambiar tokens, colores o componentes.
- Eliminar el tema oscuro.

## Decisions

1. **Valor inicial fijo a claro cuando no hay elección.** `modo` pasa a `this.guardado ?? 'claro'`. Se elimina `preferenciaSistema()`, porque ya no tiene uso. *Alternativa:* conservar la función y solo ignorarla; descartada porque deja código muerto.
2. **Retirar el escucha de `prefers-color-scheme`.** Con el claro como valor fijo, el escucha solo podría cambiar el tema del usuario sin elección, lo que contradice el requisito. Al quitarlo, la lógica queda sin efectos secundarios de sistema. *Alternativa:* dejar el escucha; descartada.
3. **`index.html` no cambia.** Ya declara `color-scheme: light dark` y `theme-color` claro. Con el tema claro por defecto, `color-scheme` sigue permitiendo que controles nativos (scroll, selects) usen su estilo oscuro cuando el usuario elige oscuro, así que el meta se deja como está. *Alternativa:* cambiar a `light`; descartada porque el modo oscuro manual necesita `color-scheme: dark`, que el `data-theme` ya aplica en CSS.

## Risks / Trade-offs

- [Usuarios que quieren modo oscuro del sistema pierden el automático] → el selector manual sigue disponible; es un cambio de valor por defecto, no una eliminación.
- [Prueba que dependía de `matchMedia`] → la prueba de valor por defecto se reescribe sin mock de sistema; se añade un caso de sistema en oscuro que debe devolver claro.
