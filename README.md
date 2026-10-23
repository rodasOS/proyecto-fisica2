# Estadix — Asistente virtual de Estadística Aplicada

Proyecto académico UMG (Facultad de Ingeniería).

**Integrantes:**
- Mario Orlando Sales Rodas — 2990-25-21488
- Kenneth Gabriel Elías Xia Temal — 2990-25-16687
 App web estática en Angular: todos los cálculos los hace código TypeScript determinista (sin backend, sin IA, sin cuentas).

## Comandos

```bash
npm install
npm start          # servidor de desarrollo en http://localhost:4200
npm test           # pruebas unitarias (Vitest)
npm run build      # build de producción en dist/asistente-estadistica/browser
```

## Estructura

- `src/app/core/stats/` — cálculo puro; cada función devuelve un `Resultado` (fórmula, sustitución, pasos, respuesta, interpretación, advertencias).
- `src/app/core/parsers/` — lectura y validación de números.
- `src/app/core/practica/` — generador de prácticas y calificación.
- `src/app/features/` — un componente por módulo; `src/app/shared/` — fórmula (KaTeX), gráficos (Chart.js), caja de resultado.
- `src/app/app.info.ts` — nombre del asistente, integrantes, asignatura y sección.

## Pruebas

Las pruebas comparan los cálculos con valores de referencia generados con el módulo `statistics` de Python (`core/stats/fixtures.ts`) y con casos conocidos del enunciado (p. ej. corriente: media 2.2 A, s ≈ 0.1581 A).

## Despliegue

Build estático: publicar la carpeta `dist/asistente-estadistica/browser` en Cloudflare Pages, Netlify o Vercel. Se usa `withHashLocation()`, así que recargar no da 404.

Enlace publicado: _pendiente_
