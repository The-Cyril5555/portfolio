import { ChangeDetectionStrategy, Component } from '@angular/core';

/** Pied de page du site (rempli à l'étape Contact/footer). */
@Component({
  selector: 'app-site-footer',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="container"><p>© {{ year }} Cyril Bizouarn</p></div>`,
  styles: `:host { display: block; }`,
})
export class SiteFooterComponent {
  protected readonly year = new Date().getFullYear();
}
