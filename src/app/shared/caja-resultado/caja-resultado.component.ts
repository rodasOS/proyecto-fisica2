import { Component, input } from '@angular/core';
import { Resultado } from '../../core/stats/resultado.model';
import { FormulaComponent } from '../formula/formula.component';

@Component({
  selector: 'app-avisos',
  template: `@for (m of mensajes(); track $index) {
    <p class="aviso" [class.error]="tipo() === 'error'" role="alert">
      <strong>{{ tipo() === 'error' ? 'Error:' : 'Aviso:' }}</strong> {{ m }}
    </p>
  }`,
})
export class AvisosComponent {
  readonly mensajes = input<string[]>([]);
  readonly tipo = input<'error' | 'aviso'>('aviso');
}

@Component({
  selector: 'app-caja-resultado',
  imports: [FormulaComponent, AvisosComponent],
  template: `
    @let r = resultado();
    <section class="caja">
      <h3>{{ r.titulo }}</h3>
      @if (r.valor === undefined && !r.formula) {
        <p class="sin-valor">No se pudo calcular.</p>
      } @else {
        <h4>Fórmula</h4>
        <app-formula [latex]="r.formula" />
        <h4>Sustitución</h4>
        <app-formula [latex]="r.sustitucion" />
        <h4>Procedimiento</h4>
        <ol>
          @for (p of r.pasos; track $index) { <li>{{ p }}</li> }
        </ol>
        @if (r.tabla; as t) {
          <div class="tabla-scroll">
            <table>
              <thead><tr>@for (h of t.encabezados; track $index) { <th>{{ h }}</th> }</tr></thead>
              <tbody>
                @for (f of t.filas; track $index) {
                  <tr>@for (c of f; track $index) { <td>{{ c }}</td> }</tr>
                }
              </tbody>
            </table>
          </div>
        }
        <p class="respuesta"><span>Respuesta</span> {{ r.respuesta }}</p>
        <h4>Interpretación</h4>
        <p>{{ r.interpretacion }}</p>
      }
      <app-avisos [mensajes]="r.advertencias" />
    </section>
  `,
})
export class CajaResultadoComponent {
  readonly resultado = input.required<Resultado>();
}
