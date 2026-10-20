import { Component, inject, signal } from '@angular/core';
import { validarSerie } from '../../core/parsers/numeros.parser';
import { DatosService } from '../../core/estado/datos.service';
import { AnalisisDescriptivo, analizarDescriptiva } from '../../core/stats/descriptiva';
import { Ejemplo } from '../../data/ejemplos';
import { AvisosComponent, CajaResultadoComponent } from '../../shared/caja-resultado/caja-resultado.component';
import { EntradaDatosComponent, SelectorUnidadComponent } from '../../shared/entrada-datos/entrada-datos.component';
import { EjemplosComponent } from '../../shared/ejemplos/ejemplos.component';

@Component({
  selector: 'app-descriptiva',
  imports: [EntradaDatosComponent, SelectorUnidadComponent, CajaResultadoComponent, AvisosComponent, EjemplosComponent],
  template: `
    <h2>Estadística descriptiva</h2>
    <p class="lead">Media, mediana, moda, rango, varianza, desviación estándar, cuartiles y valores atípicos, con el procedimiento completo.</p>
    <app-ejemplos modulo="descriptiva" (elegir)="aplicar($event)" />
    <div class="panel">
      <app-entrada-datos [(texto)]="d.datos" />
      <div class="fila">
        <app-selector-unidad [(unidad)]="d.unidad" />
        <label class="campo corto">
          <span class="etiqueta">Desviación estándar</span>
          <select [value]="tipo()" (change)="tipo.set($any($event.target).value)">
            <option value="muestral">Muestral (÷ n−1)</option>
            <option value="poblacional">Poblacional (÷ N)</option>
          </select>
        </label>
        <button type="button" class="primario" (click)="calcular()">Calcular</button>
      </div>
    </div>
    <app-avisos [mensajes]="errores()" tipo="error" />
    <app-avisos [mensajes]="avisos()" />
    @if (salida(); as s) {
      @for (m of s.medidas; track m.titulo) { <app-caja-resultado [resultado]="m" /> }
    }
  `,
})
export class DescriptivaComponent {
  protected readonly d = inject(DatosService);
  protected readonly tipo = signal<'muestral' | 'poblacional'>('muestral');
  protected readonly errores = signal<string[]>([]);
  protected readonly avisos = signal<string[]>([]);
  protected readonly salida = signal<AnalisisDescriptivo | null>(null);

  aplicar(e: Ejemplo): void {
    this.d.datos.set(e.params['datos']);
    this.d.unidad.set(e.params['unidad'] ?? '');
    this.tipo.set((e.params['tipo'] as 'muestral' | 'poblacional') ?? 'muestral');
    this.calcular();
  }

  calcular(): void {
    this.salida.set(null);
    const p = validarSerie(this.d.datos(), 1);
    this.errores.set(p.errores);
    this.avisos.set(p.avisos);
    if (p.errores.length) return;
    try {
      this.salida.set(analizarDescriptiva(p.valores, { poblacional: this.tipo() === 'poblacional', unidad: this.d.unidad().trim() || undefined }));
    } catch {
      this.errores.set(['No se pudo resolver este caso. Revisa los datos e inténtalo de nuevo.']);
    }
  }
}
