// Skill Model
// ============

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  icon?: string;  // SVG icon or emoji
}

export type SkillCategory =
  | 'design'
  | 'frontend'
  | 'backend'
  | 'tools'
  | 'soft-skills';

export interface SkillGroup {
  category: SkillCategory;
  title: string;
  skills: Skill[];
}
