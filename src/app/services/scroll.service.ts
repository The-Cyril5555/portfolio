/**
 * Service de Gestion du Scroll et Navigation
 * ===========================================
 *
 * Service centralisé pour gérer le scroll fluide et la détection
 * de la section active dans le portfolio single-page.
 *
 * **Fonctionnalités principales :**
 * - 🎯 Détection automatique de la section visible (Scroll Spy)
 * - 🎬 Navigation fluide avec GSAP ScrollToPlugin
 * - 📍 Méthode alternative avec scrollTo natif
 * - 🔄 Signal réactif pour la section active
 *
 * **Architecture :**
 * - Utilise IntersectionObserver pour performance optimale
 * - Signal Angular pour réactivité (pas besoin de RxJS)
 * - Intégration GSAP pour animations fluides
 *
 * **Configuration :**
 * - Seuil de visibilité : 30% de la section dans viewport
 * - Offset navbar : 80px (hauteur de la navbar fixe)
 * - Durée animation : 1s avec easing power2.inOut
 *
 * **Utilisation typique :**
 * ```typescript
 * // Dans app.component.ts (initialisation)
 * ngAfterViewInit() {
 *   this.scrollService.initScrollSpy();
 * }
 *
 * // Dans header-nav.component.ts (navigation)
 * navigateToSection(sectionId: string) {
 *   this.scrollService.scrollToSection(sectionId);
 * }
 *
 * // Dans header-nav.component.html (affichage section active)
 * <a [class.active]="scrollService.activeSection() === 'about'">
 *   About
 * </a>
 * ```
 *
 * @service
 * @providedIn 'root'
 *
 * @see {@link https://gsap.com/docs/v3/Plugins/ScrollToPlugin/} - GSAP ScrollToPlugin
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API} - IntersectionObserver API
 *
 * @author Cyril Bizouarn
 */

import { Injectable, signal } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

// Enregistrement du plugin GSAP pour scroll fluide
gsap.registerPlugin(ScrollToPlugin);

/**
 * Service de gestion du scroll et navigation
 */
@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  // ========================================
  // Propriétés publiques - État
  // ========================================

  /**
   * Signal de la section actuellement active/visible
   *
   * **Réactivité :** Ce signal est mis à jour automatiquement par
   * l'IntersectionObserver quand l'utilisateur scrolle.
   *
   * **Utilisation dans templates :**
   * ```html
   * <a [class.active]="scrollService.activeSection() === 'home'">
   *   Home
   * </a>
   * ```
   *
   * **Utilisation dans composants :**
   * ```typescript
   * effect(() => {
   *   console.log('Section active:', this.scrollService.activeSection());
   * });
   * ```
   *
   * @public
   * @readonly
   */
  activeSection = signal<string>('home');

  // ========================================
  // Propriétés privées
  // ========================================

  /**
   * Instance de l'IntersectionObserver pour le scroll spy
   *
   * Observe toutes les sections `<section id="...">` du DOM et met à jour
   * le signal `activeSection` quand une section entre dans la viewport.
   *
   * **Configuration :**
   * - threshold: 0.3 (30% de la section visible)
   * - rootMargin: '-80px 0px -80px 0px' (offset pour navbar fixe)
   *
   * @private
   */
  private observer?: IntersectionObserver;

  // ========================================
  // Constructeur
  // ========================================

  constructor() {}

  // ========================================
  // Méthodes publiques - Initialisation
  // ========================================

  /**
   * Initialise le système de détection de section active (Scroll Spy)
   *
   * Crée un IntersectionObserver qui surveille toutes les sections `<section id="...">`
   * du DOM et met à jour automatiquement le signal `activeSection` quand une section
   * devient visible pendant le scroll.
   *
   * **Important :** Cette méthode doit être appelée APRÈS le rendu complet du DOM,
   * typiquement dans `ngAfterViewInit` du composant principal.
   *
   * **Configuration de l'observer :**
   * - `threshold: 0.3` - La section est considérée active quand 30% est visible
   * - `rootMargin: '-80px 0px -80px 0px'` - Zone d'observation réduite pour compenser
   *   la navbar fixe de 80px de hauteur
   *
   * **Prérequis DOM :**
   * Toutes les sections doivent avoir un attribut `id` :
   * ```html
   * <section id="home">...</section>
   * <section id="about">...</section>
   * <section id="work">...</section>
   * ```
   *
   * @public
   *
   * @example
   * ```typescript
   * // Dans app.component.ts
   * ngAfterViewInit() {
   *   // Initialiser après le rendu pour que querySelectorAll trouve les sections
   *   this.scrollService.initScrollSpy();
   * }
   * ```
   *
   * @see {@link https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API}
   */
  initScrollSpy(): void {
    // Récupère toutes les sections avec un id
    const sections = document.querySelectorAll('section[id]');

    // Crée l'observer avec callback et configuration
    this.observer = new IntersectionObserver(
      (entries) => {
        // Pour chaque section qui change de visibilité
        entries.forEach((entry) => {
          // Si la section est visible (intersecting)
          if (entry.isIntersecting) {
            // Met à jour le signal avec l'id de la section
            this.activeSection.set(entry.target.id);
          }
        });
      },
      {
        // 30% de la section doit être visible
        threshold: 0.3,
        // Réduit la zone d'observation de 80px en haut et bas (navbar fixe)
        rootMargin: '-80px 0px -80px 0px'
      }
    );

    // Observer chaque section trouvée
    sections.forEach((section) => {
      this.observer?.observe(section);
    });
  }

  // ========================================
  // Méthodes publiques - Navigation
  // ========================================

  /**
   * Scroll fluide vers une section avec GSAP
   *
   * **⭐ Méthode recommandée** pour la navigation entre sections.
   *
   * Anime le scroll jusqu'à la section cible avec une transition fluide
   * gérée par GSAP ScrollToPlugin. Prend automatiquement en compte
   * l'offset de la navbar fixe (80px).
   *
   * **Avantages vs scrollTo natif :**
   * - ✅ Easing personnalisé (power2.inOut) plus fluide
   * - ✅ Durée contrôlée (1s)
   * - ✅ Interruptible et chaînable avec autres animations GSAP
   * - ✅ Support cross-browser uniforme
   *
   * @public
   *
   * @param {string} sectionId - L'id de la section cible (sans le #)
   *
   * @example
   * ```typescript
   * // Dans un composant de navigation
   * navigateToAbout() {
   *   this.scrollService.scrollToSection('about');
   * }
   * ```
   *
   * @example
   * ```html
   * <!-- Dans un template -->
   * <a (click)="scrollService.scrollToSection('contact')">
   *   Contact
   * </a>
   * ```
   *
   * @see {@link scrollToSectionNative} - Alternative sans GSAP
   */
  scrollToSection(sectionId: string): void {
    // Récupère l'élément DOM de la section cible
    const element = document.getElementById(sectionId);

    // Si la section n'existe pas, annule l'opération
    if (!element) return;

    // Animation GSAP du scroll
    gsap.to(window, {
      duration: 1, // 1 seconde d'animation
      scrollTo: {
        y: element, // Cible : l'élément DOM
        offsetY: 80 // Offset de 80px pour la navbar fixe
      },
      ease: 'power2.inOut' // Easing fluide (décélération douce)
    });
  }

  /**
   * Scroll fluide vers une section avec scrollTo natif
   *
   * **Alternative légère** à `scrollToSection()` sans dépendance GSAP.
   *
   * Utilise l'API native `window.scrollTo()` avec `behavior: 'smooth'`.
   * Plus léger mais moins de contrôle sur l'animation (pas d'easing personnalisé,
   * pas de durée configurable).
   *
   * **Quand l'utiliser :**
   * - Si GSAP n'est pas disponible ou désiré
   * - Pour réduire le bundle size
   * - Si l'animation par défaut du navigateur suffit
   *
   * **⚠️ Note :** Le `behavior: 'smooth'` peut avoir un rendu différent
   * selon les navigateurs (Chrome vs Firefox vs Safari).
   *
   * @public
   *
   * @param {string} sectionId - L'id de la section cible (sans le #)
   *
   * @example
   * ```typescript
   * // Utilisation légère sans GSAP
   * this.scrollService.scrollToSectionNative('work');
   * ```
   *
   * @see {@link scrollToSection} - Version recommandée avec GSAP
   */
  scrollToSectionNative(sectionId: string): void {
    // Récupère l'élément DOM de la section cible
    const element = document.getElementById(sectionId);

    // Si la section n'existe pas, annule l'opération
    if (!element) return;

    // Calcule la position de scroll en tenant compte de la navbar (80px)
    const offsetTop = element.offsetTop - 80;

    // Scroll natif avec comportement fluide
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth' // Animation native du navigateur
    });
  }

  // ========================================
  // Méthodes publiques - Cleanup
  // ========================================

  /**
   * Détruit l'IntersectionObserver du scroll spy
   *
   * Libère les ressources et arrête la surveillance des sections.
   * **Important** pour éviter les fuites mémoire lors de la navigation
   * ou destruction du composant principal.
   *
   * **Quand l'appeler :**
   * - Dans `ngOnDestroy` du composant principal (App)
   * - Avant de réinitialiser le scroll spy
   * - Lors d'un changement de route (si multi-page)
   *
   * @public
   *
   * @example
   * ```typescript
   * // Dans app.component.ts
   * ngOnDestroy() {
   *   this.scrollService.destroy();
   * }
   * ```
   *
   * @see {@link initScrollSpy} - Pour réinitialiser après destroy
   */
  destroy(): void {
    // Déconnecte l'observer s'il existe
    this.observer?.disconnect();
  }
}
