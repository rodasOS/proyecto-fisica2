import { ChartConfiguration } from 'chart.js';
import { Clase } from '../../core/stats/frecuencias';
import { fmt } from '../../core/stats/resultado.model';

const COLOR = '#1d4ed8';
const COLOR2 = '#c2410c';

export function histogramaConfig(clases: Clase[], unidad = ''): ChartConfiguration {
  return {
    type: 'bar',
    data: {
      labels: clases.map((c) => `${fmt(c.inferior)}–${fmt(c.superior)}`),
      datasets: [{ label: 'Frecuencia', data: clases.map((c) => c.f), backgroundColor: COLOR + 'cc', borderColor: COLOR, borderWidth: 1, barPercentage: 1, categoryPercentage: 1 }],
    },
    options: {
      plugins: { title: { display: true, text: 'Histograma' }, legend: { display: false } },
      scales: {
        x: { title: { display: true, text: `Clase${unidad ? ` (${unidad})` : ''}` } },
        y: { title: { display: true, text: 'Frecuencia' }, beginAtZero: true, ticks: { precision: 0 } },
      },
    },
  };
}

export function dispersionConfig(
  x: number[], y: number[], recta?: { a: number; b: number }, ux = '', uy = '',
): ChartConfiguration {
  const mn = Math.min(...x);
  const mx = Math.max(...x);
  const datasets: any[] = [
    { type: 'scatter', label: 'Datos', data: x.map((v, i) => ({ x: v, y: y[i] })), backgroundColor: COLOR, pointRadius: 5 },
  ];
  if (recta) {
    datasets.push({
      type: 'scatter', label: `ŷ = ${fmt(recta.a)} ${recta.b < 0 ? '−' : '+'} ${fmt(Math.abs(recta.b))}x`,
      data: [{ x: mn, y: recta.a + recta.b * mn }, { x: mx, y: recta.a + recta.b * mx }],
      showLine: true, borderColor: COLOR2, backgroundColor: COLOR2, pointRadius: 0, borderWidth: 2,
    });
  }
  return {
    type: 'scatter',
    data: { datasets },
    options: {
      plugins: { title: { display: true, text: 'Diagrama de dispersión' } },
      scales: {
        x: { title: { display: true, text: `X${ux ? ` (${ux})` : ''}` } },
        y: { title: { display: true, text: `Y${uy ? ` (${uy})` : ''}` } },
      },
    },
  };
}

export function campanaConfig(mu: number, sigma: number, desde: number, hasta: number): ChartConfiguration {
  const pdf = (v: number) => Math.exp(-0.5 * ((v - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI));
  const lo = mu - 4 * sigma;
  const hi = mu + 4 * sigma;
  const N = 160;
  const curva = Array.from({ length: N + 1 }, (_, i) => {
    const v = lo + ((hi - lo) * i) / N;
    return { x: v, y: pdf(v) };
  });
  const a = Math.max(lo, Math.min(hi, desde));
  const b = Math.max(lo, Math.min(hi, hasta));
  const sombra = Array.from({ length: N + 1 }, (_, i) => {
    const v = a + ((b - a) * i) / N;
    return { x: v, y: pdf(v) };
  });
  return {
    type: 'line',
    data: {
      datasets: [
        { label: 'Área calculada', data: sombra, parsing: false, fill: 'origin', backgroundColor: COLOR2 + '66', borderColor: COLOR2, pointRadius: 0, borderWidth: 1 },
        { label: 'Densidad N(μ, σ)', data: curva, parsing: false, borderColor: COLOR, pointRadius: 0, borderWidth: 2, fill: false },
      ],
    },
    options: {
      plugins: { title: { display: true, text: 'Distribución normal' } },
      scales: {
        x: { type: 'linear', title: { display: true, text: 'x' } },
        y: { title: { display: true, text: 'Densidad' }, beginAtZero: true },
      },
    },
  };
}
