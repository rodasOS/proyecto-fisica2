import { conUnidad, fmt, listaLatex, Resultado, resultadoInvalido } from './resultado.model';

export function suma(d: number[]): number {
  return d.reduce((a, b) => a + b, 0);
}
export function media(d: number[]): number {
  return suma(d) / d.length;
}
export function ordenar(d: number[]): number[] {
  return [...d].sort((a, b) => a - b);
}
export function mediana(d: number[]): number {
  const o = ordenar(d);
  const m = Math.floor(o.length / 2);
  return o.length % 2 ? o[m] : (o[m - 1] + o[m]) / 2;
}
export function modas(d: number[]): { modas: number[]; frecuencia: number } {
  const mapa = new Map<string, { v: number; f: number }>();
  for (const v of d) {
    const k = v.toPrecision(12);
    const e = mapa.get(k);
    if (e) e.f++;
    else mapa.set(k, { v, f: 1 });
  }
  const maxF = Math.max(...[...mapa.values()].map((e) => e.f));
  if (maxF === 1) return { modas: [], frecuencia: 1 };
  return {
    modas: [...mapa.values()].filter((e) => e.f === maxF).map((e) => e.v).sort((a, b) => a - b),
    frecuencia: maxF,
  };
}
export function sumaCuadrados(d: number[]): number {
  const m = media(d);
  return suma(d.map((x) => (x - m) ** 2));
}
export function varianza(d: number[], poblacional: boolean): number {
  return sumaCuadrados(d) / (poblacional ? d.length : d.length - 1);
}
export function desviacion(d: number[], poblacional: boolean): number {
  return Math.sqrt(varianza(d, poblacional));
}
/** Cuantil por interpolación lineal (igual al método por defecto de numpy). */
export function cuantil(d: number[], p: number): number {
  const o = ordenar(d);
  const pos = (o.length - 1) * p;
  const i = Math.floor(pos);
  const f = pos - i;
  return i + 1 < o.length ? o[i] + f * (o[i + 1] - o[i]) : o[i];
}

export interface OpcionesDescriptiva {
  poblacional?: boolean;
  unidad?: string;
}

export interface AnalisisDescriptivo {
  n: number;
  media: number;
  mediana: number;
  modas: number[];
  min: number;
  max: number;
  rango: number;
  varianza: number;
  desviacion: number;
  desviacionPob: number;
  desviacionMue?: number;
  cv?: number;
  q1: number;
  q3: number;
  iqr: number;
  atipicos: number[];
  medidas: Resultado[];
  advertencias: string[];
}

export function analizarDescriptiva(
  datos: number[],
  opciones: OpcionesDescriptiva = {},
): AnalisisDescriptivo | null {
  const u = opciones.unidad;
  const pob = !!opciones.poblacional;
  const n = datos.length;
  if (n === 0) return null;
  const advertencias: string[] = [];
  const o = ordenar(datos);
  const m = media(datos);
  const med = mediana(datos);
  const mo = modas(datos);
  const mn = o[0];
  const mx = o[n - 1];
  const ss = sumaCuadrados(datos);
  const dPob = Math.sqrt(ss / n);
  const dMue = n >= 2 ? Math.sqrt(ss / (n - 1)) : undefined;
  const divisor = pob ? n : n - 1;
  const medidas: Resultado[] = [];
  const unM = (v: number) => conUnidad(fmt(v), u);

  // Media
  medidas.push({
    titulo: 'Media aritmética',
    formula: '\\bar{x}=\\dfrac{\\sum x_i}{n}',
    sustitucion: `\\bar{x}=\\dfrac{${listaLatex(datos)}}{${n}}=\\dfrac{${fmt(suma(datos))}}{${n}}=${fmt(m)}`,
    pasos: [`Se suman los ${n} datos: ${fmt(suma(datos))}.`, `Se divide entre n = ${n}.`],
    valor: m,
    respuesta: `x̄ = ${unM(m)}`,
    interpretacion: `El valor central aritmético de los datos es ${unM(m)}.`,
    advertencias: [],
  });

  // Mediana
  const mid = Math.floor(n / 2);
  medidas.push({
    titulo: 'Mediana',
    formula: 'Me=\\begin{cases}x_{(\\frac{n+1}{2})}&n\\text{ impar}\\\\\\dfrac{x_{(n/2)}+x_{(n/2+1)}}{2}&n\\text{ par}\\end{cases}',
    sustitucion:
      n % 2
        ? `Me=x_{(${(n + 1) / 2})}=${fmt(med)}`
        : `Me=\\dfrac{${fmt(o[mid - 1])}+${fmt(o[mid])}}{2}=${fmt(med)}`,
    pasos: [`Datos ordenados: ${o.map((x) => fmt(x)).join(', ')}.`, n % 2 ? 'n es impar: se toma el dato central.' : 'n es par: se promedian los dos datos centrales.'],
    valor: med,
    respuesta: `Me = ${unM(med)}`,
    interpretacion: `La mitad de los datos es menor o igual a ${unM(med)}.`,
    advertencias: [],
  });

  // Moda
  medidas.push({
    titulo: 'Moda',
    formula: 'Mo=\\text{valor con mayor frecuencia}',
    sustitucion: mo.modas.length ? `Mo=${mo.modas.map((x) => fmt(x)).join(',\\ ')}\\ (f=${mo.frecuencia})` : 'Mo=\\text{no existe}',
    pasos: ['Se cuenta cuántas veces aparece cada valor.', mo.modas.length ? `La mayor frecuencia es ${mo.frecuencia}.` : 'Todos los valores aparecen una sola vez.'],
    respuesta: mo.modas.length ? `Mo = ${mo.modas.map((x) => unM(x)).join(' y ')}${mo.modas.length > 1 ? ' (multimodal)' : ''}` : 'No hay moda (amodal)',
    interpretacion: mo.modas.length ? `El valor más frecuente es ${mo.modas.map((x) => fmt(x)).join(' y ')}.` : 'Ningún valor se repite.',
    advertencias: [],
  });

  // Rango
  medidas.push({
    titulo: 'Rango',
    formula: 'R=x_{max}-x_{min}',
    sustitucion: `R=${fmt(mx)}-${mn < 0 ? `(${fmt(mn)})` : fmt(mn)}=${fmt(mx - mn)}`,
    pasos: [`Máximo = ${fmt(mx)}, mínimo = ${fmt(mn)}.`],
    valor: mx - mn,
    respuesta: `R = ${unM(mx - mn)}`,
    interpretacion: `Los datos se extienden ${unM(mx - mn)} entre el mínimo y el máximo.`,
    advertencias: [],
  });

  // Varianza y desviación (tabla de desviaciones)
  const tabla = {
    encabezados: ['xᵢ', 'xᵢ − x̄', '(xᵢ − x̄)²'],
    filas: [...datos.map((x) => [fmt(x), fmt(x - m), fmt((x - m) ** 2)]), ['Σ', fmt(suma(datos.map((x) => x - m))), fmt(ss)]],
  };
  const sim = pob ? '\\sigma' : 's';
  const advDisp: string[] = [];
  let varV: number | undefined;
  let desV: number | undefined;
  if (divisor <= 0) {
    advDisp.push('Con n = 1 no se puede calcular la desviación muestral: se requiere n ≥ 2.');
  } else {
    varV = ss / divisor;
    desV = Math.sqrt(varV);
  }
  if (n < 5) advDisp.push('Con menos de 5 datos las estimaciones de dispersión son poco confiables.');
  if (varV === undefined) {
    medidas.push(resultadoInvalido('Varianza y desviación estándar', advDisp));
  } else {
    medidas.push({
      titulo: `Varianza y desviación estándar ${pob ? 'poblacional' : 'muestral'}`,
      formula: pob
        ? '\\sigma^2=\\dfrac{\\sum (x_i-\\mu)^2}{N},\\quad \\sigma=\\sqrt{\\sigma^2}'
        : 's^2=\\dfrac{\\sum (x_i-\\bar{x})^2}{n-1},\\quad s=\\sqrt{s^2}',
      sustitucion: `${sim}^2=\\dfrac{${fmt(ss)}}{${pob ? n : `${n}-1`}}=\\dfrac{${fmt(ss)}}{${divisor}}=${fmt(varV)},\\quad ${sim}=\\sqrt{${fmt(varV)}}=${fmt(desV!)}`,
      pasos: [
        `Se calcula la media: ${fmt(m)}.`,
        'Se obtiene cada desviación xᵢ − x̄ y su cuadrado (ver tabla).',
        `Se suman los cuadrados: ${fmt(ss)}.`,
        `Se divide entre ${pob ? 'N' : 'n − 1'} = ${divisor}${pob ? '' : ' (corrección de Bessel)'}.`,
        'Se extrae la raíz cuadrada.',
      ],
      valor: desV,
      respuesta: `${pob ? 'σ' : 's'} = ${unM(desV!)};  ${pob ? 'σ' : 's'}² = ${fmt(varV)}${u ? ` ${u}²` : ''}`,
      interpretacion: `Los datos se alejan en promedio unos ${unM(desV!)} de la media. ${pob ? 'Se usó σ porque se tratan los datos como la población completa.' : 'Se usó s porque los datos son una muestra (p. ej. mediciones repetidas).'}`,
      advertencias: advDisp,
      tabla,
    });
  }
  const actual = desV;

  // CV
  let cv: number | undefined;
  if (actual !== undefined) {
    if (m === 0) {
      medidas.push(resultadoInvalido('Coeficiente de variación', ['La media es 0: el coeficiente de variación no está definido.']));
    } else {
      cv = (actual / Math.abs(m)) * 100;
      medidas.push({
        titulo: 'Coeficiente de variación',
        formula: 'CV=\\dfrac{s}{|\\bar{x}|}\\times 100\\%',
        sustitucion: `CV=\\dfrac{${fmt(actual)}}{${fmt(Math.abs(m))}}\\times100=${fmt(cv, 2)}\\%`,
        pasos: ['Se divide la desviación entre el valor absoluto de la media y se multiplica por 100.'],
        valor: cv,
        respuesta: `CV = ${fmt(cv, 2)} %`,
        interpretacion: `La dispersión relativa es ${fmt(cv, 2)} % de la media.`,
        advertencias: [],
      });
    }
  }

  // Cuartiles
  const q1 = cuantil(datos, 0.25);
  const q3 = cuantil(datos, 0.75);
  const iqr = q3 - q1;
  const lo = q1 - 1.5 * iqr;
  const hi = q3 + 1.5 * iqr;
  const atipicos = o.filter((x) => x < lo || x > hi);
  medidas.push({
    titulo: 'Cuartiles y valores atípicos',
    formula: 'IQR=Q_3-Q_1;\\quad [Q_1-1.5\\,IQR,\\ Q_3+1.5\\,IQR]',
    sustitucion: `IQR=${fmt(q3)}-${fmt(q1)}=${fmt(iqr)};\\quad [${fmt(lo)},\\ ${fmt(hi)}]`,
    pasos: ['Método de cuartiles: interpolación lineal entre datos ordenados (posición (n−1)·p, igual que numpy).', `Q1 = ${fmt(q1)}, Q3 = ${fmt(q3)}.`],
    valor: iqr,
    respuesta: `Q1 = ${unM(q1)}, Q3 = ${unM(q3)}, IQR = ${unM(iqr)}; atípicos: ${atipicos.length ? atipicos.map((x) => fmt(x)).join(', ') : 'ninguno'}`,
    interpretacion: atipicos.length ? 'Hay valores fuera de los límites; conviene revisarlos.' : 'Ningún dato queda fuera de los límites 1.5·IQR.',
    advertencias: [],
  });

  if (n < 5) advertencias.push('Pocos datos (n < 5): las estimaciones son poco confiables.');
  return {
    n,
    media: m,
    mediana: med,
    modas: mo.modas,
    min: mn,
    max: mx,
    rango: mx - mn,
    varianza: varV ?? NaN,
    desviacion: desV ?? NaN,
    desviacionPob: dPob,
    desviacionMue: dMue,
    cv,
    q1,
    q3,
    iqr,
    atipicos,
    medidas,
    advertencias,
  };
}
