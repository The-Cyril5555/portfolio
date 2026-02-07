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
   * @private
   */
  private observer?: IntersectionObserver;

  /**
   * Tween GSAP en cours pour le scroll (permet de kill avant un nouveau scroll)
   * @private
   */
  private currentScrollTween?: gsap.core.Tween;

  /**
   * Timer de debounce pour le scroll spy (évite les changements erratiques)
   * @private
   */
  private scrollSpyTimer?: ReturnType<typeof setTimeout>;

  /**
   * Dernière section détectée (pour comparer avant mise à jour)
   * @private
   */
  private pendingSection?: string;

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
    const sections = document.querySelectorAll('section[id]');

    // Plusieurs seuils pour une détection plus granulaire
    this.observer = new IntersectionObserver(
      (entries) => {
        // Trouver la section la plus visible parmi celles qui intersectent
        let bestEntry: IntersectionObserverEntry | null = null;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!bestEntry || entry.intersectionRatio > bestEntry.intersectionRatio) {
              bestEntry = entry;
            }
          }
        });

        if (bestEntry) {
          const sectionId = (bestEntry as IntersectionObserverEntry).target.id;

          // Debounce de 80ms pour éviter les flickering rapides
          if (sectionId !== this.activeSection()) {
            this.pendingSection = sectionId;
            clearTimeout(this.scrollSpyTimer);
            this.scrollSpyTimer = setTimeout(() => {
              if (this.pendingSection) {
                this.activeSection.set(this.pendingSection);
                this.pendingSection = undefined;
              }
            }, 80);
          }
        }
      },
      {
        // Seuils multiples pour meilleure granularité
        threshold: [0.15, 0.3, 0.5],
        rootMargin: '-80px 0px -20% 0px'
      }
    );

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
   * Durée dynamique basée sur la distance de scroll pour un rendu naturel.
   * Kill automatique de l'animation en cours si on clique rapidement entre sections.
   *
   * @param sectionId - L'id de la section cible (sans le #)
   */
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (!element) return;

    // Kill l'animation en cours pour éviter les conflits
    this.currentScrollTween?.kill();

    // Calcul de la distance pour ajuster la durée
    const targetY = element.getBoundingClientRect().top + window.scrollY - 80;
    const distance = Math.abs(targetY - window.scrollY);

    // Durée dynamique : entre 0.6s (court) et 1.4s (long)
    // Formule logarithmique pour une progression naturelle
    const duration = Math.min(1.4, Math.max(0.6, 0.4 + Math.log10(distance / 100 + 1) * 0.5));

    // Animation GSAP du scroll
    this.currentScrollTween = gsap.to(window, {
      duration,
      scrollTo: {
        y: element,
        offsetY: 80,
        autoKill: true // Stop auto si l'utilisateur scroll manuellement
      },
      ease: 'power3.inOut', // Easing premium avec décélération plus marquée
      overwrite: 'auto',
      onComplete: () => {
        this.currentScrollTween = undefined;
      }
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
    this.observer?.disconnect();
    this.currentScrollTween?.kill();
    clearTimeout(this.scrollSpyTimer);
  }
}
