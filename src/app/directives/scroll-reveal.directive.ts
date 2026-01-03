// Directive d'Animation au Scroll (GSAP)
// ========================================
// Directive réutilisable pour déclencher des animations GSAP quand un élément
// entre dans la viewport lors du scroll.
//
// Remplace la logique hardcodée dans AnimationService par des animations déclaratives.
//
// Optimisations :
// - IntersectionObserver pour détecter l'entrée dans viewport
// - Cleanup automatique des animations GSAP
// - Support stagger pour animer plusieurs éléments enfants
// - Animations prédéfinies + support custom

import {
  Directive,
  Input,
  ElementRef,
  OnInit,
  OnDestroy,
  AfterViewInit,
  inject
} from '@angular/core';
import { gsap } from 'gsap';
import {
  ScrollRevealConfig,
  DEFAULT_SCROLL_REVEAL_CONFIG,
  AnimationType
} from '../models/animation.model';

/**
 * Directive pour déclencher des animations GSAP au scroll
 *
 * Anime automatiquement un élément quand il entre dans la viewport.
 * Supporte des animations prédéfinies (fadeIn, slideIn, etc.) ou personnalisées.
 *
 * Utilise IntersectionObserver pour détecter l'entrée dans la viewport,
 * puis GSAP pour exécuter l'animation de manière fluide.
 *
 * Optimisations de performance :
 * - IntersectionObserver (pas de scroll listener)
 * - Animation joue une seule fois par défaut
 * - Cleanup automatique des timelines GSAP
 * - will-change appliqué automatiquement
 *
 * @directive
 * @standalone
 *
 * @example
 * ```html
 * <!-- Animation simple -->
 * <div [appScrollReveal]="{ animation: 'fadeInUp', duration: 800 }">
 *   Texte qui apparaît
 * </div>
 *
 * <!-- Animation avec stagger sur les enfants -->
 * <div [appScrollReveal]="{
 *   animation: 'fadeInUp',
 *   stagger: true,
 *   staggerDelay: 100
 * }">
 *   <div class="card">Card 1</div>
 *   <div class="card">Card 2</div>
 *   <div class="card">Card 3</div>
 * </div>
 *
 * <!-- Animation personnalisée -->
 * <div [appScrollReveal]="{
 *   animation: 'custom',
 *   customAnimation: { x: -100, rotation: 360, opacity: 0 },
 *   duration: 1000,
 *   ease: 'back.out'
 * }">
 *   Animation custom
 * </div>
 * ```
 */
@Directive({
  selector: '[appScrollReveal]',
  standalone: true
})
export class ScrollRevealDirective implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Configuration de l'animation
   *
   * @input
   * @required
   */
  @Input({ required: true }) appScrollReveal!: ScrollRevealConfig;

  /**
   * Référence à l'élément DOM à animer
   * @private
   */
  private elementRef = inject(ElementRef<HTMLElement>);

  /**
   * IntersectionObserver pour détecter l'entrée dans la viewport
   * @private
   */
  private intersectionObserver?: IntersectionObserver;

  /**
   * Timeline GSAP de l'animation
   * Stockée pour cleanup
   * @private
   */
  private timeline?: gsap.core.Timeline;

  /**
   * Indique si l'animation a déjà été jouée
   * Utilisé pour éviter de rejouer si repeat = false
   * @private
   */
  private hasPlayed = false;

  /**
   * Initialisation de la directive (lifecycle hook)
   *
   * Note: L'initialisation se fait dans ngAfterViewInit pour s'assurer
   * que tous les éléments enfants sont rendus (important pour stagger).
   */
  ngOnInit(): void {
    // Intentionally empty - initialization moved to ngAfterViewInit
  }

  /**
   * Après l'initialisation de la vue
   *
   * Configure l'IntersectionObserver et l'état initial APRÈS que tous
   * les enfants sont rendus. Crucial pour les animations stagger car
   * les enfants doivent exister avant d'appliquer l'état initial.
   */
  ngAfterViewInit(): void {
    const config = { ...DEFAULT_SCROLL_REVEAL_CONFIG, ...this.appScrollReveal };

    // Utiliser setTimeout pour éviter ExpressionChangedAfterItHasBeenCheckedError
    // et s'assurer que tous les enfants @for sont bien rendus
    setTimeout(() => {
      // Initialiser l'état de départ de l'animation
      this.setInitialState(config);

      // Configurer IntersectionObserver
      this.setupIntersectionObserver(config);
    }, 0);
  }

  /**
   * Nettoyage lors de la destruction
   *
   * Déconnecte l'observer et tue la timeline GSAP.
   */
  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
    this.timeline?.kill();
  }

  /**
   * Configure l'IntersectionObserver pour détecter l'entrée dans viewport
   *
   * @param config - Configuration complète de l'animation
   * @private
   */
  private setupIntersectionObserver(
    config: Required<Omit<ScrollRevealConfig, 'customAnimation' | 'staggerSelector'>> & {
      customAnimation?: gsap.TweenVars;
      staggerSelector?: string;
    }
  ): void {
    this.intersectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Élément visible, jouer l'animation
            if (!this.hasPlayed || config.repeat) {
              this.playAnimation(config);
              this.hasPlayed = true;

              // Si repeat = false, déconnecter l'observer après la première animation
              if (!config.repeat) {
                this.intersectionObserver?.disconnect();
              }
            }
          } else if (config.repeat && this.hasPlayed) {
            // Si repeat = true et élément sort de la viewport, réinitialiser
            this.resetAnimation(config);
          }
        });
      },
      {
        threshold: config.threshold,
        rootMargin: config.rootMargin
      }
    );

    this.intersectionObserver.observe(this.elementRef.nativeElement);
  }

  /**
   * Définit l'état initial de l'élément avant l'animation
   *
   * Applique les propriétés CSS initiales pour que l'élément soit
   * invisible/décalé avant l'animation.
   *
   * Si stagger = true, applique l'état initial aux ENFANTS, pas au parent.
   *
   * @param config - Configuration de l'animation
   * @private
   */
  private setInitialState(config: ScrollRevealConfig): void {
    const element = this.elementRef.nativeElement;
    const initialState = this.getInitialStateForAnimation(config.animation);

    // Si stagger, appliquer l'état initial aux enfants, pas au parent
    if (config.stagger && this.hasChildren(element)) {
      const children = this.getChildrenForStagger(element, config.staggerSelector);
      gsap.set(children, initialState);

      // will-change sur chaque enfant
      children.forEach(child => {
        child.style.willChange = 'transform, opacity';
      });
    } else {
      // Appliquer l'état initial via GSAP.set pour cohérence
      gsap.set(element, initialState);

      // Ajouter will-change pour optimisation GPU
      element.style.willChange = 'transform, opacity';
    }
  }

  /**
   * Retourne l'état initial (fromVars) pour un type d'animation
   *
   * @param type - Type d'animation
   * @returns Objet GSAP fromVars
   * @private
   */
  private getInitialStateForAnimation(type: AnimationType): gsap.TweenVars {
    switch (type) {
      case 'fadeIn':
        return { opacity: 0 };

      case 'fadeInUp':
        return { y: 50, opacity: 0 };

      case 'fadeInDown':
        return { y: -50, opacity: 0 };

      case 'fadeInLeft':
        return { x: -50, opacity: 0 };

      case 'fadeInRight':
        return { x: 50, opacity: 0 };

      case 'scaleIn':
        return { scale: 0.8, opacity: 0 };

      case 'slideInUp':
        return { y: 50 };

      case 'custom':
        // Pour custom, l'utilisateur doit fournir customAnimation
        return {};

      default:
        return { opacity: 0 };
    }
  }

  /**
   * Joue l'animation GSAP
   *
   * @param config - Configuration complète de l'animation
   * @private
   */
  private playAnimation(
    config: Required<Omit<ScrollRevealConfig, 'customAnimation' | 'staggerSelector'>> & {
      customAnimation?: gsap.TweenVars;
      staggerSelector?: string;
    }
  ): void {
    const element = this.elementRef.nativeElement;

    // Préparer les vars GSAP
    const toVars: gsap.TweenVars = {
      duration: config.duration / 1000, // GSAP utilise secondes, pas ms
      delay: config.delay / 1000,
      ease: config.ease,
      clearProps: 'transform,willChange' // Nettoyer transform et will-change après animation
    };

    // Déterminer les propriétés à animer selon le type
    const animationProps = this.getAnimationPropsForType(config.animation);
    Object.assign(toVars, animationProps);

    // Si animation custom, utiliser customAnimation
    if (config.animation === 'custom' && config.customAnimation) {
      // Pour custom, on part de customAnimation vers l'état normal
      const fromVars = config.customAnimation;
      this.timeline = gsap.timeline();

      if (config.stagger && this.hasChildren(element)) {
        // Stagger sur enfants
        const children = this.getChildrenForStagger(element, config.staggerSelector);
        this.timeline.fromTo(
          children,
          fromVars,
          {
            ...toVars,
            stagger: config.staggerDelay / 1000
          }
        );
      } else {
        // Animation simple
        this.timeline.fromTo(element, fromVars, toVars);
      }
    } else {
      // Animation prédéfinie
      this.timeline = gsap.timeline();

      if (config.stagger && this.hasChildren(element)) {
        // Stagger sur enfants
        const children = this.getChildrenForStagger(element, config.staggerSelector);
        this.timeline.to(children, {
          ...toVars,
          stagger: config.staggerDelay / 1000
        });
      } else {
        // Animation simple
        this.timeline.to(element, toVars);
      }
    }
  }

  /**
   * Retourne les propriétés d'animation pour un type donné
   *
   * @param type - Type d'animation
   * @returns Propriétés GSAP à animer
   * @private
   */
  private getAnimationPropsForType(type: AnimationType): gsap.TweenVars {
    switch (type) {
      case 'fadeIn':
        return { opacity: 1 };

      case 'fadeInUp':
      case 'fadeInDown':
      case 'fadeInLeft':
      case 'fadeInRight':
      case 'scaleIn':
        return { x: 0, y: 0, scale: 1, opacity: 1 };

      case 'slideInUp':
        return { y: 0 };

      default:
        return { opacity: 1 };
    }
  }

  /**
   * Réinitialise l'animation à son état initial
   *
   * Utilisé quand repeat = true et l'élément sort de la viewport.
   *
   * @param config - Configuration de l'animation
   * @private
   */
  private resetAnimation(config: ScrollRevealConfig): void {
    const element = this.elementRef.nativeElement;
    const initialState = this.getInitialStateForAnimation(config.animation);

    if (config.stagger && this.hasChildren(element)) {
      const children = this.getChildrenForStagger(element, config.staggerSelector);
      gsap.set(children, initialState);
    } else {
      gsap.set(element, initialState);
    }
  }

  /**
   * Vérifie si l'élément a des enfants
   *
   * @param element - Élément DOM
   * @returns true si a des enfants
   * @private
   */
  private hasChildren(element: HTMLElement): boolean {
    return element.children.length > 0;
  }

  /**
   * Récupère les enfants à animer pour le stagger
   *
   * @param element - Élément parent
   * @param selector - Sélecteur CSS optionnel pour filtrer les enfants
   * @returns Liste d'éléments à animer
   * @private
   */
  private getChildrenForStagger(
    element: HTMLElement,
    selector?: string
  ): HTMLElement[] {
    if (selector) {
      return Array.from(element.querySelectorAll<HTMLElement>(selector));
    }
    return Array.from(element.children).filter((el): el is HTMLElement => el instanceof HTMLElement);
  }
}
