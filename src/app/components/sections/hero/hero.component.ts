// Hero Component
// ===============

import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AnimationService } from '../../../services/animation.service';
import { ScrollService } from '../../../services/scroll.service';

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss'
})
export class HeroComponent implements OnInit, OnDestroy {
  private animationService = inject(AnimationService);
  private scrollService = inject(ScrollService);

  // For availability badge
  currentDay = new Date().getDate().toString();
  currentMonth = new Date().toLocaleString('fr-FR', { month: 'short' });
  currentYear = new Date().toLocaleString('fr-FR', { year: 'numeric' });

  // For parallax effect
  parallaxOffset = signal(0);

  ngOnInit(): void {
    setTimeout(() => {
      this.animationService.heroAnimation();
    }, 100);

    // Add scroll listener for parallax effect
    window.addEventListener('scroll', this.handleScroll);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.handleScroll);
  }

  private handleScroll = (): void => {
    const scrollY = window.scrollY;
    // Parallax: background scrolls faster than content (multiply by 0.5 for slower, 1.5 for faster)
    this.parallaxOffset.set(scrollY * 0.5);
  };

  scrollToWork(): void {
    this.scrollService.scrollToSection('work');
  }
}
