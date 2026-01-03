/**
 * Motion Parallax Directive
 * ==========================
 *
 * Directive standalone pour effet parallax scroll-linked utilisant Motion One.
 *
 * **Pourquoi cette directive ?**
 * - Remplace l'ancienne ParallaxDirective qui avait des problèmes de change detection
 * - Utilise Motion One's scroll() API (runs sur compositor thread)
 * - Zéro overhead Angular OnPush change detection
 * - Performance maximale : 60fps garanti
 *
 * **Comment ça marche ?**
 * 1. OnInit : Configure will-change pour GPU optimization
 * 2. Appelle MotionOneService.createScrollParallax()
 * 3. Motion One gère le scroll tracking et applique directement le transform
 * 4. OnDestroy : Cleanup de l'animation et reset will-change
 *
 * **Usage :**
 * ```html
 * <div [appMotionParallax]="{ speed: 0.5, direction: 'vertical' }">
 *   Contenu avec effet parallax
 * </div>
 * ```
 *
 * @directive
 * @standalone
 * @selector [appMotionParallax]
 * @author Cyril Bizouarn
 * @see https://motion.dev/docs/scroll
 */

import {
  Directive,
  Input,
  ElementRef,
  OnInit,
  OnDestroy,
  inject
} from '@angular/core';
import { MotionOneService } from '../services/motion-one.service';
import { ParallaxConfig, DEFAULT_PARALLAX_CONFIG } from '../models/parallax.model';

@Directive({
  selector: '[appMotionParallax]',
  standalone: true
})
export class MotionParallaxDirective implements OnInit, OnDestroy {
  /**
   * Configuration du parallax
   *
   * Propriétés :
   * - speed : Multiplicateur de vitesse (0.5 = 2x plus lent, défaut)
   * - direction : 'vertical' ou 'horizontal' (vertical par défaut)
   * - transform : Transformations CSS additionnelles (ex: 'scaleY(-1)')
   *
   * @required
   */
  @Input({ required: true }) appMotionParallax!: ParallaxConfig;

  // Injection des services
  private elementRef = inject(ElementRef<HTMLElement>);
  private motionService = inject(MotionOneService);

  // Fonction de cleanup pour l'animation
  private cleanup?: () => void;

  /**
   * Initialisation de l'effet parallax
   *
   * Configure :
   * 1. will-change: transform pour GPU optimization
   * 2. Crée l'animation scroll avec Motion One
   * 3. Stocke la fonction cleanup
   */
  ngOnInit(): void {
    // Merge config avec les valeurs par défaut
    const config: Required<ParallaxConfig> = {
      ...DEFAULT_PARALLAX_CONFIG,
      ...this.appMotionParallax
    };

    const element = this.elementRef.nativeElement;

    // Set will-change pour GPU optimization
    // Force le navigateur à créer une nouvelle couche de composition
    element.style.willChange = 'transform';

    // Créer le parallax avec Motion One
    // Ne s'exécute que si les animations sont autorisées
    if (!this.motionService.prefersReducedMotion()) {
      this.cleanup = this.motionService.createScrollParallax(
        element,
        config.speed,
        config.direction,
        config.transform
      );
    } else {
      // Si prefers-reduced-motion, appliquer le transform additionnel uniquement
      if (config.transform) {
        element.style.transform = config.transform;
      }
    }
  }

  /**
   * Nettoyage à la destruction de la directive
   *
   * 1. Appelle la fonction cleanup de Motion One
   * 2. Reset will-change à auto (économie GPU)
   */
  ngOnDestroy(): void {
    const element = this.elementRef.nativeElement;

    // Cleanup de l'animation Motion One
    this.cleanup?.();

    // Reset will-change pour libérer les ressources GPU
    element.style.willChange = 'auto';
  }
}
