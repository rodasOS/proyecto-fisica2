# Proposal

## Why

La interfaz actual de SigmaLab es funcional pero genérica, y la identificación del proyecto aún usa marcadores en lugar de los integrantes reales. Antes de la entrega (25/10/2026) hay que mostrar los nombres y carnés de ambos integrantes y elevar la experiencia visual y de uso, tanto en escritorio como en móvil, porque diseño y facilidad de uso forman parte de la rúbrica.

## What Changes

- Mostrar en el encabezado, el pie y la portada los nombres completos y carnés de los integrantes:
  - Mario Orlando Sales Rodas — 2990-25-21488
  - Kenneth Gabriel Elías Xia Temal — 2990-25-16687
- Reestructurar los estilos con un sistema de diseño propio (tokens de color, tipografía, espaciado, radios y sombras) y componentes visuales coherentes.
- Diseño móvil primero y adaptable: navegación inferior tipo app en teléfono, barra lateral o superior en escritorio, formularios y resultados cómodos al tacto.
- Tema claro y oscuro (según preferencia del sistema, con selector manual).
- Mejorar la lectura de resultados: tarjetas con la respuesta final destacada, procedimiento plegable, tablas con desplazamiento horizontal contenido, gráficas adaptables.
- Estados de interacción claros (foco, carga, vacío, error) y accesibilidad (contraste AA, objetivos táctiles ≥ 44 px, `prefers-reduced-motion`).
- Sin cambios en la lógica de cálculo ni en las rutas.

Fuera de alcance: nuevas funciones de cálculo, cambio de stack (sin librería de componentes nueva), internacionalización. La sección sigue pendiente de dato; asignatura y nombre "SigmaLab" se conservan hasta que el equipo indique otro valor.

## Capabilities

### New Capabilities
- `diseno-interfaz`: sistema visual y de interacción responsivo (tema claro/oscuro, navegación adaptable, componentes, accesibilidad y movimiento).

### Modified Capabilities
- `shell-publicacion`: la identidad del proyecto incluye el carné de cada integrante; la navegación se adapta al dispositivo; el requisito de uso en móvil se amplía a una experiencia táctil de calidad.

## Impact

- `src/app/app.info.ts`, `app.html`, `app.ts`, `app.scss` y `src/styles.scss` (reestructuración en partes por tokens/base/componentes).
- Plantillas de los módulos y componentes compartidos (`caja-resultado`, `entrada-datos`, `ejemplos`, `grafico`) para nuevas clases y estructura; las pruebas existentes de `app.spec.ts` se actualizan para verificar carnés.
- `src/index.html` (meta `theme-color`, `color-scheme`) y posible fuente del sistema/autohospedada; sin dependencias externas en tiempo de ejecución.
- README: actualizar datos del proyecto.
