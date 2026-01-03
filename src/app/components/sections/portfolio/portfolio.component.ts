/**
 * Composant Portfolio
 * ===================
 *
 * Affiche la grille de projets du portfolio avec :
 * - Vue "Featured" (projets mis en avant uniquement)
 * - Vue "All" (tous les projets)
 * - Toggle pour basculer entre les deux vues
 *
 * **Architecture :**
 * - Utilise PortfolioRepository pour l'accès aux données
 * - Convertit les Observables en Signals avec toSignal()
 * - Réactivité automatique lors du changement de vue
 *
 * **Pattern Repository :**
 * Au lieu d'importer directement les données locales (`PROJECTS`),
 * le composant utilise le PortfolioRepository qui abstrait la source
 * de données. Cela permet de migrer facilement vers une API REST
 * sans modifier le composant.
 *
 * @component
 * @selector app-portfolio
 * @standalone
 *
 * @example
 * ```html
 * <app-portfolio></app-portfolio>
 * ```
 *
 * @author Cyril Bizouarn
 */

import { Component, signal, computed, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Project } from '../../../models/project.model';
import { ScrollRevealDirective } from '../../../directives/scroll-reveal.directive';
import { PortfolioRepository } from '../../../services/data/portfolio.repository';

@Component({
  selector: 'app-portfolio',
  standalone: true,
  imports: [CommonModule, ScrollRevealDirective],
  templateUrl: './portfolio.component.html',
  styleUrl: './portfolio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PortfolioComponent {
  // ========================================
  // Propriétés privées - Services injectés
  // ========================================

  /**
   * Repository pour accéder aux projets du portfolio
   *
   * Injecté via la fonction `inject()` d'Angular (approche moderne).
   * Permet d'utiliser le repository dans les initialisations de propriétés.
   *
   * @private
   * @readonly
   */
  private readonly portfolioRepo = inject(PortfolioRepository);

  // ========================================
  // Propriétés publiques - Données
  // ========================================

  /**
   * Signal de tous les projets
   *
   * Converti depuis l'Observable du repository avec toSignal().
   * Initialisé avec un tableau vide par défaut.
   *
   * @public
   * @readonly
   */
  projects = toSignal(this.portfolioRepo.getAll(), { initialValue: [] });

  /**
   * Signal des projets mis en avant (featured)
   *
   * Converti depuis l'Observable du repository avec toSignal().
   * Initialisé avec un tableau vide par défaut.
   *
   * @public
   * @readonly
   */
  featuredProjects = toSignal(this.portfolioRepo.getFeaturedProjects(), {
    initialValue: []
  });

  /**
   * Signal indiquant si on affiche uniquement les projets featured
   *
   * - true : Affiche uniquement les projets featured
   * - false : Affiche tous les projets
   *
   * @public
   */
  showingFeatured = signal(true);

  /**
   * Signal computed des projets affichés
   *
   * Réactivité automatique :
   * - Quand `showingFeatured` change, ce signal se met à jour
   * - Retourne `featuredProjects` ou `projects` selon l'état
   *
   * **Avantage computed() vs getter :**
   * - Mise en cache automatique du résultat
   * - Recalculé uniquement quand les dépendances changent
   * - Meilleure performance
   *
   * @public
   * @readonly
   */
  displayedProjects = computed(() =>
    this.showingFeatured() ? this.featuredProjects() : this.projects()
  );

  // ========================================
  // Méthodes publiques
  // ========================================

  /**
   * Bascule entre la vue "Featured" et "All"
   *
   * Inverse la valeur du signal `showingFeatured`.
   * Le signal `displayedProjects` se met à jour automatiquement
   * grâce à computed().
   *
   * @public
   *
   * @example
   * ```html
   * <button (click)="toggleView()">
   *   {{ showingFeatured() ? 'Show All' : 'Show Featured' }}
   * </button>
   * ```
   */
  toggleView(): void {
    this.showingFeatured.update((v) => !v);
  }
}
