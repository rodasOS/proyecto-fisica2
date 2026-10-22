import { Component, ElementRef, OnDestroy, effect, inject, input, viewChild } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { ThemeService } from '../../core/estado/theme.service';

Chart.register(...registerables);

@Component({
  selector: 'app-grafico',
  template: `<div class="marco"><canvas #lienzo role="img" [attr.aria-label]="descripcion()"></canvas></div>`,
  styles: [`.marco { position: relative; width: 100%; height: clamp(240px, 55vw, 380px); }`],
})
export class GraficoComponent implements OnDestroy {
  readonly config = input.required<ChartConfiguration>();
  readonly descripcion = input('Gráfica');
  private readonly lienzo = viewChild.required<ElementRef<HTMLCanvasElement>>('lienzo');
  private readonly tema = inject(ThemeService);
  private chart?: Chart;

  constructor() {
    effect(() => {
      const cfg = this.config();
      this.tema.modo(); // se reconstruye al cambiar el tema
      const css = getComputedStyle(document.documentElement);
      Chart.defaults.color = css.getPropertyValue('--muted').trim() || '#566074';
      Chart.defaults.borderColor = css.getPropertyValue('--line').trim() || '#e2e8f0';
      Chart.defaults.font.family = css.getPropertyValue('--fuente').trim() || 'system-ui';
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
