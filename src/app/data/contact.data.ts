// Données pour le composant Contact
// ===================================

import { SocialLink, TechStackItem, ParallaxConfig } from '../models/contact.model';

/**
 * Email de contact principal
 */
export const CONTACT_EMAIL = 'cyril.bizouarn@gmail.com';

/**
 * Liens vers les réseaux sociaux
 * Pour ajouter un nouveau réseau social :
 * 1. Ajouter l'entrée ici avec un id unique
 * 2. S'assurer que l'icône est disponible dans le IconComponent
 * 3. Mettre à jour le type 'icon' dans contact.model.ts si nécessaire
 */
export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: 'github',
    name: 'GitHub',
    url: 'https://github.com/The-Cyril5555',
    icon: 'github' as const
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/cyril-bizouarn',
    icon: 'linkedin' as const
  }
];

/**
 * Stack technique utilisée pour construire ce portfolio
 * Pour ajouter une nouvelle technologie :
 * 1. Ajouter l'entrée ici avec un id unique
 * 2. Utiliser une classe Devicon valide pour l'icône
 * 3. S'assurer que Devicon est chargé dans le projet
 */
export const TECH_STACK: TechStackItem[] = [
  {
    id: 'angular',
    name: 'Angular',
    icon: 'devicon-angularjs-plain'
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    icon: 'devicon-typescript-plain'
  },
  {
    id: 'scss',
    name: 'SCSS',
    icon: 'devicon-sass-original'
  }
];

/**
 * NOTE : Les liens de navigation ont été déplacés vers navigation.data.ts
 * Ils sont maintenant partagés entre la navbar et le footer pour garantir la cohérence.
 * @see {@link ../data/navigation.data.ts}
 */

/**
 * Configuration de l'effet parallax pour la section contact
 *
 * L'effet parallax crée une sensation de profondeur en faisant défiler
 * les différentes couches à des vitesses différentes :
 * - Le fond (paint.png) défile à 30% de la vitesse de scroll (plus lent)
 * - Le contenu défile à 15% de la vitesse de scroll (encore plus lent)
 *
 * Pour ajuster l'intensité du parallax :
 * - Augmenter les valeurs = effet plus prononcé
 * - Diminuer les valeurs = effet plus subtil
 * - Valeurs recommandées : entre 0.1 et 0.5
 */
export const PARALLAX_CONFIG: ParallaxConfig = {
  backgroundSpeed: 0.3,  // Le fond défile à 30% de la vitesse de scroll
  contentSpeed: 0.15     // Le contenu défile à 15% de la vitesse de scroll
};
