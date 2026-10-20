import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { App } from './app';
import { INFO } from './app.info';

describe('App', () => {
  it('muestra nombre, integrantes, asignatura y sección', async () => {
    await TestBed.configureTestingModule({ imports: [App], providers: [provideRouter([])] }).compileComponents();
    const f = TestBed.createComponent(App);
    await f.whenStable();
    const t = (f.nativeElement as HTMLElement).textContent ?? '';
    expect(t).toContain(INFO.nombre);
    expect(t).toContain(INFO.integrantes[0]);
    expect(t).toContain(INFO.integrantes[1]);
    expect(t).toContain(INFO.asignatura);
    expect(t).toContain(INFO.seccion);
  });
});
