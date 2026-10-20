import { probit } from 'simple-statistics';
import { fmt, Resultado, resultadoInvalido } from './resultado.model';

/** erf con serie estable (|x|≤3) y fracción continua para la cola. */
function erfc(x: number): number {
  const ax = Math.abs(x);
  let r: number;
  if (ax <= 3) {
    let term = ax;
    let sum = ax;
    for (let n = 1; n < 200; n++) {
      term *= (2 * ax * ax) / (2 * n + 1);
      sum += term;
      if (term < 1e-17 * sum) break;
    }
    r = 1 - (2 / Math.sqrt(Math.PI)) * Math.exp(-ax * ax) * sum;
  } else {
    // erfc(x) = exp(-x²)/(x√π) · 1/(1+ 1/(2x²)/(1+2/(2x²)/(1+...))) vía Lentz
    let f = 0;
    for (let k = 60; k >= 1; k--) f = k / 2 / (ax + f);
    r = Math.exp(-ax * ax) / Math.sqrt(Math.PI) / (ax + f);
  }
  return x >= 0 ? r : 2 - r;
}

/** Función de distribución de la normal estándar Φ(z). */
export function phi(z: number): number {
  return 0.5 * erfc(-z / Math.SQRT2);
}

/** Inversa de Φ: semilla de simple-statistics refinada con Newton. */
export function phiInv(p: number): number {
  let z = probit(p);
  for (let i = 0; i < 4; i++) {
    const pdf = Math.exp(-z * z / 2) / Math.sqrt(2 * Math.PI);
    if (pdf === 0) break;
    z -= (phi(z) - p) / pdf;
  }
  return z;
}

const pf = (x: number) => (x < 0 ? `(${fmt(x)})` : fmt(x));

export function probabilidadClasica(favorables: number, posibles: number): Resultado {
  const t = 'Probabilidad clásica';
  const adv: string[] = [];
  if (!Number.isInteger(favorables) || !Number.isInteger(posibles) || favorables < 0 || posibles <= 0) {
    adv.push('Los casos deben ser enteros: favorables ≥ 0 y posibles > 0.');
  } else if (favorables > posibles) {
    adv.push('Los casos favorables no pueden superar a los posibles.');
  }
  if (adv.length) return resultadoInvalido(t, adv);
  const p = favorables / posibles;
  return {
    titulo: t,
    formula: 'P(A)=\\dfrac{\\text{casos favorables}}{\\text{casos posibles}}',
    sustitucion: `P(A)=\\dfrac{${favorables}}{${posibles}}=${fmt(p)}`,
    pasos: ['Se asume que todos los casos son igualmente probables.', `Se divide ${favorables} entre ${posibles}.`, `Complemento: P(Aᶜ) = 1 − ${fmt(p)} = ${fmt(1 - p)}.`],
    valor: p,
    respuesta: `P(A) = ${fmt(p)} (${fmt(p * 100, 2)} %)`,
    interpretacion: `El evento ocurre aproximadamente ${fmt(p * 100, 2)} de cada 100 veces; su complemento tiene probabilidad ${fmt(1 - p)}.`,
    advertencias: [],
  };
}

export function probabilidadUnion(pA: number, pB: number, pAB: number): Resultado {
  const t = 'Unión de eventos';
  const adv: string[] = [];
  for (const [n, v] of [['P(A)', pA], ['P(B)', pB], ['P(A∩B)', pAB]] as const) {
    if (!Number.isFinite(v) || v < 0 || v > 1) adv.push(`${n} debe estar en [0, 1].`);
  }
  if (!adv.length && pAB > Math.min(pA, pB)) adv.push('P(A∩B) no puede ser mayor que P(A) ni que P(B).');
  if (adv.length) return resultadoInvalido(t, adv);
  const u = pA + pB - pAB;
  return {
    titulo: t,
    formula: 'P(A\\cup B)=P(A)+P(B)-P(A\\cap B)',
    sustitucion: `P(A\\cup B)=${fmt(pA)}+${fmt(pB)}-${fmt(pAB)}=${fmt(u)}`,
    pasos: ['Se suman P(A) y P(B).', 'Se resta la intersección para no contarla dos veces.'],
    valor: u,
    respuesta: `P(A∪B) = ${fmt(u)}`,
    interpretacion: `La probabilidad de que ocurra A, B o ambos es ${fmt(u)}.`,
    advertencias: [],
  };
}

export function probabilidadCondicional(pAB: number, pB: number): Resultado {
  const t = 'Probabilidad condicional';
  const adv: string[] = [];
  if (!(pB > 0 && pB <= 1)) adv.push('P(B) debe estar en (0, 1].');
  if (!Number.isFinite(pAB) || pAB < 0 || pAB > 1) adv.push('P(A∩B) debe estar en [0, 1].');
  if (!adv.length && pAB > pB) adv.push('P(A∩B) no puede ser mayor que P(B).');
  if (adv.length) return resultadoInvalido(t, adv);
  const p = pAB / pB;
  return {
    titulo: t,
    formula: 'P(A\\mid B)=\\dfrac{P(A\\cap B)}{P(B)}',
    sustitucion: `P(A\\mid B)=\\dfrac{${fmt(pAB)}}{${fmt(pB)}}=${fmt(p)}`,
    pasos: ['Se divide la probabilidad conjunta entre la del evento condicionante.'],
    valor: p,
    respuesta: `P(A|B) = ${fmt(p)}`,
    interpretacion: `Sabiendo que ocurrió B, la probabilidad de A es ${fmt(p)}.`,
    advertencias: [],
  };
}

export type TipoNormal = 'menor' | 'mayor' | 'entre';

export interface ResultadoNormal extends Resultado {
  z1?: number;
  z2?: number;
}

export function normalDirecta(mu: number, sigma: number, tipo: TipoNormal, a: number, b?: number): ResultadoNormal {
  const t = 'Probabilidad normal';
  const adv: string[] = [];
  if (![mu, sigma, a].every(Number.isFinite) || (tipo === 'entre' && !Number.isFinite(b))) adv.push('Faltan datos: ingresa μ, σ y los límites como números.');
  else if (!(sigma > 0)) adv.push('σ debe ser mayor que cero.');
  else if (tipo === 'entre' && (b as number) < a) adv.push('El límite inferior a debe ser menor o igual que b.');
  if (adv.length) return resultadoInvalido(t, adv);
  const z1 = (a - mu) / sigma;
  const z2 = tipo === 'entre' ? ((b as number) - mu) / sigma : undefined;
  let p: number;
  let sim: string;
  let sust: string;
  const pasos = [`Estandarizar: z = (x − μ)/σ.`];
  if (tipo === 'menor') {
    p = phi(z1);
    sim = `P(X<${fmt(a)})`;
    sust = `z=\\dfrac{${fmt(a)}-${pf(mu)}}{${fmt(sigma)}}=${fmt(z1, 4)};\\quad ${sim}=\\Phi(${fmt(z1, 4)})=${fmt(p)}`;
    pasos.push(`z = ${fmt(z1, 4)}.`, `P = Φ(${fmt(z1, 4)}) = ${fmt(p)}.`);
  } else if (tipo === 'mayor') {
    p = 1 - phi(z1);
    sim = `P(X>${fmt(a)})`;
    sust = `z=\\dfrac{${fmt(a)}-${pf(mu)}}{${fmt(sigma)}}=${fmt(z1, 4)};\\quad ${sim}=1-\\Phi(${fmt(z1, 4)})=1-${fmt(phi(z1))}=${fmt(p)}`;
    pasos.push(`z = ${fmt(z1, 4)}.`, `P = 1 − Φ(${fmt(z1, 4)}) = ${fmt(p)}.`);
  } else {
    p = phi(z2 as number) - phi(z1);
    sim = `P(${fmt(a)}<X<${fmt(b as number)})`;
    sust = `z_1=\\dfrac{${fmt(a)}-${pf(mu)}}{${fmt(sigma)}}=${fmt(z1, 4)},\\ z_2=\\dfrac{${fmt(b as number)}-${pf(mu)}}{${fmt(sigma)}}=${fmt(z2 as number, 4)};\\quad ${sim}=\\Phi(${fmt(z2 as number, 4)})-\\Phi(${fmt(z1, 4)})=${fmt(p)}`;
    pasos.push(`z₁ = ${fmt(z1, 4)}, z₂ = ${fmt(z2 as number, 4)}.`, `P = Φ(z₂) − Φ(z₁) = ${fmt(phi(z2 as number))} − ${fmt(phi(z1))} = ${fmt(p)}.`);
  }
  return {
    titulo: t,
    formula: 'X\\sim N(\\mu,\\sigma),\\quad z=\\dfrac{x-\\mu}{\\sigma},\\quad P(X<x)=\\Phi(z)',
    sustitucion: sust,
    pasos,
    valor: p,
    respuesta: `${tipo === 'menor' ? `P(X < ${fmt(a)})` : tipo === 'mayor' ? `P(X > ${fmt(a)})` : `P(${fmt(a)} < X < ${fmt(b as number)})`} = ${fmt(p)} (${fmt(p * 100, 2)} %)`,
    interpretacion: `Con μ = ${fmt(mu)} y σ = ${fmt(sigma)}, aproximadamente ${fmt(p * 100, 2)} % de los valores cumple la condición.`,
    advertencias: [],
    z1,
    z2,
  };
}

export function normalInversa(mu: number, sigma: number, p: number): ResultadoNormal {
  const t = 'Normal inversa';
  const adv: string[] = [];
  if (![mu, sigma, p].every(Number.isFinite)) adv.push('Faltan datos: ingresa μ, σ y p como números.');
  else if (!(sigma > 0)) adv.push('σ debe ser mayor que cero.');
  else if (!(p > 0 && p < 1)) adv.push('p debe estar estrictamente entre 0 y 1.');
  if (adv.length) return resultadoInvalido(t, adv);
  const z = phiInv(p);
  const x = mu + z * sigma;
  return {
    titulo: t,
    formula: 'x=\\mu+z_p\\,\\sigma,\\quad z_p=\\Phi^{-1}(p)',
    sustitucion: `z_{${fmt(p)}}=${fmt(z, 4)};\\quad x=${fmt(mu)}+${pf(z)}\\cdot${fmt(sigma)}=${fmt(x)}`,
    pasos: [`Se busca z con Φ(z) = ${fmt(p)}: z = ${fmt(z, 4)}.`, 'Se des-estandariza: x = μ + zσ.'],
    valor: x,
    respuesta: `x = ${fmt(x, 2)} (P(X < x) = ${fmt(p)})`,
    interpretacion: `El ${fmt(p * 100, 2)} % de los valores es menor que ${fmt(x, 2)}.`,
    advertencias: [],
    z1: z,
  };
}
