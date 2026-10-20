# Design

## Context

Repositorio sin código (solo `openspec/`). Existe una guía previa en `openspec/desing.md` con el stack elegido; este documento la formaliza. Restricciones: entrega 25/10/2026, equipo de 2, hosting gratuito sin login, exactitud de cálculo prioritaria (ver proposal.md - Why).

## Goals / Non-Goals

**Goals:**
- Separar por completo cálculo (funciones puras) de interfaz, para poder probar, reutilizar en el generador de prácticas y explicar el código.
- Que cada cálculo devuelva el mismo objeto `Resultado` renderizado por un único componente.
- Despliegue estático funcional desde el primer día.

**Non-Goals:**
- Backend, base de datos, autenticación o LLM en el camino de cálculo.
- Inferencia estadística (intervalos de confianza, pruebas de hipótesis), regresión múltiple.
- Internacionalización: la interfaz es solo en español.

## Decisions

1. **Angular (standalone + signals), sin SSR.** Es el stack elegido por el equipo; el sitio estático evita servidor. *Alternativas:* React/Vite (más simple, pero el equipo ya eligió Angular); Streamlit/Python (requiere servidor y cuotas).
2. **Cálculo en TypeScript puro en `core/stats/`.** Determinista, sin cuotas ni claves. *Alternativa:* LLM para resolver — descartado por riesgo de error numérico (4/15 puntos).
3. **Contrato `Resultado`** `{ formula, sustitucion, pasos, valor, interpretacion, advertencias }` con fórmulas en LaTeX. Una sola caja de resultado lo muestra. Las funciones no lanzan excepciones por datos inválidos: devuelven advertencias y sin `valor`.
4. **Estadísticos básicos programados a mano; `simple-statistics` solo para la normal estándar y su inversa.** Así se pueden mostrar los pasos. Las pruebas cruzan ambos resultados. *Alternativa:* jStat solo si se necesita otra distribución.
5. **Cuartiles con un método único documentado** (interpolación lineal, equivalente a numpy por defecto) y mostrado en pantalla, para coincidir con las pruebas contra numpy.
6. **KaTeX directo con directiva/pipe propio** y **Chart.js directo sobre canvas** (histograma, dispersión + recta, campana con área sombreada), evitando wrappers que quizá no soporten la versión de Angular.
7. **Rutas lazy con `withHashLocation()`** para que recargar no dé 404 en cualquier hosting estático.
8. **Estado compartido con un servicio de signals** (`datos.service`); sin NgRx.
9. **Generador de prácticas con PRNG con semilla** y calificación llamando a las mismas funciones de `core/stats/`. Cada práctica guarda su semilla para ser reproducible. Retroalimentación con detectores de errores típicos (÷N vs ÷(n−1), signo de r, cola equivocada).
10. **Conversión de unidades con tabla propia** de magnitudes (corriente, tensión, longitud, tiempo, masa, fuerza) con prefijos SI; incompatibles se rechazan.
11. **Pruebas con Vitest** contra valores precalculados con numpy/scipy (10–15 casos), almacenados como fixtures. Sirven de evidencia para el informe.
12. **Hosting:** Cloudflare Pages (o Netlify/Vercel), publicación automática desde GitHub; verificar en incógnito y móvil.
13. **Parser de datos tolerante:** divide por coma, punto y coma, espacio o salto de línea; la coma es decimal solo cuando es ambigua entre dígitos sin espacios alrededor (p. ej. `2,2`); informa posición de cada token inválido. Si hay ambigüedad real (`1,5, 2,5`), se prioriza la lectura con coma decimal cuando todos los tokens separados por espacio/salto la usan.

Estructura de carpetas: la de `openspec/desing.md` §4 (`core/stats`, `core/parsers`, `core/practica`, `core/estado`, `features/*`, `shared/*`, `data/ejemplos.ts`).

## Risks / Trade-offs

- [Diferencias con la expectativa del docente en cuartiles o decimales] → documentar el método en pantalla y permitir elegir poblacional/muestral.
- [Ambigüedad de la coma decimal frente a separador] → regla del punto 13 más aviso mostrando cómo se interpretó la entrada.
- [Wrappers/librerías incompatibles con la versión de Angular] → usar KaTeX y Chart.js directos; fijar versiones en `package.json`.
- [Reparto en pareja genera conflictos] → definir primero `Resultado`, parser y estructura; una rama por módulo.
- [Plazo corto] → desplegar un "hola mundo" el primer día y avanzar por módulos en orden de puntaje (descriptiva primero).
- [El enlace cae durante la revisión] → hosting estático gratuito sin cuotas; no depender de servicios de terceros en tiempo de ejecución (fuentes y librerías empaquetadas).
