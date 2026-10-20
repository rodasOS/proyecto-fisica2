# resultado-calculo Specification

## Purpose

Define la forma uniforme en que el asistente presenta cualquier cálculo: fórmula, sustitución, procedimiento, respuesta, interpretación y advertencias, con resultados deterministas.

## Requirements

### Requirement: Estructura completa del resultado
Todo cálculo del asistente SHALL presentar fórmula, sustitución de valores, procedimiento paso a paso, respuesta final e interpretación.

#### Scenario: Cálculo exitoso
- **WHEN** el usuario ejecuta cualquier cálculo con datos válidos
- **THEN** la pantalla muestra la fórmula, la fórmula con los valores sustituidos, los pasos, la respuesta final y una interpretación en texto

### Requirement: Cálculo determinista
Los valores numéricos SHALL calcularse mediante algoritmos programados, nunca mediante un modelo de lenguaje ni respuestas escritas de antemano, de modo que los mismos datos produzcan siempre el mismo resultado.

#### Scenario: Datos nuevos
- **WHEN** el usuario ingresa datos que nunca se han usado antes
- **THEN** el resultado se calcula a partir de esos datos y es idéntico en repeticiones

### Requirement: Precisión y redondeo
El asistente SHALL calcular con precisión de punto flotante completa y redondear solo al mostrar, indicando el número de decimales usado.

#### Scenario: Redondeo de presentación
- **WHEN** se muestra una respuesta final
- **THEN** se redondea a un número fijo de decimales sin que los pasos intermedios pierdan precisión

### Requirement: Advertencias en el resultado
Cuando un cálculo no sea posible o sea poco fiable, el resultado SHALL incluir una advertencia visible que explique la causa y no SHALL mostrar un valor numérico engañoso.

#### Scenario: Caso no resoluble
- **WHEN** el cálculo es matemáticamente indefinido, por ejemplo una varianza igual a cero en la correlación
- **THEN** se muestra una advertencia con la causa y ningún valor numérico inventado
