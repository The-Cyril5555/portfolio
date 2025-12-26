// Portfolio Component
// ====================

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PROJECTS } from '../../../data/projects.data';
import { Project } from '../../../models/project.model';
import { TechGridComponent } from './tech-grid.component';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, TechGridComponent],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent {
  projects = signal<Project[]>(PROJECTS);
  featuredProjects = signal<Project[]>(
    PROJECTS.filter((p) => p.featured)
  );

  showingFeatured = signal(true);

  // Tilt effect properties
  private tiltIntensity = 10; // Max rotation degrees
  private scaleOnHover = 1.05; // Scale on hover
  private animationFrameId?: number;

  get displayedProjects(): Project[] {
    return this.showingFeatured() ? this.featuredProjects() : this.projects();
  }

  toggleView(): void {
    this.showingFeatured.update((v) => !v);
  }

  // Helper: Check if device is touch-enabled
  private isTouchDevice(): boolean {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0
    );
  }

  // Mouse move handler: Disabled for 2D-only hover effect
  // The hover effect is now handled purely by CSS for perfect alignment
  /*
  onCardMouseMove(event: MouseEvent, cardElement: HTMLElement): void {
    // Skip on touch devices or reduced motion preference
    if (this.isTouchDevice() ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Cancel previous animation frame
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }

    // Schedule calculation in next frame for better performance
    this.animationFrameId = requestAnimationFrame(() => {
      const rect = cardElement.getBoundingClientRect();

      // Calculate mouse position relative to card center
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;

      // Calculate normalized rotation (-1 to 1)
      const rotateX = ((mouseY - centerY) / centerY) * -this.tiltIntensity;
      const rotateY = ((mouseX - centerX) / centerX) * this.tiltIntensity;

      // Apply 3D transform (perspective handled by parent container)
      cardElement.style.transform = `
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        scale3d(${this.scaleOnHover}, ${this.scaleOnHover}, 1)
      `;

      // Quick transition for smooth tracking
      cardElement.style.transition = 'transform 0.1s ease-out';
    });
  }
  */

  // Mouse leave handler: Reset GPU hint
  onCardMouseLeave(cardElement: HTMLElement): void {
    cardElement.style.willChange = 'auto';  // Reset to save memory
  }

  // Mouse enter handler: Enable GPU acceleration
  onCardMouseEnter(cardElement: HTMLElement): void {
    cardElement.style.willChange = 'transform';  // Enable GPU acceleration
  }
}
