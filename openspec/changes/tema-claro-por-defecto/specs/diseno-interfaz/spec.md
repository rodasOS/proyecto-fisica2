# Spec Delta

## MODIFIED Requirements

### Requirement: Tema claro y oscuro
La interfaz SHALL ofrecer tema claro y oscuro, usar el tema claro por defecto cuando el usuario no ha elegido otro, y permitir cambiarlo manualmente, recordando la elección en el navegador. La preferencia de tema del sistema operativo SHALL NOT alterar el tema cuando no hay elección guardada.

#### Scenario: Preferencia del sistema
- **WHEN** el sistema del usuario está en modo oscuro y no hay elección guardada
- **THEN** la interfaz, incluidas fórmulas y gráficas, se muestra en tema claro

#### Scenario: Primera visita
- **WHEN** el usuario abre la aplicación por primera vez sin elección guardada
- **THEN** la interfaz se muestra en tema claro

#### Scenario: Cambio manual
- **WHEN** el usuario pulsa el selector de tema
- **THEN** la interfaz cambia de tema al instante y conserva la elección al recargar

#### Scenario: Elección guardada prevalece
- **WHEN** el usuario eligió tema oscuro y luego cambia la preferencia del sistema a claro
- **THEN** la interfaz sigue en tema oscuro
