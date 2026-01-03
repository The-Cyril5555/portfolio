// Composant Principal de l'Application
// ======================================
// Composant racine qui orchestre l'ensemble du portfolio.
// Gère l'initialisation du scroll spy et des animations GSAP.
//
// Architecture :
// - Single-page application avec toutes les sections chargées
// - Navigation par fragments (#home, #work, etc.)
// - ScrollService pour détecter la section active
// - AnimationService pour les animations au scroll

import { Component, OnInit, OnDestroy, AfterViewInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderNavComponent } from './components/navigation/header-nav.component';
import { HeroComponent } from './components/sections/hero/hero.component';
import { PortfolioComponent } from './components/sections/portfolio/portfolio.component';
import { SkillsComponent } from './components/sections/about/skills.component';
import { AboutComponent } from './components/sections/about/about.component';
import { ContactComponent } from './components/sections/contact/contact.component';
import { ScrollService } from './services/scroll.service';
import { AnimationService } from './services/animation.service';

/**
 * Composant racine de l'application portfolio
 *
 * Responsabilités :
 * - Initialiser le scroll spy pour détecter la section active
 * - Initialiser les animations GSAP au scroll
 * - Nettoyer les observateurs et animations lors de la destruction
 *
 * Le composant n'affiche pas directement de contenu mais orchestre
 * l'ensemble des sections du portfolio.
 *
 * @component
 * @standalone
 */
@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    HeaderNavComponent,
    HeroComponent,
    PortfolioComponent,
    SkillsComponent,
    AboutComponent,
    ContactComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  /**
   * Service de gestion du scroll et détection de section active
   * @private
   */
  private scrollService = inject(ScrollService);

  /**
   * Service de gestion des animations GSAP
   * @private
   */
  private animationService = inject(AnimationService);

  /**
   * Signal réactif de la section actuellement active
   * Mis à jour automatiquement par le ScrollService via IntersectionObserver
   * @readonly
   */
  activeSection = this.scrollService.activeSection;

  /**
   * Initialisation du composant
   * Appelé après la construction mais avant le rendu de la vue
   */
  ngOnInit(): void {
    // Initialisation basique - les animations sont initialisées dans AfterViewInit
  }

  /**
   * Initialisation après que la vue soit complètement rendue
   *
   * Utilise AfterViewInit au lieu de setTimeout pour garantir que :
   * - Tous les éléments DOM sont présents et accessibles
   * - Les composants enfants sont initialisés
   * - Les animations peuvent cibler les bons éléments
   *
   * Note : Remplace l'anti-pattern setTimeout(() => {...}, 100)
   */
  ngAfterViewInit(): void {
    this.scrollService.initScrollSpy();
    this.animationService.initScrollAnimations();
  }

  /**
   * Nettoyage lors de la destruction du composant
   *
   * Déconnecte l'IntersectionObserver et détruit tous les ScrollTriggers GSAP
   * pour éviter les fuites mémoire et les erreurs de référence
   */
  ngOnDestroy(): void {
    this.scrollService.destroy();
    this.animationService.destroyAll();
  }
}
