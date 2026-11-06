// Données des projets
// ===================
// L'ordre compte : il suit l'accrochage de la section (cf. portfolio.component).

import { Project } from '../models/project.model';

const PAINTINGS = 'assets/images/paintings';

export const PROJECTS: readonly Project[] = [
  {
    id: 'shadow-hunters',
    title: 'Shadow Hunters App',
    category: 'Jeu web temps réel',
    year: 2026,
    description:
      'Adaptation numérique du jeu de société à rôles cachés\u00a0: parties multijoueurs en temps réel entre Ombres, Chasseurs et Neutres, rôles secrets, cartes Ermite et Destin, victoire par camp.',
    tags: ['React', 'TypeScript', 'Node.js', 'Socket.io'],
    image: { base: `${PAINTINGS}/boecklin-autoportrait`, widths: [800, 1400], position: '50% 16%' },
    painting: { artist: 'Arnold Böcklin', title: 'Autoportrait avec la Mort jouant du violon', year: 1872 },
    links: {
      live: 'https://the-cyril5555.github.io/shadow_hunter_app/',
      github: 'https://github.com/The-Cyril5555/shadow_hunter_app',
    },
    featured: true,
  },
  {
    id: 'boutique-demo',
    title: 'Boutique e-commerce (démo)',
    category: 'E-commerce full-stack',
    year: 2026,
    description:
      'Boutique full-stack de démonstration\u00a0: paiement virtuel, authentification JWT et tableau de bord d’administration pour gérer produits, utilisateurs et commandes.',
    tags: ['Next.js 15', 'React', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Prisma', 'Zustand'],
    image: { base: `${PAINTINGS}/leighton-god-speed`, widths: [800, 1400], position: '50% 28%' },
    painting: { artist: 'Edmund Blair Leighton', title: 'God Speed!', year: 1900 },
    links: {
      live: 'https://ecommerce-rho-khaki-31.vercel.app',
      github: 'https://github.com/The-Cyril5555/e-commerce',
    },
    featured: true,
  },
  {
    id: 'proflex',
    title: 'Proflex — Plateforme d’intérim logistique',
    category: 'Plateforme métier',
    year: 2025,
    description:
      'Recrutement et gestion des besoins en intérim\u00a0: interfaces dédiées aux candidats et aux entreprises, formulaires, filtres de recherche et API REST.',
    tags: ['React', 'Node.js', 'Express', 'API REST'],
    image: { base: `${PAINTINGS}/matejko-stanczyk`, widths: [800, 1400], position: '50% 50%' },
    painting: { artist: 'Jan Matejko', title: 'Stańczyk', year: 1862 },
    links: {},
    featured: false,
  },
  {
    id: 'portfolio',
    title: 'Portfolio — ce site',
    category: 'Site personnel',
    year: 2025,
    description:
      'Le site que vous parcourez\u00a0: un design «\u00a0catalogue d’exposition\u00a0» autour de peintures classiques, et un effet Swarm où des curseurs reconstruisent la page.',
    tags: ['Angular 21', 'TypeScript', 'SCSS'],
    image: { base: `${PAINTINGS}/cabanel-ange-dechu`, widths: [680], position: '32% 50%' },
    painting: { artist: 'Alexandre Cabanel', title: 'L’Ange déchu', year: 1847 },
    links: { github: 'https://github.com/The-Cyril5555/portfolio' },
    featured: false,
  },
  {
    id: 'sqwk',
    title: 'SQWK — Boutique WooCommerce',
    category: 'E-commerce WordPress',
    year: 2023,
    description:
      'Boutique en ligne conçue de bout en bout\u00a0: catalogue produits, personnalisation du thème, optimisation SEO et modules sur mesure.',
    tags: ['WordPress', 'WooCommerce', 'PHP', 'SEO'],
    image: { base: `${PAINTINGS}/martin-pandemonium`, widths: [800, 1400], position: '62% 50%' },
    painting: { artist: 'John Martin', title: 'Pandémonium', year: 1841 },
    links: {},
    featured: false,
  },
  {
    id: 'wiki',
    title: 'Application Wiki',
    category: 'Application front-end',
    year: 2023,
    description:
      'Recherche d’articles via une API externe\u00a0: résultats dynamiques au fil de la saisie, état géré avec les hooks React, interface responsive.',
    tags: ['React', 'API REST', 'React Hooks'],
    image: { base: `${PAINTINGS}/van-utrecht-nature-morte`, widths: [800, 1400], position: '30% 50%' },
    painting: { artist: 'Adriaen van Utrecht', title: 'Nature morte de banquet', year: 1644 },
    links: {},
    featured: false,
  },
];
