// About Component
// ================

import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QUALITIES, EDUCATION, EXPERIENCES, BIO_PARAGRAPHS } from '../../../data/about.data';
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
  bioParagraphs = signal<string[]>(BIO_PARAGRAPHS);
  qualities = signal<Quality[]>(QUALITIES);
  education = signal<Education[]>(EDUCATION);
  experiences = signal<Experience[]>(EXPERIENCES);

  // Build timeline items from education and experiences
  timelineItems = computed<TimelineItem[]>(() => {
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

    // Combine and sort by year (chronological - oldest to newest)
    return [...expItems, ...eduItems].sort((a, b) => {
      const yearA = parseInt(a.year.split('-')[0]);
      const yearB = parseInt(b.year.split('-')[0]);
      return yearA - yearB; // Oldest first (left to right)
    });
  });
}
