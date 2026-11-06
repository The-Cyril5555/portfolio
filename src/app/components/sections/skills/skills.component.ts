// Section « Compétences » (#skills)
// =================================
// Trois familles (front, back, outils) en colonnes ; chaque techno est une
// pastille icône + nom, libellé toujours visible. Les icônes sont des SVG
// locaux rendus en masque monochrome (couleur de l'encre).
// La <section id="skills"> englobante est fournie par app.html.

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective } from '../../../directives/reveal.directive';
import { TECHNOLOGIES, TECHNOLOGY_GROUPS } from '../../../data/technologies.data';
import { Technology, TechnologyGroup } from '../../../models/technology.model';

interface SkillItem extends Technology {
  /** Valeur de la variable CSS --icon (mask-image). */
  iconCss: string;
}

interface SkillColumn {
  id: TechnologyGroup;
  title: string;
  /** Compteur affiché sur deux chiffres (« 09 »), façon catalogue. */
  count: string;
  items: SkillItem[];
}

@Component({
  selector: 'app-skills',
  imports: [RevealDirective],
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SkillsComponent {
  /** Données statiques : calculées une fois, aucun état d'UI à suivre. */
  protected readonly groups: SkillColumn[] = TECHNOLOGY_GROUPS.map(({ id, title }) => {
    const items = TECHNOLOGIES.filter((t) => t.group === id).map((t) => ({
      ...t,
      iconCss: `url(${t.icon})`,
    }));
    return { id, title, count: String(items.length).padStart(2, '0'), items };
  });
}
