# correlacion-regresion Specification

## Purpose

Calcular e interpretar la correlación lineal y la regresión lineal simple entre dos variables medidas.

## Requirements

### Requirement: Coeficiente de correlación
El asistente SHALL calcular el coeficiente de correlación de Pearson r y el coeficiente de determinación r², con la fórmula y las sumas intermedias.

#### Scenario: Cálculo de r
- **WHEN** X = 1, 2, 3, 4, 5 e Y = 2, 4, 5, 4, 5
- **THEN** r ≈ 0.7746 y r² = 0.6

### Requirement: Regresión lineal simple
El asistente SHALL calcular la recta ŷ = a + bx por mínimos cuadrados, mostrando pendiente, intercepto y sus fórmulas.

#### Scenario: Recta de ajuste
- **WHEN** X = 1, 2, 3, 4, 5 e Y = 2, 4, 5, 4, 5
- **THEN** b = 0.6, a = 2.2 y ŷ = 2.2 + 0.6x

### Requirement: Predicción
El usuario SHALL poder ingresar un valor x para obtener ŷ y se SHALL advertir cuando x esté fuera del rango de los datos (extrapolación).

#### Scenario: Interpolación
- **WHEN** se pide ŷ para x = 3 con la recta anterior
- **THEN** ŷ = 4.0

#### Scenario: Extrapolación
- **WHEN** se pide ŷ para x = 20
- **THEN** se muestra el valor junto con una advertencia de extrapolación

### Requirement: Interpretación de la correlación
El asistente SHALL clasificar la fuerza (muy débil, débil, moderada, fuerte, muy fuerte) y el sentido (positiva o negativa) de r, e indicar que correlación no implica causalidad.

#### Scenario: Correlación fuerte positiva
- **WHEN** r = 0.93
- **THEN** la interpretación indica correlación positiva fuerte

### Requirement: Interpretación de pendiente e intercepto
La interpretación SHALL expresar la pendiente y el intercepto en el contexto de las variables y unidades ingresadas.

#### Scenario: Pendiente con unidades
- **WHEN** X es tensión en V, Y es corriente en A y b = 0.5
- **THEN** se explica que la corriente aumenta 0.5 A por cada 1 V

### Requirement: Casos degenerados
El asistente SHALL advertir y no calcular cuando X o Y sean constantes, o cuando haya menos de 3 pares.

#### Scenario: X constante
- **WHEN** todos los valores de X son iguales
- **THEN** se advierte que la pendiente y r no están definidas
