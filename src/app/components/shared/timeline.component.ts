// Timeline Component
// ===================

import { Component, Input, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineItem } from '../../models/about.model';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimelineComponent {
  @Input() set timelineItems(items: TimelineItem[]) {
    this.items.set(items);
  }

  items = signal<TimelineItem[]>([]);
}
