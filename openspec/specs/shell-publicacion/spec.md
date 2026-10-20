# shell-publicacion Specification

## Purpose

Definir la interfaz general, la identificación del proyecto y la publicación abierta que permiten al docente usar el asistente desde un enlace sin iniciar sesión.

## Requirements

### Requirement: Identidad del proyecto
La interfaz SHALL mostrar de forma permanente un nombre original del asistente, los nombres de ambos integrantes, la asignatura y la sección.

#### Scenario: Encabezado visible
- **WHEN** se abre cualquier pantalla
- **THEN** el encabezado o pie muestra el nombre del asistente, ambos integrantes, asignatura y sección

### Requirement: Navegación por módulos
La interfaz SHALL ofrecer acceso directo a Inicio, Descriptiva, Datos experimentales, Tablas y gráficas, Probabilidad, Correlación y regresión, Práctica y Teoría.

#### Scenario: Cambio de módulo
- **WHEN** el usuario selecciona un módulo
- **THEN** se muestra el módulo sin recargar la página completa

### Requirement: Enlaces profundos y recarga
Recargar o abrir directamente la URL de un módulo SHALL funcionar sin error 404.

#### Scenario: Recarga en un módulo
- **WHEN** el usuario recarga la página estando en Probabilidad
- **THEN** se vuelve a mostrar el módulo de Probabilidad

### Requirement: Acceso público sin login
El asistente SHALL estar disponible por una única URL HTTPS pública, utilizable sin cuentas, sin claves ni cuotas, y sin depender de la sesión personal de los estudiantes.

#### Scenario: Acceso en incógnito
- **WHEN** el docente abre el enlace en una ventana de incógnito
- **THEN** puede usar todas las funciones sin autenticarse

### Requirement: Uso en móvil
La interfaz SHALL ser utilizable en pantallas desde 360 px de ancho sin desplazamiento horizontal de la página.

#### Scenario: Teléfono
- **WHEN** se abre en un teléfono
- **THEN** los formularios, tablas y gráficas son legibles y operables

### Requirement: Manejo de errores inesperados
Un fallo inesperado en un cálculo SHALL mostrar un mensaje comprensible en lugar de una pantalla en blanco, sin perder los datos ingresados.

#### Scenario: Error interno
- **WHEN** ocurre una excepción no prevista en un cálculo
- **THEN** se muestra un aviso de que no se pudo resolver el caso y los datos permanecen en el formulario

### Requirement: Página de inicio orientadora
La pantalla de inicio SHALL explicar brevemente qué hace cada módulo y ofrecer acceso al ejemplo de prueba de la corriente.

#### Scenario: Ejemplo rápido
- **WHEN** el usuario pulsa el ejemplo de corriente en Inicio
- **THEN** se abre Descriptiva con la serie cargada y el resultado calculado
