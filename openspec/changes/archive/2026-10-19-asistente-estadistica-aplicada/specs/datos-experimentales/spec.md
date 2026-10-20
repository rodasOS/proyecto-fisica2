# Spec Delta

## Purpose

Procesar series de mediciones físicas con unidades, reportando el valor medio con su incertidumbre y manejando conversiones de unidades.

## ADDED Requirements

### Requirement: Series con unidades
El asistente SHALL permitir asociar una unidad (por ejemplo A, V, m, s, kg, N) a una serie y mostrarla en todas las respuestas.

#### Scenario: Corriente en amperios
- **WHEN** el usuario ingresa 2.1, 2.3, 2.2, 2.4, 2.0 con unidad A
- **THEN** media y desviación se presentan como 2.2 A y 0.1581 A

### Requirement: Conversión de unidades
El asistente SHALL convertir entre unidades compatibles de la misma magnitud (prefijos SI y equivalentes comunes) y SHALL rechazar conversiones entre magnitudes incompatibles.

#### Scenario: Conversión válida
- **WHEN** el usuario convierte 250 mA a A
- **THEN** el resultado es 0.25 A con el factor usado visible

#### Scenario: Magnitudes incompatibles
- **WHEN** el usuario intenta convertir V a m
- **THEN** se advierte que las unidades no son compatibles

### Requirement: Incertidumbre de la media
El asistente SHALL calcular el error estándar de la media s/√n y presentar el resultado como x̄ ± s/√n con la unidad.

#### Scenario: Reporte de medición
- **WHEN** se procesa la serie de corriente 2.1, 2.3, 2.2, 2.4, 2.0
- **THEN** se reporta 2.20 ± 0.07 A (s/√5 ≈ 0.0707)

### Requirement: Cifras significativas
La respuesta final SHALL redondear la incertidumbre a una cifra significativa y ajustar el valor medio a la misma posición decimal.

#### Scenario: Redondeo coherente
- **WHEN** la incertidumbre es 0.0707 A y la media 2.2 A
- **THEN** se reporta 2.20 ± 0.07 A

### Requirement: Error porcentual de la medición
El asistente SHALL calcular la incertidumbre relativa y, si el usuario ingresa un valor de referencia, el error porcentual respecto a él.

#### Scenario: Valor de referencia
- **WHEN** el usuario ingresa referencia 2.5 A
- **THEN** se muestra |2.2 − 2.5| / 2.5 × 100 = 12 %
