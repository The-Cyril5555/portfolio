// About Data
// ===========

import { Education, Experience, Quality } from '../models/about.model';

export const QUALITIES: Quality[] = [
  {
    id: 'rigor',
    name: 'Rigueur',
    icon: 'check-circle',
    description: 'Approche méthodique et attention aux détails dans chaque projet'
  },
  {
    id: 'versatility',
    name: 'Polyvalence',
    icon: 'layers',
    description: 'Capacité d\'adaptation à différentes technologies et contextes'
  },
  {
    id: 'perseverance',
    name: 'Persévérance',
    icon: 'trending-up',
    description: 'Détermination face aux défis techniques et apprentissage continu'
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
