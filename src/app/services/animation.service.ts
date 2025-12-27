// Animation Service
// ==================

import { Injectable } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Injectable({
  providedIn: 'root'
})
export class AnimationService {
  private scrollTriggers: ScrollTrigger[] = [];

  constructor() {}

  /**
   * Initialize all scroll animations
   */
  initScrollAnimations(): void {
    this.projectCardsAnimation();
    this.skillBadgesAnimation();
    this.fadeInSections();
  }

  /**
   * Hero section animations (called directly in component)
   */
  heroAnimation(): void {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Animate all elements from hidden to visible
    tl.from('.hero-main-text', {
      y: 50,
      opacity: 0,
      duration: 1,
      clearProps: 'all'
    })
    .from('.hero-description', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      clearProps: 'all'
    }, '-=0.5')
    .from('.hero-cta', {
      y: 20,
      opacity: 0,
      duration: 0.8,
      clearProps: 'all'
    }, '-=0.4');
  }

  /**
   * Project cards stagger animation
   */
  private projectCardsAnimation(): void {
    const trigger = ScrollTrigger.create({
      trigger: '.carousel-track',
      start: 'top 80%',
      onEnter: () => {
        gsap.to('.project-card', {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power3.out',
          clearProps: 'transform'  // Clear only transform, keep opacity for visibility
        });
      },
      once: true
    });

    this.scrollTriggers.push(trigger);
  }

  /**
   * Skill badges animation
   */
  private skillBadgesAnimation(): void {
    const trigger = ScrollTrigger.create({
      trigger: '.skills-grid',
      start: 'top 75%',
      onEnter: () => {
        gsap.from('.skill-badge', {
          scale: 0.8,
          opacity: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: 'back.out(1.7)'
        });
      },
      once: true
    });

    this.scrollTriggers.push(trigger);
  }

  /**
   * Generic fade in for sections
   */
  private fadeInSections(): void {
    const sections = gsap.utils.toArray<HTMLElement>('.fade-in-section');

    sections.forEach((section) => {
      const trigger = ScrollTrigger.create({
        trigger: section,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(section, {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power2.out'
          });
        },
        once: true
      });

      this.scrollTriggers.push(trigger);
    });
  }

  /**
   * Destroy all scroll triggers
   */
  destroyAll(): void {
    this.scrollTriggers.forEach((trigger) => trigger.kill());
    this.scrollTriggers = [];
  }
}
