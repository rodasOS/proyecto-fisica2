# Tasks

## 1. Identidad

- [x] 1.1 Cambiar en `src/app/app.info.ts` `nombre` a `Estadix` y `seccion` a `Única`, quitando la nota de pendiente; verificar con `grep -rn "SigmaLab\|completar" src/app/app.info.ts` que no quedan coincidencias
- [x] 1.2 Cambiar en `src/app/app.html` la letra del logotipo de "σ" a "E" en las dos apariciones; verificar con `grep -n "σ" src/app/app.html` que no quedan coincidencias

## 2. Textos fuera de la identidad

- [x] 2.1 Cambiar el título de `src/index.html` a "Estadix — Asistente de Estadística Aplicada"; verificar con `grep -n "<title>" src/index.html`
- [x] 2.2 Actualizar el README: nombre "Estadix" en el encabezado y en la descripción de `app.info.ts`, y sección "Única"; verificar con `grep -n "SigmaLab\|pendiente" README.md` sin resultados

## 3. Clave de almacenamiento

- [x] 3.1 Cambiar `CLAVE` en `src/app/core/estado/theme.service.ts` a `estadix-tema` y las referencias en `theme.service.spec.ts`; verificar con `grep -rn "sigmalab" src/` sin resultados y `ng test` con todas las pruebas en verde

## 4. Verificación

- [x] 4.1 Ejecutar `ng build` sin advertencias y `ng test` con todas las pruebas en verde; verificar la salida de ambos comandos
- [x] 4.2 Abrir la aplicación en Chrome headless a 360 y 1280 px en ambos temas y comprobar que el encabezado, la barra lateral, el pie y la portada muestran "Estadix" y "Única", sin errores de consola; verificar con captura y lectura del texto del `main` y del pie

## Workflow follow-up

- Confirmar con el equipo que el nombre "Estadix" es el definitivo antes de publicar.
