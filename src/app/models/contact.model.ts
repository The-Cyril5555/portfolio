// Modèles de données pour le composant Contact
// ===============================================

/**
 * Représente un lien vers un réseau social
 * @interface SocialLink
 */
export interface SocialLink {
  /** Identifiant unique du lien social */
  id: string;
  /** Nom affiché du réseau social (ex: "GitHub", "LinkedIn") */
  name: string;
  /** URL complète vers le profil */
  url: string;
  /** Nom de l'icône à utiliser (doit correspondre aux icônes disponibles dans IconComponent) */
  icon: 'github' | 'linkedin';
}

/**
 * Représente un élément de la stack technique
 * @interface TechStackItem
 */
export interface TechStackItem {
  /** Identifiant unique de la technologie */
  id: string;
  /** Nom affiché de la technologie (ex: "Angular", "TypeScript") */
  name: string;
  /** Classe CSS de l'icône Devicon (ex: "devicon-angularjs-plain") */
  icon: string;
}

/**
 * Représente un lien de navigation
 * Utilisé dans la navbar (header) et le footer pour garantir la cohérence
 * @interface NavLink
 */
export interface NavLink {
  /** Identifiant unique du lien */
  id: string;
  /** Texte affiché pour le lien */
  label: string;
  /** Ancre de destination (ex: "#home", "#work") */
  href: string;
}

/**
 * Configuration pour l'effet parallax de la section contact
 * @interface ParallaxConfig
 */
export interface ParallaxConfig {
  /**
   * Multiplicateur de vitesse pour le fond
   * Valeur entre 0 et 1. Plus la valeur est petite, plus le fond défile lentement.
   * Ex: 0.3 signifie que le fond défile à 30% de la vitesse de scroll
   */
  backgroundSpeed: number;

  /**
   * Multiplicateur de vitesse pour le contenu
   * Valeur entre 0 et 1. Plus la valeur est petite, plus le contenu défile lentement.
   * Ex: 0.15 signifie que le contenu défile à 15% de la vitesse de scroll
   */
  contentSpeed: number;
}
