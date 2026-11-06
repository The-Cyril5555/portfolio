import { Injectable, signal } from '@angular/core';

/**
 * Navigation dans la page unique.
 *
 * - `activeSection` : id de la section visible (scroll-spy), lu par la nav et le SEO.
 * - `scrollToSection(id)` : défilement natif ; l'arrêt sous la nav fixe est géré
 *   en CSS par `scroll-padding-top` (styles/_base.scss), et le défilement doux
 *   est coupé quand l'utilisateur demande moins d'animations.
 */
@Injectable({ providedIn: 'root' })
export class ScrollService {
  readonly activeSection = signal<string>('home');

  private observer?: IntersectionObserver;
  private readonly ratios = new Map<string, number>();

  initScrollSpy(): void {
    if (typeof IntersectionObserver === 'undefined') return;
    const sections = document.querySelectorAll<HTMLElement>('main section[id]');

    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          this.ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        // La section qui occupe la plus grande part de la bande centrale gagne
        let best = '';
        let bestRatio = 0;
        for (const [id, ratio] of this.ratios) {
          if (ratio > bestRatio) {
            best = id;
            bestRatio = ratio;
          }
        }
        if (best && best !== this.activeSection()) this.activeSection.set(best);
      },
      // bande d'observation : sous la nav, jusqu'à 40 % du bas de l'écran
      { rootMargin: '-80px 0px -40% 0px', threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((section) => this.observer!.observe(section));
  }

  scrollToSection(sectionId: string): void {
    const target = document.getElementById(sectionId);
    if (!target) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    // Le focus suit le défilement (lecteurs d'écran / clavier) sans re-scroller
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  }

  destroy(): void {
    this.observer?.disconnect();
    this.ratios.clear();
  }
}
