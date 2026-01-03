// Hero Component
// ===============
// Section hero (première section) du portfolio avec effet parallax
//
// Affiche :
// - Badge de disponibilité avec date actuelle
// - Titre principal "DESIGNER & DEVELOPER"
// - Description de profil
// - Bouton CTA vers contact
// - Effet parallax sur l'arrière-plan (via directive appParallax)

import { Component, AfterViewInit, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationService } from '../../../services/animation.service';
import { ScrollService } from '../../../services/scroll.service';
import { MotionParallaxDirective } from '../../../directives/motion-parallax.directive';
import { ScrollRevealDirective } from '../../../directives/scroll-reveal.directive';

/**
 * Composant de la section Hero (première section du portfolio)
 *
 * Affiche la présentation principale avec :
 * - Badge de disponibilité dynamique (jour/mois)
 * - Titre principal en typographie Tusker
 * - Description du profil professionnel
 * - Call-to-action vers la section contact
 * - Effet parallax sur l'arrière-plan
 *
 * Optimisations :
 * - Utilise la directive appParallax au lieu de gestion manuelle du scroll
 * - AfterViewInit pour initialisation animations GSAP
 * - Pas de listeners scroll manuels (délégué à la directive)
 *
 * @component
 * @standalone
 */
@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule, MotionParallaxDirective, ScrollRevealDirective],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeroComponent implements AfterViewInit {
  /**
   * Service de gestion des animations GSAP
   * @private
   */
  private animationService = inject(AnimationService);

  /**
   * Service de gestion du scroll et navigation
   * @private
   */
  private scrollService = inject(ScrollService);

  // ========================================
  // Propriétés - Badge de disponibilité
  // ========================================

  /**
   * Jour actuel (1-31)
   * Affiché dans le badge de disponibilité
   * @readonly
   */
  readonly currentDay = new Date().getDate().toString();

  /**
   * Mois actuel en abrégé (jan, fév, mar, etc.)
   * Format français avec toLocaleString
   * @readonly
   */
  readonly currentMonth = new Date().toLocaleString('fr-FR', { month: 'short' });

  /**
   * Année actuelle (2024, 2025, etc.)
   * Non utilisée actuellement mais disponible si besoin
   * @readonly
   */
  readonly currentYear = new Date().toLocaleString('fr-FR', { year: 'numeric' });

  // ========================================
  // Lifecycle Hooks
  // ========================================

  /**
   * Initialisation après rendu complet de la vue
   *
   * Note : Les animations Hero sont maintenant gérées par la directive
   * ScrollRevealDirective appliquée directement dans le template HTML.
   * Plus besoin d'appeler heroAnimation() manuellement.
   */
  ngAfterViewInit(): void {
    // Animations gérées par ScrollRevealDirective dans le template
  }

  // ========================================
  // Méthodes publiques
  // ========================================

  /**
   * Scroll fluide vers la section "work" (portfolio)
   *
   * Appelée lors du clic sur le bouton CTA.
   * Utilise le ScrollService qui gère le smooth scroll avec GSAP.
   */
  scrollToWork(): void {
    this.scrollService.scrollToSection('work');
  }
}
