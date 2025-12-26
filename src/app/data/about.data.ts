// About Data
// ===========

import { Education, Experience, Quality, Statistic } from '../models/about.model';

export const BIO_PARAGRAPHS = [
  "Développeur web full-stack, je conçois des applications web modernes en alliant performance, clarté du code et expérience utilisateur. J'interviens aussi bien sur le front-end que sur le back-end, avec une spécialisation en React, Node.js et SQL.",
  "Au fil de mes projets, j'ai développé des plateformes métiers, des sites e-commerce et des applications connectées à des API, en prenant en charge des fonctionnalités complètes, de la conception à la mise en production. J'accorde une attention particulière à la structure des applications, à la maintenabilité du code et à la fluidité des interfaces.",
  "Curieux et orienté solutions, j'aime comprendre les besoins techniques et fonctionnels afin de proposer des implémentations efficaces et évolutives. Habitué au travail en équipe et aux méthodes agiles, je sais m'adapter rapidement à de nouveaux environnements techniques.",
  "Aujourd'hui, je recherche un poste de développeur web au sein d'une équipe où je pourrai continuer à monter en compétences, contribuer activement aux projets et partager une culture de qualité et de collaboration."
];

export const STATISTICS: Statistic[] = [
  {
    id: 'experience',
    label: 'Années d\'expérience',
    value: '7+',
    icon: '📅'
  },
  {
    id: 'projects',
    label: 'Projets réalisés',
    value: '15+',
    icon: '💼'
  },
  {
    id: 'technologies',
    label: 'Technologies maîtrisées',
    value: '20+',
    icon: '⚡'
  },
  {
    id: 'clients',
    label: 'Clients satisfaits',
    value: '10+',
    icon: '🤝'
  }
];

export const QUALITIES: Quality[] = [
  {
    id: 'rigor',
    name: 'Rigueur',
    icon: '🎯',
    description: 'Approche méthodique et attention aux détails dans chaque projet. Code propre, documentation claire, tests systématiques.'
  },
  {
    id: 'versatility',
    name: 'Polyvalence',
    icon: '🔄',
    description: 'Capacité d\'adaptation à différentes technologies et contextes. Full-stack avec expertise front et back-end.'
  },
  {
    id: 'perseverance',
    name: 'Persévérance',
    icon: '💪',
    description: 'Détermination face aux défis techniques et apprentissage continu. Résolution de problèmes complexes avec créativité.'
  }
];

export const EDUCATION: Education[] = [
  {
    id: 'bachelor-dev-web',
    degree: 'Bachelor Développement Web',
    institution: 'MyDigitalSchool',
    location: 'Vannes',
    startYear: 2022,
    endYear: 2024,
    type: 'formation',
    description: 'Titre Concepteur Développeur d\'Applications (CDA)'
  },
  {
    id: 'bts-sio',
    degree: 'BTS SIO option SLAM',
    institution: 'Lycée Saint-Louis',
    location: 'Châteaulin',
    startYear: 2018,
    endYear: 2021,
    type: 'formation',
    description: 'Solutions Logicielles et Applications Métiers'
  },
  {
    id: 'bac-pro',
    degree: 'Bac Pro ELEEC',
    institution: 'Lycée Paul Sérusier',
    location: 'Carhaix',
    startYear: 2015,
    endYear: 2018,
    type: 'formation',
    description: 'Électrotechnique, Énergie, Équipements Communicants'
  }
];

export const EXPERIENCES: Experience[] = [
  {
    id: 'proflex',
    title: 'Développeur Full-Stack',
    company: 'Proflex',
    location: 'Remote',
    startYear: 2025,
    type: 'dev',
    technologies: ['React', 'Node.js', 'Express', 'API REST'],
    description: 'Développement complet d\'une plateforme de recrutement et gestion des besoins en intérim'
  },
  {
    id: 'sqwk',
    title: 'Développeur Full-Stack',
    company: 'SQWK',
    location: 'Stage',
    startYear: 2023,
    endYear: 2023,
    type: 'dev',
    technologies: ['WordPress', 'WooCommerce', 'PHP'],
    description: 'Conception et développement d\'un site e-commerce complet'
  },
  {
    id: 'wiki',
    title: 'Application Web Wiki',
    company: 'Projet Personnel',
    location: 'Remote',
    startYear: 2023,
    endYear: 2023,
    type: 'dev',
    technologies: ['React', 'API REST', 'React Hooks'],
    description: 'Développement d\'une application de recherche d\'articles via API externe'
  },
  {
    id: 'sdis',
    title: 'Technicien Informatique',
    company: 'SDIS 29',
    location: 'Brest',
    startYear: 2020,
    endYear: 2021,
    type: 'it',
    description: 'Déploiement automatisé d\'images systèmes, interventions réseau et maintenance du parc'
  },
  {
    id: 'cma',
    title: 'Technicien Informatique',
    company: 'CMA29',
    location: 'Quimper',
    startYear: 2018,
    endYear: 2020,
    type: 'it',
    description: 'Mise à jour et gestion de la base de données GLPI, support utilisateurs'
  }
];
