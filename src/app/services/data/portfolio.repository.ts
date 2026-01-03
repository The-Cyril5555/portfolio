/**
 * Repository des Projets Portfolio
 * =================================
 *
 * Repository spécialisé pour la gestion des projets du portfolio.
 * Étend BaseRepository et ajoute des méthodes métier spécifiques.
 *
 * **Fonctionnalités :**
 * - ✅ Récupération des projets mis en avant (featured)
 * - ✅ Filtrage par année, tag ou service
 * - ✅ Récupération des projets les plus récents
 * - ✅ Cache RxJS pour performances optimales
 * - ✅ Future-proof pour migration API REST
 *
 * **Architecture :**
 * ```
 * Component → PortfolioRepository → Data Source (local ou API)
 * ```
 *
 * **Migration future vers API REST :**
 * Quand le backend sera prêt, il suffira de modifier les méthodes
 * pour appeler l'API au lieu de filtrer les données locales :
 *
 * ```typescript
 * // Avant (données locales)
 * getFeaturedProjects(): Observable<Project[]> {
 *   return this.filter(project => project.featured);
 * }
 *
 * // Après (API REST)
 * getFeaturedProjects(): Observable<Project[]> {
 *   return this.http.get<Project[]>('/api/projects?featured=true').pipe(
 *     shareReplay(1)
 *   );
 * }
 * ```
 *
 * @class
 * @extends BaseRepository<Project>
 *
 * @example
 * ```typescript
 * // Dans un composant
 * @Component({...})
 * export class PortfolioComponent {
 *   projects$ = this.portfolioRepo.getFeaturedProjects();
 *
 *   constructor(private portfolioRepo: PortfolioRepository) {}
 * }
 * ```
 *
 * @author Cyril Bizouarn
 */

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BaseRepository } from './base.repository';
import { Project } from '../../models/project.model';
import { PROJECTS } from '../../data/projects.data';

/**
 * Repository pour les projets du portfolio
 *
 * Centralise l'accès aux données des projets avec :
 * - Cache RxJS automatique via BaseRepository
 * - Méthodes de filtrage métier
 * - Préparation pour API REST future
 *
 * @injectable
 * @providedIn 'root'
 */
@Injectable({
  providedIn: 'root'
})
export class PortfolioRepository extends BaseRepository<Project> {
  // ========================================
  // Constructeur
  // ========================================

  /**
   * Constructeur du repository
   *
   * Injecte les données locales dans le BaseRepository qui
   * crée automatiquement le cache Observable.
   *
   * **Migration API :** Injecter HttpClient ici quand prêt.
   *
   * @public
   */
  constructor() {
    super(PROJECTS); // Injecte les données locales dans le cache
  }

  // ========================================
  // Méthodes métier - Filtrage
  // ========================================

  /**
   * Récupère uniquement les projets mis en avant (featured)
   *
   * **Comportement actuel :** Filtre les données locales
   *
   * **Migration API REST :**
   * ```typescript
   * getFeaturedProjects(): Observable<Project[]> {
   *   return this.http.get<Project[]>('/api/projects?featured=true');
   * }
   * ```
   *
   * @returns {Observable<Project[]>} Observable des projets featured
   *
   * @public
   *
   * @example
   * ```typescript
   * this.portfolioRepo.getFeaturedProjects().subscribe(projects => {
   *   console.log('Projets featured:', projects);
   * });
   * ```
   */
  getFeaturedProjects(): Observable<Project[]> {
    return this.filter(project => project.featured);
  }

  /**
   * Récupère les projets d'une année spécifique
   *
   * Utile pour créer une timeline ou filtrer par période.
   *
   * **Migration API REST :**
   * ```typescript
   * getProjectsByYear(year: number): Observable<Project[]> {
   *   return this.http.get<Project[]>(`/api/projects?year=${year}`);
   * }
   * ```
   *
   * @param {number} year - Année de réalisation du projet (ex: 2025)
   * @returns {Observable<Project[]>} Observable des projets de cette année
   *
   * @public
   *
   * @example
   * ```typescript
   * // Récupérer tous les projets de 2025
   * this.portfolioRepo.getProjectsByYear(2025).subscribe(projects => {
   *   console.log('Projets 2025:', projects);
   * });
   * ```
   */
  getProjectsByYear(year: number): Observable<Project[]> {
    return this.filter(project => project.year === year);
  }

  /**
   * Récupère les projets utilisant une technologie spécifique
   *
   * Permet de filtrer par tag (Angular, React, TypeScript, etc.).
   * La recherche est case-insensitive pour plus de flexibilité.
   *
   * **Migration API REST :**
   * ```typescript
   * getProjectsByTag(tag: string): Observable<Project[]> {
   *   return this.http.get<Project[]>(`/api/projects?tag=${tag}`);
   * }
   * ```
   *
   * @param {string} tag - Tag de technologie (ex: 'Angular 19', 'React')
   * @returns {Observable<Project[]>} Observable des projets avec ce tag
   *
   * @public
   *
   * @example
   * ```typescript
   * // Trouver tous les projets Angular
   * this.portfolioRepo.getProjectsByTag('Angular').subscribe(projects => {
   *   console.log('Projets Angular:', projects);
   * });
   * ```
   */
  getProjectsByTag(tag: string): Observable<Project[]> {
    const tagLower = tag.toLowerCase();
    return this.filter(project =>
      project.tags.some(t => t.toLowerCase().includes(tagLower))
    );
  }

  /**
   * Récupère les projets proposant un service spécifique
   *
   * Permet de filtrer par type de service (Frontend, Full Stack, etc.).
   * La recherche est case-insensitive pour plus de flexibilité.
   *
   * **Migration API REST :**
   * ```typescript
   * getProjectsByService(service: string): Observable<Project[]> {
   *   return this.http.get<Project[]>(`/api/projects?service=${service}`);
   * }
   * ```
   *
   * @param {string} service - Type de service (ex: 'Frontend Development')
   * @returns {Observable<Project[]>} Observable des projets avec ce service
   *
   * @public
   *
   * @example
   * ```typescript
   * // Trouver tous les projets de développement frontend
   * this.portfolioRepo.getProjectsByService('Frontend Development')
   *   .subscribe(projects => {
   *     console.log('Projets Frontend:', projects);
   *   });
   * ```
   */
  getProjectsByService(service: string): Observable<Project[]> {
    const serviceLower = service.toLowerCase();
    return this.filter(project =>
      project.services.some(s => s.toLowerCase().includes(serviceLower))
    );
  }

  /**
   * Récupère les N projets les plus récents
   *
   * Trie les projets par année décroissante et limite le résultat.
   * Utile pour afficher les projets récents en page d'accueil.
   *
   * **Algorithme :**
   * 1. Récupère tous les projets depuis le cache
   * 2. Trie par année décroissante (plus récent en premier)
   * 3. Limite au nombre demandé avec slice()
   *
   * **Migration API REST :**
   * ```typescript
   * getLatestProjects(limit: number): Observable<Project[]> {
   *   return this.http.get<Project[]>(`/api/projects?sort=year&limit=${limit}`);
   * }
   * ```
   *
   * @param {number} limit - Nombre maximum de projets à retourner
   * @returns {Observable<Project[]>} Observable des N projets les plus récents
   *
   * @public
   *
   * @example
   * ```typescript
   * // Afficher les 3 projets les plus récents
   * this.portfolioRepo.getLatestProjects(3).subscribe(projects => {
   *   console.log('Derniers projets:', projects);
   * });
   * ```
   */
  getLatestProjects(limit: number): Observable<Project[]> {
    return this.getAll().pipe(
      map(projects =>
        // Copie le tableau pour éviter de muter l'original
        [...projects]
          // Trie par année décroissante (plus récent en premier)
          .sort((a, b) => b.year - a.year)
          // Limite au nombre demandé
          .slice(0, limit)
      )
    );
  }

  // ========================================
  // Méthodes métier - Recherche avancée
  // ========================================

  /**
   * Recherche de projets par mot-clé
   *
   * Effectue une recherche full-text dans :
   * - Titre du projet
   * - Description
   * - Tags de technologie
   * - Services proposés
   *
   * La recherche est case-insensitive pour plus de résultats.
   *
   * **Migration API REST :**
   * ```typescript
   * searchProjects(query: string): Observable<Project[]> {
   *   return this.http.get<Project[]>(`/api/projects/search?q=${query}`);
   * }
   * ```
   *
   * @param {string} query - Mot-clé de recherche
   * @returns {Observable<Project[]>} Observable des projets correspondants
   *
   * @public
   *
   * @example
   * ```typescript
   * // Rechercher tous les projets contenant "React"
   * this.portfolioRepo.searchProjects('React').subscribe(projects => {
   *   console.log('Résultats:', projects);
   * });
   * ```
   */
  searchProjects(query: string): Observable<Project[]> {
    const queryLower = query.toLowerCase();

    return this.filter(project => {
      // Recherche dans le titre
      const titleMatch = project.title.toLowerCase().includes(queryLower);

      // Recherche dans la description
      const descMatch = project.description.toLowerCase().includes(queryLower);

      // Recherche dans les tags
      const tagMatch = project.tags.some(tag =>
        tag.toLowerCase().includes(queryLower)
      );

      // Recherche dans les services
      const serviceMatch = project.services.some(service =>
        service.toLowerCase().includes(queryLower)
      );

      // Match si au moins un critère est vrai
      return titleMatch || descMatch || tagMatch || serviceMatch;
    });
  }

  /**
   * Récupère les tags uniques de tous les projets
   *
   * Utile pour créer un système de filtres ou un tag cloud.
   * Retourne une liste unique et triée alphabétiquement.
   *
   * **Algorithme :**
   * 1. Récupère tous les projets
   * 2. Extrait tous les tags avec flatMap
   * 3. Élimine les doublons avec Set
   * 4. Trie alphabétiquement
   *
   * **Migration API REST :**
   * ```typescript
   * getAllTags(): Observable<string[]> {
   *   return this.http.get<string[]>('/api/projects/tags');
   * }
   * ```
   *
   * @returns {Observable<string[]>} Observable des tags uniques triés
   *
   * @public
   *
   * @example
   * ```typescript
   * // Générer une liste de filtres
   * this.portfolioRepo.getAllTags().subscribe(tags => {
   *   console.log('Tags disponibles:', tags);
   *   // Afficher dans l'UI pour filtrer
   * });
   * ```
   */
  getAllTags(): Observable<string[]> {
    return this.getAll().pipe(
      map(projects => {
        // Extrait tous les tags de tous les projets
        const allTags = projects.flatMap(project => project.tags);

        // Élimine les doublons avec Set et retourne un tableau trié
        return [...new Set(allTags)].sort();
      })
    );
  }

  /**
   * Récupère les services uniques de tous les projets
   *
   * Utile pour créer un système de filtres par type de service.
   * Retourne une liste unique et triée alphabétiquement.
   *
   * **Migration API REST :**
   * ```typescript
   * getAllServices(): Observable<string[]> {
   *   return this.http.get<string[]>('/api/projects/services');
   * }
   * ```
   *
   * @returns {Observable<string[]>} Observable des services uniques triés
   *
   * @public
   *
   * @example
   * ```typescript
   * // Générer une liste de filtres par service
   * this.portfolioRepo.getAllServices().subscribe(services => {
   *   console.log('Services disponibles:', services);
   * });
   * ```
   */
  getAllServices(): Observable<string[]> {
    return this.getAll().pipe(
      map(projects => {
        // Extrait tous les services de tous les projets
        const allServices = projects.flatMap(project => project.services);

        // Élimine les doublons et trie
        return [...new Set(allServices)].sort();
      })
    );
  }

  /**
   * Récupère les statistiques du portfolio
   *
   * Calcule des métriques utiles pour afficher des insights :
   * - Nombre total de projets
   * - Nombre de projets featured
   * - Année du projet le plus ancien
   * - Année du projet le plus récent
   * - Nombre de technologies uniques
   *
   * **Migration API REST :**
   * ```typescript
   * getStats(): Observable<PortfolioStats> {
   *   return this.http.get<PortfolioStats>('/api/projects/stats');
   * }
   * ```
   *
   * @returns {Observable<PortfolioStats>} Observable des statistiques
   *
   * @public
   *
   * @example
   * ```typescript
   * this.portfolioRepo.getStats().subscribe(stats => {
   *   console.log(`${stats.total} projets depuis ${stats.oldestYear}`);
   * });
   * ```
   */
  getStats(): Observable<{
    total: number;
    featured: number;
    oldestYear: number;
    newestYear: number;
    uniqueTechnologies: number;
  }> {
    return this.getAll().pipe(
      map(projects => {
        // Compte le nombre de projets featured
        const featured = projects.filter(p => p.featured).length;

        // Trouve l'année la plus ancienne
        const oldestYear = Math.min(...projects.map(p => p.year));

        // Trouve l'année la plus récente
        const newestYear = Math.max(...projects.map(p => p.year));

        // Compte les technologies uniques
        const allTags = projects.flatMap(p => p.tags);
        const uniqueTechnologies = new Set(allTags).size;

        return {
          total: projects.length,
          featured,
          oldestYear,
          newestYear,
          uniqueTechnologies
        };
      })
    );
  }
}
