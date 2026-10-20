import { fmt, Resultado, resultadoInvalido, Tabla } from './resultado.model';

export interface Clase {
  inferior: number;
  superior: number;
  marca: number;
  f: number;
  fr: number;
  fa: number;
  fra: number;
  /** true si el límite superior es cerrado (última clase) */
  cerrada: boolean;
}

export interface TablaFrecuencias {
  clases: Clase[];
  k: number;
  amplitud: number;
  n: number;
  resultado: Resultado;
}

function decimales(x: number): number {
  const s = String(x);
  if (s.includes('e-')) return Number(s.split('e-')[1]);
  const i = s.indexOf('.');
  return i < 0 ? 0 : s.length - i - 1;
}

export function tablaFrecuencias(
  datos: number[],
  opciones: { clases?: number; amplitud?: number } = {},
): TablaFrecuencias | Resultado {
  const titulo = 'Tabla de frecuencias';
  const n = datos.length;
  if (n < 2) return resultadoInvalido(titulo, ['Se necesitan al menos 2 datos para agrupar.']);
  const mn = Math.min(...datos);
  const mx = Math.max(...datos);
  const R = mx - mn;
  if (R === 0) {
    return resultadoInvalido(titulo, ['El rango es 0 (todos los datos son iguales): no se puede agrupar en clases.']);
  }
  const dec = Math.max(...datos.map(decimales));
  const pasos: string[] = [`n = ${n}, mínimo = ${fmt(mn)}, máximo = ${fmt(mx)}, rango R = ${fmt(R)}.`];
  let k: number;
  let w: number;
  if (opciones.amplitud !== undefined) {
    if (!(opciones.amplitud > 0)) return resultadoInvalido(titulo, ['La amplitud debe ser mayor que 0.']);
    w = opciones.amplitud;
    k = Math.ceil(R / w - 1e-9);
    pasos.push(`Amplitud fijada por el usuario: A = ${fmt(w)}; k = ⌈R/A⌉ = ${k}.`);
  } else {
    if (opciones.clases !== undefined) {
      if (!Number.isInteger(opciones.clases) || opciones.clases < 1 || opciones.clases > 50) {
        return resultadoInvalido(titulo, ['El número de clases debe ser un entero entre 1 y 50.']);
      }
      k = opciones.clases;
      pasos.push(`Número de clases fijado por el usuario: k = ${k}.`);
    } else {
      k = Math.ceil(1 + 3.322 * Math.log10(n));
      pasos.push(`Regla de Sturges: k = ⌈1 + 3.322·log₁₀(${n})⌉ = ${k}.`);
    }
    const f = Math.pow(10, dec);
    w = Math.ceil((R / k) * f - 1e-9) / f;
    pasos.push(`Amplitud: A = R/k = ${fmt(R / k, 6)} → ${fmt(w)} (redondeada hacia arriba a ${dec} decimales).`);
  }
  if (k < 1) k = 1;
  const clases: Clase[] = [];
  let acum = 0;
  const conteo = new Array(k).fill(0);
  for (const x of datos) {
    const i = Math.min(k - 1, Math.max(0, Math.floor((x - mn) / w + 1e-9)));
    conteo[i]++;
  }
  for (let i = 0; i < k; i++) {
    const inf = mn + i * w;
    const sup = inf + w;
    acum += conteo[i];
    clases.push({
      inferior: inf, superior: sup, marca: (inf + sup) / 2, f: conteo[i],
      fr: conteo[i] / n, fa: acum, fra: acum / n, cerrada: i === k - 1,
    });
  }
  const adv: string[] = [];
  if (acum !== n) adv.push('Error interno: las frecuencias no suman n.');
  if (n < 10) adv.push('Con pocos datos el histograma es poco informativo.');
  const tabla: Tabla = {
    encabezados: ['Clase', 'Marca', 'f', 'fr', 'F', 'Fr'],
    filas: [
      ...clases.map((c) => [
        `[${fmt(c.inferior)}, ${fmt(c.superior)}${c.cerrada ? ']' : ')'}`,
        fmt(c.marca), c.f, fmt(c.fr), c.fa, fmt(c.fra),
      ]),
      ['Total', '', n, '1', '', ''],
    ],
  };
  const modal = clases.reduce((a, b) => (b.f > a.f ? b : a));
  const resultado: Resultado = {
    titulo,
    formula: 'k=\\lceil 1+3.322\\log_{10}n\\rceil,\\quad A=\\dfrac{R}{k},\\quad fr=\\dfrac{f}{n}',
    sustitucion: `R=${fmt(mx)}-${fmt(mn)}=${fmt(R)},\\quad k=${k},\\quad A=\\dfrac{${fmt(R)}}{${k}}\\approx ${fmt(w)}`,
    pasos: [...pasos, 'Cada clase es [L, L+A); la última incluye su límite superior.', `Se cuenta cuántos datos caen en cada clase: Σf = ${acum} = n.`],
    valor: k,
    respuesta: `${k} clases de amplitud ${fmt(w)}; clase modal [${fmt(modal.inferior)}, ${fmt(modal.superior)}${modal.cerrada ? ']' : ')'} con f = ${modal.f}`,
    interpretacion: `La clase con más datos es [${fmt(modal.inferior)}, ${fmt(modal.superior)}) con ${modal.f} de ${n} (${fmt(modal.fr * 100, 1)} %).`,
    advertencias: adv,
    tabla,
  };
  return { clases, k, amplitud: w, n, resultado };
}

export function esTablaFrecuencias(x: TablaFrecuencias | Resultado): x is TablaFrecuencias {
  return (x as TablaFrecuencias).clases !== undefined;
}
