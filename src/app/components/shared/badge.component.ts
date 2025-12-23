// Badge Component
// ================

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="'glass-badge skill-badge ' + size">
      @if (icon) {
        <span class="badge-icon">{{ icon }}</span>
      }
      <ng-content></ng-content>
    </span>
  `,
  styles: [`
    .skill-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;

      &.sm {
        font-size: 12px;
        padding: 4px 12px;
      }

      &.md {
        font-size: 14px;
        padding: 6px 16px;
      }

      &.lg {
        font-size: 16px;
        padding: 8px 20px;
      }

      .badge-icon {
        font-size: 1.2em;
      }
    }
  `]
})
export class BadgeComponent {
  @Input() icon?: string;
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
}
