// Données de navigation
// =====================
// Source unique de vérité pour tous les liens de navigation du portfolio
// Utilisé par : navbar (header) et footer

import { NavLink } from '../models/contact.model';

/**
 * Liens de navigation principaux du portfolio
 *
 * Ces liens sont utilisés dans la navbar (header) et le footer pour garantir
 * une cohérence parfaite des labels et des destinations à travers tout le site.
 *
 * Pour ajouter une nouvelle section :
 * 1. Ajouter l'entrée ici avec un id unique
 * 2. Créer la section correspondante dans l'application
 * 3. L'ancre sera automatiquement créée avec le format #id
 *
 * Pour modifier un label :
 * 1. Modifier uniquement la propriété 'label' ici
 * 2. Le changement sera automatiquement répercuté dans navbar et footer
 *
 * Ordre d'affichage :
 * - Suit l'ordre de navigation naturel de l'application
 * - De haut en bas : Accueil → Projets → Compétences → À Propos → Contact
 *
 * @constant
 * @type {NavLink[]}
 */
export const NAV_LINKS: NavLink[] = [
  { id: 'home', label: 'Accueil', href: '#home' },
  { id: 'work', label: 'Projets', href: '#work' },
  { id: 'skills', label: 'Compétences', href: '#skills' },
  { id: 'about', label: 'À Propos', href: '#about' },
  { id: 'contact', label: 'Contact', href: '#contact' }
];
