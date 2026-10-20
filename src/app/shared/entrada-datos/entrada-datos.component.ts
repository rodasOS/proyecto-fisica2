import { Component, input, model } from '@angular/core';
import { LISTA_UNIDADES } from '../../core/stats/experimental';

@Component({
  selector: 'app-entrada-datos',
  template: `
    <label class="campo">
      <span class="etiqueta">{{ etiqueta() }}</span>
      <textarea
        [rows]="filas()"
        [value]="texto()"
        (input)="texto.set($any($event.target).value)"
        [placeholder]="placeholder()"
        spellcheck="false"
      ></textarea>
      <span class="ayuda">{{ ayuda() }}</span>
    </label>
  `,
})
export class EntradaDatosComponent {
  readonly etiqueta = input('Datos');
  readonly placeholder = input('2.1, 2.3, 2.2, 2.4, 2.0');
  readonly ayuda = input('Separa con coma, espacio, punto y coma o salto de línea. Acepta coma o punto decimal.');
  readonly filas = input(3);
  readonly texto = model('');
}

@Component({
  selector: 'app-selector-unidad',
  template: `
    <label class="campo corto">
      <span class="etiqueta">{{ etiqueta() }}</span>
      <input
        type="text"
        list="lista-unidades"
        [value]="unidad()"
        (input)="unidad.set($any($event.target).value)"
        placeholder="A, V, m, s…"
        autocomplete="off"
      />
      <datalist id="lista-unidades">
        @for (u of unidades; track u) { <option [value]="u"></option> }
      </datalist>
    </label>
  `,
})
export class SelectorUnidadComponent {
  readonly etiqueta = input('Unidad (opcional)');
  readonly unidad = model('');
  readonly unidades = LISTA_UNIDADES;
}
