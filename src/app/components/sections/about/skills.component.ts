// Skills Component
// =================

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SKILL_GROUPS } from '../../../data/skills.data';
import { SkillGroup } from '../../../models/skill.model';
import { BadgeComponent } from '../../shared/badge.component';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  template: `
    <div class="skills-section">
      <h3 class="text-center mb-2xl">Compétences & Expertises</h3>

      <div class="skills-grid">
        @for (group of skillGroups(); track group.category) {
          <div class="skill-group glass-card">
            <h4>{{ group.title }}</h4>
            <div class="skill-list">
              @for (skill of group.skills; track skill.id) {
                <app-badge
                  [icon]="skill.icon"
                  size="md"
                  class="skill-badge"
                >
                  {{ skill.name }}
                </app-badge>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    @use '../../../../styles/variables' as *;
    @use '../../../../styles/mixins' as *;

    .skills-section {
      h3 {
        font-size: $font-size-3xl;
        margin-bottom: $spacing-2xl;
      }
    }

    .skills-grid {
      display: grid;
      gap: $spacing-xl;

      @include respond-to('md') {
        grid-template-columns: repeat(2, 1fr);
      }

      @include respond-to('lg') {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .skill-group {
      h4 {
        font-size: $font-size-lg;
        margin-bottom: $spacing-md;
        color: var(--accent-primary);
      }

      .skill-list {
        display: flex;
        flex-wrap: wrap;
        gap: $spacing-sm;
      }
    }

    .mb-2xl {
      margin-bottom: $spacing-2xl;
    }

    .text-center {
      text-align: center;
    }
  `]
})
export class SkillsComponent {
  skillGroups = signal<SkillGroup[]>(SKILL_GROUPS);
}
