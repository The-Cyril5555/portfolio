import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PROJECTS } from '../../../data/projects.data';
import { Project } from '../../../models/project.model';
import { RevealDirective } from '../../../directives/reveal.directive';

/**
 * Accrochage à 12 colonnes (≥ 1280px) : largeur de chaque carte, dans l'ordre
 * de PROJECTS. Rangées 7 + 5, 4 + 4 + 4, puis 7 + carte GitHub en 5 : une œuvre
 * reste toujours plus large que l'appel « hors catalogue ».
 * De 768 à 1279px, deux colonnes : seule la première carte prend toute la ligne.
 */
const SPANS = [7, 5, 4, 4, 4, 7] as const;

/** Largeur de la carte dans l'accrochage à 12 colonnes (conteneur plafonné à 1320px). */
const XL_WIDTH: Record<number, string> = {
  7: 'min(58vw, 780px)',
  5: 'min(42vw, 560px)',
  4: 'min(34vw, 450px)',
};

/**
 * Attribut `sizes` : largeur RENDUE de la peinture pour chaque mise en page.
 * Elle est en `object-fit: cover` ; une peinture paysage dans une boîte haute
 * déborde donc la carte : largeur rendue = max(largeur de carte, hauteur × ratio).
 * Les hauteurs (px, majorées) suivent portfolio.component.scss :
 * - cadre plein (carte ≥ 30rem) : la peinture couvre tout le cadre, --frame-h ou plus ;
 * - cadre étroit : rangée de peinture (13rem au moins) + --overlap (6rem).
 */
function sizesFor(span: number, fullRow: boolean, featured: boolean, ratio: number): string {
  const slot = (width: string, boxHeight: number) =>
    `max(${width}, ${Math.round(boxHeight * ratio)}px)`;
  const half = fullRow ? '94vw' : '46vw';
  return [
    // 12 colonnes : les cartes en 4 sont étroites, les autres en cadre plein
    `(min-width: 1280px) ${slot(XL_WIDTH[span], span === 4 ? 368 : featured ? 660 : 600)}`,
    // 2 colonnes, cartes ≥ 30rem : cadre plein
    `(min-width: 1040px) ${slot(half, 600)}`,
    // 2 colonnes, demi-cartes étroites (la première carte reste en cadre plein)
    `(min-width: 768px) ${slot(half, fullRow ? 620 : 460)}`,
    // 1 colonne, carte ≥ 30rem : cadre plein
    `(min-width: 520px) ${slot('94vw', 660)}`,
    // mobile : 13rem + 6rem
    slot('94vw', 320),
  ].join(', ');
}

interface WorkCard {
  project: Project;
  /** Titre affiché : pas de coupure de ligne après un trait d'union (« e-commerce »). */
  heading: string;
  span: number;
  /** Seule sur sa ligne dans la grille à deux colonnes. */
  fullRow: boolean;
  src: string;
  srcset: string;
  sizes: string;
}

function toCard(project: Project, index: number): WorkCard {
  const { base, widths, ratio } = project.image;
  const span = SPANS[index] ?? 4;
  const fullRow = index === 0;
  return {
    project,
    heading: project.title.replace(/-/g, '-\u2060'),
    span,
    fullRow,
    src: `${base}-${widths[0]}.webp`,
    srcset: widths.map((w) => `${base}-${w}.webp ${w}w`).join(', '),
    sizes: sizesFor(span, fullRow, project.featured, ratio),
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
