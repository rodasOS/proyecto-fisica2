# Spec Delta

## Purpose

Definir la calidad visual y de interacción de la interfaz: un sistema de diseño coherente, moderno, adaptable a móvil y escritorio, con temas y accesibilidad.

## ADDED Requirements

### Requirement: Sistema de diseño coherente
La interfaz SHALL usar un conjunto único de colores, tipografía, espaciado, radios y sombras definidos centralmente, de modo que todos los módulos compartan el mismo aspecto.

#### Scenario: Consistencia entre módulos
- **WHEN** el usuario recorre todos los módulos
- **THEN** botones, campos, tarjetas, avisos y tablas tienen el mismo estilo en cada uno

### Requirement: Diseño adaptable
La disposición SHALL adaptarse de forma continua entre teléfono (360 px), tableta y escritorio, sin desbordamiento horizontal de la página en ninguno de esos anchos.

#### Scenario: Cambio de ancho
- **WHEN** la ventana pasa de 1280 px a 360 px
- **THEN** el contenido se reorganiza en una columna y no aparece barra de desplazamiento horizontal en la página

#### Scenario: Tablas anchas
- **WHEN** una tabla es más ancha que la pantalla
- **THEN** solo la tabla se desplaza horizontalmente dentro de su contenedor

### Requirement: Tema claro y oscuro
La interfaz SHALL ofrecer tema claro y oscuro, usar por defecto la preferencia del sistema y permitir cambiarlo manualmente, recordando la elección en el navegador.

#### Scenario: Preferencia del sistema
- **WHEN** el sistema del usuario está en modo oscuro y no hay elección guardada
- **THEN** la interfaz, incluidas fórmulas y gráficas, se muestra en tema oscuro legible

#### Scenario: Cambio manual
- **WHEN** el usuario pulsa el selector de tema
- **THEN** la interfaz cambia de tema al instante y conserva la elección al recargar

### Requirement: Jerarquía clara de resultados
Cada resultado SHALL destacar la respuesta final y permitir consultar fórmula, sustitución y procedimiento de forma ordenada, con el procedimiento visible por defecto y posibilidad de plegarlo.

#### Scenario: Lectura de un resultado
- **WHEN** se muestra un resultado
- **THEN** la respuesta final es el elemento más prominente de su tarjeta y el resto de secciones están claramente rotuladas

#### Scenario: Plegar procedimiento
- **WHEN** el usuario pliega el procedimiento
- **THEN** la respuesta final y la interpretación permanecen visibles

### Requirement: Estados de interacción
Los controles SHALL mostrar estados visibles de foco, activo, deshabilitado y error, y los avisos de error SHALL ubicarse junto al formulario que los originó.

#### Scenario: Navegación con teclado
- **WHEN** el usuario recorre la página con la tecla Tab
- **THEN** cada control enfocado muestra un indicador de foco claramente visible

#### Scenario: Error de entrada
- **WHEN** el usuario envía datos inválidos
- **THEN** el aviso aparece junto al formulario y la vista se desplaza hasta él si queda fuera de pantalla

### Requirement: Accesibilidad visual
El texto y los controles SHALL cumplir contraste mínimo AA en ambos temas, los objetivos táctiles SHALL medir al menos 44 × 44 px y los campos SHALL usar tamaño de fuente de al menos 16 px en móvil.

#### Scenario: Contraste
- **WHEN** se mide el contraste de texto sobre su fondo en cualquier tema
- **THEN** es de al menos 4.5:1 para texto normal

### Requirement: Movimiento moderado
Las transiciones SHALL ser breves y sutiles, y SHALL desactivarse cuando el usuario prefiera movimiento reducido.

#### Scenario: Movimiento reducido
- **WHEN** el sistema indica preferencia de movimiento reducido
- **THEN** no se ejecutan animaciones ni transiciones decorativas

### Requirement: Sin dependencias externas en ejecución
La interfaz SHALL mostrarse correctamente sin cargar fuentes ni estilos desde servidores de terceros.

#### Scenario: Sin conexión a terceros
- **WHEN** se bloquean los dominios externos
- **THEN** la aplicación conserva su tipografía y estilos
