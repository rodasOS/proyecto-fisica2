import { Component, inject, signal } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { validarSerie } from '../../core/parsers/numeros.parser';
import { DatosService } from '../../core/estado/datos.service';
import { desviacion, media } from '../../core/stats/descriptiva';
import {
  normalDirecta, normalInversa, probabilidadClasica, probabilidadCondicional, probabilidadUnion, TipoNormal,
} from '../../core/stats/probabilidad';
import { fmt, Resultado } from '../../core/stats/resultado.model';
import { Ejemplo } from '../../data/ejemplos';
import { AvisosComponent, CajaResultadoComponent } from '../../shared/caja-resultado/caja-resultado.component';
import { EjemplosComponent } from '../../shared/ejemplos/ejemplos.component';
import { GraficoComponent } from '../../shared/grafico/grafico.component';
import { campanaConfig } from '../../shared/grafico/configs';

type Modo = 'clasica' | 'union' | 'condicional' | 'normal' | 'inversa';

@Component({
  selector: 'app-probabilidad',
  imports: [CajaResultadoComponent, AvisosComponent, EjemplosComponent, GraficoComponent],
  template: `
    <h2>Probabilidad y distribución normal</h2>
    <p class="lead">Probabilidad básica y problemas con la normal: estandarización, áreas y valores inversos.</p>
    <app-ejemplos modulo="probabilidad" (elegir)="aplicar($event)" />
    <div class="panel">
      <label class="campo">
        <span class="etiqueta">Tipo de problema</span>
        <select [value]="modo()" (change)="cambiarModo($any($event.target).value)">
          <option value="clasica">Probabilidad clásica (favorables / posibles)</option>
          <option value="union">Unión de eventos P(A∪B)</option>
          <option value="condicional">Probabilidad condicional P(A|B)</option>
          <option value="normal">Normal: P(X&lt;a), P(X&gt;a), P(a&lt;X&lt;b)</option>
          <option value="inversa">Normal inversa: x con P(X&lt;x) = p</option>
        </select>
      </label>
      <div class="fila">
        @switch (modo()) {
          @case ('clasica') {
            <label class="campo corto"><span class="etiqueta">Casos favorables</span><input type="text" [value]="f('favorables')" (input)="s('favorables', $event)" /></label>
            <label class="campo corto"><span class="etiqueta">Casos posibles</span><input type="text" [value]="f('posibles')" (input)="s('posibles', $event)" /></label>
          }
          @case ('union') {
            <label class="campo corto"><span class="etiqueta">P(A)</span><input type="text" [value]="f('pA')" (input)="s('pA', $event)" /></label>
            <label class="campo corto"><span class="etiqueta">P(B)</span><input type="text" [value]="f('pB')" (input)="s('pB', $event)" /></label>
            <label class="campo corto"><span class="etiqueta">P(A∩B)</span><input type="text" [value]="f('pAB')" (input)="s('pAB', $event)" /></label>
          }
          @case ('condicional') {
            <label class="campo corto"><span class="etiqueta">P(A∩B)</span><input type="text" [value]="f('pAB')" (input)="s('pAB', $event)" /></label>
            <label class="campo corto"><span class="etiqueta">P(B)</span><input type="text" [value]="f('pB')" (input)="s('pB', $event)" /></label>
          }
          @default {
            <label class="campo corto"><span class="etiqueta">Media μ</span><input type="text" [value]="f('mu')" (input)="s('mu', $event)" /></label>
            <label class="campo corto"><span class="etiqueta">Desviación σ</span><input type="text" [value]="f('sigma')" (input)="s('sigma', $event)" /></label>
            <button type="button" class="secundario" (click)="usarSerie()" title="Usa la media y la desviación muestral de la serie cargada en Descriptiva">Usar mi serie</button>
          }
        }
      </div>
      @if (modo() === 'normal') {
        <div class="fila">
          <label class="campo corto"><span class="etiqueta">Pregunta</span>
            <select [value]="tipo()" (change)="tipo.set($any($event.target).value)">
              <option value="menor">P(X &lt; a)</option><option value="mayor">P(X &gt; a)</option><option value="entre">P(a &lt; X &lt; b)</option>
            </select></label>
          <label class="campo corto"><span class="etiqueta">a</span><input type="text" [value]="f('a')" (input)="s('a', $event)" /></label>
          @if (tipo() === 'entre') {
            <label class="campo corto"><span class="etiqueta">b</span><input type="text" [value]="f('b')" (input)="s('b', $event)" /></label>
          }
        </div>
      }
      @if (modo() === 'inversa') {
        <div class="fila">
          <label class="campo corto"><span class="etiqueta">p (entre 0 y 1)</span><input type="text" [value]="f('p')" (input)="s('p', $event)" /></label>
        </div>
      }
      <div class="fila"><button type="button" class="primario" (click)="calcular()">Calcular</button></div>
    </div>
    <app-avisos [mensajes]="errores()" tipo="error" />
    <app-avisos [mensajes]="avisos()" />
    @if (salida(); as r) { <app-caja-resultado [resultado]="r" /> }
    @if (grafica(); as g) { <div class="caja"><app-grafico [config]="g" descripcion="Curva normal con el área calculada sombreada" /></div> }
  `,
})
export class ProbabilidadComponent {
  private readonly datos = inject(DatosService);
  protected readonly modo = signal<Modo>('normal');
  protected readonly tipo = signal<TipoNormal>('mayor');
  protected readonly campos = signal<Record<string, string>>({ mu: '100', sigma: '15', a: '115', b: '', p: '0.975', favorables: '3', posibles: '12', pA: '0.5', pB: '0.3', pAB: '0.1' });
  protected readonly errores = signal<string[]>([]);
  protected readonly avisos = signal<string[]>([]);
  protected readonly salida = signal<Resultado | null>(null);
  protected readonly grafica = signal<ChartConfiguration | null>(null);

  protected f(k: string): string { return this.campos()[k] ?? ''; }
  protected s(k: string, ev: Event): void { this.campos.update((c) => ({ ...c, [k]: (ev.target as HTMLInputElement).value })); }

  cambiarModo(m: Modo): void {
    this.modo.set(m);
    this.salida.set(null);
    this.grafica.set(null);
    this.errores.set([]);
  }

  aplicar(e: Ejemplo): void {
    const p = e.params;
    this.modo.set((p['modo'] as Modo) ?? 'normal');
    if (p['tipo']) this.tipo.set(p['tipo'] as TipoNormal);
    this.campos.update((c) => ({ ...c, ...p }));
    this.calcular();
  }

  usarSerie(): void {
    const p = validarSerie(this.datos.datos(), 2, 'datos en el módulo Descriptiva');
    if (p.errores.length) {
      this.errores.set(['Para usar tu serie, cárgala primero en Descriptiva o Datos experimentales. ' + p.errores[0]]);
      return;
    }
    this.errores.set([]);
    this.campos.update((c) => ({ ...c, mu: fmt(media(p.valores), 6), sigma: fmt(desviacion(p.valores, false), 6) }));
    this.avisos.set(['μ y σ se estimaron con la media y la desviación muestral de tu serie (son estimaciones).']);
  }

  /** Lee un campo numérico; null si está vacío o no es número. */
  private num(k: string, etiqueta: string, errs: string[], opcional = false): number {
    const t = this.f(k).trim().replace(',', '.');
    if (t === '') { if (!opcional) errs.push(`Falta el dato: ${etiqueta}.`); return NaN; }
    const n = Number(t);
    if (!Number.isFinite(n)) { errs.push(`"${this.f(k)}" no es un número válido (${etiqueta}).`); return NaN; }
    return n;
  }

  calcular(): void {
    this.salida.set(null);
    this.grafica.set(null);
    this.avisos.set([]);
    const errs: string[] = [];
    try {
      let r: Resultado | undefined;
      const m = this.modo();
      if (m === 'clasica') {
        const fav = this.num('favorables', 'casos favorables', errs);
        const pos = this.num('posibles', 'casos posibles', errs);
        if (!errs.length) r = probabilidadClasica(fav, pos);
      } else if (m === 'union') {
        const a = this.num('pA', 'P(A)', errs), b = this.num('pB', 'P(B)', errs), ab = this.num('pAB', 'P(A∩B)', errs);
        if (!errs.length) r = probabilidadUnion(a, b, ab);
      } else if (m === 'condicional') {
        const ab = this.num('pAB', 'P(A∩B)', errs), b = this.num('pB', 'P(B)', errs);
        if (!errs.length) r = probabilidadCondicional(ab, b);
      } else {
        const mu = this.num('mu', 'μ', errs), sg = this.num('sigma', 'σ', errs);
        if (m === 'normal') {
          const a = this.num('a', 'a', errs);
          const b = this.tipo() === 'entre' ? this.num('b', 'b', errs) : undefined;
          if (!errs.length) {
            const n = normalDirecta(mu, sg, this.tipo(), a, b);
            r = n;
            if (n.valor !== undefined) {
              const lo = this.tipo() === 'menor' ? -Infinity : a;
              const hi = this.tipo() === 'mayor' ? Infinity : (b as number);
              this.grafica.set(campanaConfig(mu, sg, lo, hi));
            }
          }
        } else {
          const p = this.num('p', 'p', errs);
          if (!errs.length) {
            const n = normalInversa(mu, sg, p);
            r = n;
            if (n.valor !== undefined) this.grafica.set(campanaConfig(mu, sg, -Infinity, n.valor));
          }
        }
      }
      if (errs.length) { this.errores.set(errs); return; }
      if (r && r.valor === undefined) { this.errores.set(r.advertencias); return; }
      this.errores.set([]);
      this.salida.set(r ?? null);
    } catch {
      this.errores.set(['No se pudo resolver este caso. Revisa los datos e inténtalo de nuevo.']);
    }
  }
}
