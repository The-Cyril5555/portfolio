/**
 * Service de Gestion des Animations GSAP
 * ========================================
 *
 * Service centralisé pour gérer les animations GSAP et ScrollTrigger
 * dans l'application portfolio.
 *
 * **⚠️ Note d'Architecture :**
 * Ce service est progressivement remplacé par des directives réutilisables
 * (ScrollRevealDirective) pour une approche plus déclarative et maintenable.
 *
 * **Fonctionnalités :**
 * - Initialisation des animations au scroll (ScrollTrigger)
 * - Animations d'entrée de sections (fade in, slide in, etc.)
 * - Gestion du cycle de vie (cleanup des triggers)
 *
 * **Optimisations :**
 * - Utilise clearProps pour libérer GPU après animations
 * - ScrollTriggers avec once: true pour performance
 * - Cleanup automatique via destroyAll()
 *
 * **Migration en cours :**
 * - ✅ heroAnimation() → ScrollRevealDirective (hero.component.html)
 * - ✅ projectCardsAnimation() → ScrollRevealDirective (portfolio.component.html)
 * - ⏳ skillBadgesAnimation() → À migrer
 * - ⏳ fadeInSections() → À migrer
 *
 * @service
 * @providedIn 'root'
 *
 * @example
 * ```typescript
 * // Utilisation actuelle (legacy)
 * constructor(private animationService: AnimationService) {}
 *
 * ngOnInit() {
 *   this.animationService.initScrollAnimations();
 * }
 *
 * // Nouvelle approche (recommandée)
 * // Utiliser ScrollRevealDirective directement dans les templates
 * ```
 *
 * @see {@link ScrollRevealDirective} - Directive moderne pour animations au scroll
 */

import { Injectable } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Enregistrement du plugin ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

/**
 * Service de gestion des animations GSAP
 */
@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  // ========================================
  // Propriétés privées
  // ========================================

  /**
   * Tableau des ScrollTriggers actifs
   *
   * Stocke tous les triggers créés pour permettre leur cleanup
   * lors de la destruction du service ou du composant.
   *
   * @private
   */
  private scrollTriggers: ScrollTrigger[] = [];

  // ========================================
  // Constructeur
  // ========================================

  constructor() {}

  // ========================================
  // Méthodes publiques - Initialisation
  // ========================================

  /**
   * Initialise toutes les animations au scroll
   *
   * Point d'entrée principal appelé au démarrage de l'application (app.ts).
   * Crée tous les ScrollTriggers pour les différentes sections.
   *
   * **⚠️ Note :** Cette méthode est progressivement vidée au fur et à mesure
   * que les animations migrent vers ScrollRevealDirective.
   *
   * @public
   *
   * @example
   * ```typescript
   * ngAfterViewInit() {
   *   this.animationService.initScrollAnimations();
   * }
   * ```
   */
  initScrollAnimations(): void {
    // ✅ Migré vers ScrollRevealDirective
    // this.projectCardsAnimation();

    // ⏳ À migrer
    this.skillBadgesAnimation();
    this.fadeInSections();
  }

  // ========================================
  // Méthodes publiques - Animations spécifiques
  // ========================================

  /**
   * Animation de la section Hero
   *
   * **⚠️ DÉPRÉCIÉ - Ne plus utiliser**
   *
   * Cette méthode est remplacée par ScrollRevealDirective appliquée
   * directement dans hero.component.html sur les éléments :
   * - .hero-main-text
   * - .hero-description
   * - .hero-cta
   *
   * @deprecated Utiliser ScrollRevealDirective à la place
   * @public
   *
   * @example
   * ```html
   * <!-- Nouvelle approche (hero.component.html) -->
   * <h1 [appScrollReveal]="{ animation: 'fadeInUp', duration: 1000 }">
   *   Titre
   * </h1>
   * ```
   */
  heroAnimation(): void {
    // ⚠️ DÉPRÉCIÉ - Conservé pour compatibilité temporaire
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.from('.hero-main-text', {
      y: 50,
      opacity: 0,
      duration: 1,
      clearProps: 'all'
    })
    .from('.hero-description', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      clearProps: 'all'
    }, '-=0.5')
    .from('.hero-cta', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      clearProps: 'all'
    }, '-=0.4');
  }

  /**
   * Animation des cartes de projets avec effet stagger
   *
   * **⚠️ DÉPRÉCIÉ - Ne plus utiliser**
   *
   * Cette méthode est remplacée par ScrollRevealDirective avec stagger
   * appliquée directement sur .carousel-track dans portfolio.component.html.
   *
   * @deprecated Utiliser ScrollRevealDirective avec stagger: true
   * @private
   *
   * @example
   * ```html
   * <!-- Nouvelle approche (portfolio.component.html) -->
   * <div class="carousel-track"
   *      [appScrollReveal]="{
   *        animation: 'fadeInUp',
   *        duration: 600,
   *        stagger: true,
   *        staggerDelay: 150
   *      }">
   *   <!-- Project cards -->
   * </div>
   * ```
   */
  private projectCardsAnimation(): void {
    // ⚠️ DÉPRÉCIÉ - Conservé pour référence
    const trigger = ScrollTrigger.create({
      trigger: '.carousel-track',
      start: 'top 80%',
      onEnter: () => {
        gsap.to('.project-card', {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power3.out',
          clearProps: 'transform'
        });
      },
      once: true
    });

    this.scrollTriggers.push(trigger);
  }

  /**
   * Animation des badges de compétences avec effet de rebond
   *
   * Anime les badges de la section Skills avec un effet de scale
   * et un easing "back.out" pour un rebond subtil.
   *
   * **⏳ À migrer vers ScrollRevealDirective**
   *
   * @private
   *
   * Configuration :
   * - Trigger: 75% de la section visible
   * - Animation: Scale de 0.8 à 1 avec fade in
   * - Stagger: 80ms entre chaque badge
   * - Easing: back.out(1.7) pour effet rebond
   */
  private skillBadgesAnimation(): void {
    const trigger = ScrollTrigger.create({
      trigger: '.skills-grid',
      start: 'top 75%',
      onEnter: () => {
        gsap.from('.skill-badge', {
          scale: 0.8,
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'back.out(1.7)'
        });
      },
      once: true
    });

    this.scrollTriggers.push(trigger);
  }

  /**
   * Animation fade in générique pour les sections
   *
   * Applique une animation fade in + slide up sur toutes les sections
   * ayant la classe CSS `.fade-in-section`.
   *
   * **⏳ À migrer vers ScrollRevealDirective**
   *
   * @private
   *
   * Configuration :
   * - Trigger: 85% de la section visible
   * - Animation: Slide up (y: 0) + fade in (opacity: 1)
   * - Durée: 800ms
   * - Easing: power2.out (décélération douce)
   *
   * Utilisation actuelle :
   * Toute section HTML avec la classe `.fade-in-section` sera automatiquement
   * animée lors de l'entrée dans la viewport.
   */
  private fadeInSections(): void {
    // Récupère toutes les sections avec la classe .fade-in-section
    const sections = gsap.utils.toArray<HTMLElement>('.fade-in-section');

    // Crée un ScrollTrigger pour chaque section
    sections.forEach((section) => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(section, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out'
          });
        },
        once: true
      });

      this.scrollTriggers.push(trigger);
    });
  }

  // ========================================
  // Méthodes publiques - Cleanup
  // ========================================

  /**
   * Détruit tous les ScrollTriggers actifs
   *
   * Libère les ressources et event listeners associés aux animations.
   * À appeler dans ngOnDestroy du composant principal ou lors d'un
   * changement de route.
   *
   * **Important :** Cette méthode est essentielle pour éviter les fuites
   * mémoire lors de la navigation dans l'application.
   *
   * @public
   *
   * @example
   * ```typescript
   * ngOnDestroy() {
   *   this.animationService.destroyAll();
   * }
   * ```
   */
  destroyAll(): void {
    // Kill chaque ScrollTrigger individuellement
    this.scrollTriggers.forEach((trigger) => trigger.kill());

    // Vide le tableau pour libérer la mémoire
    this.scrollTriggers = [];
  }
}
