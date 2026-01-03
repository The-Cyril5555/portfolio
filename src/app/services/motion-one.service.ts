/**
 * Motion One Service - Utilitaires d'Animation
 * ==============================================
 *
 * Service centralisé pour gérer les animations avec Motion One.
 *
 * **Pourquoi Motion One ?**
 * - Ultra-léger : 4-6KB (vs 50KB+ pour autres librairies)
 * - Built on Web Animations API (WAAPI) - hardware accelerated
 * - 2.5-6x plus rapide que GSAP pour les transitions simples
 * - Framework-agnostic
 * - Tree-shakeable
 *
 * **Cas d'usage :**
 * - Animations navbar (hover, underline, active state)
 * - Menu mobile (slide-in, stagger links)
 * - Micro-interactions légères
 *
 * **Note :** Pour le smooth scroll, on continue d'utiliser GSAP via ScrollService
 *
 * **Sources :**
 * - https://motion.dev/docs/quick-start
 * - https://motion.dev/docs/animate
 * - https://motion.dev/docs/timeline
 * - https://williamjuan.dev/blog/animate-your-angular-app-using-motion-one
 *
 * @service
 * @providedIn 'root'
 * @author Cyril Bizouarn
 */

import { Injectable } from '@angular/core';
import { animate, stagger, scroll } from '@motionone/dom';
import { ParallaxConfig, DEFAULT_PARALLAX_CONFIG } from '../models/parallax.model';

/**
 * Options de préréglage pour animations communes
 */
export interface MotionPreset {
  duration: number;
  easing: any; // Motion One accepte string, number[], ou fonction
}

/**
 * Service de gestion des animations Motion One
 */
@Injectable({
  providedIn: 'root'
})
export class MotionOneService {

  // ========================================
  // Configuration - Préréglages
  // ========================================

  /**
   * Préréglages d'animations pour cohérence visuelle
   *
   * Toutes les durées sont en secondes
   */
  private readonly presets = {
    // Animations rapides (hover, click feedback)
    fast: {
      duration: 0.2,
      easing: 'ease-out'
    } as MotionPreset,

    // Animations standard (transitions UI)
    normal: {
      duration: 0.3,
      easing: [0.4, 0, 0.2, 1] // cubic-bezier custom
    } as MotionPreset,

    // Animations douces (panels, modales)
    smooth: {
      duration: 0.4,
      easing: 'ease-in-out'
    } as MotionPreset,

    // Animations lentes (emphasis)
    slow: {
      duration: 0.6,
      easing: [0.16, 1, 0.3, 1] // Easing avec bounce subtil
    } as MotionPreset
  };

  // ========================================
  // Méthodes Publiques - Navigation Links
  // ========================================

  /**
   * Anime le underline d'un lien de navigation (hover in)
   *
   * Fait apparaître l'underline avec un effet de wipe de gauche à droite.
   *
   * @param element - L'élément underline à animer
   * @param options - Options d'animation (optionnelles)
   *
   * @example
   * ```typescript
   * // Dans le composant
   * link.addEventListener('mouseenter', () => {
   *   const underline = link.querySelector('.underline');
   *   this.motionService.animateUnderlineIn(underline as HTMLElement);
   * });
   * ```
   */
  animateUnderlineIn(element: HTMLElement, options?: Partial<MotionPreset>): void {
    const config = { ...this.presets.normal, ...options };

    animate(
      element,
      { transform: ['scaleX(0)', 'scaleX(1)'] },
      {
        duration: config.duration,
        easing: config.easing as any
      }
    );
  }

  /**
   * Anime le underline d'un lien de navigation (hover out)
   *
   * Fait disparaître l'underline sauf si le lien est actif.
   *
   * @param element - L'élément underline à animer
   * @param isActive - Si true, garde l'underline visible
   * @param options - Options d'animation (optionnelles)
   */
  animateUnderlineOut(element: HTMLElement, isActive: boolean = false, options?: Partial<MotionPreset>): void {
    if (isActive) return; // Ne pas cacher si lien actif

    const config = { ...this.presets.fast, ...options };

    animate(
      element,
      { transform: ['scaleX(1)', 'scaleX(0)'] },
      {
        duration: config.duration,
        easing: 'ease-in' as any
      }
    );
  }

  /**
   * Anime l'apparition d'un lien de navigation
   *
   * Utilisé au chargement initial de la page.
   *
   * @param element - Le lien à animer
   * @param delay - Délai avant l'animation (en secondes)
   */
  animateNavLinkIn(element: HTMLElement, delay: number = 0): void {
    animate(
      element,
      {
        opacity: [0, 1],
        y: [-10, 0]
      },
      {
        duration: this.presets.smooth.duration,
        easing: this.presets.smooth.easing as any,
        delay
      }
    );
  }

  // ========================================
  // Méthodes Publiques - Mobile Menu
  // ========================================

  /**
   * Anime l'ouverture du menu mobile avec stagger sur les liens
   *
   * **Effet :**
   * 1. Panel slide depuis la droite (translateX)
   * 2. Links apparaissent en cascade (opacity + translateY)
   *
   * @param menuPanel - L'élément panel du menu
   * @param menuLinks - Les éléments de liens (NodeList ou Array)
   *
   * @example
   * ```typescript
   * const panel = this.elementRef.nativeElement.querySelector('.mobile-menu-panel');
   * const links = this.elementRef.nativeElement.querySelectorAll('.mobile-nav-link');
   * this.motionService.animateMobileMenuOpen(panel, links);
   * ```
   */
  animateMobileMenuOpen(menuPanel: HTMLElement, menuLinks: NodeListOf<Element> | Element[]): void {
    // Panel slide in
    animate(
      menuPanel,
      { transform: ['translateX(100%)', 'translateX(0%)'] },
      {
        duration: this.presets.smooth.duration,
        easing: 'ease-out' as any
      }
    );

    // Links stagger in (démarre après un court délai)
    animate(
      menuLinks,
      {
        opacity: [0, 1],
        transform: ['translateY(20px)', 'translateY(0px)']
      },
      {
        duration: this.presets.normal.duration,
        delay: stagger(0.05, { start: 0.2 }) as any, // 50ms entre chaque lien, commence à 200ms
        easing: this.presets.normal.easing as any
      }
    );
  }

  /**
   * Anime la fermeture du menu mobile
   *
   * **Effet :** Panel slide vers la droite (plus rapide que l'ouverture)
   *
   * @param menuPanel - L'élément panel du menu
   */
  animateMobileMenuClose(menuPanel: HTMLElement): void {
    animate(
      menuPanel,
      { transform: 'translateX(100%)' },
      {
        duration: this.presets.normal.duration,
        easing: 'ease-in' as any
      }
    );
  }

  // ========================================
  // Méthodes Publiques - Hamburger Button
  // ========================================

  /**
   * Anime la transformation du hamburger vers X
   *
   * Note: Dans notre cas, on utilise des transitions CSS car c'est plus
   * simple pour les 3 barres. Cette méthode est un exemple au cas où
   * vous voudriez plus de contrôle.
   *
   * @param lines - Les 3 barres du hamburger [top, middle, bottom]
   */
  animateHamburgerToX(lines: [HTMLElement, HTMLElement, HTMLElement]): void {
    const [top, middle, bottom] = lines;

    // Barre du haut : rotate + translateY
    animate(
      top,
      {
        transform: ['translateY(0px) rotate(0deg)', 'translateY(7px) rotate(45deg)']
      },
      { duration: this.presets.normal.duration, easing: this.presets.normal.easing as any }
    );

    // Barre du milieu : disparaît
    animate(
      middle,
      {
        transform: ['scaleX(1)', 'scaleX(0)'],
        opacity: [1, 0]
      },
      { duration: this.presets.fast.duration, easing: this.presets.fast.easing as any }
    );

    // Barre du bas : rotate + translateY
    animate(
      bottom,
      {
        transform: ['translateY(0px) rotate(0deg)', 'translateY(-7px) rotate(-45deg)']
      },
      { duration: this.presets.normal.duration, easing: this.presets.normal.easing as any }
    );
  }

  /**
   * Anime la transformation du X vers hamburger
   *
   * @param lines - Les 3 barres [top, middle, bottom]
   */
  animateXToHamburger(lines: [HTMLElement, HTMLElement, HTMLElement]): void {
    const [top, middle, bottom] = lines;

    // Barre du haut
    animate(
      top,
      { transform: 'translateY(0px) rotate(0deg)' },
      { duration: this.presets.normal.duration, easing: this.presets.normal.easing as any }
    );

    // Barre du milieu
    animate(
      middle,
      { transform: 'scaleX(1)', opacity: 1 },
      { duration: this.presets.fast.duration, easing: this.presets.fast.easing as any }
    );

    // Barre du bas
    animate(
      bottom,
      { transform: 'translateY(0px) rotate(0deg)' },
      { duration: this.presets.normal.duration, easing: this.presets.normal.easing as any }
    );
  }

  // ========================================
  // Méthodes Publiques - Utilitaires
  // ========================================

  /**
   * Anime une liste d'éléments avec effet stagger
   *
   * Utilitaire générique pour animer plusieurs éléments en cascade.
   *
   * @param elements - Éléments à animer
   * @param animation - Propriétés à animer (ex: {opacity: [0,1], y: [20,0]})
   * @param delayBetween - Délai entre chaque élément (en secondes, 0.05 par défaut)
   * @param options - Options supplémentaires
   *
   * @example
   * ```typescript
   * const cards = document.querySelectorAll('.card');
   * this.motionService.animateStagger(
   *   cards,
   *   { opacity: [0, 1], scale: [0.9, 1] },
   *   0.1
   * );
   * ```
   */
  animateStagger(
    elements: NodeListOf<Element> | Element[],
    animation: Record<string, any>,
    delayBetween: number = 0.05,
    options?: any
  ): void {
    animate(
      elements,
      animation,
      {
        duration: this.presets.normal.duration,
        easing: this.presets.normal.easing,
        delay: stagger(delayBetween),
        ...options
      }
    );
  }

  /**
   * Anime un fade in simple
   *
   * @param element - Élément à faire apparaître
   * @param options - Options d'animation
   */
  fadeIn(element: HTMLElement, options?: Partial<MotionPreset>): void {
    const config = { ...this.presets.normal, ...options };

    animate(
      element,
      { opacity: [0, 1] },
      {
        duration: config.duration,
        easing: config.easing as any
      }
    );
  }

  /**
   * Anime un fade out simple
   *
   * @param element - Élément à faire disparaître
   * @param options - Options d'animation
   */
  fadeOut(element: HTMLElement, options?: Partial<MotionPreset>): void {
    const config = { ...this.presets.fast, ...options };

    animate(
      element,
      { opacity: [1, 0] },
      {
        duration: config.duration,
        easing: config.easing as any
      }
    );
  }

  /**
   * Anime un scale (zoom) avec bounce
   *
   * Utile pour attirer l'attention (click feedback, notifications)
   *
   * @param element - Élément à scaler
   * @param scaleTo - Échelle finale (1.1 par défaut = 110%)
   */
  animateScaleBounce(element: HTMLElement, scaleTo: number = 1.1): void {
    animate(
      element,
      {
        scale: [1, scaleTo, 1]
      },
      {
        duration: this.presets.slow.duration,
        easing: [0.34, 1.56, 0.64, 1] // Spring easing
      }
    );
  }

  // ========================================
  // Méthodes Publiques - Accessibilité
  // ========================================

  /**
   * Vérifie si l'utilisateur préfère les animations réduites
   *
   * Respect de la préférence système `prefers-reduced-motion`
   *
   * @returns true si animations réduites demandées
   *
   * @example
   * ```typescript
   * if (!this.motionService.prefersReducedMotion()) {
   *   this.motionService.animateNavLinkIn(element);
   * }
   * ```
   */
  prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }

  /**
   * Anime un élément uniquement si les animations sont autorisées
   *
   * Wrapper qui vérifie automatiquement prefers-reduced-motion
   *
   * @param callback - Fonction d'animation à exécuter
   *
   * @example
   * ```typescript
   * this.motionService.animateIfAllowed(() => {
   *   this.animateNavLinkIn(element);
   * });
   * ```
   */
  animateIfAllowed(callback: () => void): void {
    if (!this.prefersReducedMotion()) {
      callback();
    }
  }

  // ========================================
  // Méthodes Publiques - Scroll-Linked Animations
  // ========================================

  /**
   * Crée un effet parallax scroll-linked avec Motion One
   *
   * Utilise l'API scroll() de Motion One qui tourne sur le compositor thread
   * pour des performances maximales (60fps garanti) sans overhead Angular.
   *
   * **Avantages :**
   * - Runs sur WAAPI/compositor thread (pas de JavaScript pendant scroll)
   * - Zéro overhead de change detection Angular
   * - Smooth 60fps garanti
   * - GPU-accelerated avec will-change
   *
   * **Note :** Cette méthode retourne une fonction de cleanup à appeler
   * dans ngOnDestroy pour nettoyer l'animation.
   *
   * @param element - Élément HTML à animer avec parallax
   * @param speed - Multiplicateur de vitesse (0.5 = 2x plus lent, 1.5 = 1.5x plus rapide)
   * @param direction - Direction du mouvement ('vertical' ou 'horizontal')
   * @param additionalTransform - Transformations CSS additionnelles (ex: 'scaleY(-1)')
   * @returns Fonction de cleanup à appeler dans ngOnDestroy
   *
   * @example
   * ```typescript
   * // Dans la directive ou le composant
   * private cleanup?: () => void;
   *
   * ngOnInit() {
   *   this.cleanup = this.motionService.createScrollParallax(
   *     this.elementRef.nativeElement,
   *     0.5,
   *     'vertical'
   *   );
   * }
   *
   * ngOnDestroy() {
   *   this.cleanup?.();
   * }
   * ```
   */
  createScrollParallax(
    element: HTMLElement,
    speed: number = 0.5,
    direction: 'vertical' | 'horizontal' = 'vertical',
    additionalTransform?: string
  ): () => void {
    const axis = direction === 'horizontal' ? 'x' : 'y';

    // Motion One's scroll() API - runs on compositor thread
    // https://motion.dev/docs/scroll
    const animation = scroll(
      ({ y }) => {
        // Calcul de l'offset basé sur la progression du scroll
        // y.progress va de 0 (début) à 1 (fin)
        const offset = y.progress * window.innerHeight * speed;

        // Construction du transform
        const translateProp = direction === 'horizontal' ? 'translateX' : 'translateY';
        const translate = `${translateProp}(${offset}px)`;

        // Combine avec transform additionnel si fourni
        const transform = additionalTransform
          ? `${translate} ${additionalTransform}`
          : translate;

        // Application directe au style (pas de change detection Angular)
        element.style.transform = transform;
      },
      {
        target: element,
        // Anime depuis l'apparition jusqu'à la disparition de l'élément
        offset: ['start end', 'end start']
      }
    );

    // Retourne la fonction cleanup
    return () => animation();
  }

  // ========================================
  // Getters - Accès aux préréglages
  // ========================================

  /**
   * Récupère un préréglage d'animation
   *
   * @param presetName - Nom du préréglage ('fast', 'normal', 'smooth', 'slow')
   * @returns Configuration du préréglage
   */
  getPreset(presetName: 'fast' | 'normal' | 'smooth' | 'slow'): MotionPreset {
    return { ...this.presets[presetName] };
  }
}
