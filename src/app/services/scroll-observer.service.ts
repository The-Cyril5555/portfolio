// Service d'Observation du Scroll (RxJS)
// =======================================
// Service centralisé pour gérer tous les événements de scroll de l'application
// avec RxJS au lieu de window.addEventListener manuel.
//
// Avantages :
// - Un seul écouteur de scroll partagé entre tous les composants (performance)
// - Throttling automatique pour 60fps
// - Cleanup automatique avec takeUntilDestroyed
// - Testable avec des mocks RxJS
// - Évite les fuites mémoire

import { Injectable, DestroyRef, inject } from '@angular/core';
import { fromEvent, Observable, combineLatest } from 'rxjs';
import {
  map,
  throttleTime,
  shareReplay,
  distinctUntilChanged,
  pairwise,
  startWith
} from 'rxjs/operators';

/**
 * Direction du scroll (haut ou bas)
 */
export type ScrollDirection = 'up' | 'down' | 'none';

/**
 * Interface pour la position de scroll complète
 */
export interface ScrollPosition {
  x: number;
  y: number;
}

/**
 * Interface pour les métriques de scroll
 */
export interface ScrollMetrics {
  scrollY: number;
  scrollX: number;
  direction: ScrollDirection;
  speed: number;
  isScrolled: boolean;
  scrollPercentage: number;
}

/**
 * Service d'observation du scroll avec RxJS
 *
 * Centralise tous les événements de scroll de l'application dans des
 * Observables RxJS réactifs. Remplace les window.addEventListener manuels
 * qui étaient dispersés dans les composants.
 *
 * Optimisations de performance :
 * - Un seul écouteur de scroll pour toute l'application
 * - Throttling à 16ms (60fps) pour éviter trop de calculs
 * - shareReplay(1) pour multicast vers tous les abonnés
 * - distinctUntilChanged pour éviter les émissions dupliquées
 *
 * @service
 * @providedIn 'root'
 *
 * @example
 * ```typescript
 * // Dans un composant
 * constructor(private scrollObserver: ScrollObserverService) {}
 *
 * ngOnInit() {
 *   // S'abonner à la position de scroll
 *   this.scrollObserver.scrollY$
 *     .pipe(
 *       map(scrollY => scrollY * 0.5), // Effet parallax
 *       takeUntilDestroyed(this.destroyRef)
 *     )
 *     .subscribe(offset => this.parallaxOffset.set(offset));
 *
 *   // Ou utiliser les métriques complètes
 *   this.scrollObserver.metrics$
 *     .pipe(takeUntilDestroyed(this.destroyRef))
 *     .subscribe(metrics => {
 *       console.log('Scroll à', metrics.scrollPercentage, '%');
 *     });
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class ScrollObserverService {
  /**
   * Seuil de scroll (en pixels) pour considérer la page comme "scrolled"
   * Utilisé pour activer/désactiver certains effets (navbar transparente, etc.)
   * @private
   */
  private readonly SCROLL_THRESHOLD = 50;

  /**
   * Throttle time en millisecondes pour limiter le nombre d'événements
   * 16ms = ~60fps pour des animations fluides
   * @private
   */
  private readonly THROTTLE_TIME_MS = 16;

  // ========================================
  // Observables de base
  // ========================================

  /**
   * Observable de l'événement de scroll brut
   * Throttlé à 60fps et partagé entre tous les abonnés
   * @private
   */
  private scroll$ = fromEvent(window, 'scroll').pipe(
    throttleTime(this.THROTTLE_TIME_MS, undefined, { leading: true, trailing: true }),
    shareReplay(1)
  );

  /**
   * Observable de l'événement de resize de fenêtre
   * Nécessaire pour recalculer les pourcentages de scroll
   * @private
   */
  private resize$ = fromEvent(window, 'resize').pipe(
    throttleTime(this.THROTTLE_TIME_MS),
    shareReplay(1)
  );

  // ========================================
  // Observables publics - Position
  // ========================================

  /**
   * Observable de la position verticale du scroll (en pixels)
   *
   * Émet la valeur de window.scrollY à chaque scroll throttlé à 60fps.
   * Utilisé principalement pour les effets parallax.
   *
   * @example
   * ```typescript
   * this.scrollObserver.scrollY$
   *   .pipe(map(y => y * 0.3))
   *   .subscribe(offset => this.parallaxOffset.set(offset));
   * ```
   */
  readonly scrollY$: Observable<number> = this.scroll$.pipe(
    map(() => window.scrollY),
    distinctUntilChanged(),
    shareReplay(1)
  );

  /**
   * Observable de la position horizontale du scroll (en pixels)
   *
   * Rarement utilisé dans les single-page apps verticales,
   * mais disponible pour les cas d'usage spécifiques.
   */
  readonly scrollX$: Observable<number> = this.scroll$.pipe(
    map(() => window.scrollX),
    distinctUntilChanged(),
    shareReplay(1)
  );

  /**
   * Observable de la position complète (x, y)
   *
   * Combine scrollX et scrollY dans un seul objet.
   */
  readonly position$: Observable<ScrollPosition> = combineLatest([
    this.scrollX$,
    this.scrollY$
  ]).pipe(
    map(([x, y]) => ({ x, y })),
    shareReplay(1)
  );

  // ========================================
  // Observables publics - Direction
  // ========================================

  /**
   * Observable de la direction du scroll (up, down, none)
   *
   * Compare la position actuelle avec la précédente pour déterminer
   * si l'utilisateur scroll vers le haut ou vers le bas.
   *
   * Utile pour :
   * - Cacher/afficher la navbar au scroll
   * - Animations différentes selon la direction
   *
   * @example
   * ```typescript
   * this.scrollObserver.direction$
   *   .subscribe(direction => {
   *     if (direction === 'down') {
   *       this.hideNavbar();
   *     } else if (direction === 'up') {
   *       this.showNavbar();
   *     }
   *   });
   * ```
   */
  readonly direction$: Observable<ScrollDirection> = this.scrollY$.pipe(
    startWith(0),
    pairwise(),
    map(([previous, current]) => {
      if (current > previous) return 'down';
      if (current < previous) return 'up';
      return 'none';
    }),
    distinctUntilChanged(),
    shareReplay(1)
  );

  // ========================================
  // Observables publics - Métriques
  // ========================================

  /**
   * Observable indiquant si l'utilisateur a scrollé (dépassé le seuil)
   *
   * Émet true quand scrollY > SCROLL_THRESHOLD (50px par défaut).
   * Utilisé pour activer l'effet liquid glass de la navbar.
   *
   * @example
   * ```typescript
   * this.scrollObserver.isScrolled$
   *   .subscribe(isScrolled => this.navbarTransparent.set(!isScrolled));
   * ```
   */
  readonly isScrolled$: Observable<boolean> = this.scrollY$.pipe(
    map(scrollY => scrollY > this.SCROLL_THRESHOLD),
    distinctUntilChanged(),
    shareReplay(1)
  );

  /**
   * Observable du pourcentage de scroll de la page (0-100)
   *
   * Calcule le pourcentage de défilement de la page totale.
   * 0% = haut de page, 100% = bas de page
   *
   * Prend en compte les changements de taille de fenêtre.
   *
   * @example
   * ```typescript
   * this.scrollObserver.scrollPercentage$
   *   .subscribe(percent => this.progressBar.set(percent));
   * ```
   */
  readonly scrollPercentage$: Observable<number> = combineLatest([
    this.scrollY$,
    this.resize$.pipe(startWith(null))
  ]).pipe(
    map(() => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollableHeight = documentHeight - windowHeight;

      if (scrollableHeight === 0) return 0;

      const percentage = (window.scrollY / scrollableHeight) * 100;
      return Math.min(100, Math.max(0, percentage));
    }),
    distinctUntilChanged(),
    shareReplay(1)
  );

  /**
   * Observable de la vitesse de scroll (pixels par frame)
   *
   * Calcule la différence de position entre deux frames.
   * Valeur absolue (toujours positive).
   *
   * Utile pour adapter l'intensité des animations à la vitesse de scroll.
   */
  readonly scrollSpeed$: Observable<number> = this.scrollY$.pipe(
    startWith(0),
    pairwise(),
    map(([previous, current]) => Math.abs(current - previous)),
    shareReplay(1)
  );

  /**
   * Observable regroupant toutes les métriques de scroll
   *
   * Combine toutes les informations de scroll dans un seul objet.
   * Pratique quand on a besoin de plusieurs métriques simultanément.
   *
   * @example
   * ```typescript
   * this.scrollObserver.metrics$
   *   .subscribe(metrics => {
   *     console.log(`Scrollé à ${metrics.scrollY}px (${metrics.scrollPercentage}%)`);
   *     console.log(`Direction: ${metrics.direction}, Vitesse: ${metrics.speed}px/frame`);
   *   });
   * ```
   */
  readonly metrics$: Observable<ScrollMetrics> = combineLatest([
    this.scrollY$,
    this.scrollX$,
    this.direction$,
    this.scrollSpeed$,
    this.isScrolled$,
    this.scrollPercentage$
  ]).pipe(
    map(([scrollY, scrollX, direction, speed, isScrolled, scrollPercentage]) => ({
      scrollY,
      scrollX,
      direction,
      speed,
      isScrolled,
      scrollPercentage
    })),
    shareReplay(1)
  );

  // ========================================
  // Méthodes utilitaires
  // ========================================

  /**
   * Récupère la position de scroll actuelle de manière synchrone
   *
   * Alternative synchrone aux observables pour les cas où on a besoin
   * de la valeur immédiatement sans s'abonner.
   *
   * @returns Position de scroll actuelle {x, y}
   */
  getCurrentPosition(): ScrollPosition {
    return {
      x: window.scrollX,
      y: window.scrollY
    };
  }

  /**
   * Récupère le pourcentage de scroll actuel de manière synchrone
   *
   * @returns Pourcentage de scroll (0-100)
   */
  getCurrentScrollPercentage(): number {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollableHeight = documentHeight - windowHeight;

    if (scrollableHeight === 0) return 0;

    const percentage = (window.scrollY / scrollableHeight) * 100;
    return Math.min(100, Math.max(0, percentage));
  }

  /**
   * Vérifie si l'utilisateur a scrollé au-delà du seuil (synchrone)
   *
   * @returns true si scrollY > SCROLL_THRESHOLD
   */
  isCurrentlyScrolled(): boolean {
    return window.scrollY > this.SCROLL_THRESHOLD;
  }
}
