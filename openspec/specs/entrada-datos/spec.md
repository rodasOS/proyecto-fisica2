# entrada-datos Specification

## Purpose

Permitir al usuario ingresar datos nuevos de forma flexible y detectar entradas vacías, inválidas o insuficientes antes de calcular.

## Requirements

### Requirement: Formatos de entrada tolerantes
El asistente SHALL aceptar números separados por coma, punto y coma, espacio o salto de línea, con punto o coma como separador decimal.

#### Scenario: Separadores mixtos
- **WHEN** el usuario escribe "2.1, 2.3 2,2
2.4; 2.0"
- **THEN** se interpretan cinco valores: 2.1, 2.3, 2.2, 2.4 y 2.0

#### Scenario: Notación científica
- **WHEN** el usuario escribe "1.5e-3 2e2"
- **THEN** se interpretan 0.0015 y 200

### Requirement: Rechazo de entradas inválidas
Cuando la entrada contenga elementos no numéricos, el asistente SHALL indicar cuáles son y su posición, y no SHALL calcular con datos descartados sin avisar.

#### Scenario: Texto en la lista
- **WHEN** el usuario ingresa "3, 4, abc, 5"
- **THEN** se advierte que "abc" (posición 3) no es un número y se solicita corregirlo

### Requirement: Entrada vacía o insuficiente
El asistente SHALL advertir cuando no haya datos o cuando la cantidad sea menor a la que requiere el cálculo.

#### Scenario: Entrada vacía
- **WHEN** el usuario pulsa calcular sin datos
- **THEN** se muestra un mensaje que pide ingresar datos y no se ejecuta cálculo

#### Scenario: Un solo dato para desviación muestral
- **WHEN** hay n = 1 y se pide la desviación estándar muestral
- **THEN** se advierte que se requiere n ≥ 2

### Requirement: Datos emparejados
Para cálculos con dos variables, el asistente SHALL exigir que X e Y tengan la misma cantidad de valores.

#### Scenario: Longitudes distintas
- **WHEN** X tiene 5 valores e Y tiene 4
- **THEN** se advierte la diferencia de longitud y no se calcula

### Requirement: Datos de ejemplo cargables
El usuario SHALL poder cargar un conjunto de datos de ejemplo en el campo de entrada con un solo clic y editarlo después.

#### Scenario: Cargar ejemplo
- **WHEN** el usuario elige un ejemplo
- **THEN** los campos se rellenan y el usuario puede modificarlos antes de calcular

### Requirement: Datos compartidos entre módulos
Los datos ingresados SHALL conservarse al cambiar de módulo dentro de la misma sesión.

#### Scenario: Cambio de módulo
- **WHEN** el usuario ingresa datos en Descriptiva y navega a Tablas y gráficas
- **THEN** la serie sigue disponible sin reingresarla
