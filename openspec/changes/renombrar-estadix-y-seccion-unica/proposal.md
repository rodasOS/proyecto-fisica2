# Proposal

## Why

El nombre "SigmaLab" no transmite lo que hace la aplicación ni resulta memorable para el público de estudiantes y docentes. Además, la sección del proyecto sigue como marcador ("Sección (completar)") aunque el dato ya está definido: es única. Conviene cerrar ambos puntos antes de la entrega del 25/10/2026.

## What Changes

- Renombrar la aplicación de "SigmaLab" a **Estadix** en todos los lugares visibles: encabezado, barra lateral, título de la página, pie, diálogo de equipo, portada, README.
- Cambiar la letra del logotipo de "σ" a "E", para que coincida con el nombre.
- Reemplazar el valor de la sección por **"Única"** en todas las vistas donde aparece (encabezado, barra lateral, pie, portada, diálogo de equipo) y en el README. Se retira la nota "pendiente de completar".
- Renombrar la clave de almacenamiento del tema de `sigmalab-tema` a `estadix-tema`. Efecto: quien ya tenía un tema elegido verá el valor por defecto (claro) una vez; la elección se vuelve a guardar al cambiarla.

Supuesto registrado: "Estadix" es la elección del usuario entre tres opciones propuestas (Estadix, Datora, Medix). No se revisa disponibilidad de marca ni de dominio; eso queda fuera de alcance.

Fuera de alcance: cambios de colores, tipografía o componentes; cambios de comportamiento de cálculo; el nombre del paquete npm (`asistente-estadistica`), que no se muestra al usuario.

## Capabilities

### New Capabilities
<!-- Ninguna. -->

### Modified Capabilities
<!-- Ninguna: la spec shell-publicacion exige "un nombre original" y una "sección" sin fijar su valor, así que no cambia el comportamiento exigido. -->

## Impact

- `src/app/app.info.ts`: `nombre` y `seccion`.
- `src/app/app.html`: letra del logotipo (dos apariciones) y el texto del pie usa el valor de la sección.
- `src/index.html`: título de la página.
- `src/app/core/estado/theme.service.ts` y su prueba: clave de almacenamiento.
- `src/app/features/inicio/inicio.component.ts`: solo muestra el valor de sección en la tarjeta de equipo; no tiene nombre ni logotipo propio.
- `README.md`: nombre y sección.
- Specs: ninguna. El cambio no altera comportamiento exigido; el cambio tiene `skip_specs: true`.
