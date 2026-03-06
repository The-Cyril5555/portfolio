// Projects Data
// ==============

import { Project } from '../models/project.model';

export const PROJECTS: Project[] = [
  {
    id: 'portfolio-angular',
    title: 'Portfolio - Site Web Personnel',
    description: 'Création d\'un portfolio web moderne avec Angular 19. Interface brutalist avec effets de glassmorphisme, animations GSAP et intégration de peintures classiques. Architecture SCSS modulaire avec système de thèmes.',
    year: 2025,
    services: ['Frontend Development', 'UI/UX Design'],
    tags: ['Angular 19', 'TypeScript', 'GSAP', 'SCSS'],
    images: {
      thumbnail: '/assets/images/paintings/fallen_angel.jpg',
      featured: '/assets/images/paintings/fallen_angel.jpg'
    },
    links: {
      github: 'https://github.com/The-Cyril5555/portfolio'
    },
    featured: true,
    color: '#e11d48'
  },
  {
    id: 'ecommerce-nextjs',
    title: 'E-commerce Exemple',
    description: 'Plateforme e-commerce full-stack moderne avec système de paiement virtuel, authentification JWT sécurisée et tableau de bord administrateur pour gérer produits, utilisateurs et commandes.',
    year: 2026,
    services: ['Full Stack Development', 'Frontend Development', 'E-commerce'],
    tags: ['Next.js 15', 'React 18', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Prisma', 'Zustand'],
    images: {
      thumbnail: '/assets/images/paintings/Leighton-God_Speed!.jpg',
      featured: '/assets/images/paintings/Leighton-God_Speed!.jpg'
    },
    links: {
      github: 'https://github.com/The-Cyril5555/e-commerce',
      live: 'https://ecommerce-rho-khaki-31.vercel.app'
    },
    featured: true,
    color: '#6366f1'
  },
  {
    id: 'proflex-platform',
    title: 'Proflex - Plateforme d\'Intérim Logistique',
    description: 'Développement complet d\'une plateforme de recrutement et gestion des besoins en intérim. Création d\'interfaces dynamiques pour candidats et entreprises avec formulaires, filtres et routes optimisées.',
    year: 2025,
    services: ['Full Stack Development', 'Frontend Development'],
    tags: ['React', 'Node.js', 'Express', 'API REST'],
    images: {
      thumbnail: '/assets/images/paintings/Jan_Matejko,_Stańczyk.jpg',
      featured: '/assets/images/paintings/Jan_Matejko,_Stańczyk.jpg'
    },
    links: {},
    featured: true,
    color: '#3b82f6'
  },
  {
    id: 'sqwk-ecommerce',
    title: 'SQWK - Site E-commerce',
    description: 'Conception et développement complet d\'un site e-commerce. Mise en place du catalogue produits, personnalisation du thème, optimisation SEO et intégration de modules personnalisés pour améliorer l\'expérience utilisateur.',
    year: 2023,
    services: ['Web Development', 'E-commerce'],
    tags: ['WordPress', 'WooCommerce', 'PHP', 'SEO'],
    images: {
      thumbnail: '/assets/images/paintings/John_Martin_Le_Pandemonium_Louvre.jpg',
      featured: '/assets/images/paintings/John_Martin_Le_Pandemonium_Louvre.jpg'
    },
    links: {},
    featured: true,
    color: '#10b981'
  },
  {
    id: 'wiki-app',
    title: 'Application Web Wiki',
    description: 'Développement d\'une application de recherche d\'articles via API externe. Gestion de l\'état avec React Hooks, interface responsive et recherche dynamique en temps réel.',
    year: 2023,
    services: ['Frontend Development', 'API Integration'],
    tags: ['React', 'API REST', 'React Hooks', 'Responsive Design'],
    images: {
      thumbnail: '/assets/images/paintings/europeana-84R6ipsqaxo-unsplash.jpg',
      featured: '/assets/images/paintings/europeana-84R6ipsqaxo-unsplash.jpg'
    },
    links: {
      github: 'https://github.com/The-Cyril5555'
    },
    featured: true,
    color: '#8b5cf6'
  },
  {
    id: 'sdis-29',
    title: 'SDIS 29 - Technicien Informatique',
    description: 'Déploiement automatisé d\'images systèmes sur parc informatique. Interventions sur le réseau et maintenance du parc.',
    year: 2021,
    services: ['Support Technique', 'Maintenance'],
    tags: ['Windows', 'Réseaux', 'Support IT', 'Déploiement'],
    images: {
      thumbnail: '/assets/images/paintings/art-institute-of-chicago-bINu9vWYpLM-unsplash.jpg',
      featured: '/assets/images/paintings/art-institute-of-chicago-bINu9vWYpLM-unsplash.jpg'
    },
    links: {},
    featured: true,
    color: '#dc2626'
  },
  {
    id: 'cma-29',
    title: 'CMA29 - Technicien Informatique',
    description: 'Mise à jour et gestion de la base de données GLPI. Support utilisateurs et gestion du matériel.',
    year: 2020,
    services: ['Administration', 'Support'],
    tags: ['GLPI', 'Support IT', 'Administration', 'Helpdesk'],
    images: {
      thumbnail: '/assets/images/paintings/europeana-TjegK_z-0j8-unsplash.jpg',
      featured: '/assets/images/paintings/europeana-TjegK_z-0j8-unsplash.jpg'
    },
    links: {},
    featured: true,
    color: '#f59e0b'
  },
  {
    id: 'shadow-hunter-app',
    title: 'Shadow Hunters App',
    description: 'Adaptation numérique du jeu de société Shadow Hunters — un jeu de rôles cachés où Ombres, Chasseurs et Neutres s\'affrontent dans un manoir maudit. Application web temps réel avec gestion de parties multi-joueurs, attribution secrète des rôles, système de cartes Ermite et du Destin, et logique de victoire par camp.',
    year: 2026,
    services: ['Game Development', 'Full Stack Development', 'Real-time Systems'],
    tags: ['React', 'TypeScript', 'WebSocket', 'Node.js', 'Socket.io', 'Game Logic'],
    images: {
      thumbnail: '/assets/images/paintings/Arnold_Boecklin-fiedelnder_Tod.jpg',
      featured: '/assets/images/paintings/Arnold_Boecklin-fiedelnder_Tod.jpg'
    },
    links: {
      github: 'https://github.com/The-Cyril5555/shadow_hunter_app',
      live: 'https://the-cyril5555.github.io/shadow_hunter_app/'
    },
    featured: true,
    color: '#7c3aed',
    status: 'sortie'
  }
];
