# Spec Delta

## MODIFIED Requirements

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

### Requirement: Uso en móvil
La interfaz SHALL ser utilizable en pantallas desde 360 px de ancho sin desplazamiento horizontal de la página, con controles cómodos al tacto y sin zoom involuntario al enfocar campos.

#### Scenario: Teléfono
- **WHEN** se abre en un teléfono
- **THEN** los formularios, tablas y gráficas son legibles y operables

#### Scenario: Enfoque de campos
- **WHEN** el usuario toca un campo de texto en un teléfono
- **THEN** el navegador no amplía la página y el campo permanece visible sobre el teclado
