// Frise verticale du parcours
// ===========================
// Liste ordonnée d'étapes (formation / expérience) reliées par un filet :
// point plein pour une formation, anneau pour une expérience.

import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RevealDirective } from '../../directives/reveal.directive';
import { TimelineItem, TimelineKind } from '../../models/about.model';

@Component({
  selector: 'app-timeline',
  imports: [RevealDirective],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TimelineComponent {
  /** Étapes, dans l'ordre d'affichage. */
  readonly items = input.required<readonly TimelineItem[]>();

  /** id du titre qui nomme la liste (aria-labelledby). */
  readonly labelledBy = input<string>();

  protected readonly kindLabel: Record<TimelineKind, string> = {
    formation: 'Formation',
    experience: 'Expérience',
  };
}
