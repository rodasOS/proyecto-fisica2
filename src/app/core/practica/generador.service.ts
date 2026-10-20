import { Injectable } from '@angular/core';
import { analizarDescriptiva, mediana } from '../stats/descriptiva';
import { analizarExperimental } from '../stats/experimental';
import { esTablaFrecuencias, tablaFrecuencias } from '../stats/frecuencias';
import { normalDirecta, normalInversa, probabilidadClasica } from '../stats/probabilidad';
import { analizarRegresion } from '../stats/regresion';
import { fmt, Resultado } from '../stats/resultado.model';
import { parsearNumeros } from '../parsers/numeros.parser';

export type ModuloPractica = 'descriptiva' | 'experimentales' | 'tablas' | 'probabilidad' | 'regresion';
export type Dificultad = 'facil' | 'medio' | 'dificil';

export interface Practica {
  semilla: number;
  modulo: ModuloPractica;
  dificultad: Dificultad;
  enunciado: string;
  datos?: number[];
  datosY?: number[];
  unidad?: string;
  respuesta: number;
  decimales: number;
  solucion: Resultado;
  /** Errores típicos: si la respuesta coincide con `valor`, se muestra `pista`. */
  errores: { valor: number; pista: string }[];
}

export interface Calificacion {
  estado: 'correcta' | 'incorrecta' | 'invalida';
  mensaje: string;
  pista?: string;
}

export function prng(semilla: number): () => number {
  let a = semilla >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const redondear = (x: number, d: number) => Number(x.toFixed(d));
const lista = (v: number[]) => v.map((x) => fmt(x, 3)).join(', ');

@Injectable({ providedIn: 'root' })
export class GeneradorService {
  nuevaSemilla(): number {
    return Math.floor(Math.random() * 2 ** 31);
  }

  generar(modulo: ModuloPractica, dificultad: Dificultad, semilla = this.nuevaSemilla()): Practica {
    const rnd = prng(semilla);
    const ent = (a: number, b: number) => a + Math.floor(rnd() * (b - a + 1));
    const n = dificultad === 'facil' ? ent(4, 5) : dificultad === 'medio' ? ent(6, 8) : ent(9, 12);
    const dec = dificultad === 'facil' ? 0 : dificultad === 'medio' ? 1 : 2;
    const base = [
      ['facil', 10, 5],
      ['medio', 20, 8],
      ['dificil', 50, 15],
    ].find((x) => x[0] === dificultad)!;
    const serie = (centro: number, amp: number, d = dec) =>
      Array.from({ length: n }, () => redondear(centro + (rnd() * 2 - 1) * amp, d));
    const resultado = (p: Omit<Practica, 'semilla' | 'modulo' | 'dificultad'>): Practica => ({ semilla, modulo, dificultad, ...p });

    switch (modulo) {
      case 'descriptiva': {
        const d = serie(base[1] as number, base[2] as number);
        const a = analizarDescriptiva(d)!;
        const k = ent(0, 2);
        if (k === 0)
          return resultado({
            enunciado: `Calcula la media de: ${lista(d)}.`, datos: d, respuesta: a.media, decimales: 3,
            solucion: a.medidas[0], errores: [{ valor: a.mediana, pista: 'Ese valor es la mediana, no la media.' }],
          });
        if (k === 1)
          return resultado({
            enunciado: `Calcula la mediana de: ${lista(d)}.`, datos: d, respuesta: mediana(d), decimales: 3,
            solucion: a.medidas[1], errores: [{ valor: a.media, pista: 'Ese valor es la media: la mediana es el dato central de la serie ordenada.' }],
          });
        return resultado({
          enunciado: `Calcula la desviación estándar muestral de: ${lista(d)}.`, datos: d, respuesta: a.desviacion, decimales: 3,
          solucion: a.medidas[4],
          errores: [
            { valor: a.desviacionPob, pista: 'Dividiste entre N (desviación poblacional). Para una muestra se divide entre n − 1.' },
            { valor: a.desviacion ** 2, pista: 'Ese valor es la varianza; falta sacar la raíz cuadrada.' },
          ],
        });
      }
      case 'experimentales': {
        const d = serie(base[1] as number / 10, base[2] as number / 20, 2);
        const e = analizarExperimental(d, 'A')!;
        return resultado({
          enunciado: `Mediciones de corriente (A): ${lista(d)}. Calcula la incertidumbre de la media u = s/√n (en A).`,
          datos: d, unidad: 'A', respuesta: e.errorEstandar, decimales: 3, solucion: e.resultados[0],
          errores: [{ valor: e.desviacion, pista: 'Ese valor es la desviación s; falta dividir entre √n.' }],
        });
      }
      case 'tablas': {
        const d = Array.from({ length: n + 10 }, () => redondear(base[1] as number + (rnd() * 2 - 1) * (base[2] as number), 1));
        const t = tablaFrecuencias(d, { clases: 4 });
        if (!esTablaFrecuencias(t)) throw new Error('tabla inválida');
        const maxF = Math.max(...t.clases.map((c) => c.f));
        return resultado({
          enunciado: `Con los datos ${lista(d)}, agrupa en 4 clases de igual amplitud (primera clase desde el mínimo, última clase cerrada). ¿Cuál es la frecuencia más alta?`,
          datos: d, respuesta: maxF, decimales: 0, solucion: t.resultado,
          errores: [{ valor: t.n, pista: 'Ese es el total de datos; se pide la frecuencia de la clase con más datos.' }],
        });
      }
      case 'probabilidad': {
        const k = ent(0, 2);
        if (k === 0) {
          const pos = ent(6, 40);
          const fav = ent(1, pos - 1);
          const r = probabilidadClasica(fav, pos);
          return resultado({
            enunciado: `En un experimento hay ${fav} casos favorables de ${pos} posibles igualmente probables. Calcula P(A) (decimal).`,
            respuesta: r.valor!, decimales: 3, solucion: r,
            errores: [{ valor: 1 - r.valor!, pista: 'Ese valor es el complemento P(Aᶜ).' }],
          });
        }
        const mu = ent(40, 120);
        const sigma = ent(4, 15);
        if (k === 1) {
          const tipo = rnd() < 0.5 ? 'mayor' : 'menor';
          const a = mu + Math.round((rnd() * 2 - 0.5) * sigma * 10) / 10;
          const r = normalDirecta(mu, sigma, tipo, a);
          return resultado({
            enunciado: `X ~ N(μ = ${mu}, σ = ${sigma}). Calcula P(X ${tipo === 'mayor' ? '>' : '<'} ${a}).`,
            respuesta: r.valor!, decimales: 3, solucion: r,
            errores: [{ valor: 1 - r.valor!, pista: 'Ese valor es el de la cola contraria: revisa si pedían menor o mayor que.' }],
          });
        }
        const p = [0.9, 0.95, 0.975, 0.99, 0.8][ent(0, 4)];
        const r = normalInversa(mu, sigma, p);
        return resultado({
          enunciado: `X ~ N(μ = ${mu}, σ = ${sigma}). Halla x tal que P(X < x) = ${p}.`,
          respuesta: r.valor!, decimales: 1, solucion: r,
          errores: [{ valor: r.z1!, pista: 'Ese valor es z; falta des-estandarizar con x = μ + zσ.' }],
        });
      }
      case 'regresion': {
        const x = Array.from({ length: n }, (_, i) => i + 1);
        const pend = redondear((rnd() * 2 - 0.5) * 3 + 0.5, 1) || 1;
        const y = x.map((v) => redondear(ent(1, 10) + pend * v + (rnd() - 0.5) * 2, 1));
        const r = analizarRegresion(x, y) as Exclude<ReturnType<typeof analizarRegresion>, { errores: string[] }>;
        if (rnd() < 0.5)
          return resultado({
            enunciado: `X = ${lista(x)}; Y = ${lista(y)}. Calcula el coeficiente de correlación r.`,
            datos: x, datosY: y, respuesta: r.r, decimales: 3, solucion: r.medidas[0],
            errores: [{ valor: r.r2, pista: 'Ese valor es r², falta la raíz (con el signo de la pendiente).' }],
          });
        return resultado({
          enunciado: `X = ${lista(x)}; Y = ${lista(y)}. Calcula la pendiente b de la recta de regresión ŷ = a + bx.`,
          datos: x, datosY: y, respuesta: r.pendiente, decimales: 3, solucion: r.medidas[1],
          errores: [{ valor: r.r, pista: 'Ese valor es r; la pendiente es b = Sxy / Sxx.' }],
        });
      }
    }
  }

  calificar(p: Practica, texto: string): Calificacion {
    const t = parsearNumeros(texto);
    if (t.valores.length !== 1 || t.invalidos.length) {
      return { estado: 'invalida', mensaje: 'Escribe un solo número como respuesta (punto o coma decimal).' };
    }
    const v = t.valores[0];
    const tol = Math.max(Math.abs(p.respuesta) * 0.005, 0.5 * Math.pow(10, -p.decimales) * 1.01);
    if (Math.abs(v - p.respuesta) <= tol) {
      return { estado: 'correcta', mensaje: `¡Correcto! El valor exacto es ${fmt(p.respuesta, Math.max(p.decimales, 4))}.` };
    }
    const error = p.errores.find((e) => Math.abs(v - e.valor) <= Math.max(Math.abs(e.valor) * 0.005, 0.5 * Math.pow(10, -p.decimales) * 1.01));
    return {
      estado: 'incorrecta',
      mensaje: `Incorrecto. La respuesta esperada era ${fmt(p.respuesta, Math.max(p.decimales, 4))}.`,
      pista: error?.pista,
    };
  }
}
