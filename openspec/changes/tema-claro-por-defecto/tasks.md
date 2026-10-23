# Tasks

## 1. Comportamiento del tema por defecto

- [x] 1.1 Cambiar `ThemeService` para que el valor inicial sin elección guardada sea `claro`, eliminar `preferenciaSistema()` y el escucha de `prefers-color-scheme`; verificar con `ng build` que compila sin advertencias
- [x] 1.2 Actualizar `theme.service.spec.ts`: caso sin elección guardada devuelve claro aunque `matchMedia` indique oscuro; caso con elección guardada oscura se conserva; caso de alternar y persistir sigue pasando; verificar con `ng test` que todas las pruebas pasan

## 2. Verificación

- [x] 2.1 Comprobar en Chrome headless, con preferencia del sistema en oscuro y sin `localStorage`, que `data-theme` es `light` y la página se ve en claro; verificar con la captura y el valor de `document.documentElement.dataset.theme`
- [x] 2.2 Comprobar que, tras elegir oscuro, recargar mantiene oscuro y que cambiar el tema del sistema no lo altera; verificar con la misma sesión de navegador
