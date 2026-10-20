import { describe, expect, it } from 'vitest';
import { parsearNumeros } from '../core/parsers/numeros.parser';
import { analizarDescriptiva } from '../core/stats/descriptiva';
import { analizarExperimental } from '../core/stats/experimental';
import { esTablaFrecuencias, tablaFrecuencias } from '../core/stats/frecuencias';
import { normalDirecta, normalInversa, probabilidadClasica } from '../core/stats/probabilidad';
import { analizarRegresion } from '../core/stats/regresion';
import { EJEMPLOS } from './ejemplos';

const nums = (t: string) => parsearNumeros(t).valores;

describe('ejemplos', () => {
  it('hay al menos 10 y cubren todos los módulos', () => {
    expect(EJEMPLOS.length).toBeGreaterThanOrEqual(10);
    expect(new Set(EJEMPLOS.map((e) => e.modulo))).toEqual(new Set(['descriptiva', 'experimentales', 'tablas', 'probabilidad', 'regresion']));
    expect(EJEMPLOS.some((e) => e.id === 'corriente')).toBe(true);
  });

  for (const e of EJEMPLOS) {
    it(`${e.id} se resuelve sin advertencias de error`, () => {
      const p = e.params;
      if (e.modulo === 'descriptiva') expect(analizarDescriptiva(nums(p['datos']))!.medidas.every((m) => m.valor !== undefined || m.titulo.includes('Moda'))).toBe(true);
      else if (e.modulo === 'experimentales') {
        const a = analizarExperimental(nums(p['datos']), p['unidad'], Number(p['referencia']))!;
        expect(a.resultados.every((r) => r.valor !== undefined)).toBe(true);
      } else if (e.modulo === 'tablas') expect(esTablaFrecuencias(tablaFrecuencias(nums(p['datos'])))).toBe(true);
      else if (e.modulo === 'regresion') expect('errores' in analizarRegresion(nums(p['x']), nums(p['y']))).toBe(false);
      else if (p['modo'] === 'clasica') expect(probabilidadClasica(+p['favorables'], +p['posibles']).valor).toBeDefined();
      else if (p['modo'] === 'inversa') expect(normalInversa(+p['mu'], +p['sigma'], +p['p']).valor).toBeDefined();
      else expect(normalDirecta(+p['mu'], +p['sigma'], p['tipo'] as any, +p['a'], +p['b']).valor).toBeDefined();
    });
  }
});
