// Modèles : contact et navigation
// ================================

/** Lien vers un profil externe (section Contact). */
export interface SocialLink {
  /** Identifiant unique du lien social */
  id: string;
  /** Nom affiché du réseau social (ex: "GitHub", "LinkedIn") */
  name: string;
  /** URL complète vers le profil */
  url: string;
  /** Nom de l'icône (doit exister dans IconComponent) */
  icon: 'github' | 'linkedin';
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
