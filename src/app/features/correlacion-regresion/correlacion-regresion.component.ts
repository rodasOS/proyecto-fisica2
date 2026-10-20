import { Component, inject, signal } from '@angular/core';
import { ChartConfiguration } from 'chart.js';
import { validarSerie } from '../../core/parsers/numeros.parser';
import { DatosService } from '../../core/estado/datos.service';
import { AnalisisRegresion, analizarRegresion } from '../../core/stats/regresion';
import { Ejemplo } from '../../data/ejemplos';
import { AvisosComponent, CajaResultadoComponent } from '../../shared/caja-resultado/caja-resultado.component';
import { EntradaDatosComponent } from '../../shared/entrada-datos/entrada-datos.component';
import { EjemplosComponent } from '../../shared/ejemplos/ejemplos.component';
import { GraficoComponent } from '../../shared/grafico/grafico.component';
import { dispersionConfig } from '../../shared/grafico/configs';

@Component({
  selector: 'app-correlacion-regresion',
  imports: [EntradaDatosComponent, CajaResultadoComponent, AvisosComponent, EjemplosComponent, GraficoComponent],
  template: `
    <h2>Correlación y regresión lineal simple</h2>
    <p class="lead">Coeficiente de correlación r, r², recta de mínimos cuadrados, predicción e interpretación.</p>
    <app-ejemplos modulo="regresion" (elegir)="aplicar($event)" />
    <div class="panel">
      <div class="dos">
        <app-entrada-datos [(texto)]="d.x" etiqueta="Valores de X" placeholder="1 2 3 4 5" [filas]="2" ayuda="Variable independiente." />
        <app-entrada-datos [(texto)]="d.y" etiqueta="Valores de Y" placeholder="2 4 5 4 5" [filas]="2" ayuda="Variable dependiente (misma cantidad que X)." />
      </div>
      <div class="fila">
        <label class="campo corto"><span class="etiqueta">Unidad de X</span><input type="text" [value]="ux()" (input)="ux.set($any($event.target).value)" /></label>
        <label class="campo corto"><span class="etiqueta">Unidad de Y</span><input type="text" [value]="uy()" (input)="uy.set($any($event.target).value)" /></label>
        <label class="campo corto"><span class="etiqueta">Predecir ŷ para x = (opcional)</span><input type="text" [value]="xp()" (input)="xp.set($any($event.target).value)" /></label>
        <button type="button" class="primario" (click)="calcular()">Calcular</button>
      </div>
    </div>
    <app-avisos [mensajes]="errores()" tipo="error" />
    <app-avisos [mensajes]="avisos()" />
    @if (salida(); as s) {
      @for (m of s.medidas; track m.titulo) { <app-caja-resultado [resultado]="m" /> }
      <div class="caja"><app-grafico [config]="grafica()!" descripcion="Dispersión con recta de regresión" /></div>
    }
  `,
})
export class CorrelacionRegresionComponent {
  protected readonly d = inject(DatosService);
  protected readonly ux = signal('');
  protected readonly uy = signal('');
  protected readonly xp = signal('');
  protected readonly errores = signal<string[]>([]);
  protected readonly avisos = signal<string[]>([]);
  protected readonly salida = signal<AnalisisRegresion | null>(null);
  protected readonly grafica = signal<ChartConfiguration | null>(null);

  aplicar(e: Ejemplo): void {
    this.d.x.set(e.params['x']);
    this.d.y.set(e.params['y']);
    this.ux.set(e.params['unidadX'] ?? '');
    this.uy.set(e.params['unidadY'] ?? '');
    this.xp.set(e.params['xPred'] ?? '');
    this.calcular();
  }

  calcular(): void {
    this.salida.set(null);
    const px = validarSerie(this.d.x(), 1, 'valores de X');
    const py = validarSerie(this.d.y(), 1, 'valores de Y');
    const errs = [...px.errores.map((e) => 'X: ' + e), ...py.errores.map((e) => 'Y: ' + e)];
    this.avisos.set([...px.avisos, ...py.avisos]);
    let xPred: number | undefined;
    if (this.xp().trim()) {
      const q = validarSerie(this.xp(), 1);
      if (q.errores.length || q.valores.length !== 1) errs.push('El valor a predecir debe ser un único número.');
      else xPred = q.valores[0];
    }
    if (errs.length) { this.errores.set(errs); return; }
    try {
      const r = analizarRegresion(px.valores, py.valores, { unidadX: this.ux().trim() || undefined, unidadY: this.uy().trim() || undefined, xPred });
      if ('errores' in r) { this.errores.set(r.errores); return; }
      this.errores.set([]);
      this.salida.set(r);
      this.grafica.set(dispersionConfig(px.valores, py.valores, { a: r.intercepto, b: r.pendiente }, this.ux().trim(), this.uy().trim()));
    } catch {
      this.errores.set(['No se pudo resolver este caso. Revisa los datos e inténtalo de nuevo.']);
    }
  }
}
