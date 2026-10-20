import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeService } from './core/estado/theme.service';
import { IconoComponent } from './shared/icono/icono.component';
import { INFO } from './app.info';

interface ItemMenu {
  ruta: string;
  texto: string;
  icono: string;
  principal: boolean;
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, IconoComponent],
  templateUrl: './app.html',
})
export class App {
  protected readonly info = INFO;
  protected readonly tema = inject(ThemeService);
  protected readonly menu: ItemMenu[] = [
    { ruta: '/', texto: 'Inicio', icono: 'inicio', principal: true },
    { ruta: '/descriptiva', texto: 'Descriptiva', icono: 'descriptiva', principal: true },
    { ruta: '/datos-experimentales', texto: 'Datos experimentales', icono: 'experimentales', principal: false },
    { ruta: '/tablas-graficas', texto: 'Tablas y gráficas', icono: 'tablas', principal: false },
    { ruta: '/probabilidad', texto: 'Probabilidad', icono: 'probabilidad', principal: true },
    { ruta: '/correlacion-regresion', texto: 'Correlación y regresión', icono: 'regresion', principal: false },
    { ruta: '/practica', texto: 'Práctica', icono: 'practica', principal: true },
    { ruta: '/teoria', texto: 'Teoría', icono: 'teoria', principal: false },
  ];
  protected readonly principales = this.menu.filter((m) => m.principal);
  protected readonly secundarios = this.menu.filter((m) => !m.principal);

  private readonly dlgMas = viewChild<ElementRef<HTMLDialogElement>>('dlgMas');
  private readonly dlgEquipo = viewChild<ElementRef<HTMLDialogElement>>('dlgEquipo');

  protected abrirMas(): void { this.dlgMas()?.nativeElement.showModal?.(); }
  protected cerrarMas(): void { this.dlgMas()?.nativeElement.close?.(); }
  protected abrirEquipo(): void { this.dlgEquipo()?.nativeElement.showModal?.(); }
  protected cerrarEquipo(): void { this.dlgEquipo()?.nativeElement.close?.(); }
  protected cerrarAlFondo(ev: MouseEvent, d: HTMLDialogElement): void {
    if (ev.target === d) d.close();
  }
}
