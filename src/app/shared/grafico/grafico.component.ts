import { Component, ElementRef, OnDestroy, effect, input, viewChild } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-grafico',
  template: `<div class="marco"><canvas #lienzo role="img" [attr.aria-label]="descripcion()"></canvas></div>`,
  styles: [`.marco { position: relative; width: 100%; height: 320px; }`],
})
export class GraficoComponent implements OnDestroy {
  readonly config = input.required<ChartConfiguration>();
  readonly descripcion = input('Gráfica');
  private readonly lienzo = viewChild.required<ElementRef<HTMLCanvasElement>>('lienzo');
  private chart?: Chart;

  constructor() {
    effect(() => {
      const cfg = this.config();
      this.chart?.destroy();
      this.chart = new Chart(this.lienzo().nativeElement, {
        ...cfg,
        options: { responsive: true, maintainAspectRatio: false, ...cfg.options },
      });
    });
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }
}
