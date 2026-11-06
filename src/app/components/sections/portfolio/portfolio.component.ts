import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PROJECTS } from '../../../data/projects.data';
import { Project } from '../../../models/project.model';
import { RevealDirective } from '../../../directives/reveal.directive';

/** Largeur de chaque carte (sur 12 colonnes, ≥ 1024px), dans l'ordre de PROJECTS. */
const SPANS = [7, 5, 4, 4, 4, 5] as const;

/** Largeur rendue de l'image selon la colonne occupée (attribut `sizes`). */
const SIZES: Record<number, string> = {
  7: '(min-width: 1024px) min(58vw, 780px), 94vw',
  5: '(min-width: 1024px) min(42vw, 560px), (min-width: 768px) 46vw, 94vw',
  4: '(min-width: 1024px) min(34vw, 450px), (min-width: 768px) 46vw, 94vw',
};

interface WorkCard {
  project: Project;
  /** Titre affiché : pas de coupure de ligne après un trait d'union (« e-commerce »). */
  heading: string;
  span: number;
  src: string;
  srcset: string;
  sizes: string;
}

function toCard(project: Project, index: number): WorkCard {
  const { base, widths } = project.image;
  const span = SPANS[index] ?? 4;
  return {
    project,
    heading: project.title.replace(/-/g, '-\u2060'),
    span,
    src: `${base}-${widths[0]}.webp`,
    srcset: widths.map((w) => `${base}-${w}.webp ${w}w`).join(', '),
    sizes: SIZES[span],
  };
}

/**
 * Section « Projets » (#work) : accrochage de musée asymétrique.
 * Chaque projet est une peinture encadrée, avec son cartel sous la carte.
 * La balise <section> englobante est fournie par app.html.
 */
@Component({
  selector: 'app-portfolio',
  imports: [RevealDirective],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PortfolioComponent {
  /** Données statiques : pas d'état à suivre, donc pas de signal. */
  protected readonly cards: readonly WorkCard[] = PROJECTS.map(toCard);
  protected readonly githubProfile = 'https://github.com/The-Cyril5555';
  /** Logo GitHub (Octicons « mark-github », 16×16). */
  protected readonly githubPath =
    'M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z';
}
