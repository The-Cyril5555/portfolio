// Scroll Service
// ===============

import { Injectable, signal } from '@angular/core';
import { gsap } from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';

gsap.registerPlugin(ScrollToPlugin);

@Injectable({
  providedIn: 'root'
})
export class ScrollService {
  // Active section tracking
  activeSection = signal<string>('home');

  private observer?: IntersectionObserver;

  constructor() {}

  /**
   * Initialize scroll spy to track active section
   */
  initScrollSpy(): void {
    const sections = document.querySelectorAll('section[id]');

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.activeSection.set(entry.target.id);
          }
        });
      },
      {
        threshold: 0.3,
        rootMargin: '-80px 0px -80px 0px'
      }
    );

    sections.forEach((section) => {
      this.observer?.observe(section);
    });
  }

  /**
   * Smooth scroll to a section using GSAP
   */
  scrollToSection(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (!element) return;

    gsap.to(window, {
      duration: 1,
      scrollTo: {
        y: element,
        offsetY: 80  // Account for fixed header
      },
      ease: 'power2.inOut'
    });
  }

  /**
   * Native smooth scroll (alternative method)
   */
  scrollToSectionNative(sectionId: string): void {
    const element = document.getElementById(sectionId);
    if (!element) return;

    const offsetTop = element.offsetTop - 80;
    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    });
  }

  /**
   * Destroy scroll spy observer
   */
  destroy(): void {
    this.observer?.disconnect();
  }
}
