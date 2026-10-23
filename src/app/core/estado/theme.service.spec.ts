import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ThemeService } from './theme.service';

/** Simula un sistema en modo oscuro: el servicio no debe consultarlo. */
function sistemaEnOscuro(): void {
  vi.stubGlobal('matchMedia', () => ({ matches: true, addEventListener: () => {}, removeEventListener: () => {} }));
}

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('sin elección guardada usa claro aunque el sistema esté en oscuro', () => {
    sistemaEnOscuro();
    const s = new ThemeService();
    expect(s.modo()).toBe('claro');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('sin elección guardada y sin soporte de matchMedia usa claro', () => {
    vi.stubGlobal('matchMedia', undefined);
    const s = new ThemeService();
    expect(s.modo()).toBe('claro');
  });

  it('usa la elección guardada al iniciar', () => {
    localStorage.setItem('estadix-tema', 'oscuro');
    const s = new ThemeService();
    expect(s.modo()).toBe('oscuro');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('una elección guardada prevalece sobre el sistema', () => {
    localStorage.setItem('estadix-tema', 'oscuro');
    sistemaEnOscuro();
    expect(new ThemeService().modo()).toBe('oscuro');
  });

  it('alternar cambia el tema y lo recuerda', () => {
    const s = new ThemeService();
    s.alternar();
    expect(s.modo()).toBe('oscuro');
    expect(localStorage.getItem('estadix-tema')).toBe('oscuro');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    s.alternar();
    expect(s.modo()).toBe('claro');
    expect(localStorage.getItem('estadix-tema')).toBe('claro');
  });

  it('no falla si localStorage lanza', () => {
    const orig = Storage.prototype.setItem;
    Storage.prototype.setItem = () => { throw new Error('bloqueado'); };
    const s = new ThemeService();
    expect(() => s.alternar()).not.toThrow();
    expect(s.modo()).toBe('oscuro');
    Storage.prototype.setItem = orig;
  });
});
