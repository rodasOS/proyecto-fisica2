# Design

## Context

Estado actual (observado): estilos en un solo `src/styles.scss` (132 líneas) con variables CSS mínimas, `app.scss` vacío, menú superior en píldoras con `flex-wrap`, encabezado azul con autores en texto pequeño y datos de integrantes como marcadores en `src/app/app.info.ts`. Componentes compartidos (`caja-resultado`, `entrada-datos`, `ejemplos`, `grafico`, `formula`) y módulos usan clases globales (`panel`, `caja`, `fila`, `campo`, `chip`, `respuesta`). KaTeX y Chart.js se renderizan con colores fijos. Ver proposal.md para la motivación.

## Goals / Non-Goals

**Goals:**
- Sistema de diseño con tokens CSS, móvil primero, tema claro/oscuro.
- Navegación adaptable (inferior en teléfono, lateral en escritorio) sin cambiar rutas.
- Resultados con jerarquía clara; gráficas y fórmulas coherentes con el tema.
- Datos de integrantes con carné visibles en todos los tamaños.

**Non-Goals:**
- Cambiar lógica de cálculo, rutas o modelo `Resultado`.
- Añadir librerías de UI (Material, Tailwind) ni fuentes remotas.
- Soporte de impresión o internacionalización.

## Decisions

1. **CSS propio con tokens y capas, sin librería.** Archivos SCSS por capa (`styles/tokens`, `base`, `layout`, `componentes`) importados desde `styles.scss`, usando `@layer` para controlar especificidad. *Alternativas:* Tailwind (añade build y reescritura de todas las plantillas); Angular Material (ya se descartó por peso y por limitar el diseño propio).
2. **Móvil primero con `min-width` y unidades fluidas** (`clamp()` en tipografía y espaciado, `grid` con `auto-fit`). Puntos de quiebre: 640 px (tableta) y 1024 px (escritorio). *Alternativa:* `max-width` (el estilo actual), más propenso a desbordes.
3. **Navegación adaptable en `App`:** barra inferior fija con 4 accesos (Inicio, Descriptiva, Probabilidad, Práctica) y botón "Más" con hoja inferior para los demás en < 1024 px; barra lateral fija con los 8 módulos en ≥ 1024 px. Un único arreglo `menu` alimenta ambas vistas; `env(safe-area-inset-bottom)` para iPhones.
4. **Identidad con carné:** `INFO.integrantes` pasa a objetos `{ nombre, carne }`. Encabezado compacto (nombre del asistente + botón "Equipo" que abre un panel con integrantes, carné, asignatura y sección) en móvil; tarjeta visible en la barra lateral y pie en escritorio. *Alternativa:* mostrar todo en el encabezado (ocupa demasiado en 360 px).
5. **Tema con `data-theme` en `<html>` y `prefers-color-scheme` como valor inicial;** elección en `localStorage` (con try/catch) mediante un pequeño `ThemeService` con signal. Los tokens de color se redefinen por tema; `color-scheme` y `theme-color` se actualizan. Las gráficas leen los colores de los tokens (`getComputedStyle`) y se reconfiguran al cambiar el tema.
6. **Resultado como tarjeta con jerarquía:** respuesta final arriba y destacada, luego interpretación; fórmula, sustitución y procedimiento en secciones, con el procedimiento dentro de `<details open>` plegable. Tablas dentro de contenedor con `overflow-x: auto`.
7. **Campos y controles:** `font-size: 16px` mínimo en inputs (evita zoom en iOS), altura táctil ≥ 44 px, botón principal fijo a ancho completo en móvil, `scroll-into-view` hacia el aviso de error tras calcular.
8. **Tipografía del sistema** (`system-ui`) más escala fluida; sin descargar fuentes. *Alternativa:* fuente autohospedada (mejor identidad, más peso y trabajo; se puede añadir después).
9. **Movimiento:** transiciones de 120–200 ms en color/sombra/transform, todas bajo `@media (prefers-reduced-motion: no-preference)`.
10. **Verificación visual automatizada:** capturas con Chrome headless a 360, 768 y 1280 px en ambos temas, y comprobación de ausencia de desbordamiento horizontal, igual que la verificación previa del proyecto.

## Risks / Trade-offs

- [Regresiones visuales por tocar todas las plantillas] → cambiar primero tokens/base, mantener nombres de clases existentes cuando sea posible y revisar capturas de cada módulo.
- [Gráficas y KaTeX ilegibles en tema oscuro] → colores de gráficas desde tokens y color de texto heredado en KaTeX; verificar con capturas.
- [Barra inferior tapa contenido o el pie] → `padding-bottom` del contenido igual a la altura de la barra más el área segura.
- [`localStorage` no disponible en modo privado] → try/catch y valor por defecto del sistema.
- [Carné o nombres con errores tipográficos] → fuente única en `app.info.ts` y prueba que verifica el texto exacto.
- [Sección aún desconocida] → se conserva el marcador y se avisa antes de entregar.
