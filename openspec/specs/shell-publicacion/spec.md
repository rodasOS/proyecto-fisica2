# shell-publicacion Specification

## Purpose

Definir la interfaz general, la identificación del proyecto y la publicación abierta que permiten al docente usar el asistente desde un enlace sin iniciar sesión.

## Requirements

### Requirement: Identidad del proyecto
La interfaz SHALL mostrar de forma permanente un nombre original del asistente, los nombres completos y carnés de ambos integrantes, la asignatura y la sección.

#### Scenario: Encabezado visible
- **WHEN** se abre cualquier pantalla
- **THEN** el encabezado o pie muestra el nombre del asistente, ambos integrantes con su carné, asignatura y sección

#### Scenario: Datos de los integrantes
- **WHEN** se consulta la identidad del proyecto
- **THEN** aparecen "Mario Orlando Sales Rodas — 2990-25-21488" y "Kenneth Gabriel Elías Xia Temal — 2990-25-16687"

#### Scenario: Pantalla pequeña
- **WHEN** la pantalla mide 360 px de ancho
- **THEN** los nombres y carnés siguen visibles, accesibles desde el encabezado o un panel de información, sin cortar el texto

### Requirement: Navegación por módulos
La interfaz SHALL ofrecer acceso directo a Inicio, Descriptiva, Datos experimentales, Tablas y gráficas, Probabilidad, Correlación y regresión, Práctica y Teoría, con una disposición adaptada al tamaño de pantalla.

#### Scenario: Cambio de módulo
- **WHEN** el usuario selecciona un módulo
- **THEN** se muestra el módulo sin recargar la página completa y el elemento activo queda resaltado

#### Scenario: Navegación en teléfono
- **WHEN** la pantalla es de teléfono
- **THEN** los módulos principales se alcanzan con una barra inferior y el resto con un menú "Más", todo con objetivos táctiles de al menos 44 px

#### Scenario: Navegación en escritorio
- **WHEN** la pantalla es de escritorio
- **THEN** los módulos aparecen en una barra lateral o superior siempre visible

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
La interfaz SHALL ser utilizable en pantallas desde 360 px de ancho sin desplazamiento horizontal de la página, con controles cómodos al tacto y sin zoom involuntario al enfocar campos.

#### Scenario: Teléfono
- **WHEN** se abre en un teléfono
- **THEN** los formularios, tablas y gráficas son legibles y operables

#### Scenario: Enfoque de campos
- **WHEN** el usuario toca un campo de texto en un teléfono
- **THEN** el navegador no amplía la página y el campo permanece visible sobre el teclado

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
