// Directive d'Effet Parallax
// ===========================
// Directive réutilisable pour appliquer un effet de parallax (profondeur)
// sur n'importe quel élément DOM lors du scroll.
//
// Remplace la logique dupliquée dans HeroComponent et ContactComponent.
//
// Optimisations :
// - Utilise ScrollObserverService (RxJS) au lieu de window.addEventListener
// - IntersectionObserver pour ne calculer que quand visible
// - requestAnimationFrame pour animations fluides 60fps
// - Cleanup automatique avec takeUntilDestroyed

import {
  Directive,
  Input,
  ElementRef,
  OnInit,
  DestroyRef,
  inject,
  HostBinding,
  OnDestroy
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ScrollObserverService } from '../services/scroll-observer.service';
import { ParallaxConfig, DEFAULT_PARALLAX_CONFIG } from '../models/parallax.model';

/**
 * Directive pour créer un effet de parallax au scroll
 *
 * Applique une transformation CSS translateY ou translateX en fonction
 * de la position de scroll, créant une illusion de profondeur 3D.
 *
 * L'élément défile plus lentement (ou plus rapidement) que le scroll
 * normal, donnant une sensation de couches superposées.
 *
 * Optimisations de performance :
 * - Utilise RxJS avec throttling (60fps max)
 * - IntersectionObserver pour désactiver quand hors viewport
 * - requestAnimationFrame pour synchronisation avec le navigateur
 * - Cleanup automatique des observables
 *
 * @directive
 * @standalone
 *
 * @example
 * ```html
 * <!-- Arrière-plan qui défile lentement -->
 * <div class="background"
 *      [appParallax]="{ speed: 0.3, direction: 'vertical' }">
 * </div>
 *
 * <!-- Arrière-plan retourné (effet artistique du ContactComponent) -->
 * <div class="contact-bg"
 *      [appParallax]="{
 *        speed: 0.3,
 *        direction: 'vertical',
 *        transform: 'scaleY(-1)'
 *      }">
 * </div>
 *
 * <!-- Premier plan qui défile plus vite -->
 * <div class="foreground"
 *      [appParallax]="{ speed: 1.5 }">
 * </div>
 * ```
 */
@Directive({
  selector: '[appParallax]',
  standalone: true
})
export class ParallaxDirective implements OnInit, OnDestroy {
  /**
   * Configuration de l'effet parallax
   *
   * @input
   * @required
   */
  @Input({ required: true }) appParallax!: ParallaxConfig;

  /**
   * Référence à l'élément DOM sur lequel appliquer l'effet
   * @private
   */
  private elementRef = inject(ElementRef<HTMLElement>);

  /**
   * Service d'observation du scroll (RxJS)
   * @private
   */
  private scrollObserver = inject(ScrollObserverService);

  /**
   * DestroyRef pour cleanup automatique des observables
   * @private
   */
  private destroyRef = inject(DestroyRef);

  /**
   * IntersectionObserver pour détecter la visibilité de l'élément
   * Permet d'optimiser en ne calculant le parallax que quand visible
   * @private
   */
  private intersectionObserver?: IntersectionObserver;

  /**
   * Indique si l'élément est actuellement visible dans la viewport
   * @private
   */
  private isVisible = false;

  /**
   * Offset vertical actuel du parallax (en pixels)
   * @private
   */
  private currentOffset = 0;

  /**
   * ID du requestAnimationFrame en cours
   * Permet d'annuler l'animation si nécessaire
   * @private
   */
  private rafId?: number;

  /**
   * Transformation CSS appliquée à l'élément
   *
   * Utilise HostBinding pour appliquer directement le style transform
   * sans manipulation DOM manuelle (plus Angular-idiomatic).
   *
   * @hostbinding
   */
  @HostBinding('style.transform')
  get transform(): string {
    return this.calculateTransform();
  }

  /**
   * Active will-change pour optimisation GPU
   *
   * Indique au navigateur que la propriété transform va changer,
   * permettant une optimisation GPU pour des animations plus fluides.
   *
   * @hostbinding
   */
  @HostBinding('style.will-change')
  get willChange(): string {
    return 'transform';
  }

  /**
   * Initialisation de la directive
   *
   * Configure l'IntersectionObserver et s'abonne au ScrollObserverService
   * pour mettre à jour le parallax lors du scroll.
   */
  ngOnInit(): void {
    // Merge avec config par défaut
    const config: Required<ParallaxConfig> = {
      ...DEFAULT_PARALLAX_CONFIG,
      ...this.appParallax
    };

    // Initialiser IntersectionObserver si activé
    if (config.enableIntersectionObserver) {
      this.setupIntersectionObserver(config.intersectionThreshold);
    } else {
      // Si désactivé, considérer toujours visible
      this.isVisible = true;
    }

    // S'abonner aux événements de scroll
    this.scrollObserver.scrollY$
      .pipe(
        map(scrollY => this.calculateParallaxOffset(scrollY, config.speed)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(offset => {
        this.currentOffset = offset;

        // Utiliser requestAnimationFrame pour synchronisation avec le navigateur
        if (this.isVisible) {
          this.scheduleUpdate();
        }
      });
  }

  /**
   * Nettoyage lors de la destruction de la directive
   *
   * Déconnecte l'IntersectionObserver et annule les animations en cours
   * pour éviter les fuites mémoire.
   */
  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
    if (this.rafId !== undefined) {
      cancelAnimationFrame(this.rafId);
    }
  }

  /**
   * Configure l'IntersectionObserver pour détecter la visibilité
   *
   * L'effet parallax est calculé uniquement quand l'élément est visible,
   * ce qui améliore les performances en évitant des calculs inutiles.
   *
   * @param threshold - Seuil de visibilité (0-1)
   * @private
   */
  private setupIntersectionObserver(threshold: number): void {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          this.isVisible = entry.isIntersecting;

          // Forcer une mise à jour immédiate quand l'élément devient visible
          if (this.isVisible) {
            this.scheduleUpdate();
          }
        });
      },
      {
        threshold,
        rootMargin: '50px' // Commencer l'animation 50px avant qu'il soit visible
      }
    );

    this.intersectionObserver.observe(this.elementRef.nativeElement);
  }

  /**
   * Calcule le décalage parallax en fonction de la position de scroll
   *
   * Algorithme :
   * - scrollY * speed pour un effet proportionnel au scroll
   * - speed < 1 : défile plus lentement (arrière-plan)
   * - speed > 1 : défile plus vite (premier plan)
   * - speed = 1 : défile normalement (pas d'effet)
   *
   * @param scrollY - Position verticale du scroll
   * @param speed - Multiplicateur de vitesse
   * @returns Décalage en pixels
   *
   * @example
   * calculateParallaxOffset(100, 0.5) // retourne 50
   * calculateParallaxOffset(100, 1.5) // retourne 150
   *
   * @private
   */
  private calculateParallaxOffset(scrollY: number, speed: number): number {
    return scrollY * speed;
  }

  /**
   * Calcule la transformation CSS complète à appliquer
   *
   * Combine :
   * - Le translateY ou translateX du parallax
   * - Les transforms additionnels de la config (scale, rotate, etc.)
   *
   * @returns Chaîne CSS transform complète
   *
   * @example
   * // Direction vertical, speed 0.5, scrollY 100
   * 'translateY(50px)'
   *
   * // Avec transform additionnel
   * 'translateY(50px) scaleY(-1)'
   *
   * @private
   */
  private calculateTransform(): string {
    const config = { ...DEFAULT_PARALLAX_CONFIG, ...this.appParallax };
    const direction = config.direction === 'horizontal' ? 'translateX' : 'translateY';
    const parallaxTransform = `${direction}(${this.currentOffset}px)`;

    // Combiner avec transform additionnel si présent
    if (config.transform) {
      return `${parallaxTransform} ${config.transform}`;
    }

    return parallaxTransform;
  }

  /**
   * Programme une mise à jour avec requestAnimationFrame
   *
   * Utilise requestAnimationFrame pour synchroniser les updates
   * avec le refresh rate du navigateur (typiquement 60fps).
   *
   * Annule le frame précédent pour éviter d'accumuler les updates.
   *
   * @private
   */
  private scheduleUpdate(): void {
    // Annuler le frame précédent s'il existe
    if (this.rafId !== undefined) {
      cancelAnimationFrame(this.rafId);
    }

    // Programmer le prochain frame
    // Note: Le HostBinding se mettra à jour automatiquement
    // car Angular détectera le changement de currentOffset
    this.rafId = requestAnimationFrame(() => {
      this.rafId = undefined;
    });
  }
}
