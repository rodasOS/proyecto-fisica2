import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { parsearNumeros } from '../../core/parsers/numeros.parser';
import { DatosService } from '../../core/estado/datos.service';
import { desviacion } from '../../core/stats/descriptiva';
import { fmt } from '../../core/stats/resultado.model';
import { GLOSARIO } from '../../data/glosario';
import { FormulaComponent } from '../../shared/formula/formula.component';

@Component({
  selector: 'app-teoria',
  imports: [FormulaComponent, RouterLink],
  template: `
    <h2>Teoría e interpretación</h2>
    <h3>Desviación estándar poblacional (σ) frente a muestral (s)</h3>
    <div class="caja">
      <app-formula latex="\\sigma=\\sqrt{\\dfrac{\\sum (x_i-\\mu)^2}{N}}\\qquad s=\\sqrt{\\dfrac{\\sum (x_i-\\bar{x})^2}{n-1}}" />
      <ul>
        <li><strong>σ (÷N)</strong>: se usa cuando los datos son <em>toda la población</em>; μ es el verdadero promedio.</li>
        <li><strong>s (÷(n−1))</strong>: se usa cuando los datos son una <em>muestra</em> (p. ej. mediciones repetidas). Como x̄ se calcula con los mismos datos, las desviaciones respecto a x̄ tienden a ser menores que respecto a μ; dividir entre n−1 corrige ese sesgo (corrección de Bessel; n−1 son los grados de libertad).</li>
        <li>La diferencia es grande con pocos datos y desaparece al crecer n: s/σ = √(n/(n−1)).</li>
        <li>En un laboratorio de física, las mediciones repetidas son una muestra: se recomienda <strong>s</strong>.</li>
      </ul>
      @if (comp(); as c) {
        <h4>Con tu serie cargada (n = {{ c.n }})</h4>
        <app-formula [latex]="c.latex" />
        <p>La desviación muestral es {{ c.razon }} veces la poblacional. {{ c.nota }}</p>
      } @else {
        <p class="aviso">Carga una serie con al menos 2 datos en <a routerLink="/descriptiva">Descriptiva</a> para compararlas con tus propios datos.</p>
      }
    </div>
    <h3>Cómo interpretar</h3>
    <div class="caja">
      <ul>
        <li><strong>Media ± incertidumbre</strong>: la media estima el valor verdadero; s/√n mide qué tan bien lo estima.</li>
        <li><strong>Correlación</strong>: r cerca de ±1 indica relación lineal fuerte; cerca de 0, casi nula. Correlación no implica causalidad.</li>
        <li><strong>Normal</strong>: ≈68 % de los datos está a ±1σ, ≈95 % a ±2σ y ≈99.7 % a ±3σ.</li>
        <li><strong>Muestras pequeñas</strong> (n &lt; 5): todas las estimaciones son poco confiables.</li>
      </ul>
    </div>
    <h3>Glosario</h3>
    <div class="caja glosario">
      @for (g of glosario; track g.termino) {
        <details><summary>{{ g.termino }}</summary><p>{{ g.definicion }}</p>@if (g.formula) { <app-formula [latex]="g.formula" /> }</details>
      }
    </div>
  `,
})
export class TeoriaComponent {
  private readonly d = inject(DatosService);
  protected readonly glosario = GLOSARIO;
  protected readonly comp = computed(() => {
    const v = parsearNumeros(this.d.datos()).valores;
    if (v.length < 2) return null;
    const sp = desviacion(v, true);
    const sm = desviacion(v, false);
    const razon = sm / sp;
    return {
      n: v.length,
      latex: `\\sigma=${fmt(sp)},\\qquad s=${fmt(sm)},\\qquad \\dfrac{s}{\\sigma}=\\sqrt{\\dfrac{${v.length}}{${v.length - 1}}}=${fmt(razon)}`,
      razon: fmt(razon),
      nota: v.length < 10 ? 'Con tan pocos datos la diferencia es apreciable.' : 'Con más datos la diferencia se reduce.',
    };
  });
}
