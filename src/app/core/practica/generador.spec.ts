import { describe, expect, it } from 'vitest';
import { GeneradorService, ModuloPractica } from './generador.service';

describe('GeneradorService', () => {
  const g = new GeneradorService();
  const modulos: ModuloPractica[] = ['descriptiva', 'experimentales', 'tablas', 'probabilidad', 'regresion'];

  it('semilla igual → mismo ejercicio; distinta → distinto', () => {
    const a = g.generar('descriptiva', 'medio', 42);
    const b = g.generar('descriptiva', 'medio', 42);
    const c = g.generar('descriptiva', 'medio', 43);
    expect(a.enunciado).toBe(b.enunciado);
    expect(a.enunciado).not.toBe(c.enunciado);
  });

  it('cada módulo y dificultad genera ejercicios con respuesta finita', () => {
    for (const m of modulos) for (const d of ['facil', 'medio', 'dificil'] as const) for (let s = 1; s <= 30; s++) {
      const p = g.generar(m, d, s);
      expect(Number.isFinite(p.respuesta)).toBe(true);
      expect(g.calificar(p, String(p.respuesta).replace('.', ',')).estado).toBe('correcta');
    }
  });

  it('califica con tolerancia y coma decimal', () => {
    const p = g.generar('descriptiva', 'medio', 5);
    expect(g.calificar(p, String(p.respuesta + 1e-4)).estado).toBe('correcta');
    expect(g.calificar(p, String(p.respuesta + 5)).estado).toBe('incorrecta');
  });

  it('entrada inválida no se califica', () => {
    const p = g.generar('regresion', 'facil', 3);
    expect(g.calificar(p, 'abc').estado).toBe('invalida');
    expect(g.calificar(p, '').estado).toBe('invalida');
  });

  it('detecta confusión ÷N en desviación muestral', () => {
    for (let s = 1; s < 200; s++) {
      const p = g.generar('descriptiva', 'medio', s);
      if (p.enunciado.includes('desviación')) {
        const c = g.calificar(p, String(p.errores[0].valor));
        expect(c.pista).toContain('N');
        return;
      }
    }
    throw new Error('no se generó ejercicio de desviación');
  });
});
