import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describe, expect, it } from 'vitest';
import { App } from './app';
import { INFO } from './app.info';

describe('App', () => {
  it('INFO tiene los nombres y carnés exactos', () => {
    expect(INFO.integrantes).toEqual([
      { nombre: 'Mario Orlando Sales Rodas', carne: '2990-25-21488' },
      { nombre: 'Kenneth Gabriel Elías Xia Temal', carne: '2990-25-16687' },
    ]);
  });

  it('muestra nombre, integrantes con carné, asignatura y sección', async () => {
    await TestBed.configureTestingModule({ imports: [App], providers: [provideRouter([])] }).compileComponents();
    const f = TestBed.createComponent(App);
    await f.whenStable();
    const t = (f.nativeElement as HTMLElement).textContent ?? '';
    expect(t).toContain(INFO.nombre);
    for (const i of INFO.integrantes) {
      expect(t).toContain(i.nombre);
      expect(t).toContain(i.carne);
    }
    expect(t).toContain(INFO.asignatura);
    expect(t).toContain(INFO.seccion);
  });
});
