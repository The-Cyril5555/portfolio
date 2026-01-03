/**
 * Repository de Base
 * ==================
 *
 * Classe abstraite fournissant les fonctionnalités communes à tous les repositories.
 *
 * **Pattern Repository :**
 * Le pattern Repository abstrait la logique d'accès aux données et fournit
 * une interface uniforme pour récupérer, créer, mettre à jour et supprimer des données.
 *
 * **Avantages :**
 * - ✅ Abstraction de la source de données (fichiers locaux, API REST, etc.)
 * - ✅ Facilite les tests avec des mocks
 * - ✅ Centralise la logique de cache
 * - ✅ Prépare la migration vers une API REST
 * - ✅ Un seul endroit pour modifier la source de données
 *
 * **Architecture :**
 * ```
 * Component → Repository → Data Source (local files ou API)
 * ```
 *
 * **Migration future vers API REST :**
 * Quand le backend sera prêt, il suffira de modifier les repositories
 * pour appeler l'API au lieu de retourner les données locales :
 *
 * ```typescript
 * // Avant (données locales)
 * getAll(): Observable<T[]> {
 *   return of(LOCAL_DATA).pipe(shareReplay(1));
 * }
 *
 * // Après (API REST)
 * getAll(): Observable<T[]> {
 *   return this.http.get<T[]>('/api/projects').pipe(shareReplay(1));
 * }
 * ```
 *
 * @abstract
 * @template T - Type des entités gérées par le repository
 *
 * @example
 * ```typescript
 * // Implémentation concrète
 * @Injectable({ providedIn: 'root' })
 * export class PortfolioRepository extends BaseRepository<Project> {
 *   constructor() {
 *     super(PROJECTS); // Données locales
 *   }
 * }
 * ```
 *
 * @author Cyril Bizouarn
 */

import { Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

/**
 * Repository abstrait de base
 *
 * Fournit les opérations CRUD de base pour tous les repositories.
 * Les repositories concrets étendent cette classe et ajoutent leurs méthodes spécifiques.
 *
 * @template T - Type des entités
 */
export abstract class BaseRepository<T> {
  // ========================================
  // Propriétés protégées
  // ========================================

  /**
   * Cache des données
   *
   * Stocke les données en mémoire pour éviter de re-créer l'observable
   * à chaque appel. Utilise shareReplay(1) pour partager le résultat
   * entre tous les subscribers.
   *
   * **Note :** En production avec une API, ce cache serait géré différemment
   * (ex: avec un TTL, invalidation manuelle, etc.)
   *
   * @protected
   */
  protected cache$: Observable<T[]>;

  // ========================================
  // Constructeur
  // ========================================

  /**
   * Constructeur du repository
   *
   * @param {T[]} data - Données initiales (fichier local pour l'instant)
   *
   * @protected
   */
  constructor(protected data: T[]) {
    // Crée un observable qui émet les données et les met en cache
    this.cache$ = of(this.data).pipe(
      // shareReplay(1) : Partage le dernier résultat avec tous les subscribers
      // Évite de réexécuter of(data) pour chaque subscription
      shareReplay(1)
    );
  }

  // ========================================
  // Méthodes publiques - CRUD de base
  // ========================================

  /**
   * Récupère toutes les entités
   *
   * **Comportement actuel :** Retourne les données locales depuis le cache
   *
   * **Migration API REST :**
   * ```typescript
   * getAll(): Observable<T[]> {
   *   return this.http.get<T[]>(this.apiUrl);
   * }
   * ```
   *
   * @returns {Observable<T[]>} Observable des entités
   *
   * @public
   *
   * @example
   * ```typescript
   * this.portfolioRepository.getAll().subscribe(projects => {
   *   console.log('All projects:', projects);
   * });
   * ```
   */
  getAll(): Observable<T[]> {
    return this.cache$;
  }

  /**
   * Récupère une entité par son ID
   *
   * **Comportement actuel :** Filtre les données locales
   *
   * **Migration API REST :**
   * ```typescript
   * getById(id: string): Observable<T | undefined> {
   *   return this.http.get<T>(`${this.apiUrl}/${id}`);
   * }
   * ```
   *
   * @param {string} id - ID de l'entité recherchée
   * @returns {Observable<T | undefined>} Observable de l'entité ou undefined si non trouvée
   *
   * @public
   *
   * @example
   * ```typescript
   * this.portfolioRepository.getById('project-1').subscribe(project => {
   *   if (project) {
   *     console.log('Project found:', project);
   *   }
   * });
   * ```
   */
  getById(id: string): Observable<T | undefined> {
    return this.cache$.pipe(
      map(items => items.find((item: any) => item.id === id))
    );
  }

  /**
   * Récupère le nombre total d'entités
   *
   * Utile pour la pagination ou afficher des statistiques.
   *
   * @returns {Observable<number>} Observable du nombre d'entités
   *
   * @public
   *
   * @example
   * ```typescript
   * this.portfolioRepository.count().subscribe(count => {
   *   console.log(`Total projects: ${count}`);
   * });
   * ```
   */
  count(): Observable<number> {
    return this.cache$.pipe(
      map(items => items.length)
    );
  }

  /**
   * Filtre les entités selon un prédicat
   *
   * Méthode générique pour filtrer les données selon n'importe quel critère.
   *
   * **Migration API REST :**
   * ```typescript
   * filter(predicate: (item: T) => boolean): Observable<T[]> {
   *   // Envoyer les filtres au backend via query params
   *   return this.http.get<T[]>(`${this.apiUrl}?filter=...`);
   * }
   * ```
   *
   * @param {(item: T) => boolean} predicate - Fonction de filtrage
   * @returns {Observable<T[]>} Observable des entités filtrées
   *
   * @public
   *
   * @example
   * ```typescript
   * // Filtrer les projets featured
   * this.portfolioRepository
   *   .filter(project => project.featured)
   *   .subscribe(featured => {
   *     console.log('Featured projects:', featured);
   *   });
   * ```
   */
  filter(predicate: (item: T) => boolean): Observable<T[]> {
    return this.cache$.pipe(
      map(items => items.filter(predicate))
    );
  }

  // ========================================
  // Méthodes protégées - Utilitaires
  // ========================================

  /**
   * Invalide le cache
   *
   * Force le repository à recharger les données lors du prochain appel.
   * Utile après une création, mise à jour ou suppression.
   *
   * **Note :** Avec une API REST, cette méthode déclencherait un nouveau
   * fetch depuis le serveur.
   *
   * @protected
   *
   * @example
   * ```typescript
   * // Dans une méthode de repository concret
   * create(item: T): Observable<T> {
   *   // ... logique de création
   *   this.invalidateCache();
   *   return of(item);
   * }
   * ```
   */
  protected invalidateCache(): void {
    this.cache$ = of(this.data).pipe(shareReplay(1));
  }
}
