// Timeline Component
// ===================

import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineItem } from '../../models/about.model';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="timeline-wrapper">
      <div class="timeline-track">
        <div class="timeline-line"></div>

        @for (item of items(); track item.id) {
          <div class="timeline-item" [attr.data-type]="item.type">
            <div class="timeline-marker">
              <div class="marker-dot"></div>
            </div>

            <div class="timeline-content brutalist-card">
              <div class="timeline-year">{{ item.year }}</div>
              <h4 class="timeline-title">{{ item.title }}</h4>
              <p class="timeline-subtitle">{{ item.subtitle }}</p>
              @if (item.description) {
                <p class="timeline-description">{{ item.description }}</p>
              }
              @if (item.category) {
                <span class="timeline-category brutalist-badge">{{ item.category }}</span>
              }
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styleUrl: './timeline.component.scss'
})
export class TimelineComponent {
  @Input() set timelineItems(items: TimelineItem[]) {
    this.items.set(items);
  }

  items = signal<TimelineItem[]>([]);
}
