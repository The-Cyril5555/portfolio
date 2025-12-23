// Portfolio Component
// ====================

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PROJECTS } from '../../../data/projects.data';
import { Project } from '../../../models/project.model';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss'
})
export class PortfolioComponent {
  projects = signal<Project[]>(PROJECTS);
  featuredProjects = signal<Project[]>(
    PROJECTS.filter((p) => p.featured)
  );

  showingFeatured = signal(true);

  get displayedProjects(): Project[] {
    return this.showingFeatured() ? this.featuredProjects() : this.projects();
  }

  toggleView(): void {
    this.showingFeatured.update((v) => !v);
  }
}
