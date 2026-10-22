import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { EJEMPLOS, RUTA_MODULO } from '../../data/ejemplos';
import { INFO } from '../../app.info';
import { IconoComponent } from '../../shared/icono/icono.component';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, IconoComponent],
  template: `
    <section class="hero">
      <h2>Bienvenido a {{ info.nombre }}</h2>
      <p>{{ info.eslogan }}. Resuelve ejercicios reales con fórmula, sustitución, procedimiento, respuesta e interpretación. Todos los cálculos los hace un algoritmo programado, no un modelo de IA: mismos datos, mismo resultado.</p>
      <a class="primario enlace" routerLink="/descriptiva" [queryParams]="{ ejemplo: 'corriente' }">Probar con el ejemplo de la corriente (2.1, 2.3, 2.2, 2.4, 2.0 A)</a>
    </section>
    <h3>Módulos</h3>
    <div class="tarjetas">
      @for (m of modulos; track m.ruta) {
        <a class="tarjeta" [routerLink]="m.ruta"><span class="icono-bloque" aria-hidden="true"><app-icono [n]="m.icono" /></span><strong>{{ m.titulo }}</strong><span>{{ m.texto }}</span></a>
      }
    </div>
    <h3 class="sep">Ejercicios de ejemplo ({{ ejemplos.length }})</h3>
    <div class="tarjetas">
      @for (e of ejemplos; track e.id) {
        <a class="tarjeta" [routerLink]="ruta(e.modulo)" [queryParams]="{ ejemplo: e.id }"><strong>{{ e.titulo }}</strong><span>{{ e.descripcion }}</span></a>
      }
    </div>
    <h3 class="sep">Equipo</h3>
    <div class="caja equipo-inicio">
      @for (i of info.integrantes; track i.carne) {
        <div class="persona">
          <span class="avatar" aria-hidden="true">{{ i.nombre.charAt(0) }}</span>
          <div><strong>{{ i.nombre }}</strong><small>Carné {{ i.carne }}</small></div>
        </div>
      }
      <div class="persona"><div><strong>{{ info.asignatura }}</strong><small>{{ info.seccion }}</small></div></div>
    </div>
    <h3 class="sep">Cómo usarlo</h3>
    <ol>
      <li>Elige un módulo y escribe tus propios datos (o carga un ejemplo).</li>
      <li>Pulsa <em>Calcular</em>: verás el procedimiento completo.</li>
      <li>Si falta un dato o hay un error de entrada, se te avisará qué corregir.</li>
      <li>En <a routerLink="/practica">Práctica</a> genera ejercicios nuevos y recibe retroalimentación.</li>
    </ol>
  `,
})
export class InicioComponent {
  protected readonly info = INFO;
  protected readonly ejemplos = EJEMPLOS;
  protected readonly modulos = [
    { ruta: '/descriptiva', icono: 'descriptiva', titulo: 'Descriptiva', texto: 'Media, mediana, moda, rango, σ y s, cuartiles.' },
    { ruta: '/datos-experimentales', icono: 'experimentales', titulo: 'Datos experimentales', texto: 'Mediciones con unidades, x̄ ± s/√n, conversión.' },
    { ruta: '/tablas-graficas', icono: 'tablas', titulo: 'Tablas y gráficas', texto: 'Frecuencias, histograma y dispersión.' },
    { ruta: '/probabilidad', icono: 'probabilidad', titulo: 'Probabilidad', texto: 'Probabilidad básica y distribución normal.' },
    { ruta: '/correlacion-regresion', icono: 'regresion', titulo: 'Correlación y regresión', texto: 'r, r², recta de mínimos cuadrados.' },
    { ruta: '/practica', icono: 'practica', titulo: 'Práctica', texto: 'Ejercicios aleatorios con calificación.' },
    { ruta: '/teoria', icono: 'teoria', titulo: 'Teoría', texto: 'σ vs s, interpretación y glosario.' },
  ];
  protected ruta(m: keyof typeof RUTA_MODULO): string {
    return RUTA_MODULO[m];
  }
}
