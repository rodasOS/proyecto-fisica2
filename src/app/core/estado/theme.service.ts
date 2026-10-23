import { Injectable, signal } from '@angular/core';

export type Tema = 'claro' | 'oscuro';
const CLAVE = 'estadix-tema';

function leer(): Tema | null {
  try {
    const v = localStorage.getItem(CLAVE);
    return v === 'claro' || v === 'oscuro' ? v : null;
  } catch {
    return null;
  }
}

/** Tema claro por defecto; la elección manual del usuario se persiste y prevalece. */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private guardado = leer();
  readonly modo = signal<Tema>(this.guardado ?? 'claro');

  constructor() {
    this.aplicar(this.modo());
  }

  alternar(): void {
    this.fijar(this.modo() === 'oscuro' ? 'claro' : 'oscuro');
  }

  private fijar(t: Tema): void {
    this.guardado = t;
    try {
      localStorage.setItem(CLAVE, t);
    } catch {
      /* almacenamiento no disponible */
    }
    this.aplicar(t);
    this.modo.set(t);
  }

  private aplicar(t: Tema): void {
    const raiz = document.documentElement;
    raiz.setAttribute('data-theme', t === 'oscuro' ? 'dark' : 'light');
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', t === 'oscuro' ? '#1c1f2b' : '#fff9f5');
  }
}
