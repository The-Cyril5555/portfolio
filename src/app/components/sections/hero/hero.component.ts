// Hero (#home) — première impression du site
// ===========================================
// Le plafond baroque en pleine page, voilé d'encre pour la lisibilité ;
// en bas, le lettrage d'affiche « DESIGNER & DEVELOPER » à gauche, l'intro et
// les appels à l'action à droite. Le bouton Swarm lance la reconstruction de la
// page par une nuée de curseurs (souris uniquement, cf. SCSS).
//
// La <section id="home"> est fournie par app.html : ce composant ne rend que
// son contenu. La parallaxe est en CSS pur (scroll-driven animation).
// Pas d'appReveal ici : le premier écran est visible (et focusable) dès le
// premier rendu — un fondu retarderait le LCP, et le bas de l'écran, hors de
// la zone observée, resterait transparent jusqu'au premier défilement.

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { ScrollService } from '../../../services/scroll.service';
import { SwarmService } from '../../../services/swarm.service';

type HeroTarget = 'work' | 'contact';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrls: ['./hero.component.scss', './hero.fit.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.is-font-ready]': 'fontReady()',
  },
})
export class HeroComponent {
  private readonly scroll = inject(ScrollService);
  private readonly swarm = inject(SwarmService);
  private readonly injector = inject(Injector);
  private readonly swarmButton = viewChild<ElementRef<HTMLButtonElement>>('swarmButton');

  /** Script en cours de chargement : bouton désactivé, libellé « Chargement… ». */
  protected readonly swarmLoading = this.swarm.loading;
  /** Rien à relancer tant que l'effet charge ou tourne. */
  protected readonly swarmBusy = computed(() => this.swarm.loading() || this.swarm.running());

  /**
   * Police du lettrage (Tusker) chargée, en échec, ou attendue plus de 3 s : le
   * lettrage s'affiche, et peut passer à la ligne si l'utilisateur élargit le
   * texte (cf. hero.fit.scss). Avant, il reste invisible, comme avec
   * font-display: block, pour ne pas sauter à l'arrivée de la police (CLS).
   */
  protected readonly fontReady = signal(false);

  constructor() {
    const fonts = typeof document === 'undefined' ? undefined : document.fonts;
    const font = '1em "Tusker Grotesk"';
    const ready = () => this.fontReady.set(true);
    // déjà là (navigation suivante) : affiché dès le premier rendu
    if (!fonts || fonts.check(font)) {
      ready();
      return;
    }
    fonts.load(font).then(ready, ready); // lance aussi le téléchargement, sans attendre le CSS
    setTimeout(ready, 3000);
  }

  /**
   * Défilement doux vers une section. Les clics « ouvrir dans un nouvel
   * onglet » (Ctrl/⌘/Maj, bouton du milieu) gardent le comportement du lien.
   */
  protected goTo(event: MouseEvent, id: HeroTarget): void {
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    this.scroll.scrollToSection(id);
  }

  /**
   * Lance l'effet, puis rend le focus au bouton quand il se termine (ou échoue),
   * comme à la fermeture d'une modale : SwarmService le retire au lancement.
   * Lancé au clavier, la vue revient au bouton ; à la souris, elle ne bouge pas.
   */
  protected async startSwarm(): Promise<void> {
    const button = this.swarmButton()?.nativeElement;
    const preventScroll = !button?.matches(':focus-visible');
    await this.swarm.start();
    if (this.swarm.running()) await once('swarm:exit');
    // le bouton (désactivé pendant l'effet) redevient actif au rendu suivant
    afterNextRender(() => button?.focus({ preventScroll }), { injector: this.injector });
  }
}

function once(type: string): Promise<void> {
  return new Promise((resolve) => window.addEventListener(type, () => resolve(), { once: true }));
}
