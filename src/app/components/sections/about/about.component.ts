// Section « À propos » : portrait (bio + peinture encadrée) puis parcours
// ======================================================================

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BIO_PARAGRAPHS, PARCOURS } from '../../../data/about.data';
import { RevealDirective } from '../../../directives/reveal.directive';
import { TimelineComponent } from '../../shared/timeline.component';

@Component({
  selector: 'app-about',
  imports: [RevealDirective, TimelineComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutComponent {
  protected readonly bio = BIO_PARAGRAPHS;
  protected readonly parcours = PARCOURS;

  /** Peinture : chemins relatifs (le site est servi sous /portfolio/). */
  protected readonly painting = {
    src: 'assets/images/paintings/van-de-velde-coup-de-canon-700.webp',
    srcset:
      'assets/images/paintings/van-de-velde-coup-de-canon-700.webp 700w, ' +
      'assets/images/paintings/van-de-velde-coup-de-canon-1200.webp 1200w',
    // largeur réelle de l'image dans son cadre : colonnes 8-12 dès 768px, pleine
    // largeur en dessous (voir about.component.scss)
    sizes: '(min-width: 1440px) 450px, (min-width: 768px) 31vw, calc(100vw - 5rem)',
    width: 700,
    height: 832,
  } as const;
}
