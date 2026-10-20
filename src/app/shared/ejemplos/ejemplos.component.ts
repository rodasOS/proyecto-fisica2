import { Component, computed, inject, input, OnInit, output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ejemplo, EJEMPLOS, ModuloEjemplo } from '../../data/ejemplos';

/** Botones de ejemplos del módulo; también aplica el ejemplo indicado en ?ejemplo=id. */
@Component({
  selector: 'app-ejemplos',
  template: `
    <div class="ejemplos">
      <span class="etiqueta">Ejemplos:</span>
      @for (e of lista(); track e.id) {
        <button type="button" class="chip" [title]="e.descripcion" (click)="elegir.emit(e)">{{ e.titulo }}</button>
      }
    </div>
  `,
})
export class EjemplosComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly modulo = input.required<ModuloEjemplo>();
  readonly elegir = output<Ejemplo>();
  readonly lista = computed(() => EJEMPLOS.filter((e) => e.modulo === this.modulo()));

  ngOnInit(): void {
    const id = this.route.snapshot.queryParamMap.get('ejemplo');
    const e = EJEMPLOS.find((x) => x.id === id && x.modulo === this.modulo());
    if (e) queueMicrotask(() => this.elegir.emit(e));
  }
}
