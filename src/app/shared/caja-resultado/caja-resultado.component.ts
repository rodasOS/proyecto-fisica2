import { Component, ElementRef, effect, inject, input } from '@angular/core';
import { Resultado } from '../../core/stats/resultado.model';
import { FormulaComponent } from '../formula/formula.component';

@Component({
  selector: 'app-avisos',
  template: `@for (m of mensajes(); track $index) {
    <p class="aviso" [class.error]="tipo() === 'error'" role="alert">
      <strong>{{ tipo() === 'error' ? 'Error:' : 'Aviso:' }}</strong> {{ m }}
    </p>
  }`,
  styles: [`:host { display: block; scroll-margin: 5rem 0 6rem; }`],
})
export class AvisosComponent {
  readonly mensajes = input<string[]>([]);
  readonly tipo = input<'error' | 'aviso'>('aviso');
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  constructor() {
    effect(() => {
      if (this.tipo() === 'error' && this.mensajes().length) {
        setTimeout(() => this.host.nativeElement.scrollIntoView?.({ block: 'nearest' }), 0);
      }
    });
  }
}

@Component({
  selector: 'app-caja-resultado',
  imports: [FormulaComponent, AvisosComponent],
  template: `
    @let r = resultado();
    <article class="resultado">
      <header><h3>{{ r.titulo }}</h3></header>
      <div class="cuerpo">
        @if (r.valor === undefined && !r.formula) {
          <p class="sin-valor">No se pudo calcular.</p>
        } @else {
          <div class="respuesta-final">
            <span class="etq">Respuesta final</span>
            <strong>{{ r.respuesta }}</strong>
          </div>
          <app-avisos [mensajes]="r.advertencias" />
          <p class="interp">{{ r.interpretacion }}</p>
          <div class="seccion">
            <h4>Fórmula</h4>
            <div class="bloque-formula"><app-formula [latex]="r.formula" /></div>
            <h4>Sustitución</h4>
            <div class="bloque-formula"><app-formula [latex]="r.sustitucion" /></div>
          </div>
          <details class="seccion" open>
            <summary>Procedimiento paso a paso</summary>
            <ol>
              @for (p of r.pasos; track $index) { <li>{{ p }}</li> }
            </ol>
            @if (r.tabla; as t) {
              <div class="tabla-scroll">
                <table>
                  <thead><tr>@for (h of t.encabezados; track $index) { <th scope="col">{{ h }}</th> }</tr></thead>
                  <tbody>
                    @for (f of t.filas; track $index) {
                      <tr>@for (c of f; track $index) { <td>{{ c }}</td> }</tr>
                    }
                  </tbody>
                </table>
              </div>
            }
          </details>
        }
        @if (r.valor === undefined && !r.formula) { <app-avisos [mensajes]="r.advertencias" /> }
      </div>
    </article>
  `,
})
export class CajaResultadoComponent {
  readonly resultado = input.required<Resultado>();
}
