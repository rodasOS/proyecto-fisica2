import { desviacion, media } from './descriptiva';
import { fmt, Resultado, resultadoInvalido } from './resultado.model';

type Magnitud = 'corriente' | 'tensión' | 'longitud' | 'tiempo' | 'masa' | 'fuerza';

/** Factor para llevar cada unidad a la unidad base SI de su magnitud. */
export const UNIDADES: Record<string, { magnitud: Magnitud; factor: number }> = {
  A: { magnitud: 'corriente', factor: 1 }, mA: { magnitud: 'corriente', factor: 1e-3 },
  µA: { magnitud: 'corriente', factor: 1e-6 }, kA: { magnitud: 'corriente', factor: 1e3 },
  V: { magnitud: 'tensión', factor: 1 }, mV: { magnitud: 'tensión', factor: 1e-3 },
  µV: { magnitud: 'tensión', factor: 1e-6 }, kV: { magnitud: 'tensión', factor: 1e3 },
  m: { magnitud: 'longitud', factor: 1 }, cm: { magnitud: 'longitud', factor: 1e-2 },
  mm: { magnitud: 'longitud', factor: 1e-3 }, km: { magnitud: 'longitud', factor: 1e3 },
  µm: { magnitud: 'longitud', factor: 1e-6 }, nm: { magnitud: 'longitud', factor: 1e-9 },
  in: { magnitud: 'longitud', factor: 0.0254 }, ft: { magnitud: 'longitud', factor: 0.3048 },
  s: { magnitud: 'tiempo', factor: 1 }, ms: { magnitud: 'tiempo', factor: 1e-3 },
  µs: { magnitud: 'tiempo', factor: 1e-6 }, min: { magnitud: 'tiempo', factor: 60 },
  h: { magnitud: 'tiempo', factor: 3600 },
  kg: { magnitud: 'masa', factor: 1 }, g: { magnitud: 'masa', factor: 1e-3 },
  mg: { magnitud: 'masa', factor: 1e-6 }, lb: { magnitud: 'masa', factor: 0.45359237 },
  N: { magnitud: 'fuerza', factor: 1 }, mN: { magnitud: 'fuerza', factor: 1e-3 },
  kN: { magnitud: 'fuerza', factor: 1e3 },
};

export const LISTA_UNIDADES = Object.keys(UNIDADES);

function normalizarUnidad(u: string): string {
  return u.trim().replace(/^u(?=[AVms])/, 'µ');
}

export function convertir(valor: number, de: string, a: string): Resultado {
  const titulo = 'Conversión de unidades';
  const d = UNIDADES[normalizarUnidad(de)];
  const t = UNIDADES[normalizarUnidad(a)];
  if (!d || !t) return resultadoInvalido(titulo, [`Unidad no reconocida: "${!d ? de : a}".`]);
  if (d.magnitud !== t.magnitud) {
    return resultadoInvalido(titulo, [`Las unidades no son compatibles: ${de} es ${d.magnitud} y ${a} es ${t.magnitud}.`]);
  }
  const factor = d.factor / t.factor;
  const res = valor * factor;
  return {
    titulo,
    formula: `x_{${a}}=x_{${de}}\\times\\dfrac{\\text{factor}(${de})}{\\text{factor}(${a})}`,
    sustitucion: `${fmt(valor, 6)}\\ ${de}\\times ${fmt(factor, 9)}=${fmt(res, 6)}\\ ${a}`,
    pasos: [`1 ${de} = ${fmt(factor, 9)} ${a}.`, `Se multiplica ${fmt(valor, 6)} por ese factor.`],
    valor: res,
    respuesta: `${fmt(valor, 6)} ${de} = ${fmt(res, 6)} ${a}`,
    interpretacion: `Ambas cantidades representan la misma ${d.magnitud}.`,
    advertencias: [],
  };
}

/** Redondea la incertidumbre a 1 cifra significativa y ajusta la media. */
export function reportar(valor: number, incert: number): { texto: string; decimales: number; u: number } {
  if (!(incert > 0)) return { texto: fmt(valor), decimales: 4, u: incert };
  const dec = -Math.floor(Math.log10(incert));
  const f = Math.pow(10, dec);
  const u = Math.round(incert * f) / f;
  // si el redondeo sube de orden (p. ej. 0.96→1.0) las cifras siguen siendo válidas
  const decimales = Math.max(dec, 0);
  const v = Math.round(valor * f) / f;
  return { texto: `${v.toFixed(decimales)} ± ${u.toFixed(decimales)}`, decimales, u };
}

export interface AnalisisExperimental {
  media: number;
  desviacion: number;
  errorEstandar: number;
  reporte: string;
  resultados: Resultado[];
  advertencias: string[];
}

export function analizarExperimental(
  datos: number[],
  unidad: string,
  referencia?: number,
): AnalisisExperimental | null {
  const n = datos.length;
  const un = unidad ? normalizarUnidad(unidad) : '';
  const u = un ? ` ${un}` : '';
  if (n < 2) return null;
  const m = media(datos);
  const s = desviacion(datos, false);
  const se = s / Math.sqrt(n);
  const adv: string[] = [];
  if (n < 5) adv.push('Con menos de 5 mediciones la incertidumbre estimada es poco confiable.');
  if (un && !UNIDADES[un]) adv.push(`La unidad "${un}" no está en la lista; se muestra tal cual y no se puede convertir.`);
  const resultados: Resultado[] = [];
  const rep = reportar(m, se);

  resultados.push({
    titulo: 'Incertidumbre de la media',
    formula: 'u(\\bar{x})=\\dfrac{s}{\\sqrt{n}}',
    sustitucion: `u(\\bar{x})=\\dfrac{${fmt(s)}}{\\sqrt{${n}}}=\\dfrac{${fmt(s)}}{${fmt(Math.sqrt(n))}}=${fmt(se)}`,
    pasos: [
      `Media: x̄ = ${fmt(m)}${u}. Desviación muestral: s = ${fmt(s)}${u}.`,
      `Error estándar de la media: s/√n = ${fmt(se)}${u}.`,
      'La incertidumbre se redondea a 1 cifra significativa y la media se ajusta a la misma posición decimal.',
    ],
    valor: se,
    respuesta: `x̄ ± u = ${rep.texto}${u}`,
    interpretacion: `La medición se reporta como ${rep.texto}${u}: el valor verdadero probablemente está cerca de ${fmt(m)}${u}, con una incertidumbre de la media de ${rep.u}${u}. La desviación s describe la dispersión de cada medición; s/√n, la precisión de la media.`,
    advertencias: adv,
  });

  if (m !== 0) {
    const rel = (se / Math.abs(m)) * 100;
    resultados.push({
      titulo: 'Incertidumbre relativa',
      formula: 'u_r=\\dfrac{u(\\bar{x})}{|\\bar{x}|}\\times100\\%',
      sustitucion: `u_r=\\dfrac{${fmt(se)}}{${fmt(Math.abs(m))}}\\times100=${fmt(rel, 2)}\\%`,
      pasos: ['Se divide la incertidumbre entre el valor absoluto de la media.'],
      valor: rel,
      respuesta: `u_r = ${fmt(rel, 2)} %`,
      interpretacion: `La incertidumbre es ${fmt(rel, 2)} % del valor medido.`,
      advertencias: [],
    });
  }

  if (referencia !== undefined && Number.isFinite(referencia)) {
    if (referencia === 0) {
      resultados.push(resultadoInvalido('Error porcentual', ['El valor de referencia es 0: el error porcentual no está definido.']));
    } else {
      const e = (Math.abs(m - referencia) / Math.abs(referencia)) * 100;
      resultados.push({
        titulo: 'Error porcentual',
        formula: '\\%E=\\dfrac{|\\bar{x}-x_{ref}|}{|x_{ref}|}\\times100',
        sustitucion: `\\%E=\\dfrac{|${fmt(m)}-${fmt(referencia)}|}{${fmt(Math.abs(referencia))}}\\times100=${fmt(e, 2)}\\%`,
        pasos: ['Se resta la referencia a la media, se toma valor absoluto y se divide entre la referencia.'],
        valor: e,
        respuesta: `%E = ${fmt(e, 2)} %`,
        interpretacion: `La media difiere ${fmt(e, 2)} % del valor de referencia.`,
        advertencias: [],
      });
    }
  }
  return { media: m, desviacion: s, errorEstandar: se, reporte: `${rep.texto}${u}`, resultados, advertencias: adv };
}
