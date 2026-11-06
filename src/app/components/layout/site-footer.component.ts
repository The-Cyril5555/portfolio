// Pied de page — le colophon du catalogue
// =======================================
// Ligne 1 : signature (gothique) + plan du site ; ligne 2 : mentions.
// Placé après <main> dans app.html (data-nav-theme="dark" pour la nav).

import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NAV_LINKS } from '../../data/navigation.data';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-site-footer',
  templateUrl: './site-footer.component.html',
  styleUrl: './site-footer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteFooterComponent {
  private readonly scroll = inject(ScrollService);

  protected readonly links = NAV_LINKS;
  protected readonly year = new Date().getFullYear();

  /**
   * Défilement doux vers une section. Les clics « ouvrir dans un nouvel
   * onglet » (Ctrl/⌘/Maj, bouton du milieu) gardent le comportement du lien.
   */
  protected goTo(event: MouseEvent, id: string): void {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    this.scroll.scrollToSection(id);
  }
}
