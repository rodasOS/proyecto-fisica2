import { beforeEach, describe, expect, it } from 'vitest';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('usa la elección guardada al iniciar', () => {
    localStorage.setItem('sigmalab-tema', 'oscuro');
    const s = new ThemeService();
    expect(s.modo()).toBe('oscuro');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });

  it('sin elección usa claro cuando el sistema no indica oscuro', () => {
    const s = new ThemeService();
    expect(s.modo()).toBe('claro');
    expect(document.documentElement.getAttribute('data-theme')).toBe('light');
  });

  it('alternar cambia el tema y lo recuerda', () => {
    const s = new ThemeService();
    s.alternar();
    expect(s.modo()).toBe('oscuro');
    expect(localStorage.getItem('sigmalab-tema')).toBe('oscuro');
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
    s.alternar();
    expect(s.modo()).toBe('claro');
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
