# Tasks

## 1. Proyecto y despliegue inicial

- [x] 1.1 Crear el proyecto Angular sin SSR (`ng new asistente-estadistica --ssr=false`) con standalone y Vitest; verificar que `ng build` y `ng test` corren
- [x] 1.2 Instalar Angular Material, simple-statistics, katex y chart.js; verificar que el build compila con las importaciones
- [x] 1.3 Crear la estructura de carpetas de `design.md` y rutas lazy con `withHashLocation()`; verificar que cada ruta carga un componente vacío y recarga sin 404
- [ ] 1.4 Publicar un "hola mundo" en Cloudflare Pages/Netlify/Vercel; verificar que la URL abre en incógnito y en el celular
- [ ] 1.5 Redactar README con comandos y enlace de despliegue; verificar que otro integrante puede clonar y ejecutar

## 2. Base común (resultado-calculo, entrada-datos, shell-publicacion)

- [x] 2.1 Definir la interfaz `Resultado` y utilidades de redondeo; verificar con pruebas unitarias del formateo
- [x] 2.2 Implementar el parser de números (separadores, coma decimal, científica, tokens inválidos con posición); verificar con pruebas de los escenarios de la spec `entrada-datos`
- [x] 2.3 Implementar `datos.service` (signals) y el componente `entrada-datos` con textarea, selector de unidad y botón de ejemplo; verificar que la serie persiste al cambiar de módulo
- [x] 2.4 Crear componentes `formula` (KaTeX) y `caja-resultado`; verificar que un `Resultado` de prueba muestra fórmula, sustitución, pasos, respuesta, interpretación y advertencias
- [x] 2.5 Construir el layout con nombre original, integrantes, asignatura y sección, menú de módulos, inicio y manejo global de errores; verificar visualmente en 360 px y escritorio

## 3. Estadística descriptiva (estadistica-descriptiva, interpretacion-teoria)

- [x] 3.1 Implementar media, mediana, moda(s), rango, varianza y desviación poblacional/muestral y CV con pasos y tabla de desviaciones; verificar con pruebas (serie 2,4,4,4,5,5,7,9 y la de corriente)
- [x] 3.2 Implementar cuartiles (interpolación lineal), IQR y atípicos; verificar contra fixtures de numpy
- [x] 3.3 Construir la pantalla Descriptiva con selector poblacional/muestral e interpretación dinámica; verificar el ejemplo de corriente (media 2.2, s ≈ 0.1581) en el navegador
- [x] 3.4 Crear la pantalla Teoría (σ vs s con los datos del usuario, glosario, nota de muestra pequeña); verificar que usa la serie cargada

## 4. Datos experimentales (datos-experimentales)

- [x] 4.1 Implementar tabla de unidades y conversión con rechazo de magnitudes incompatibles; verificar con pruebas (250 mA → 0.25 A, V → m rechazado)
- [x] 4.2 Implementar incertidumbre de la media, cifras significativas y error porcentual; verificar con la serie de corriente (2.20 ± 0.07 A, 12 % con referencia 2.5)
- [x] 4.3 Construir la pantalla de Datos experimentales; verificar en el navegador el reporte x̄ ± s/√n con unidad

## 5. Tablas y gráficas (tablas-graficas)

- [x] 5.1 Implementar tabla de frecuencias (Sturges, clases manuales, acumuladas) con validación de cobertura; verificar que las frecuencias suman n y el caso de rango cero advierte
- [x] 5.2 Crear wrapper de Chart.js y los gráficos de histograma y dispersión con rótulos; verificar visualmente y en 360 px
- [x] 5.3 Construir la pantalla Tablas y gráficas; verificar que histograma coincide con la tabla

## 6. Correlación y regresión (correlacion-regresion)

- [x] 6.1 Implementar r, r², pendiente, intercepto, predicción y detección de casos degenerados con pasos; verificar con X=1..5, Y=2,4,5,4,5 (r≈0.7746, ŷ=2.2+0.6x) y fixtures de scipy
- [x] 6.2 Implementar la interpretación de fuerza/sentido, pendiente con unidades y aviso de extrapolación; verificar con pruebas de texto (r = 0.93 → positiva fuerte)
- [x] 6.3 Construir la pantalla con entrada X/Y, dispersión y recta; verificar errores de longitud distinta y X constante

## 7. Probabilidad y normal (probabilidad-normal)

- [x] 7.1 Implementar probabilidad clásica, complemento, unión y condicional con validación [0,1]; verificar con pruebas de la spec
- [x] 7.2 Implementar normal directa, intervalo e inversa con estandarización y validación de parámetros; verificar P(X>115)≈0.1587, P(|Z|<1.96)≈0.95, x≈129.40 contra scipy
- [x] 7.3 Construir la pantalla Probabilidad con gráfica de campana sombreada y opción "usar mi serie"; verificar en el navegador

## 8. Ejemplos y práctica (practica-ejemplos)

- [x] 8.1 Crear `data/ejemplos.ts` con ≥10 ejemplos (incluido el de corriente) cubriendo todos los módulos y su carga con un clic; verificar que cada ejemplo resuelve sin advertencias
- [x] 8.2 Implementar el generador con PRNG con semilla por módulo y dificultad; verificar por prueba que semillas distintas dan datos distintos y la misma semilla es reproducible
- [x] 8.3 Implementar calificación con tolerancia, coma decimal y detectores de errores típicos (÷N, cola, signo); verificar con pruebas de la spec
- [x] 8.4 Construir la pantalla Práctica con retroalimentación, procedimiento y marcador de sesión; verificar el flujo completo en el navegador

## 9. Calidad, evidencias y entrega

- [x] 9.1 Completar suite de 10–15 casos contra numpy/scipy y ejecutar `ng test`; verificar que todo pasa y guardar la salida para el informe
- [x] 9.2 Probar entradas inesperadas en todos los módulos (vacío, texto, n=1, σ=0, X constante, números enormes); verificar que siempre aparece advertencia y no hay pantallas en blanco
- [ ] 9.3 Pulir diseño y accesibilidad (contraste, foco, 360 px); verificar en Chrome y en un teléfono real
- [ ] 9.4 Desplegar la versión final y comprobar el enlace en incógnito y móvil; verificar que todas las funciones funcionan sin login
- [ ] 9.5 Tomar capturas y redactar el informe de máx. 3 páginas (integrantes, herramientas, funciones, pruebas, capturas); verificar longitud y que ambos integrantes pueden demostrar cada módulo

## Workflow follow-up

- Entregar en Canvas la URL y el informe antes del 25/10/2026.
- Archivar el cambio de OpenSpec cuando la entrega esté verificada.
