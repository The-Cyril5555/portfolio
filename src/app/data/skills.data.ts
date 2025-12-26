// Skills Data
// ============

import { SkillGroup } from '../models/skill.model';

export const SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'frontend',
    title: 'Frontend Development',
    skills: [
      { id: 'javascript', name: 'JavaScript', category: 'frontend', level: 'expert', icon: 'code' },
      { id: 'html-css', name: 'HTML/CSS', category: 'frontend', level: 'expert', icon: 'layout' },
      { id: 'react', name: 'React', category: 'frontend', level: 'advanced', icon: 'atom' },
      { id: 'vue', name: 'Vue.js', category: 'frontend', level: 'advanced', icon: 'triangle' },
      { id: 'angular', name: 'Angular', category: 'frontend', level: 'advanced', icon: 'hexagon' },
      { id: 'typescript', name: 'TypeScript', category: 'frontend', level: 'advanced', icon: 'file-code' }
    ]
  },
  {
    category: 'backend',
    title: 'Backend Development',
    skills: [
      { id: 'node', name: 'Node.js', category: 'backend', level: 'advanced', icon: 'server' },
      { id: 'express', name: 'Express', category: 'backend', level: 'advanced', icon: 'zap' },
      { id: 'php', name: 'PHP', category: 'backend', level: 'advanced', icon: 'file-code-2' },
      { id: 'laravel', name: 'Laravel', category: 'backend', level: 'intermediate', icon: 'package' },
      { id: 'symfony', name: 'Symfony', category: 'backend', level: 'intermediate', icon: 'box' },
      { id: 'mysql', name: 'MySQL', category: 'backend', level: 'advanced', icon: 'database' },
      { id: 'sql', name: 'SQL', category: 'backend', level: 'advanced', icon: 'table' },
      { id: 'rest-api', name: 'REST API', category: 'backend', level: 'advanced', icon: 'link' }
    ]
  },
  {
    category: 'cms',
    title: 'CMS & E-commerce',
    skills: [
      { id: 'wordpress', name: 'WordPress', category: 'cms', level: 'advanced', icon: 'file-text' },
      { id: 'woocommerce', name: 'WooCommerce', category: 'cms', level: 'advanced', icon: 'shopping-cart' }
    ]
  },
  {
    category: 'design',
    title: 'Design & UX',
    skills: [
      { id: 'figma', name: 'Figma', category: 'design', level: 'advanced', icon: 'figma' },
      { id: 'responsive', name: 'Responsive Design', category: 'design', level: 'expert', icon: 'smartphone' }
    ]
  },
  {
    category: 'tools',
    title: 'Outils & Technologies',
    skills: [
      { id: 'git', name: 'Git/GitHub', category: 'tools', level: 'expert', icon: 'git-branch' },
      { id: 'docker', name: 'Docker', category: 'tools', level: 'intermediate', icon: 'container' },
      { id: 'linux', name: 'Linux', category: 'tools', level: 'advanced', icon: 'terminal' },
      { id: 'windows', name: 'Windows', category: 'tools', level: 'expert', icon: 'monitor' },
      { id: 'agile', name: 'Méthodes Agiles', category: 'tools', level: 'advanced', icon: 'refresh-cw' },
      { id: 'trello', name: 'Trello', category: 'tools', level: 'advanced', icon: 'trello' },
      { id: 'android-studio', name: 'Android Studio', category: 'tools', level: 'intermediate', icon: 'smartphone' }
    ]
  },
  {
    category: 'soft-skills',
    title: 'Qualités Professionnelles',
    skills: [
      { id: 'rigor', name: 'Rigueur', category: 'soft-skills', level: 'expert', icon: 'check-circle' },
      { id: 'versatility', name: 'Polyvalence', category: 'soft-skills', level: 'expert', icon: 'layers' },
      { id: 'perseverance', name: 'Persévérance', category: 'soft-skills', level: 'expert', icon: 'trending-up' }
    ]
  }
];
