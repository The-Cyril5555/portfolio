// Projects Data
// ==============

import { Project } from '../models/project.model';

export const PROJECTS: Project[] = [
  {
    id: 'proflex-platform',
    title: 'Proflex - Plateforme d\'Intérim Logistique',
    description: 'Développement complet d\'une plateforme de recrutement et gestion des besoins en intérim. Création d\'interfaces dynamiques pour candidats et entreprises avec formulaires, filtres et routes optimisées.',
    year: 2025,
    services: ['Full Stack Development', 'Frontend Development'],
    tags: ['React', 'Node.js', 'Express', 'API REST'],
    images: {
      thumbnail: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop',
      featured: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1200&h=800&fit=crop'
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
      thumbnail: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?w=800&h=600&fit=crop',
      featured: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?w=1200&h=800&fit=crop'
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
      thumbnail: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&h=600&fit=crop',
      featured: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=1200&h=800&fit=crop'
    },
    links: {
      github: 'https://github.com/The-Cyril5555'
    },
    featured: true,
    color: '#8b5cf6'
  }
];
