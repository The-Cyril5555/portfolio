import { Injectable, OnDestroy } from '@angular/core';

/**
 * Registre des éléments « à révéler » au scroll.
 *
 * Un seul IntersectionObserver partagé pour toute la page. La directive
 * `appReveal` y inscrit son hôte ; quand il entre dans le viewport, la classe
 * `is-visible` est ajoutée (la transition est en CSS, cf. styles/_ui.scss).
 *
 * `revealAll()` affiche immédiatement tout ce qui ne l'est pas encore :
 * utilisé avant l'effet Swarm, qui photographie la page entière et
 * reconstruirait sinon des blocs invisibles.
 */
@Injectable({ providedIn: 'root' })
export class RevealService implements OnDestroy {
  private readonly pending = new Set<Element>();
  private observer?: IntersectionObserver;

  /** false si l'utilisateur demande moins d'animations (ou environnement sans matchMedia). */
  readonly motionAllowed =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    typeof IntersectionObserver !== 'undefined' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  observe(el: Element): void {
    if (!this.motionAllowed) return;
    this.pending.add(el);
    this.getObserver().observe(el);
  }

  unobserve(el: Element): void {
    this.pending.delete(el);
    this.observer?.unobserve(el);
  }

  /** Révèle tout de suite, sans transition, chaque élément encore caché. */
  revealAll(): void {
    for (const el of this.pending) {
      el.classList.add('is-visible', 'is-instant');
      this.observer?.unobserve(el);
    }
    this.pending.clear();
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
    this.pending.clear();
  }

  private getObserver(): IntersectionObserver {
    this.observer ??= new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          this.observer?.unobserve(entry.target);
          this.pending.delete(entry.target);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    return this.observer;
  }
}
