import { Injectable, signal } from '@angular/core';

export type Tema = 'claro' | 'oscuro';
const CLAVE = 'sigmalab-tema';

function leer(): Tema | null {
  try {
    const v = localStorage.getItem(CLAVE);
    return v === 'claro' || v === 'oscuro' ? v : null;
  } catch {
    return null;
  }
}

function preferenciaSistema(): Tema {
  try {
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'oscuro' : 'claro';
  } catch {
    return 'claro';
  }
}

/** Tema claro/oscuro: preferencia del sistema por defecto, elección manual persistida. */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private guardado = leer();
  readonly modo = signal<Tema>(this.guardado ?? preferenciaSistema());

  constructor() {
    this.aplicar(this.modo());
    try {
      window.matchMedia?.('(prefers-color-scheme: dark)').addEventListener?.('change', (e) => {
        if (!this.guardado) this.fijar(e.matches ? 'oscuro' : 'claro', false);
      });
    } catch {
      /* sin soporte: se queda con el valor inicial */
    }
  }

  alternar(): void {
    this.fijar(this.modo() === 'oscuro' ? 'claro' : 'oscuro', true);
  }

  private fijar(t: Tema, persistir: boolean): void {
    if (persistir) {
      this.guardado = t;
      try {
        localStorage.setItem(CLAVE, t);
      } catch {
        /* almacenamiento no disponible */
      }
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
