// About Component
// ================

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SKILL_GROUPS } from '../../../data/skills.data';
import { QUALITIES, EDUCATION, EXPERIENCES } from '../../../data/about.data';
import { SkillGroup } from '../../../models/skill.model';
import { Quality, Education, Experience, TimelineItem } from '../../../models/about.model';
import { TimelineComponent } from '../../shared/timeline.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, TimelineComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  skillGroups = signal<SkillGroup[]>(SKILL_GROUPS);
  qualities = signal<Quality[]>(QUALITIES);
  education = signal<Education[]>(EDUCATION);
  experiences = signal<Experience[]>(EXPERIENCES);

  // About content
  aboutText = {
    intro: "Développeur web full-stack spécialisé en React, Node.js et SQL, diplômé d'un Bachelor Développement Web (Titre CDA).",
    description: "Expérience en création d'applications web, sites e-commerce et plateformes métiers. Profil orienté solutions, capable de concevoir des fonctionnalités complètes du front-end au back-end.",
    experience: "Fort de 7 années d'expérience combinant développement web et support technique, j'ai travaillé sur divers projets allant des sites e-commerce aux plateformes métiers complexes."
  };

  stats = [
    { label: 'Années d\'expérience', value: '7+' },
    { label: 'Projets réalisés', value: '5+' },
    { label: 'Technologies maîtrisées', value: '20+' }
  ];

  // Build timeline items from education and experiences
  buildTimelineItems(): TimelineItem[] {
    const eduItems = this.education().map(edu => ({
      id: edu.id,
      title: edu.degree,
      subtitle: `${edu.institution} - ${edu.location}`,
      year: `${edu.startYear}-${edu.endYear}`,
      type: 'education' as const,
      category: 'Formation',
      description: edu.description
    }));

    const expItems = this.experiences().map(exp => ({
      id: exp.id,
      title: exp.title,
      subtitle: `${exp.company} - ${exp.location}`,
      year: exp.endYear ? `${exp.startYear}-${exp.endYear}` : `${exp.startYear} - Présent`,
      type: 'experience' as const,
      category: exp.type === 'dev' ? 'Développement' : 'IT',
      description: exp.technologies?.join(', ')
    }));

    // Combine and sort by year (reverse chronological)
    return [...expItems, ...eduItems].sort((a, b) => {
      const yearA = parseInt(a.year.split('-')[0]);
      const yearB = parseInt(b.year.split('-')[0]);
      return yearB - yearA;
    });
  }
}
