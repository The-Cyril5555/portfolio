// Technologies Data
// ==================
// Icônes : SVG locaux issus de devicon 2.16.0 (licence MIT, cf.
// public/assets/svg/tech-icons/LICENSE-devicon.txt), rendus en masque
// monochrome dans la section Compétences. Pour une graisse homogène à 20px,
// mysql/laravel/express sont épaissis d'un contour et vuejs est recomposé
// à partir de la variante « original » (deux bandes séparées).

import { Technology, TechnologyGroup, TechnologyGroupInfo } from '../models/technology.model';

const ICONS = 'assets/svg/tech-icons/';

const tech = (id: string, name: string, group: TechnologyGroup): Technology => ({
  id,
  name,
  icon: `${ICONS}${id}.svg`,
  group,
});

/** Ordre d'affichage des colonnes. */
export const TECHNOLOGY_GROUPS: TechnologyGroupInfo[] = [
  { id: 'front', title: 'Front-end' },
  { id: 'back', title: 'Back-end & données' },
  { id: 'tools', title: 'CMS & outils' },
];

export const TECHNOLOGIES: Technology[] = [
  // Front-end
  tech('react', 'React', 'front'),
  tech('nextjs', 'Next.js', 'front'),
  tech('angular', 'Angular', 'front'),
  tech('vuejs', 'Vue.js', 'front'),
  tech('typescript', 'TypeScript', 'front'),
  tech('javascript', 'JavaScript', 'front'),
  tech('html5', 'HTML5', 'front'),
  tech('css3', 'CSS3', 'front'),
  tech('tailwindcss', 'Tailwind CSS', 'front'),
  tech('vitejs', 'Vite', 'front'),

  // Back-end & données
  tech('nodejs', 'Node.js', 'back'),
  tech('express', 'Express', 'back'),
  tech('php', 'PHP', 'back'),
  tech('laravel', 'Laravel', 'back'),
  tech('symfony', 'Symfony', 'back'),
  tech('python', 'Python', 'back'),
  tech('postgresql', 'PostgreSQL', 'back'),
  tech('mysql', 'MySQL', 'back'),
  tech('socketio', 'Socket.io', 'back'),

  // CMS & outils
  tech('wordpress', 'WordPress', 'tools'),
  tech('woocommerce', 'WooCommerce', 'tools'),
  tech('git', 'Git', 'tools'),
  tech('docker', 'Docker', 'tools'),
  tech('figma', 'Figma', 'tools'),
  tech('linux', 'Linux', 'tools'),
  tech('androidstudio', 'Android Studio', 'tools'),
];
