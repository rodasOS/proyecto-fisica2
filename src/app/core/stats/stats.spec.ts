import { describe, expect, it } from 'vitest';
import { CASOS, CDFZ, INVERSA, NORMAL } from './fixtures';
import { analizarDescriptiva } from './descriptiva';
import { analizarExperimental, convertir } from './experimental';
import { esTablaFrecuencias, tablaFrecuencias } from './frecuencias';
import { normalDirecta, normalInversa, phi, phiInv, probabilidadClasica, probabilidadUnion } from './probabilidad';
import { analizarRegresion, fuerzaCorrelacion } from './regresion';
import { parsearNumeros } from '../parsers/numeros.parser';
import { fmt } from './resultado.model';

describe('parser', () => {
  it('separadores mixtos y coma decimal', () => {
    expect(parsearNumeros('2.1, 2.3 2,2\n2.4; 2.0').valores).toEqual([2.1, 2.3, 2.2, 2.4, 2.0]);
  });
  it('notación científica', () => {
    expect(parsearNumeros('1.5e-3 2e2').valores).toEqual([0.0015, 200]);
  });
  it('token inválido con posición', () => {
    const p = parsearNumeros('3, 4, abc, 5');
    expect(p.invalidos).toEqual([{ token: 'abc', posicion: 3 }]);
  });
  it('vacío', () => {
    expect(parsearNumeros('  ').valores).toEqual([]);
  });
});

describe('fmt', () => {
  it('quita ceros y redondea', () => {
    expect(fmt(2.2)).toBe('2.2');
    expect(fmt(0.158113883)).toBe('0.1581');
    expect(fmt(-8.88e-16)).toBe('0');
  });
});

describe('descriptiva', () => {
  it('ejemplo de la corriente', () => {
    const a = analizarDescriptiva([2.1, 2.3, 2.2, 2.4, 2.0])!;
    expect(a.media).toBeCloseTo(2.2, 12);
    expect(a.desviacion).toBeCloseTo(0.1581138830084189, 12);
    expect(a.desviacionPob).toBeCloseTo(0.1414213562, 9);
  });
  it('serie 2,4,4,4,5,5,7,9', () => {
    const a = analizarDescriptiva([2, 4, 4, 4, 5, 5, 7, 9])!;
    expect(a.media).toBe(5);
    expect(a.mediana).toBe(4.5);
    expect(a.modas).toEqual([4]);
    expect(a.rango).toBe(7);
    expect(a.desviacionPob).toBeCloseTo(2, 12);
    expect(a.desviacion).toBeCloseTo(2.1380899353, 9);
  });
  it('amodal y multimodal', () => {
    expect(analizarDescriptiva([1, 2, 3])!.modas).toEqual([]);
    expect(analizarDescriptiva([1, 1, 2, 2, 3])!.modas).toEqual([1, 2]);
  });
  it('n=1 advierte desviación muestral', () => {
    const a = analizarDescriptiva([5])!;
    const m = a.medidas.find((x) => x.titulo.startsWith('Varianza'))!;
    expect(m.valor).toBeUndefined();
    expect(m.advertencias.join(' ')).toContain('n ≥ 2');
  });
  it('atípicos', () => {
    expect(analizarDescriptiva([1, 2, 2, 3, 3, 3, 4, 4, 100])!.atipicos).toEqual([100]);
  });
  it('opción poblacional cambia divisor', () => {
    const a = analizarDescriptiva([2, 4, 4, 4, 5, 5, 7, 9], { poblacional: true })!;
    expect(a.desviacion).toBeCloseTo(2, 12);
    expect(a.medidas[4].sustitucion).toContain('8');
  });
  for (const [i, c] of CASOS.entries()) {
    it(`caso aleatorio ${i + 1} contra Python`, () => {
      const a = analizarDescriptiva(c.d)!;
      expect(a.media).toBeCloseTo(c.mean, 9);
      expect(a.mediana).toBeCloseTo(c.median, 9);
      expect(a.desviacion).toBeCloseTo(c.sd, 9);
      expect(a.desviacionPob).toBeCloseTo(c.pd, 9);
      expect(a.q1).toBeCloseTo(c.q1, 9);
      expect(a.q3).toBeCloseTo(c.q3, 9);
    });
    it(`regresión aleatoria ${i + 1} contra Python`, () => {
      const r = analizarRegresion(c.d, c.e) as any;
      expect(r.r).toBeCloseTo(c.r, 9);
      expect(r.pendiente).toBeCloseTo(c.b, 9);
      expect(r.intercepto).toBeCloseTo(c.a, 9);
    });
  }
});

describe('experimental', () => {
  it('reporte de corriente', () => {
    const a = analizarExperimental([2.1, 2.3, 2.2, 2.4, 2.0], 'A', 2.5)!;
    expect(a.errorEstandar).toBeCloseTo(0.0707106781, 9);
    expect(a.reporte).toBe('2.20 ± 0.07 A');
    expect(a.resultados[2].valor).toBeCloseTo(12, 9);
  });
  it('conversión', () => {
    expect(convertir(250, 'mA', 'A').valor).toBeCloseTo(0.25, 12);
    expect(convertir(1, 'V', 'm').valor).toBeUndefined();
    expect(convertir(1, 'V', 'm').advertencias[0]).toContain('no son compatibles');
  });
});

describe('frecuencias', () => {
  it('Sturges y suma de frecuencias', () => {
    const datos = Array.from({ length: 30 }, (_, i) => (i * 7) % 23 + 1);
    const t = tablaFrecuencias(datos);
    expect(esTablaFrecuencias(t)).toBe(true);
    if (esTablaFrecuencias(t)) {
      expect(t.k).toBe(6);
      expect(t.clases.reduce((s, c) => s + c.f, 0)).toBe(30);
      expect(t.clases[t.k - 1].fa).toBe(30);
    }
  });
  it('clases manuales cubren todo', () => {
    const t = tablaFrecuencias([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], { clases: 5 });
    if (esTablaFrecuencias(t)) {
      expect(t.k).toBe(5);
      expect(t.clases.map((c) => c.f)).toEqual([2, 2, 2, 2, 2]);
    } else throw new Error('esperaba tabla');
  });
  it('rango cero advierte', () => {
    const t = tablaFrecuencias([3, 3, 3]);
    expect(esTablaFrecuencias(t)).toBe(false);
    expect((t as any).advertencias[0]).toContain('rango es 0');
  });
});

describe('probabilidad', () => {
  it('clásica y unión', () => {
    expect(probabilidadClasica(3, 12).valor).toBe(0.25);
    expect(probabilidadUnion(0.5, 0.3, 0.1).valor).toBeCloseTo(0.7, 12);
    expect(probabilidadUnion(1.5, 0.3, 0.1).advertencias.length).toBe(1);
  });
  it('normal directa conocida', () => {
    expect(normalDirecta(100, 15, 'mayor', 115).valor).toBeCloseTo(0.15865525393, 9);
    expect(normalDirecta(0, 1, 'entre', -1.96, 1.96).valor).toBeCloseTo(0.9500042097, 9);
    expect(normalInversa(100, 15, 0.975).valor).toBeCloseTo(129.39946, 4);
  });
  it('σ ≤ 0 advierte', () => {
    expect(normalDirecta(0, 0, 'menor', 1).valor).toBeUndefined();
  });
  for (const c of CDFZ) it(`Φ(${c.z}) contra Python`, () => expect(phi(c.z)).toBeCloseTo(c.p, 12));
  for (const c of INVERSA) it(`Φ⁻¹(${c.p}) contra Python`, () => expect(phiInv(c.p)).toBeCloseTo(c.z, 8));
  for (const c of NORMAL) it(`N(50,8) en ${c.x} contra Python`, () => expect(normalDirecta(c.mu, c.s, 'menor', c.x).valor).toBeCloseTo(c.cdf, 12));
});

describe('regresión', () => {
  it('ejemplo X=1..5', () => {
    const r = analizarRegresion([1, 2, 3, 4, 5], [2, 4, 5, 4, 5], { xPred: 3 }) as any;
    expect(r.r).toBeCloseTo(0.7745966692, 9);
    expect(r.r2).toBeCloseTo(0.6, 12);
    expect(r.pendiente).toBeCloseTo(0.6, 12);
    expect(r.intercepto).toBeCloseTo(2.2, 12);
    expect(r.prediccion).toBeCloseTo(4, 12);
  });
  it('extrapolación advierte', () => {
    const r = analizarRegresion([1, 2, 3, 4, 5], [2, 4, 5, 4, 5], { xPred: 20 }) as any;
    expect(r.medidas[2].advertencias[0]).toContain('extrapolación');
  });
  it('fuerza de correlación', () => {
    expect(fuerzaCorrelacion(0.93)).toBe('fuerte');
    expect(fuerzaCorrelacion(0.98)).toBe('muy fuerte');
    expect(fuerzaCorrelacion(-0.7)).toBe('fuerte');
    const r = analizarRegresion([1, 2, 3, 4, 5], [2, 4, 5, 4, 5], { unidadX: 'V', unidadY: 'A' }) as any;
    expect(r.medidas[0].interpretacion).toContain('positiva fuerte');
    expect(r.medidas[1].interpretacion).toContain('0.6 A');
  });
  it('casos degenerados', () => {
    expect((analizarRegresion([1, 1, 1], [1, 2, 3]) as any).errores[0]).toContain('X son iguales');
    expect((analizarRegresion([1, 2, 3], [1, 2]) as any).errores[0]).toContain('misma cantidad');
    expect((analizarRegresion([1, 2], [1, 2]) as any).errores[0]).toContain('al menos 3');
  });
});
