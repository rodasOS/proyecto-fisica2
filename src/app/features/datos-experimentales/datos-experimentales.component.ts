import { Component, inject, signal } from '@angular/core';
import { validarSerie } from '../../core/parsers/numeros.parser';
import { DatosService } from '../../core/estado/datos.service';
import { AnalisisExperimental, analizarExperimental, convertir, LISTA_UNIDADES } from '../../core/stats/experimental';
import { Resultado } from '../../core/stats/resultado.model';
import { Ejemplo } from '../../data/ejemplos';
import { AvisosComponent, CajaResultadoComponent } from '../../shared/caja-resultado/caja-resultado.component';
import { EntradaDatosComponent, SelectorUnidadComponent } from '../../shared/entrada-datos/entrada-datos.component';
import { EjemplosComponent } from '../../shared/ejemplos/ejemplos.component';

@Component({
  selector: 'app-datos-experimentales',
  imports: [EntradaDatosComponent, SelectorUnidadComponent, CajaResultadoComponent, AvisosComponent, EjemplosComponent],
  template: `
    <h2>Datos experimentales</h2>
    <p class="lead">Procesa series de mediciones con unidades: media, incertidumbre de la media (s/√n), cifras significativas y error porcentual.</p>
    <app-ejemplos modulo="experimentales" (elegir)="aplicar($event)" />
    <div class="panel">
      <app-entrada-datos [(texto)]="d.datos" etiqueta="Mediciones" />
      <div class="fila">
        <app-selector-unidad [(unidad)]="d.unidad" etiqueta="Unidad de las mediciones" />
        <label class="campo corto">
          <span class="etiqueta">Valor de referencia (opcional)</span>
          <input type="text" [value]="referencia()" (input)="referencia.set($any($event.target).value)" placeholder="2.5" />
        </label>
        <button type="button" class="primario" (click)="calcular()">Calcular</button>
      </div>
    </div>
    <app-avisos [mensajes]="errores()" tipo="error" />
    <app-avisos [mensajes]="avisos()" />
    @if (salida(); as s) {
      <p class="destacado">Resultado de la medición: <strong>{{ s.reporte }}</strong></p>
      @for (m of s.resultados; track m.titulo) { <app-caja-resultado [resultado]="m" /> }
    }

    <h3 class="sep">Conversión de unidades</h3>
    <div class="panel">
      <div class="fila">
        <label class="campo corto"><span class="etiqueta">Valor</span>
          <input type="text" [value]="cv()" (input)="cv.set($any($event.target).value)" /></label>
        <label class="campo corto"><span class="etiqueta">De</span>
          <select [value]="de()" (change)="de.set($any($event.target).value)">@for (u of unidades; track u) { <option>{{ u }}</option> }</select></label>
        <label class="campo corto"><span class="etiqueta">A</span>
          <select [value]="a()" (change)="a.set($any($event.target).value)">@for (u of unidades; track u) { <option>{{ u }}</option> }</select></label>
        <button type="button" class="primario" (click)="convertirUnidad()">Convertir</button>
      </div>
    </div>
    <app-avisos [mensajes]="errConv()" tipo="error" />
    @if (conv(); as c) { <app-caja-resultado [resultado]="c" /> }
  `,
})
export class DatosExperimentalesComponent {
  protected readonly d = inject(DatosService);
  protected readonly unidades = LISTA_UNIDADES;
  protected readonly referencia = signal('');
  protected readonly errores = signal<string[]>([]);
  protected readonly avisos = signal<string[]>([]);
  protected readonly salida = signal<AnalisisExperimental | null>(null);
  protected readonly cv = signal('250');
  protected readonly de = signal('mA');
  protected readonly a = signal('A');
  protected readonly conv = signal<Resultado | null>(null);
  protected readonly errConv = signal<string[]>([]);

  aplicar(e: Ejemplo): void {
    this.d.datos.set(e.params['datos']);
    this.d.unidad.set(e.params['unidad'] ?? '');
    this.referencia.set(e.params['referencia'] ?? '');
    this.calcular();
  }

  calcular(): void {
    this.salida.set(null);
    const p = validarSerie(this.d.datos(), 2, 'mediciones');
    this.errores.set(p.errores);
    this.avisos.set(p.avisos);
    let ref: number | undefined;
    const rt = this.referencia().trim();
    if (rt) {
      const r = validarSerie(rt, 1, 'referencia');
      if (r.errores.length || r.valores.length !== 1) p.errores.push('El valor de referencia debe ser un único número.');
      else ref = r.valores[0];
      this.errores.set(p.errores);
    }
    if (p.errores.length) return;
    try {
      this.salida.set(analizarExperimental(p.valores, this.d.unidad().trim(), ref));
    } catch {
      this.errores.set(['No se pudo resolver este caso. Revisa los datos e inténtalo de nuevo.']);
    }
  }

  convertirUnidad(): void {
    this.conv.set(null);
    const v = validarSerie(this.cv(), 1, 'un valor');
    if (v.errores.length || v.valores.length !== 1) {
      this.errConv.set(v.errores.length ? v.errores : ['Ingresa un solo valor a convertir.']);
      return;
    }
    this.errConv.set([]);
    const r = convertir(v.valores[0], this.de(), this.a());
    if (r.valor === undefined) this.errConv.set(r.advertencias);
    else this.conv.set(r);
  }
}
