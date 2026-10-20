export type ModuloEjemplo = 'descriptiva' | 'experimentales' | 'tablas' | 'probabilidad' | 'regresion';

export interface Ejemplo {
  id: string;
  titulo: string;
  modulo: ModuloEjemplo;
  descripcion: string;
  /** Campos de entrada del módulo (texto, tal como los escribiría el usuario). */
  params: Record<string, string>;
}

export const RUTA_MODULO: Record<ModuloEjemplo, string> = {
  descriptiva: '/descriptiva',
  experimentales: '/datos-experimentales',
  tablas: '/tablas-graficas',
  probabilidad: '/probabilidad',
  regresion: '/correlacion-regresion',
};

export const EJEMPLOS: Ejemplo[] = [
  {
    id: 'corriente', modulo: 'descriptiva', titulo: 'Mediciones de corriente',
    descripcion: 'Media y desviación estándar muestral de 2.1, 2.3, 2.2, 2.4 y 2.0 A (ejemplo de prueba).',
    params: { datos: '2.1, 2.3, 2.2, 2.4, 2.0', unidad: 'A', tipo: 'muestral' },
  },
  {
    id: 'notas', modulo: 'descriptiva', titulo: 'Serie con moda y desviación conocida',
    descripcion: '2, 4, 4, 4, 5, 5, 7, 9: media 5, σ = 2.',
    params: { datos: '2 4 4 4 5 5 7 9', unidad: '', tipo: 'poblacional' },
  },
  {
    id: 'atipico', modulo: 'descriptiva', titulo: 'Detección de un valor atípico',
    descripcion: 'Tiempos de reacción con una medición anómala.',
    params: { datos: '0.21 0.19 0.22 0.20 0.23 0.21 0.95 0.20', unidad: 's', tipo: 'muestral' },
  },
  {
    id: 'longitud', modulo: 'experimentales', titulo: 'Longitud de una varilla',
    descripcion: 'Seis mediciones con calibrador y comparación con el valor nominal de 25.0 mm.',
    params: { datos: '24.8 25.1 25.0 24.9 25.2 25.1', unidad: 'mm', referencia: '25.0' },
  },
  {
    id: 'tension', modulo: 'experimentales', titulo: 'Tensión de una batería',
    descripcion: 'Lecturas de voltaje y su incertidumbre; referencia 9.0 V.',
    params: { datos: '8.92 9.05 8.98 9.01 8.95', unidad: 'V', referencia: '9.0' },
  },
  {
    id: 'periodo', modulo: 'experimentales', titulo: 'Periodo de un péndulo',
    descripcion: 'Cinco medidas del periodo (s) con referencia teórica 1.42 s.',
    params: { datos: '1.43 1.40 1.45 1.41 1.44', unidad: 's', referencia: '1.42' },
  },
  {
    id: 'histograma', modulo: 'tablas', titulo: 'Histograma de 30 mediciones',
    descripcion: 'Tabla de frecuencias con la regla de Sturges.',
    params: {
      datos: '12.1 13.4 12.8 14.0 13.1 12.5 13.7 12.9 13.3 14.2 12.7 13.0 13.5 12.2 13.8 13.2 12.6 13.9 13.4 12.8 13.1 13.6 12.4 13.3 14.1 12.9 13.0 13.5 12.7 13.2',
      clases: '',
    },
  },
  {
    id: 'normal-coc', modulo: 'probabilidad', titulo: 'Cola derecha: CI normal',
    descripcion: 'X ~ N(100, 15): P(X > 115).',
    params: { modo: 'normal', mu: '100', sigma: '15', tipo: 'mayor', a: '115', b: '', p: '' },
  },
  {
    id: 'normal-entre', modulo: 'probabilidad', titulo: 'Intervalo normal estándar',
    descripcion: 'Z ~ N(0, 1): P(−1.96 < Z < 1.96).',
    params: { modo: 'normal', mu: '0', sigma: '1', tipo: 'entre', a: '-1.96', b: '1.96', p: '' },
  },
  {
    id: 'normal-inversa', modulo: 'probabilidad', titulo: 'Percentil 97.5 %',
    descripcion: 'X ~ N(100, 15): ¿qué valor deja 97.5 % por debajo?',
    params: { modo: 'inversa', mu: '100', sigma: '15', tipo: 'menor', a: '', b: '', p: '0.975' },
  },
  {
    id: 'clasica', modulo: 'probabilidad', titulo: 'Probabilidad clásica',
    descripcion: '3 casos favorables de 12 posibles.',
    params: { modo: 'clasica', favorables: '3', posibles: '12' },
  },
  {
    id: 'ley-ohm', modulo: 'regresion', titulo: 'Ley de Ohm experimental',
    descripcion: 'Tensión (V) frente a corriente (A): la pendiente estima la resistencia.',
    params: { x: '0.5 1.0 1.5 2.0 2.5', y: '1.1 2.0 3.1 4.0 5.1', unidadX: 'A', unidadY: 'V', xPred: '1.75' },
  },
  {
    id: 'resorte', modulo: 'regresion', titulo: 'Resorte (ley de Hooke)',
    descripcion: 'Fuerza (N) frente a elongación (m).',
    params: { x: '0.02 0.04 0.06 0.08 0.10', y: '0.52 0.98 1.55 2.03 2.49', unidadX: 'm', unidadY: 'N', xPred: '0.07' },
  },
  {
    id: 'correlacion-basica', modulo: 'regresion', titulo: 'Correlación moderada',
    descripcion: 'X = 1..5, Y = 2, 4, 5, 4, 5: r ≈ 0.7746.',
    params: { x: '1 2 3 4 5', y: '2 4 5 4 5', unidadX: '', unidadY: '', xPred: '3' },
  },
];
