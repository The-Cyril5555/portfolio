// Configuration de l'Application
// ================================
// Configuration globale de l'application Angular avec :
// - Router avec support des fragments pour navigation entre sections
// - Gestion globale des erreurs
// - ViewportScroller pour scroll automatique vers les fragments

import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners
} from '@angular/core';
import { provideRouter, withInMemoryScrolling, withViewTransitions } from '@angular/router';
import { routes } from './app.routes';

/**
 * Configuration de l'application Angular
 *
 * Providers configurés :
 * - Router avec support des fragments et scroll automatique
 * - View Transitions API pour animations de navigation fluides
 * - InMemoryScrolling pour gérer le scroll vers les fragments
 * - Gestion globale des erreurs navigateur
 *
 * @constant
 * @type {ApplicationConfig}
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      // Scroll automatique vers les fragments (#section)
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
      // Transitions fluides entre navigations (API moderne)
      withViewTransitions()
    ),
    provideBrowserGlobalErrorListeners()
  ]
};
