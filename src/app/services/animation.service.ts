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
   * **✅ MIGRATION TERMINÉE**
   *
   * Toutes les animations ont été migrées vers ScrollRevealDirective.
   * Cette méthode est conservée temporairement pour compatibilité
   * mais ne fait plus rien.
   *
   * @deprecated Toutes les animations utilisent maintenant ScrollRevealDirective
   * @public
   *
   * @example
   * ```typescript
   * // Ancienne approche (déprécié)
   * ngAfterViewInit() {
   *   this.animationService.initScrollAnimations();
   * }
   *
   * // Nouvelle approche (recommandée)
   * // Utiliser [appScrollReveal] directement dans les templates
   * ```
   */
  initScrollAnimations(): void {
    // ✅ Toutes les animations migrées vers ScrollRevealDirective
    // Plus aucune animation à initialiser ici
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
