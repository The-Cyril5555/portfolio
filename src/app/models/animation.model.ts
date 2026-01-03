// Modèles pour les Animations au Scroll
// =======================================
// Définit les interfaces pour configurer les animations GSAP déclenchées au scroll

/**
 * Types d'animations prédéfinies disponibles
 *
 * Chaque type correspond à une animation GSAP configurée :
 * - fadeIn : Apparition en fondu (opacity 0 → 1)
 * - fadeInUp : Apparition avec montée (translateY + opacity)
 * - fadeInDown : Apparition avec descente (translateY + opacity)
 * - fadeInLeft : Apparition depuis la gauche (translateX + opacity)
 * - fadeInRight : Apparition depuis la droite (translateX + opacity)
 * - scaleIn : Apparition avec zoom (scale 0.8 → 1 + opacity)
 * - slideInUp : Glissement vers le haut (translateY sans fade)
 * - custom : Animation personnalisée avec configuration GSAP complète
 */
export type AnimationType =
  | 'fadeIn'
  | 'fadeInUp'
  | 'fadeInDown'
  | 'fadeInLeft'
  | 'fadeInRight'
  | 'scaleIn'
  | 'slideInUp'
  | 'custom';

/**
 * Type d'easing GSAP disponibles
 *
 * Courbes d'accélération pour les animations.
 * Voir https://gsap.com/docs/v3/Eases/ pour visualisation.
 */
export type EasingType =
  | 'power1.out'
  | 'power2.out'
  | 'power3.out'
  | 'power4.out'
  | 'back.out'
  | 'elastic.out'
  | 'bounce.out'
  | 'none';

/**
 * Configuration pour les animations au scroll avec GSAP
 *
 * Interface utilisée par la directive appScrollReveal pour configurer
 * les animations qui se déclenchent quand un élément entre dans la viewport.
 *
 * @interface
 *
 * @example
 * ```html
 * <!-- Animation simple fadeInUp -->
 * <div [appScrollReveal]="{ animation: 'fadeInUp', duration: 800 }">
 *   Contenu animé
 * </div>
 *
 * <!-- Animation avec stagger pour plusieurs éléments enfants -->
 * <div [appScrollReveal]="{
 *   animation: 'fadeInUp',
 *   duration: 600,
 *   stagger: true,
 *   staggerDelay: 100
 * }">
 *   <div class="item">Item 1</div>
 *   <div class="item">Item 2</div>
 *   <div class="item">Item 3</div>
 * </div>
 *
 * <!-- Animation personnalisée -->
 * <div [appScrollReveal]="{
 *   animation: 'custom',
 *   customAnimation: { x: -100, rotation: 360, opacity: 0 },
 *   duration: 1000
 * }">
 *   Animation custom
 * </div>
 * ```
 */
export interface ScrollRevealConfig {
  /**
   * Type d'animation à appliquer
   *
   * Utilisez 'custom' pour définir votre propre animation
   * via customAnimation.
   *
   * @default 'fadeInUp'
   */
  animation: AnimationType;

  /**
   * Durée de l'animation en millisecondes
   *
   * @default 800
   */
  duration?: number;

  /**
   * Délai avant le démarrage de l'animation en millisecondes
   *
   * Utile pour créer des séquences d'animations.
   *
   * @default 0
   */
  delay?: number;

  /**
   * Type d'easing (courbe d'accélération) GSAP
   *
   * Définit comment l'animation accélère/décélère.
   *
   * @default 'power3.out'
   */
  ease?: EasingType;

  /**
   * Active le stagger (échelonnement) pour les éléments enfants
   *
   * Quand true, anime les éléments enfants avec un délai entre chacun
   * au lieu d'animer l'élément parent directement.
   *
   * L'élément parent doit avoir des enfants pour que cela fonctionne.
   *
   * @default false
   */
  stagger?: boolean;

  /**
   * Délai entre chaque élément enfant en millisecondes (quand stagger = true)
   *
   * Plus la valeur est élevée, plus le délai entre les animations est long.
   *
   * @default 150
   */
  staggerDelay?: number;

  /**
   * Sélecteur CSS pour cibler les éléments enfants à animer
   *
   * Utilisé uniquement quand stagger = true.
   * Si non spécifié, anime tous les enfants directs.
   *
   * @example '.item' ou '.card' ou 'div'
   * @default undefined (tous les enfants directs)
   */
  staggerSelector?: string;

  /**
   * Configuration GSAP personnalisée pour animation 'custom'
   *
   * Objet GSAP fromVars complet. Utilisé uniquement si animation = 'custom'.
   * Permet de définir n'importe quelle propriété animable GSAP.
   *
   * @example
   * ```typescript
   * {
   *   x: -50,              // Translate X
   *   y: 100,              // Translate Y
   *   rotation: 180,       // Rotation en degrés
   *   scale: 0.5,          // Scale
   *   opacity: 0,          // Opacity
   *   transformOrigin: 'center center'
   * }
   * ```
   *
   * @default undefined
   */
  customAnimation?: gsap.TweenVars;

  /**
   * Seuil de visibilité pour déclencher l'animation (0-1)
   *
   * - 0 : Dès qu'un pixel est visible
   * - 0.5 : Quand 50% de l'élément est visible
   * - 1 : Quand 100% de l'élément est visible
   *
   * @default 0.2
   */
  threshold?: number;

  /**
   * Marge du root pour IntersectionObserver
   *
   * Permet de déclencher l'animation avant/après que l'élément entre dans la viewport.
   * Format CSS (ex: '50px', '-100px 0px')
   *
   * @example '0px 0px -100px 0px' déclenche 100px avant que l'élément entre
   * @default '0px'
   */
  rootMargin?: string;

  /**
   * Rejouer l'animation à chaque fois que l'élément entre dans la viewport
   *
   * - false : Animation joue une seule fois (défaut)
   * - true : Animation se rejoue à chaque apparition dans la viewport
   *
   * @default false
   */
  repeat?: boolean;
}

/**
 * Configuration par défaut pour ScrollReveal
 *
 * Utilisée quand certaines propriétés ne sont pas spécifiées.
 *
 * @constant
 */
export const DEFAULT_SCROLL_REVEAL_CONFIG: Required<Omit<ScrollRevealConfig, 'customAnimation' | 'staggerSelector'>> & {
  customAnimation?: gsap.TweenVars;
  staggerSelector?: string;
} = {
  animation: 'fadeInUp',
  duration: 800,
  delay: 0,
  ease: 'power3.out',
  stagger: false,
  staggerDelay: 150,
  staggerSelector: undefined,
  customAnimation: undefined,
  threshold: 0.2,
  rootMargin: '0px',
  repeat: false
};
