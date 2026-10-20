export interface Tabla {
  encabezados: string[];
  filas: (string | number)[][];
}

/** Objeto uniforme que la UI renderiza para cualquier cálculo. */
export interface Resultado {
  titulo: string;
  /** LaTeX */
  formula: string;
  /** LaTeX con los valores sustituidos */
  sustitucion: string;
  pasos: string[];
  /** Valor numérico final (ausente si no se pudo calcular). */
  valor?: number;
  /** Respuesta final lista para mostrar (con unidad y redondeo). */
  respuesta: string;
  interpretacion: string;
  advertencias: string[];
  tabla?: Tabla;
}

export const DECIMALES = 4;

/** Redondea solo para mostrar; quita ceros finales. */
export function fmt(x: number, dec = DECIMALES): string {
  if (!Number.isFinite(x)) return String(x);
  if (Math.abs(x) < 1e-12) return '0'; // ruido de punto flotante
  if (Math.abs(x) < Math.pow(10, -dec)) return x.toExponential(2);
  const r = Number(x.toFixed(dec));
  return String(Object.is(r, -0) ? 0 : r);
}

export function conUnidad(texto: string, unidad?: string): string {
  return unidad ? `${texto} ${unidad}` : texto;
}

/** Lista de valores para LaTeX; abrevia si es larga. */
export function listaLatex(vals: number[], sep = ' + ', max = 8): string {
  const f = vals.map((v) => (v < 0 ? `(${fmt(v)})` : fmt(v)));
  if (f.length <= max) return f.join(sep);
  return [...f.slice(0, max - 2), '\\dots', f[f.length - 1]].join(sep);
}

export function resultadoInvalido(titulo: string, advertencias: string[]): Resultado {
  return {
    titulo,
    formula: '',
    sustitucion: '',
    pasos: [],
    respuesta: 'No se pudo calcular',
    interpretacion: '',
    advertencias,
  };
}
