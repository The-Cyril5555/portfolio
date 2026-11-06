// Données de navigation
// =====================
// Source unique des liens de la page : barre de navigation, menu mobile et pied de page.
// Pour ajouter une section : une entrée ici (id = id de la <section> dans app.html).

import { NavLink } from '../models/contact.model';

/** Liens principaux, dans l'ordre de la page (de haut en bas). */
export const NAV_LINKS: NavLink[] = [
  { id: 'home', label: 'Accueil', href: '#home' },
  { id: 'work', label: 'Projets', href: '#work' },
  { id: 'skills', label: 'Compétences', href: '#skills' },
  { id: 'about', label: 'À propos', href: '#about' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

/**
 * Adresse affichée en bas du menu mobile.
 * (Même valeur que CONTACT_EMAIL de contact.data.ts, gardée ici pour que la nav
 * ne dépende pas des données d'une section.)
 */
export const NAV_EMAIL = 'cyril.bizouarn@gmail.com';
