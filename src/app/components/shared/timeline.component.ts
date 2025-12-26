// Timeline Component
// ===================

import { Component, Input, signal, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimelineItem } from '../../models/about.model';

@Component({
  selector: 'app-timeline',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './timeline.component.html',
  styleUrl: './timeline.component.scss'
})
export class TimelineComponent implements AfterViewInit, OnDestroy {
  @Input() set timelineItems(items: TimelineItem[]) {
    this.items.set(items);
  }

  items = signal<TimelineItem[]>([]);

  // Intersection Observer for scroll animations
  private observer?: IntersectionObserver;

  ngAfterViewInit() {
    this.setupScrollAnimations();
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  // Setup Intersection Observer for scroll-triggered animations
  private setupScrollAnimations() {
    const options = {
      root: null, // Viewport observer
      rootMargin: '0px',
      threshold: 0.3 // Trigger when 30% visible
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, options);

    // Observe all timeline items
    const items = document.querySelectorAll('.timeline-item');
    items.forEach(item => this.observer?.observe(item));
  }
}
