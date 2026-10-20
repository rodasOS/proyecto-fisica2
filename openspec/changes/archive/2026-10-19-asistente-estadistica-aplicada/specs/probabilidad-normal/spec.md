# Spec Delta

## Purpose

Resolver ejercicios básicos de probabilidad y problemas con la distribución normal, mostrando estandarización y lectura de áreas.

## ADDED Requirements

### Requirement: Probabilidad básica
El asistente SHALL calcular probabilidad clásica (casos favorables / casos posibles), complemento, unión e intersección de eventos, y probabilidad condicional con datos suministrados.

#### Scenario: Probabilidad clásica
- **WHEN** hay 3 casos favorables de 12 posibles
- **THEN** P = 3/12 = 0.25 con la fórmula y la sustitución mostradas

#### Scenario: Unión de eventos
- **WHEN** P(A) = 0.5, P(B) = 0.3 y P(A∩B) = 0.1
- **THEN** P(A∪B) = 0.7

#### Scenario: Probabilidad fuera de rango
- **WHEN** el usuario ingresa una probabilidad menor que 0 o mayor que 1
- **THEN** se advierte que debe estar en [0, 1]

### Requirement: Probabilidad normal directa
El asistente SHALL calcular P(X < a), P(X > a) y P(a < X < b) para X ~ N(μ, σ) mostrando la estandarización z = (x − μ)/σ.

#### Scenario: Cola derecha
- **WHEN** μ = 100, σ = 15 y se pide P(X > 115)
- **THEN** z = 1 y la probabilidad es aproximadamente 0.1587

#### Scenario: Intervalo
- **WHEN** μ = 0, σ = 1 y se pide P(−1.96 < Z < 1.96)
- **THEN** el resultado es aproximadamente 0.9500

### Requirement: Normal inversa
El asistente SHALL hallar el valor x tal que P(X < x) = p dadas μ y σ.

#### Scenario: Percentil
- **WHEN** μ = 100, σ = 15 y p = 0.975
- **THEN** x ≈ 129.40 (z ≈ 1.96)

### Requirement: Parámetros normales válidos
El asistente SHALL rechazar σ ≤ 0, p fuera de (0, 1) en la inversa y límites con a > b.

#### Scenario: Sigma no positiva
- **WHEN** el usuario ingresa σ = 0
- **THEN** se advierte que σ debe ser mayor que cero y no se calcula

### Requirement: Normal desde datos
El asistente SHALL permitir usar la media y la desviación muestral de una serie ingresada como μ y σ de la normal.

#### Scenario: Parámetros desde la serie
- **WHEN** el usuario elige "usar mi serie" en el módulo normal
- **THEN** μ y σ se rellenan con la media y la desviación muestral y se indica que son estimaciones

### Requirement: Gráfica de la campana
El resultado normal SHALL incluir una gráfica de la curva con el área calculada sombreada.

#### Scenario: Área sombreada
- **WHEN** se calcula P(X > 115)
- **THEN** la curva muestra sombreada la región x > 115
