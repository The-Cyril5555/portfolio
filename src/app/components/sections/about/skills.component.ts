// Skills Component
// =================

import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Technology } from '../../../models/technology.model';
import { TECHNOLOGIES } from '../../../data/technologies.data';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="competence-section">
      <h2 class="competence-title">{{ title }}</h2>
      <div class="grid-container">
        <div class="tech-grid">
          @for (tech of technologies; track tech.id) {
            <div class="tech-item">
              <i [class]="tech.iconClass"></i>
              <span class="tech-label">{{ tech.name }}</span>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    // Competence Section
    .competence-section {
      margin-top: 5rem;
      margin-bottom: 0;
    }

    .competence-title {
      font-family: 'Manufacturing Consent', sans-serif;
      font-size: clamp(60px, 10vw, 120px);
      text-align: center;
      margin: 0 0 3rem;
      letter-spacing: 0.02em;
      color: black;
    }

    // Conteneur avec max-width
    .grid-container {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 40px;

      @media (max-width: 1480px) {
        padding: 0 40px;
      }
      @media (max-width: 768px) {
        padding: 0 20px;
      }
    }

    .tech-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      background: #F4E9E0;

      @media (max-width: 1200px) { grid-template-columns: repeat(4, 1fr); }
      @media (max-width: 768px) { grid-template-columns: repeat(3, 1fr); }
      @media (max-width: 480px) { grid-template-columns: repeat(2, 1fr); }
    }

    .tech-item {
      aspect-ratio: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      border-right: 3px solid black;
      border-bottom: 3px solid black;
      transition: all 0.3s ease;
      position: relative;

      &:hover {
        .tech-label {
          opacity: 1;
        }
      }

      &:nth-child(7n) { border-right: none; }
      @media (max-width: 1200px) {
        &:nth-child(7n) { border-right: 3px solid black; }
        &:nth-child(4n) { border-right: none; }
      }
      @media (max-width: 768px) {
        &:nth-child(4n) { border-right: 3px solid black; }
        &:nth-child(3n) { border-right: none; }
      }
      @media (max-width: 480px) {
        &:nth-child(3n) { border-right: 3px solid black; }
        &:nth-child(2n) { border-right: none; }
      }

      &:nth-last-child(-n+7) { border-bottom: none; }
      @media (max-width: 1200px) {
        &:nth-last-child(-n+7) { border-bottom: 3px solid black; }
        &:nth-last-child(-n+1) { border-bottom: none; }
      }
      @media (max-width: 768px) {
        &:nth-last-child(-n+1) { border-bottom: 3px solid black; }
        &:nth-last-child(-n+3) { border-bottom: none; }
      }
      @media (max-width: 480px) {
        &:nth-last-child(-n+3) { border-bottom: 3px solid black; }
        &:nth-last-child(-n+1) { border-bottom: none; }
      }

      @media (max-width: 768px) { padding: 1.5rem; }
      @media (max-width: 480px) { padding: 1rem; }
    }

    i {
      font-size: 80px;
      flex-shrink: 0;

      @media (max-width: 768px) { font-size: 60px; }
      @media (max-width: 480px) { font-size: 40px; }
    }

    .tech-label {
      font-family: 'Migra', serif;
      font-size: 12px;
      font-weight: 400;
      color: black;
      text-align: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;

      position: absolute;
      bottom: 1rem;
      left: 50%;
      transform: translateX(-50%);
      width: calc(100% - 4rem);
      max-width: calc(100% - 4rem);

      @media (max-width: 768px) {
        font-size: 11px;
        bottom: 0.75rem;
        width: calc(100% - 3rem);
        max-width: calc(100% - 3rem);
      }
      @media (max-width: 480px) {
        font-size: 10px;
        bottom: 0.5rem;
        width: calc(100% - 2rem);
        max-width: calc(100% - 2rem);
      }
    }
  `]
})
export class SkillsComponent {
  @Input() technologies: Technology[] = TECHNOLOGIES;
  @Input() title: string = 'Compétence';
}
