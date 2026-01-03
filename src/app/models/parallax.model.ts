// Modèles pour l'Effet Parallax
// ==============================
// Définit les interfaces pour configurer l'effet parallax des directives

/**
 * Direction du mouvement parallax
 * - vertical : Déplacement sur l'axe Y (haut/bas)
 * - horizontal : Déplacement sur l'axe X (gauche/droite)
 */
export type ParallaxDirection = 'vertical' | 'horizontal';

/**
 * Configuration de l'effet parallax
 *
 * Interface utilisée par la directive appParallax pour configurer
 * le comportement de l'effet de profondeur lors du scroll.
 *
 * @interface
 *
 * @example
 * ```html
 * <div [appParallax]="{
 *   speed: 0.5,
 *   direction: 'vertical',
 *   transform: 'scaleY(-1)'
 * }">
 *   Contenu avec parallax
 * </div>
 * ```
 */
export interface ParallaxConfig {
  /**
   * Vitesse de l'effet parallax (multiplicateur)
   *
   * - 0 : Aucun mouvement (fixe)
   * - 0.5 : Défile 2x plus lentement (effet de profondeur)
   * - 1 : Défile à la même vitesse que le scroll (pas d'effet)
   * - 1.5 : Défile 1.5x plus vite (effet inverse)
   *
   * Valeurs typiques :
   * - Arrière-plan lointain : 0.3 à 0.5
   * - Arrière-plan proche : 0.6 à 0.8
   * - Élément de premier plan : 1.2 à 1.5
   *
   * @default 0.5
   */
  speed: number;

  /**
   * Direction du mouvement parallax
   *
   * - vertical : Transforme translateY (cas le plus courant)
   * - horizontal : Transforme translateX (rare, pour effets spéciaux)
   *
   * @default 'vertical'
   */
  direction?: ParallaxDirection;

  /**
   * Transformation CSS additionnelle à combiner avec le parallax
   *
   * Permet d'ajouter d'autres transforms comme scale, rotate, etc.
   * Ces transforms sont combinés avec le translateY/X du parallax.
   *
   * @example 'scaleY(-1)' - Retourne l'image verticalement
   * @example 'rotate(5deg)' - Rotation de 5 degrés
   * @example 'scale(1.1)' - Zoom de 110%
   *
   * @default undefined
   */
  transform?: string;

  /**
   * Activer/désactiver l'optimisation avec IntersectionObserver
   *
   * Quand true, le parallax est calculé uniquement si l'élément
   * est visible dans la viewport. Améliore les performances mais
   * peut causer un léger délai à l'apparition.
   *
   * @default true
   */
  enableIntersectionObserver?: boolean;

  /**
   * Seuil de visibilité pour IntersectionObserver (0-1)
   *
   * - 0 : Dès qu'un pixel est visible
   * - 0.5 : Quand 50% de l'élément est visible
   * - 1 : Quand 100% de l'élément est visible
   *
   * @default 0.1
   */
  intersectionThreshold?: number;
}

/**
 * Configuration par défaut pour l'effet parallax
 *
 * Utilisée quand certaines propriétés ne sont pas spécifiées.
 *
 * @constant
 */
export const DEFAULT_PARALLAX_CONFIG: Required<ParallaxConfig> = {
  speed: 0.5,
  direction: 'vertical',
  transform: undefined as any, // Will be checked for undefined
  enableIntersectionObserver: true,
  intersectionThreshold: 0.1
};
