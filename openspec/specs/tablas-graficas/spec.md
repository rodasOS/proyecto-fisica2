# tablas-graficas Specification

## Purpose

Construir tablas de frecuencias, histogramas y diagramas de dispersión a partir de datos del usuario, con el procedimiento de armado explicado.

## Requirements

### Requirement: Tabla de frecuencias
El asistente SHALL construir una tabla con clases, marca de clase, frecuencia absoluta, relativa y acumulada para datos agrupados.

#### Scenario: Agrupación automática
- **WHEN** el usuario ingresa 30 datos sin especificar clases
- **THEN** se calcula el número de clases por la regla de Sturges, la amplitud y se muestra la tabla, cuyas frecuencias suman 30

### Requirement: Clases definidas por el usuario
El usuario SHALL poder fijar el número de clases o la amplitud, y el asistente SHALL validar que las clases cubran todos los datos.

#### Scenario: Número de clases manual
- **WHEN** el usuario pide 5 clases
- **THEN** la tabla tiene 5 clases con límites explícitos y sin datos fuera de ellas

### Requirement: Histograma
El asistente SHALL dibujar un histograma coherente con la tabla de frecuencias, con ejes rotulados.

#### Scenario: Histograma desde la tabla
- **WHEN** se genera la tabla
- **THEN** el histograma muestra una barra por clase con altura igual a su frecuencia

### Requirement: Diagrama de dispersión
El asistente SHALL dibujar un diagrama de dispersión de pares (x, y) y, cuando se pida, superponer la recta de regresión.

#### Scenario: Dispersión con recta
- **WHEN** el usuario ingresa pares válidos y activa la recta
- **THEN** se muestran los puntos y la recta ŷ = a + bx

### Requirement: Gráficas legibles
Las gráficas SHALL mostrar título, rótulos de ejes (con unidades si existen) y SHALL adaptarse al ancho de un teléfono.

#### Scenario: Vista móvil
- **WHEN** la página se abre en pantalla de 360 px de ancho
- **THEN** la gráfica se redimensiona sin desbordar la pantalla

### Requirement: Datos insuficientes para graficar
El asistente SHALL advertir cuando los datos no basten para construir la tabla o gráfica.

#### Scenario: Todos los datos iguales
- **WHEN** todos los valores son idénticos y se pide agrupar por rango
- **THEN** se advierte que el rango es cero y se ofrece una tabla de frecuencias por valor
