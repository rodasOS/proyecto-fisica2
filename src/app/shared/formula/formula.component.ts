import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import katex from 'katex';

@Component({
  selector: 'app-formula',
  template: `<span [class.bloque]="bloque()" [innerHTML]="html()"></span>`,
  styles: [`.bloque { display: block; overflow-x: auto; overflow-y: hidden; padding: 0.15rem 0; }`],
})
export class FormulaComponent {
  private readonly san = inject(DomSanitizer);
  readonly latex = input.required<string>();
  readonly bloque = input(true);
  readonly html = computed(() => {
    try {
      return this.san.bypassSecurityTrustHtml(
        katex.renderToString(this.latex(), { displayMode: this.bloque(), throwOnError: false, output: 'html' }),
      );
    } catch {
      return this.latex();
    }
  });
}
