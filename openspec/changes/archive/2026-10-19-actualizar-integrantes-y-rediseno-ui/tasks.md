# Tasks

## 1. Identidad del proyecto

- [x] 1.1 Cambiar `INFO.integrantes` a objetos `{ nombre, carne }` con Mario Orlando Sales Rodas (2990-25-21488) y Kenneth Gabriel Elías Xia Temal (2990-25-16687); actualizar `app.spec.ts` para verificar nombres y carnés exactos y comprobar que `ng test` pasa
- [x] 1.2 Actualizar el README con los integrantes y carnés; verificar que coinciden con `app.info.ts`

## 2. Sistema de diseño base

- [x] 2.1 Crear `src/styles/` con tokens (color claro/oscuro, tipografía fluida, espaciado, radios, sombras), reset y base importados desde `styles.scss`; verificar que `ng build` compila y la app conserva su aspecto funcional
- [x] 2.2 Implementar `ThemeService` (signal, `prefers-color-scheme`, `localStorage` con try/catch, `data-theme`, `theme-color`) con pruebas unitarias del valor inicial y del cambio manual
- [x] 2.3 Estilos de controles (campos ≥ 16 px y ≥ 44 px, botones, chips, selects, casillas), foco visible y `prefers-reduced-motion`; verificar con capturas y recorrido con Tab que cada control muestra foco

## 3. Estructura y navegación adaptable

- [x] 3.1 Rehacer `app.html`/`app.scss` con encabezado compacto, barra inferior en < 1024 px (4 accesos + "Más" con hoja inferior), barra lateral en ≥ 1024 px y selector de tema; verificar en 360, 768 y 1280 px que la navegación llega a los 8 módulos con objetivos ≥ 44 px
- [x] 3.2 Añadir panel/tarjeta "Equipo" con integrantes, carné, asignatura y sección visible en móvil y escritorio; verificar con prueba de componente y captura a 360 px que el texto no se corta
- [x] 3.3 Ajustar el contenido para el área segura y la altura de la barra inferior; verificar que ningún elemento final queda tapado ni hay desbordamiento horizontal

## 4. Componentes de resultado y gráficas

- [x] 4.1 Rediseñar `caja-resultado` con respuesta destacada, interpretación, secciones rotuladas, procedimiento plegable (`<details open>`) y tablas con desplazamiento contenido; verificar con pruebas de componente y capturas
- [x] 4.2 Adaptar `grafico` y `configs.ts` para leer colores de los tokens y reconfigurarse al cambiar el tema, con altura responsiva; verificar histograma, dispersión y campana en ambos temas
- [x] 4.3 Ajustar `formula` (KaTeX) para heredar color y desplazarse horizontalmente en pantallas estrechas; verificar fórmulas largas a 360 px
- [x] 4.4 Rediseñar avisos y errores (junto al formulario, `scroll-into-view`, `role="alert"`); verificar con entradas vacías e inválidas en cada módulo

## 5. Módulos y portada

- [x] 5.1 Rediseñar la portada (hero, tarjetas de módulos y ejemplos, ejemplo de la corriente destacado); verificar que el enlace de la corriente abre Descriptiva con el resultado
- [x] 5.2 Aplicar el nuevo layout de formularios (columna en móvil, rejilla en escritorio, botón principal a ancho completo en móvil) a Descriptiva, Datos experimentales, Tablas y gráficas, Probabilidad, Correlación y regresión, Práctica y Teoría; verificar cada módulo a 360 y 1280 px
- [x] 5.3 Pulir Práctica (enunciado, veredicto, marcador) y Teoría (secciones, glosario) con el nuevo sistema; verificar el flujo completo de generar, calificar y ver retroalimentación

## 6. Verificación integral

- [x] 6.1 Ejecutar capturas con Chrome headless de todos los módulos a 360, 768 y 1280 px en tema claro y oscuro; verificar cero desbordamiento horizontal y cero errores de consola
- [x] 6.2 Auditar contraste AA, objetivos táctiles y estados de foco en ambos temas (herramienta o revisión con valores calculados); corregir hallazgos y verificar el resultado
- [x] 6.3 Ejecutar `ng test` y `ng build`; verificar que todas las pruebas pasan y que no hay advertencias nuevas

## Workflow follow-up

- Completar la sección en `app.info.ts` cuando el equipo la confirme.
- Probar en un teléfono real y publicar la versión final.
- Archivar el cambio tras la revisión.
