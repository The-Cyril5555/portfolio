// Skills Data
// ============

import { SkillGroup } from '../models/skill.model';

export const SKILL_GROUPS: SkillGroup[] = [
  {
    category: 'frontend',
    title: 'Frontend Development',
    skills: [
      { id: 'angular', name: 'Angular', category: 'frontend', level: 'expert', icon: '🅰️' },
      { id: 'typescript', name: 'TypeScript', category: 'frontend', level: 'expert', icon: '📘' },
      { id: 'javascript', name: 'JavaScript', category: 'frontend', level: 'expert', icon: '🟨' },
      { id: 'react', name: 'React', category: 'frontend', level: 'advanced', icon: '⚛️' },
      { id: 'vue', name: 'Vue.js', category: 'frontend', level: 'advanced', icon: '💚' },
      { id: 'html-css', name: 'HTML/CSS', category: 'frontend', level: 'expert', icon: '🎨' },
      { id: 'scss', name: 'SCSS/SASS', category: 'frontend', level: 'expert', icon: '💅' },
      { id: 'tailwind', name: 'Tailwind CSS', category: 'frontend', level: 'advanced', icon: '🌊' },
      { id: 'gsap', name: 'GSAP', category: 'frontend', level: 'advanced', icon: '✨' }
    ]
  },
  {
    category: 'backend',
    title: 'Backend Development',
    skills: [
      { id: 'node', name: 'Node.js', category: 'backend', level: 'advanced', icon: '🟢' },
      { id: 'nest', name: 'NestJS', category: 'backend', level: 'advanced', icon: '🐈' },
      { id: 'express', name: 'Express', category: 'backend', level: 'advanced', icon: '🚂' },
      { id: 'mongodb', name: 'MongoDB', category: 'backend', level: 'intermediate', icon: '🍃' },
      { id: 'postgresql', name: 'PostgreSQL', category: 'backend', level: 'intermediate', icon: '🐘' },
      { id: 'graphql', name: 'GraphQL', category: 'backend', level: 'intermediate', icon: '◼️' },
      { id: 'rest-api', name: 'REST API', category: 'backend', level: 'advanced', icon: '🔌' }
    ]
  },
  {
    category: 'design',
    title: 'Design & UX',
    skills: [
      { id: 'figma', name: 'Figma', category: 'design', level: 'advanced', icon: '🎨' },
      { id: 'adobe-xd', name: 'Adobe XD', category: 'design', level: 'intermediate', icon: '🔷' },
      { id: 'ux-design', name: 'UX Design', category: 'design', level: 'advanced', icon: '👤' },
      { id: 'ui-design', name: 'UI Design', category: 'design', level: 'advanced', icon: '🖼️' },
      { id: 'prototyping', name: 'Prototyping', category: 'design', level: 'advanced', icon: '🔄' },
      { id: 'responsive', name: 'Responsive Design', category: 'design', level: 'expert', icon: '📱' }
    ]
  },
  {
    category: 'tools',
    title: 'Tools & Technologies',
    skills: [
      { id: 'git', name: 'Git', category: 'tools', level: 'expert', icon: '🌿' },
      { id: 'github', name: 'GitHub', category: 'tools', level: 'expert', icon: '🐙' },
      { id: 'vscode', name: 'VS Code', category: 'tools', level: 'expert', icon: '💻' },
      { id: 'webpack', name: 'Webpack', category: 'tools', level: 'advanced', icon: '📦' },
      { id: 'vite', name: 'Vite', category: 'tools', level: 'advanced', icon: '⚡' },
      { id: 'docker', name: 'Docker', category: 'tools', level: 'intermediate', icon: '🐳' },
      { id: 'ci-cd', name: 'CI/CD', category: 'tools', level: 'intermediate', icon: '🔄' },
      { id: 'jest', name: 'Jest/Vitest', category: 'tools', level: 'advanced', icon: '🧪' }
    ]
  }
];
