# Spec Delta

## Purpose

Ofrecer explicaciones didácticas y dinámicas que ayuden a interpretar resultados y a distinguir conceptos clave como desviación poblacional y muestral.

## ADDED Requirements

### Requirement: Interpretación en cada resultado
Cada resultado SHALL acompañarse de una interpretación redactada con los valores y unidades del caso, no de texto genérico.

#### Scenario: Interpretación de la corriente
- **WHEN** se calcula la serie 2.1, 2.3, 2.2, 2.4, 2.0 A
- **THEN** el texto indica que la corriente típica es 2.2 A y que las mediciones se desvían en promedio unos 0.16 A

### Requirement: Comparación poblacional vs muestral
El asistente SHALL incluir una sección que explique σ (÷N) frente a s (÷(n−1)), cuándo usar cada una y por qué se corrige por n−1.

#### Scenario: Comparación con los datos del usuario
- **WHEN** el usuario abre la sección con una serie cargada
- **THEN** se muestran σ y s calculadas sobre su serie, la razón entre ellas y la explicación de la diferencia

### Requirement: Recomendación según contexto
Los resultados de dispersión SHALL indicar qué desviación corresponde cuando los datos son una muestra y cuál cuando son toda la población.

#### Scenario: Mediciones de laboratorio
- **WHEN** se procesan mediciones repetidas de un experimento
- **THEN** se recomienda la desviación muestral y se justifica

### Requirement: Glosario
El asistente SHALL incluir un glosario breve de los términos usados (media, mediana, moda, varianza, correlación, z, entre otros).

#### Scenario: Consulta de término
- **WHEN** el usuario abre el glosario
- **THEN** puede leer la definición de cada término con una fórmula

### Requirement: Límites de la interpretación
Cuando n sea pequeño (menos de 5 datos) la interpretación SHALL advertir que las estimaciones son poco confiables.

#### Scenario: Muestra pequeña
- **WHEN** hay 3 datos
- **THEN** se añade una nota sobre la poca fiabilidad de las estimaciones
