import { Injectable, signal } from '@angular/core';

/** Datos compartidos entre módulos durante la sesión. */
@Injectable({ providedIn: 'root' })
export class DatosService {
  readonly datos = signal('');
  readonly unidad = signal('');
  readonly x = signal('');
  readonly y = signal('');
}
