# estadistica-descriptiva Specification

## Purpose

Calcular y explicar las medidas de tendencia central, posición y dispersión de un conjunto de datos, mostrando el procedimiento.

## Requirements

### Requirement: Medidas de tendencia central
El asistente SHALL calcular la media aritmética, la mediana y la moda (o las modas) de una serie.

#### Scenario: Serie con moda única
- **WHEN** los datos son 2, 4, 4, 4, 5, 5, 7, 9
- **THEN** la media es 5, la mediana es 4.5 y la moda es 4

#### Scenario: Serie amodal
- **WHEN** todos los valores aparecen una sola vez
- **THEN** se informa que no hay moda

#### Scenario: Serie multimodal
- **WHEN** dos valores comparten la máxima frecuencia
- **THEN** se informan ambas modas

### Requirement: Medidas de dispersión
El asistente SHALL calcular rango, varianza y desviación estándar tanto poblacional (÷N) como muestral (÷(n−1)), y el coeficiente de variación.

#### Scenario: Desviaciones de una serie
- **WHEN** los datos son 2, 4, 4, 4, 5, 5, 7, 9
- **THEN** el rango es 7, la desviación poblacional es 2 y la muestral es aproximadamente 2.1381

#### Scenario: Ejemplo de la corriente
- **WHEN** los datos son 2.1, 2.3, 2.2, 2.4 y 2.0
- **THEN** la media es 2.2, la desviación muestral es aproximadamente 0.1581 y la poblacional aproximadamente 0.1414

### Requirement: Cuartiles y valores atípicos
El asistente SHALL calcular cuartiles, rango intercuartílico y señalar valores atípicos según el criterio 1.5·IQR, indicando el método de cuartiles usado.

#### Scenario: Valor atípico
- **WHEN** la serie contiene un valor fuera de [Q1 − 1.5·IQR, Q3 + 1.5·IQR]
- **THEN** ese valor se lista como atípico

### Requirement: Elección de tipo de desviación
El usuario SHALL poder elegir entre desviación poblacional y muestral, y el resultado principal SHALL indicar cuál se usó.

#### Scenario: Selección del tipo
- **WHEN** el usuario cambia a "población"
- **THEN** el divisor mostrado en la fórmula y la sustitución pasa a ser N

### Requirement: Procedimiento detallado
La media y la desviación SHALL mostrar la tabla de cada dato, su desviación respecto a la media y su cuadrado.

#### Scenario: Tabla de desviaciones
- **WHEN** se calcula la desviación de la serie
- **THEN** se muestra una tabla con xᵢ, (xᵢ − x̄) y (xᵢ − x̄)² y sus sumas
