import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { INFO } from './app.info';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly info = INFO;
  protected readonly menu = [
    { ruta: '/', texto: 'Inicio' },
    { ruta: '/descriptiva', texto: 'Descriptiva' },
    { ruta: '/datos-experimentales', texto: 'Datos experimentales' },
    { ruta: '/tablas-graficas', texto: 'Tablas y gráficas' },
    { ruta: '/probabilidad', texto: 'Probabilidad' },
    { ruta: '/correlacion-regresion', texto: 'Correlación y regresión' },
    { ruta: '/practica', texto: 'Práctica' },
    { ruta: '/teoria', texto: 'Teoría' },
  ];
}
