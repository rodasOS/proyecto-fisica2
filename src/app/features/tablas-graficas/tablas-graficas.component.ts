import { Component, computed, inject, signal } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { validarSerie } from '../../core/parsers/numeros.parser';
import { DatosService } from '../../core/estado/datos.service';
import { esTablaFrecuencias, tablaFrecuencias, TablaFrecuencias } from '../../core/stats/frecuencias';
import { analizarRegresion, AnalisisRegresion, validarPares } from '../../core/stats/regresion';
import { Resultado } from '../../core/stats/resultado.model';
import { Ejemplo } from '../../data/ejemplos';
import { AvisosComponent, CajaResultadoComponent } from '../../shared/caja-resultado/caja-resultado.component';
import { EntradaDatosComponent, SelectorUnidadComponent } from '../../shared/entrada-datos/entrada-datos.component';
import { EjemplosComponent } from '../../shared/ejemplos/ejemplos.component';
import { GraficoComponent } from '../../shared/grafico/grafico.component';
import { dispersionConfig, histogramaConfig } from '../../shared/grafico/configs';

@Component({
  selector: 'app-tablas-graficas',
  imports: [EntradaDatosComponent, SelectorUnidadComponent, CajaResultadoComponent, AvisosComponent, EjemplosComponent, GraficoComponent],
  template: `
    <h2>Tablas y gráficas</h2>
    <p class="lead">Tabla de frecuencias con histograma, y diagrama de dispersión con la recta de regresión.</p>

    <h3>Tabla de frecuencias e histograma</h3>
    <app-ejemplos modulo="tablas" (elegir)="aplicar($event)" />
    <div class="panel">
      <app-entrada-datos [(texto)]="d.datos" />
      <div class="fila">
        <app-selector-unidad [(unidad)]="d.unidad" />
        <label class="campo corto"><span class="etiqueta">N.º de clases (vacío = Sturges)</span>
          <input type="text" inputmode="numeric" [value]="clases()" (input)="clases.set($any($event.target).value)" /></label>
        <label class="campo corto"><span class="etiqueta">Amplitud (opcional)</span>
          <input type="text" [value]="amplitud()" (input)="amplitud.set($any($event.target).value)" /></label>
        <button type="button" class="primario" (click)="calcular()">Construir tabla</button>
      </div>
    </div>
    <app-avisos [mensajes]="errores()" tipo="error" />
    <app-avisos [mensajes]="avisos()" />
    @if (tabla(); as t) {
      <app-caja-resultado [resultado]="t.resultado" />
      <div class="caja"><app-grafico [config]="histograma()!" descripcion="Histograma de frecuencias" /></div>
    }

    <h3 class="sep">Diagrama de dispersión</h3>
    <div class="panel">
      <div class="dos">
        <app-entrada-datos [(texto)]="d.x" etiqueta="Valores de X" placeholder="1 2 3 4 5" [filas]="2" ayuda="Misma cantidad de valores que Y." />
        <app-entrada-datos [(texto)]="d.y" etiqueta="Valores de Y" placeholder="2 4 5 4 5" [filas]="2" ayuda="Misma cantidad de valores que X." />
      </div>
      <div class="fila">
        <label class="casilla"><input type="checkbox" [checked]="recta()" (change)="recta.set($any($event.target).checked)" /> Mostrar recta de regresión</label>
        <button type="button" class="primario" (click)="dispersar()">Graficar</button>
      </div>
    </div>
    <app-avisos [mensajes]="errDisp()" tipo="error" />
    @if (dispersion(); as c) {
      <div class="caja"><app-grafico [config]="c" descripcion="Diagrama de dispersión" /></div>
      @if (reg(); as r) { <app-caja-resultado [resultado]="r" /> }
    }
  `,
})
export class TablasGraficasComponent {
  protected readonly d = inject(DatosService);
  protected readonly clases = signal('');
  protected readonly amplitud = signal('');
  protected readonly errores = signal<string[]>([]);
  protected readonly avisos = signal<string[]>([]);
  protected readonly tabla = signal<TablaFrecuencias | null>(null);
  protected readonly histograma = computed<ChartConfiguration | null>(() => {
    const t = this.tabla();
    return t ? histogramaConfig(t.clases, this.d.unidad().trim()) : null;
  });
  protected readonly recta = signal(true);
  protected readonly errDisp = signal<string[]>([]);
  protected readonly dispersion = signal<ChartConfiguration | null>(null);
  protected readonly reg = signal<Resultado | null>(null);

  aplicar(e: Ejemplo): void {
    this.d.datos.set(e.params['datos']);
    this.clases.set(e.params['clases'] ?? '');
    this.amplitud.set('');
    this.calcular();
  }

  calcular(): void {
    this.tabla.set(null);
    const p = validarSerie(this.d.datos(), 2);
    const errs = [...p.errores];
    this.avisos.set(p.avisos);
    const opc: { clases?: number; amplitud?: number } = {};
    if (this.clases().trim()) {
      const k = Number(this.clases().replace(',', '.'));
      if (!Number.isFinite(k)) errs.push('El número de clases debe ser un número.');
      else opc.clases = k;
    }
    if (this.amplitud().trim()) {
      const w = Number(this.amplitud().replace(',', '.'));
      if (!Number.isFinite(w)) errs.push('La amplitud debe ser un número.');
      else opc.amplitud = w;
    }
    if (errs.length) { this.errores.set(errs); return; }
    try {
      const t = tablaFrecuencias(p.valores, opc);
      if (esTablaFrecuencias(t)) { this.errores.set([]); this.tabla.set(t); }
      else this.errores.set(t.advertencias);
    } catch {
      this.errores.set(['No se pudo resolver este caso. Revisa los datos e inténtalo de nuevo.']);
    }
  }

  dispersar(): void {
    this.dispersion.set(null);
    this.reg.set(null);
    const px = validarSerie(this.d.x(), 1, 'valores de X');
    const py = validarSerie(this.d.y(), 1, 'valores de Y');
    const errs = [...px.errores.map((e) => 'X: ' + e), ...py.errores.map((e) => 'Y: ' + e)];
    if (!errs.length) {
      if (px.valores.length !== py.valores.length) errs.push(...validarPares(px.valores, py.valores));
      else if (px.valores.length < 2) errs.push('Se necesitan al menos 2 pares para graficar.');
    }
    this.errDisp.set(errs);
    if (errs.length) return;
    try {
      let rectaC: { a: number; b: number } | undefined;
      if (this.recta()) {
        const r = analizarRegresion(px.valores, py.valores);
        if ('errores' in r) this.errDisp.set(['No se dibuja la recta: ' + r.errores[0]]);
        else {
          rectaC = { a: r.intercepto, b: r.pendiente };
          this.reg.set((r as AnalisisRegresion).medidas[1]);
        }
      }
      this.dispersion.set(dispersionConfig(px.valores, py.valores, rectaC));
    } catch {
      this.errDisp.set(['No se pudo resolver este caso. Revisa los datos e inténtalo de nuevo.']);
    }
  }
}
