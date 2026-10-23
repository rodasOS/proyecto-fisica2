# Design

## Context

El nombre aparece en `src/app/app.info.ts` (fuente única de identidad), en `src/index.html` (título), en `src/app/app.html` (logotipo y pie), en el README y en la clave de `localStorage` del `ThemeService`. La sección se define en `app.info.ts` como `seccion` y se muestra en encabezado, barra lateral, pie, portada y diálogo de equipo. See proposal.md - What Changes.

## Goals / Non-Goals

**Goals:**
- Un único lugar de verdad para el nombre y la sección: `app.info.ts`.
- Que ningún texto visible siga diciendo "SigmaLab" ni "pendiente de completar".

**Non-Goals:**
- Migrar la clave antigua de `localStorage`; el efecto se describe en el proposal.
- Cambiar el nombre del paquete npm.

## Decisions

1. **Nombre y sección solo desde `app.info.ts`.** Los textos visibles ya salen de `INFO`; el título de la página y el README son los únicos fuera de ese flujo, y se actualizan a mano. *Alternativa:* inyectar el título desde Angular en tiempo de ejecución; descartada porque el título inicial en `index.html` se muestra antes de cargar la aplicación.
2. **Clave de tema renombrada sin migración.** `CLAVE` pasa a `estadix-tema`. Leer la clave antigua como respaldo añadiría código para un único cambio y un efecto menor (el tema claro por defecto). *Alternativa:* conservar la clave antigua; descartada porque mantendría el nombre viejo en el código.
3. **Letra del logotipo "E".** Coincide con el nombre; se usa el mismo bloque de estilo, sin cambios de tokens.

## Risks / Trade-offs

- [Un usuario que ya eligió tema oscuro lo verá en claro una vez] → aceptable; se documenta en el proposal y es un solo cambio.
- [El nombre no se verificó contra marcas registradas] → fuera de alcance; el usuario decide si lo registra.
