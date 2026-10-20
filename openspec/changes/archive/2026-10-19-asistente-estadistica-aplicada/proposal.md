# Proposal

## Why

El curso exige, para el 25/10/2026, un asistente virtual académico de Estadística Aplicada que resuelva ejercicios reales, muestre fórmula, sustitución, procedimiento y respuesta, y sea accesible por un enlace gratuito sin login. La exactitud vale 4 de 15 puntos, por lo que los cálculos deben ser deterministas y verificables. No existe todavía código en el repositorio.

## What Changes

- Nueva app web estática (Angular, sin backend ni claves de API) publicada en un hosting gratuito con HTTPS.
- Motor de cálculo en TypeScript puro (`core/stats/`) cuyas funciones devuelven un objeto `Resultado` uniforme (fórmula, sustitución, pasos, valor, interpretación, advertencias).
- Módulos de usuario: estadística descriptiva, datos experimentales con unidades, tablas de frecuencias y gráficas, probabilidad y distribución normal, correlación y regresión lineal simple, y teoría (σ poblacional vs s muestral).
- Entrada de datos libre por el usuario con parser tolerante (coma/punto decimal, separadores) y validación con advertencias claras.
- Al menos 10 ejercicios de ejemplo (incluido el de la corriente: 2.1, 2.3, 2.2, 2.4, 2.0) y un generador de prácticas con calificación y retroalimentación.
- Encabezado fijo con nombres de ambos integrantes, asignatura y sección; nombre original del asistente.
- Pruebas unitarias contrastadas con valores de numpy/scipy, que sirven de evidencia para el informe.

Fuera de alcance: IA generativa en los cálculos, cuentas de usuario, persistencia en servidor, inferencia (intervalos de confianza, pruebas de hipótesis) y el informe PDF/Word (entregable manual).

## Capabilities

### New Capabilities
- `resultado-calculo`: contrato `Resultado` y reglas comunes de presentación (fórmula, sustitución, pasos, respuesta, interpretación, advertencias) y de precisión numérica.
- `entrada-datos`: ingreso, parseo y validación de datos numéricos y unidades; detección de datos faltantes o inválidos.
- `estadistica-descriptiva`: media, mediana, moda, rango, varianza y desviación (poblacional y muestral), cuartiles.
- `datos-experimentales`: series de mediciones físicas con unidades, conversión, incertidumbre de la media y cifras significativas.
- `tablas-graficas`: tablas de frecuencias, histograma y diagrama de dispersión con línea de regresión.
- `probabilidad-normal`: probabilidad básica y distribución normal (directa, inversa, estandarización).
- `correlacion-regresion`: coeficiente de correlación r, regresión lineal simple e interpretación.
- `interpretacion-teoria`: explicaciones didácticas, incluida la diferencia entre σ (÷N) y s (÷(n−1)).
- `practica-ejemplos`: biblioteca de ≥10 ejemplos y generador de prácticas con calificación por tolerancia y retroalimentación.
- `shell-publicacion`: interfaz, navegación, identificación de autores y publicación pública sin login.

### Modified Capabilities
<!-- Ninguna: el proyecto no tiene specs previas. -->

## Impact

- Código nuevo en la raíz del repo: proyecto Angular (`src/app/core`, `features`, `shared`, `data`).
- Dependencias: Angular + Angular Material, simple-statistics, KaTeX, Chart.js, Vitest.
- Infraestructura: despliegue en Cloudflare Pages, Netlify o Vercel (plan gratuito); verificación en incógnito y móvil.
- Referencia de arquitectura previa: `openspec/desing.md`.
