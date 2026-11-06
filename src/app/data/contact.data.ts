// Données de la section Contact
// =============================

import { SocialLink } from '../models/contact.model';

/** Adresse e-mail de contact. */
export const CONTACT_EMAIL = 'cyril.bizouarn@gmail.com';

/**
 * Profils externes, dans l'ordre d'affichage.
 * L'icône doit exister dans IconComponent (cf. SocialLink['icon']).
 */
export const SOCIAL_LINKS: readonly SocialLink[] = [
  {
    id: 'github',
    name: 'GitHub',
    url: 'https://github.com/The-Cyril5555',
    icon: 'github',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/cyril-bizouarn',
    icon: 'linkedin',
  },
];
