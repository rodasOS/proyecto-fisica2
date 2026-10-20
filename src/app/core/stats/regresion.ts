import { media, suma } from './descriptiva';
import { conUnidad, fmt, Resultado } from './resultado.model';

export function fuerzaCorrelacion(r: number): string {
  const a = Math.abs(r);
  const f = a < 0.2 ? 'muy débil' : a < 0.4 ? 'débil' : a < 0.6 ? 'moderada' : a < 0.95 ? 'fuerte' : 'muy fuerte';
  return a < 0.05 ? 'prácticamente nula' : f;
}

export interface AnalisisRegresion {
  n: number;
  r: number;
  r2: number;
  pendiente: number;
  intercepto: number;
  prediccion?: number;
  medidas: Resultado[];
  advertencias: string[];
}

export function validarPares(x: number[], y: number[]): string[] {
  const e: string[] = [];
  if (x.length !== y.length) e.push(`X tiene ${x.length} valores e Y tiene ${y.length}: deben tener la misma cantidad.`);
  else if (x.length < 3) e.push('Se necesitan al menos 3 pares de datos.');
  return e;
}

export function analizarRegresion(
  x: number[],
  y: number[],
  opc: { unidadX?: string; unidadY?: string; xPred?: number } = {},
): AnalisisRegresion | { errores: string[] } {
  const errores = validarPares(x, y);
  if (errores.length) return { errores };
  const n = x.length;
  const mx = media(x);
  const my = media(y);
  const sxx = suma(x.map((v) => (v - mx) ** 2));
  const syy = suma(y.map((v) => (v - my) ** 2));
  const sxy = suma(x.map((v, i) => (v - mx) * (y[i] - my)));
  const advGlobal: string[] = [];
  if (sxx === 0) errores.push('Todos los valores de X son iguales: la pendiente y r no están definidas.');
  if (syy === 0) errores.push('Todos los valores de Y son iguales: r no está definido (no hay variación en Y).');
  if (errores.length) return { errores };
  const ux = opc.unidadX;
  const uy = opc.unidadY;
  const r = sxy / Math.sqrt(sxx * syy);
  const b = sxy / sxx;
  const a = my - b * mx;
  const medidas: Resultado[] = [];
  const tabla = {
    encabezados: ['x', 'y', 'x − x̄', 'y − ȳ', '(x − x̄)(y − ȳ)', '(x − x̄)²', '(y − ȳ)²'],
    filas: [
      ...x.map((v, i) => [fmt(v), fmt(y[i]), fmt(v - mx), fmt(y[i] - my), fmt((v - mx) * (y[i] - my)), fmt((v - mx) ** 2), fmt((y[i] - my) ** 2)]),
      ['Σ', '', '', '', fmt(sxy), fmt(sxx), fmt(syy)],
    ],
  };
  const sentido = r > 0 ? 'positiva' : 'negativa';
  const fuerza = fuerzaCorrelacion(r);
  if (n < 5) advGlobal.push('Con menos de 5 pares la correlación es poco confiable.');
  if (Math.abs(r) >= 0.8) advGlobal.push('Una correlación alta no implica causalidad.');

  medidas.push({
    titulo: 'Coeficiente de correlación (Pearson)',
    formula: 'r=\\dfrac{\\sum(x_i-\\bar{x})(y_i-\\bar{y})}{\\sqrt{\\sum(x_i-\\bar{x})^2\\,\\sum(y_i-\\bar{y})^2}},\\quad r^2',
    sustitucion: `\\bar{x}=${fmt(mx)},\\ \\bar{y}=${fmt(my)};\\quad r=\\dfrac{${fmt(sxy)}}{\\sqrt{${fmt(sxx)}\\cdot${fmt(syy)}}}=${fmt(r)},\\quad r^2=${fmt(r * r)}`,
    pasos: [`Medias: x̄ = ${fmt(mx)}, ȳ = ${fmt(my)}.`, 'Se calculan las sumas de la tabla: Sxy, Sxx, Syy.', 'r = Sxy / √(Sxx·Syy).'],
    valor: r,
    respuesta: `r = ${fmt(r)};  r² = ${fmt(r * r)}`,
    interpretacion: `r = ${fmt(r, 2)}: correlación ${sentido} ${fuerza}. El ${fmt(r * r * 100, 1)} % de la variación de Y se explica linealmente por X. Correlación no implica causalidad.`,
    advertencias: advGlobal,
    tabla,
  });

  medidas.push({
    titulo: 'Regresión lineal simple',
    formula: '\\hat{y}=a+bx,\\quad b=\\dfrac{S_{xy}}{S_{xx}},\\quad a=\\bar{y}-b\\bar{x}',
    sustitucion: `b=\\dfrac{${fmt(sxy)}}{${fmt(sxx)}}=${fmt(b)},\\quad a=${fmt(my)}-${fmt(b)}\\cdot${mx < 0 ? `(${fmt(mx)})` : fmt(mx)}=${fmt(a)},\\quad \\hat{y}=${fmt(a)}${b < 0 ? '-' : '+'}${fmt(Math.abs(b))}x`,
    pasos: ['Pendiente b = Sxy / Sxx.', 'Intercepto a = ȳ − b·x̄.'],
    valor: b,
    respuesta: `ŷ = ${fmt(a)} ${b < 0 ? '−' : '+'} ${fmt(Math.abs(b))}x`,
    interpretacion:
      `Pendiente: por cada aumento de 1${ux ? ' ' + ux : ' unidad'} en X, Y ${b >= 0 ? 'aumenta' : 'disminuye'} en promedio ${fmt(Math.abs(b))}${uy ? ' ' + uy : ' unidades'}. ` +
      `Intercepto: cuando X = 0, el modelo predice Y = ${conUnidad(fmt(a), uy)}${Math.min(...x) > 0 ? ' (fuera del rango de datos, interprétese con cuidado)' : ''}.`,
    advertencias: [],
  });

  let prediccion: number | undefined;
  if (opc.xPred !== undefined && Number.isFinite(opc.xPred)) {
    prediccion = a + b * opc.xPred;
    const fuera = opc.xPred < Math.min(...x) || opc.xPred > Math.max(...x);
    medidas.push({
      titulo: 'Predicción',
      formula: '\\hat{y}=a+bx_0',
      sustitucion: `\\hat{y}=${fmt(a)}+${fmt(b)}\\cdot${opc.xPred < 0 ? `(${fmt(opc.xPred)})` : fmt(opc.xPred)}=${fmt(prediccion)}`,
      pasos: ['Se evalúa la recta en el valor x₀ dado.'],
      valor: prediccion,
      respuesta: `ŷ(${fmt(opc.xPred)}) = ${conUnidad(fmt(prediccion), uy)}`,
      interpretacion: fuera ? 'El valor está fuera del rango observado.' : 'El valor está dentro del rango observado (interpolación).',
      advertencias: fuera ? [`x₀ = ${fmt(opc.xPred)} está fuera del rango de los datos [${fmt(Math.min(...x))}, ${fmt(Math.max(...x))}]: es una extrapolación y puede no ser fiable.`] : [],
    });
  }
  return { n, r, r2: r * r, pendiente: b, intercepto: a, prediccion, medidas, advertencias: advGlobal };
}
