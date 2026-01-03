/**
 * Repository des Données de Contact
 * ==================================
 *
 * Repository spécialisé pour la gestion des informations de contact,
 * liens sociaux et stack technique du portfolio.
 *
 * **Fonctionnalités :**
 * - ✅ Récupération de l'email de contact
 * - ✅ Gestion des liens vers réseaux sociaux
 * - ✅ Affichage de la stack technique
 * - ✅ Configuration de l'effet parallax
 * - ✅ Future-proof pour migration API REST
 *
 * **Architecture :**
 * ```
 * Component → ContactRepository → Data Source (local ou API)
 * ```
 *
 * **Migration future vers API REST :**
 * Quand le backend sera prêt, il suffira de modifier les méthodes
 * pour appeler l'API au lieu de retourner les données locales :
 *
 * ```typescript
 * // Avant (données locales)
 * getContactEmail(): Observable<string> {
 *   return of(CONTACT_EMAIL);
 * }
 *
 * // Après (API REST)
 * getContactEmail(): Observable<string> {
 *   return this.http.get<{email: string}>('/api/contact').pipe(
 *     map(response => response.email)
 *   );
 * }
 * ```
 *
 * @class
 *
 * @example
 * ```typescript
 * // Dans un composant
 * @Component({...})
 * export class ContactComponent {
 *   email$ = this.contactRepo.getContactEmail();
 *   socialLinks$ = this.contactRepo.getSocialLinks();
 *
 *   constructor(private contactRepo: ContactRepository) {}
 * }
 * ```
 *
 * @author Cyril Bizouarn
 */

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { SocialLink, TechStackItem, ParallaxConfig } from '../../models/contact.model';
import {
  CONTACT_EMAIL,
  SOCIAL_LINKS,
  TECH_STACK,
  PARALLAX_CONFIG
} from '../../data/contact.data';

/**
 * Repository pour les données de contact
 *
 * Centralise l'accès aux données de contact avec :
 * - Cache RxJS automatique
 * - Méthodes d'accès type-safe
 * - Préparation pour API REST future
 *
 * @injectable
 * @providedIn 'root'
 */
@Injectable({
  providedIn: 'root'
})
export class ContactRepository {
  // ========================================
  // Propriétés privées - Cache
  // ========================================

  /**
   * Cache de l'email de contact
   *
   * Stocke l'email en Observable avec shareReplay(1) pour :
   * - Éviter de re-créer l'observable à chaque appel
   * - Partager le résultat entre tous les subscribers
   *
   * @private
   */
  private emailCache$: Observable<string>;

  /**
   * Cache des liens sociaux
   *
   * Stocke les liens sociaux en Observable avec shareReplay(1) pour :
   * - Éviter de re-créer l'observable à chaque appel
   * - Partager le résultat entre tous les subscribers
   *
   * @private
   */
  private socialLinksCache$: Observable<SocialLink[]>;

  /**
   * Cache de la stack technique
   *
   * Stocke la stack en Observable avec shareReplay(1) pour :
   * - Éviter de re-créer l'observable à chaque appel
   * - Partager le résultat entre tous les subscribers
   *
   * @private
   */
  private techStackCache$: Observable<TechStackItem[]>;

  /**
   * Cache de la configuration parallax
   *
   * Stocke la configuration en Observable avec shareReplay(1) pour :
   * - Éviter de re-créer l'observable à chaque appel
   * - Partager le résultat entre tous les subscribers
   *
   * @private
   */
  private parallaxConfigCache$: Observable<ParallaxConfig>;

  // ========================================
  // Constructeur
  // ========================================

  /**
   * Constructeur du repository
   *
   * Initialise tous les caches Observable au chargement du service.
   * Utilise `of()` pour créer des Observables à partir des données statiques,
   * et `shareReplay(1)` pour mettre en cache le résultat.
   *
   * **Migration API :** Injecter HttpClient ici quand prêt.
   *
   * @public
   */
  constructor() {
    // Initialise les caches avec les données locales
    this.emailCache$ = of(CONTACT_EMAIL).pipe(shareReplay(1));
    this.socialLinksCache$ = of(SOCIAL_LINKS).pipe(shareReplay(1));
    this.techStackCache$ = of(TECH_STACK).pipe(shareReplay(1));
    this.parallaxConfigCache$ = of(PARALLAX_CONFIG).pipe(shareReplay(1));
  }

  // ========================================
  // Méthodes publiques - Email
  // ========================================

  /**
   * Récupère l'email de contact principal
   *
   * **Comportement actuel :** Retourne l'email depuis les données locales
   *
   * **Migration API REST :**
   * ```typescript
   * getContactEmail(): Observable<string> {
   *   return this.http.get<{email: string}>('/api/contact').pipe(
   *     map(response => response.email)
   *   );
   * }
   * ```
   *
   * @returns {Observable<string>} Observable de l'email de contact
   *
   * @public
   *
   * @example
   * ```typescript
   * this.contactRepo.getContactEmail().subscribe(email => {
   *   console.log('Email:', email);
   * });
   * ```
   */
  getContactEmail(): Observable<string> {
    return this.emailCache$;
  }

  // ========================================
  // Méthodes publiques - Réseaux Sociaux
  // ========================================

  /**
   * Récupère tous les liens vers les réseaux sociaux
   *
   * **Comportement actuel :** Retourne les liens depuis les données locales
   *
   * **Migration API REST :**
   * ```typescript
   * getSocialLinks(): Observable<SocialLink[]> {
   *   return this.http.get<SocialLink[]>('/api/contact/social');
   * }
   * ```
   *
   * @returns {Observable<SocialLink[]>} Observable des liens sociaux
   *
   * @public
   *
   * @example
   * ```typescript
   * this.contactRepo.getSocialLinks().subscribe(links => {
   *   console.log('Réseaux sociaux:', links);
   * });
   * ```
   */
  getSocialLinks(): Observable<SocialLink[]> {
    return this.socialLinksCache$;
  }

  /**
   * Récupère un lien social par son ID
   *
   * Permet de récupérer un réseau social spécifique (ex: 'github', 'linkedin').
   *
   * **Migration API REST :**
   * ```typescript
   * getSocialLinkById(id: string): Observable<SocialLink | undefined> {
   *   return this.http.get<SocialLink>(`/api/contact/social/${id}`);
   * }
   * ```
   *
   * @param {string} id - ID du réseau social ('github', 'linkedin', etc.)
   * @returns {Observable<SocialLink | undefined>} Observable du lien social ou undefined
   *
   * @public
   *
   * @example
   * ```typescript
   * // Récupérer uniquement le lien GitHub
   * this.contactRepo.getSocialLinkById('github').subscribe(github => {
   *   if (github) {
   *     window.open(github.url, '_blank');
   *   }
   * });
   * ```
   */
  getSocialLinkById(id: string): Observable<SocialLink | undefined> {
    return this.socialLinksCache$.pipe(
      map(links => links.find(link => link.id === id))
    );
  }

  /**
   * Compte le nombre de liens sociaux
   *
   * Utile pour afficher des statistiques ou adapter le layout.
   *
   * @returns {Observable<number>} Observable du nombre de liens sociaux
   *
   * @public
   *
   * @example
   * ```typescript
   * this.contactRepo.getSocialLinksCount().subscribe(count => {
   *   console.log(`${count} réseaux sociaux disponibles`);
   * });
   * ```
   */
  getSocialLinksCount(): Observable<number> {
    return this.socialLinksCache$.pipe(
      map(links => links.length)
    );
  }

  // ========================================
  // Méthodes publiques - Stack Technique
  // ========================================

  /**
   * Récupère la stack technique complète
   *
   * Retourne la liste des technologies utilisées pour construire le portfolio.
   *
   * **Comportement actuel :** Retourne la stack depuis les données locales
   *
   * **Migration API REST :**
   * ```typescript
   * getTechStack(): Observable<TechStackItem[]> {
   *   return this.http.get<TechStackItem[]>('/api/contact/tech-stack');
   * }
   * ```
   *
   * @returns {Observable<TechStackItem[]>} Observable de la stack technique
   *
   * @public
   *
   * @example
   * ```typescript
   * this.contactRepo.getTechStack().subscribe(stack => {
   *   console.log('Technologies:', stack);
   * });
   * ```
   */
  getTechStack(): Observable<TechStackItem[]> {
    return this.techStackCache$;
  }

  /**
   * Récupère une technologie par son ID
   *
   * Permet de récupérer une technologie spécifique de la stack.
   *
   * @param {string} id - ID de la technologie ('angular', 'typescript', etc.)
   * @returns {Observable<TechStackItem | undefined>} Observable de la technologie ou undefined
   *
   * @public
   *
   * @example
   * ```typescript
   * // Récupérer uniquement Angular de la stack
   * this.contactRepo.getTechStackItemById('angular').subscribe(angular => {
   *   if (angular) {
   *     console.log('Framework:', angular.name);
   *   }
   * });
   * ```
   */
  getTechStackItemById(id: string): Observable<TechStackItem | undefined> {
    return this.techStackCache$.pipe(
      map(stack => stack.find(item => item.id === id))
    );
  }

  /**
   * Compte le nombre de technologies dans la stack
   *
   * Utile pour afficher des statistiques.
   *
   * @returns {Observable<number>} Observable du nombre de technologies
   *
   * @public
   *
   * @example
   * ```typescript
   * this.contactRepo.getTechStackCount().subscribe(count => {
   *   console.log(`Built with ${count} technologies`);
   * });
   * ```
   */
  getTechStackCount(): Observable<number> {
    return this.techStackCache$.pipe(
      map(stack => stack.length)
    );
  }

  // ========================================
  // Méthodes publiques - Configuration Parallax
  // ========================================

  /**
   * Récupère la configuration de l'effet parallax
   *
   * Retourne les multiplicateurs de vitesse pour le fond et le contenu
   * de la section contact.
   *
   * **Comportement actuel :** Retourne la config depuis les données locales
   *
   * **Migration API REST :**
   * ```typescript
   * getParallaxConfig(): Observable<ParallaxConfig> {
   *   return this.http.get<ParallaxConfig>('/api/contact/parallax-config');
   * }
   * ```
   *
   * @returns {Observable<ParallaxConfig>} Observable de la configuration parallax
   *
   * @public
   *
   * @example
   * ```typescript
   * this.contactRepo.getParallaxConfig().subscribe(config => {
   *   console.log('Parallax speeds:', config);
   *   // Utiliser config.backgroundSpeed et config.contentSpeed
   * });
   * ```
   */
  getParallaxConfig(): Observable<ParallaxConfig> {
    return this.parallaxConfigCache$;
  }

  /**
   * Récupère uniquement la vitesse du fond parallax
   *
   * Utile si seul le multiplicateur de vitesse du fond est nécessaire.
   *
   * @returns {Observable<number>} Observable de la vitesse du fond (0-1)
   *
   * @public
   *
   * @example
   * ```typescript
   * this.contactRepo.getBackgroundSpeed().subscribe(speed => {
   *   console.log(`Fond défile à ${speed * 100}% de la vitesse`);
   * });
   * ```
   */
  getBackgroundSpeed(): Observable<number> {
    return this.parallaxConfigCache$.pipe(
      map(config => config.backgroundSpeed)
    );
  }

  /**
   * Récupère uniquement la vitesse du contenu parallax
   *
   * Utile si seul le multiplicateur de vitesse du contenu est nécessaire.
   *
   * @returns {Observable<number>} Observable de la vitesse du contenu (0-1)
   *
   * @public
   *
   * @example
   * ```typescript
   * this.contactRepo.getContentSpeed().subscribe(speed => {
   *   console.log(`Contenu défile à ${speed * 100}% de la vitesse`);
   * });
   * ```
   */
  getContentSpeed(): Observable<number> {
    return this.parallaxConfigCache$.pipe(
      map(config => config.contentSpeed)
    );
  }

  // ========================================
  // Méthodes publiques - Invalidation du Cache
  // ========================================

  /**
   * Invalide tous les caches
   *
   * Force le repository à recharger les données lors du prochain appel.
   * Utile après une mise à jour des données de contact.
   *
   * **Note :** Avec une API REST, cette méthode déclencherait un nouveau
   * fetch depuis le serveur.
   *
   * @public
   *
   * @example
   * ```typescript
   * // Après une mise à jour des données
   * this.contactRepo.invalidateCache();
   * this.contactRepo.getContactEmail().subscribe(email => {
   *   // Récupère les nouvelles données
   * });
   * ```
   */
  invalidateCache(): void {
    this.emailCache$ = of(CONTACT_EMAIL).pipe(shareReplay(1));
    this.socialLinksCache$ = of(SOCIAL_LINKS).pipe(shareReplay(1));
    this.techStackCache$ = of(TECH_STACK).pipe(shareReplay(1));
    this.parallaxConfigCache$ = of(PARALLAX_CONFIG).pipe(shareReplay(1));
  }
}
