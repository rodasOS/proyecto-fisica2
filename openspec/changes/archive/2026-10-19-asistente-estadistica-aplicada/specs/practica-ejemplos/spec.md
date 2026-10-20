# Spec Delta

## Purpose

Proveer ejercicios de ejemplo resueltos y un generador de prácticas con calificación automática y retroalimentación para el aprendizaje autónomo.

## ADDED Requirements

### Requirement: Biblioteca de ejemplos
El asistente SHALL incluir al menos 10 ejercicios de ejemplo que cubran todos los módulos, uno de ellos el de las mediciones de corriente (2.1, 2.3, 2.2, 2.4, 2.0 A).

#### Scenario: Resolver un ejemplo
- **WHEN** el usuario elige un ejemplo
- **THEN** se cargan sus datos y se resuelve con el motor real, mostrando el procedimiento completo

#### Scenario: Cobertura de módulos
- **WHEN** se revisa la lista de ejemplos
- **THEN** hay al menos uno por cada módulo: descriptiva, experimentales, tablas y gráficas, probabilidad, normal y regresión

### Requirement: Generador de prácticas
El asistente SHALL generar ejercicios nuevos con datos aleatorios por módulo y dificultad, distintos en cada solicitud.

#### Scenario: Ejercicio nuevo
- **WHEN** el usuario pulsa "Generar práctica" en un módulo
- **THEN** aparece un enunciado con datos aleatorios y un campo de respuesta

### Requirement: Calificación con tolerancia
El asistente SHALL calificar la respuesta numérica del usuario comparándola con el cálculo real dentro de una tolerancia relativa, aceptando punto o coma decimal.

#### Scenario: Respuesta correcta
- **WHEN** la respuesta difiere del valor exacto menos que la tolerancia
- **THEN** se marca como correcta

#### Scenario: Respuesta con coma decimal
- **WHEN** el usuario escribe "0,1581"
- **THEN** se interpreta como 0.1581

#### Scenario: Respuesta vacía o no numérica
- **WHEN** el usuario envía texto no numérico
- **THEN** se pide ingresar un número y no se califica

### Requirement: Retroalimentación
Tras calificar, el asistente SHALL mostrar el procedimiento completo y, si la respuesta fue incorrecta, una pista del error probable.

#### Scenario: Confusión de divisor
- **WHEN** la respuesta coincide con la desviación poblacional pero se pedía la muestral
- **THEN** la retroalimentación señala que se dividió entre N en vez de n−1

### Requirement: Reproducibilidad de la práctica
Una práctica SHALL conservar sus datos hasta que el usuario pida otra, y el resumen de intentos de la sesión SHALL mostrar aciertos y total.

#### Scenario: Marcador de sesión
- **WHEN** el usuario resuelve 3 prácticas con 2 aciertos
- **THEN** se muestra 2/3
