import { Component, inject, signal } from '@angular/core';
import { Calificacion, Dificultad, GeneradorService, ModuloPractica, Practica } from '../../core/practica/generador.service';
import { CajaResultadoComponent } from '../../shared/caja-resultado/caja-resultado.component';

@Component({
  selector: 'app-practica',
  imports: [CajaResultadoComponent],
  template: `
    <h2>Práctica con retroalimentación</h2>
    <p class="lead">Genera un ejercicio nuevo con datos aleatorios, respóndelo y recibe la calificación con el procedimiento.</p>
    <div class="panel">
      <div class="fila">
        <label class="campo corto"><span class="etiqueta">Módulo</span>
          <select [value]="modulo()" (change)="modulo.set($any($event.target).value)">
            <option value="descriptiva">Estadística descriptiva</option>
            <option value="experimentales">Datos experimentales</option>
            <option value="tablas">Tablas de frecuencias</option>
            <option value="probabilidad">Probabilidad y normal</option>
            <option value="regresion">Correlación y regresión</option>
          </select></label>
        <label class="campo corto"><span class="etiqueta">Dificultad</span>
          <select [value]="dificultad()" (change)="dificultad.set($any($event.target).value)">
            <option value="facil">Fácil</option><option value="medio">Medio</option><option value="dificil">Difícil</option>
          </select></label>
        <button type="button" class="primario" (click)="generar()">Generar práctica</button>
      </div>
    </div>
    @if (practica(); as p) {
      <section class="caja">
        <h3>Ejercicio</h3>
        <p class="enunciado">{{ p.enunciado }}</p>
        <div class="fila">
          <label class="campo corto"><span class="etiqueta">Tu respuesta</span>
            <input type="text" [value]="respuesta()" (input)="respuesta.set($any($event.target).value)" (keydown.enter)="calificar()" inputmode="decimal" /></label>
          <button type="button" class="primario" (click)="calificar()">Calificar</button>
        </div>
        @if (cal(); as c) {
          <p class="veredicto" [class.ok]="c.estado === 'correcta'" [class.mal]="c.estado === 'incorrecta'" role="status">{{ c.mensaje }}</p>
          @if (c.pista) { <p class="aviso"><strong>Pista:</strong> {{ c.pista }}</p> }
        }
      </section>
      @if (cal() && cal()!.estado !== 'invalida') { <app-caja-resultado [resultado]="p.solucion" /> }
    }
    <p class="marcador">Marcador de la sesión: <strong>{{ aciertos() }}/{{ total() }}</strong></p>
  `,
})
export class PracticaComponent {
  private readonly gen = inject(GeneradorService);
  protected readonly modulo = signal<ModuloPractica>('descriptiva');
  protected readonly dificultad = signal<Dificultad>('medio');
  protected readonly practica = signal<Practica | null>(null);
  protected readonly respuesta = signal('');
  protected readonly cal = signal<Calificacion | null>(null);
  protected readonly aciertos = signal(0);
  protected readonly total = signal(0);
  private calificada = false;

  generar(): void {
    this.practica.set(this.gen.generar(this.modulo(), this.dificultad()));
    this.respuesta.set('');
    this.cal.set(null);
    this.calificada = false;
  }

  calificar(): void {
    const p = this.practica();
    if (!p) return;
    const c = this.gen.calificar(p, this.respuesta());
    this.cal.set(c);
    if (c.estado !== 'invalida' && !this.calificada) {
      this.calificada = true;
      this.total.update((n) => n + 1);
      if (c.estado === 'correcta') this.aciertos.update((n) => n + 1);
    }
  }
}
