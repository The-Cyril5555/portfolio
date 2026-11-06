// Données de la section « À propos »
// ===================================

import { TimelineItem } from '../models/about.model';

/** Biographie en trois paragraphes ; le premier est affiché en chapeau (.lead). */
export const BIO_PARAGRAPHS: readonly string[] = [
  'Développeur web full-stack, je conçois des applications modernes qui allient performance, clarté du code et expérience utilisateur. J’interviens aussi bien sur le front-end que sur le back-end, avec une spécialisation en React, Node.js et SQL.',
  'Plateformes métiers, sites e-commerce, applications connectées à des API : au fil de mes projets, j’ai pris en charge des fonctionnalités complètes, de la conception à la mise en production. Je veille particulièrement à la structure des applications, à la maintenabilité du code et à la fluidité des interfaces.',
  'Curieux et orienté solutions, j’aime comprendre les besoins techniques comme fonctionnels pour proposer des implémentations efficaces et évolutives. Habitué au travail en équipe et aux méthodes agiles, je recherche aujourd’hui un poste de développeur web au sein d’une équipe où continuer à progresser, contribuer activement aux projets et partager une culture de qualité et de collaboration.',
];

/** Formation et expérience réunies, du plus récent au plus ancien. */
export const PARCOURS: readonly TimelineItem[] = [
  {
    id: 'bachelor-dev-web',
    kind: 'formation',
    start: 2022,
    end: 2024,
    title: 'Bachelor Développement Web',
    organization: 'MyDigitalSchool',
    location: 'Vannes',
    description: 'Titre Concepteur Développeur d’Applications (CDA)',
  },
  {
    id: 'sdis-29',
    kind: 'experience',
    start: 2021,
    title: 'Technicien informatique',
    organization: 'SDIS 29',
    description: 'Déploiement automatisé d’images système sur le parc, interventions réseau et maintenance',
  },
  {
    id: 'cma-29',
    kind: 'experience',
    start: 2020,
    title: 'Technicien informatique',
    organization: 'CMA29',
    description: 'Mise à jour et gestion de la base GLPI, support utilisateurs et gestion du matériel',
  },
  {
    id: 'bts-sio',
    kind: 'formation',
    start: 2018,
    end: 2021,
    title: 'BTS SIO option SLAM',
    organization: 'Lycée Saint-Louis',
    location: 'Châteaulin',
    description: 'Solutions logicielles et applications métiers',
  },
  {
    id: 'bac-pro-eleec',
    kind: 'formation',
    start: 2015,
    end: 2018,
    title: 'Bac Pro ELEEC',
    organization: 'Lycée Paul Sérusier',
    location: 'Carhaix',
    description: 'Électrotechnique, énergie, équipements communicants',
  },
];
