// Hero (#home) — première impression du site
// ===========================================
// Le plafond baroque en pleine page, voilé d'encre pour la lisibilité ;
// en bas, le lettrage d'affiche « DESIGNER & DEVELOPER » à gauche, l'intro et
// les appels à l'action à droite. Le bouton Swarm lance la reconstruction de la
// page par une nuée de curseurs (souris uniquement, cf. SCSS).
//
// La <section id="home"> est fournie par app.html : ce composant ne rend que
// son contenu. La parallaxe est en CSS pur (scroll-driven animation).

import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { RevealDirective } from '../../../directives/reveal.directive';
import { ScrollService } from '../../../services/scroll.service';
import { SwarmService } from '../../../services/swarm.service';

type HeroTarget = 'work' | 'contact';

@Component({
  selector: 'app-hero',
  imports: [RevealDirective],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent {
  private readonly scroll = inject(ScrollService);
  private readonly swarm = inject(SwarmService);

  /** Script en cours de chargement : bouton désactivé, libellé « Chargement… ». */
  protected readonly swarmLoading = this.swarm.loading;
  /** Rien à relancer tant que l'effet charge ou tourne. */
  protected readonly swarmBusy = computed(() => this.swarm.loading() || this.swarm.running());

  /**
   * Défilement doux vers une section. Les clics « ouvrir dans un nouvel
   * onglet » (Ctrl/⌘/Maj, bouton du milieu) gardent le comportement du lien.
   */
  protected goTo(event: MouseEvent, id: HeroTarget): void {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    this.scroll.scrollToSection(id);
  }

  protected startSwarm(): void {
    void this.swarm.start();
  }
}
