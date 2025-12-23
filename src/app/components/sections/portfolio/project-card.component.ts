// Project Card Component
// =======================

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project } from '../../../models/project.model';
import { BadgeComponent } from '../../shared/badge.component';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, BadgeComponent],
  template: `
    <article class="project-card glass-card">
      <div class="project-image">
        <img [src]="project.images.thumbnail" [alt]="project.title" loading="lazy" />
        <div class="overlay">
          @if (project.links.live) {
            <a [href]="project.links.live" target="_blank" class="view-link glass-button">
              Voir le projet
            </a>
          }
        </div>
      </div>

      <div class="project-content">
        <div class="project-meta">
          <span class="year">{{ project.year }}</span>
          @if (project.client) {
            <span class="separator">•</span>
            <span class="client">{{ project.client }}</span>
          }
        </div>

        <h3>{{ project.title }}</h3>
        <p>{{ project.description }}</p>

        <div class="project-tags">
          @for (tag of project.tags.slice(0, 4); track tag) {
            <app-badge size="sm">{{ tag }}</app-badge>
          }
        </div>

        <div class="project-links">
          @if (project.links.github) {
            <a [href]="project.links.github" target="_blank" aria-label="GitHub">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          }
          @if (project.links.live) {
            <a [href]="project.links.live" target="_blank" aria-label="Live site">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/>
                <line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
          }
        </div>
      </div>
    </article>
  `,
  styles: [`
    @use '../../../../styles/variables' as *;
    @use '../../../../styles/mixins' as *;

    .project-card {
      @include card-hover;
      overflow: hidden;

      .project-image {
        position: relative;
        aspect-ratio: 16 / 10;
        border-radius: $radius-md;
        overflow: hidden;
        margin-bottom: $spacing-md;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform $transition-slow;
        }

        .overlay {
          @include full-cover;
          background: var(--overlay-bg);
          opacity: 0;
          transition: opacity $transition-base;
          @include flex-center;

          .view-link {
            transform: translateY(20px);
            transition: transform $transition-base;
          }
        }
      }

      &:hover {
        .project-image {
          img {
            transform: scale(1.05);
          }

          .overlay {
            opacity: 1;

            .view-link {
              transform: translateY(0);
            }
          }
        }
      }

      .project-content {
        .project-meta {
          display: flex;
          align-items: center;
          gap: $spacing-sm;
          font-size: $font-size-sm;
          color: var(--text-tertiary);
          margin-bottom: $spacing-sm;

          .separator {
            opacity: 0.5;
          }
        }

        h3 {
          margin-bottom: $spacing-sm;
          font-size: $font-size-xl;
        }

        p {
          color: var(--text-secondary);
          margin-bottom: $spacing-md;
          @include line-clamp(2);
        }

        .project-tags {
          display: flex;
          flex-wrap: wrap;
          gap: $spacing-sm;
          margin-bottom: $spacing-md;
        }

        .project-links {
          display: flex;
          gap: $spacing-md;
          padding-top: $spacing-md;
          border-top: 1px solid var(--border-primary);

          a {
            color: var(--text-secondary);
            transition: color $transition-fast;

            &:hover {
              color: var(--accent-primary);
            }
          }
        }
      }
    }
  `]
})
export class ProjectCardComponent {
  @Input({ required: true }) project!: Project;
}
