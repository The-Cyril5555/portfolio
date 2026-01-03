// Configuration des Routes Angular
// =================================
// Ce fichier configure le routing de l'application avec support des fragments
// pour permettre la navigation vers les différentes sections du portfolio
//
// Les fragments permettent de maintenir le comportement de single-page app
// tout en bénéficiant des avantages du Router Angular :
// - Navigation avec les boutons navigateur (back/forward)
// - Deep linking vers des sections spécifiques
// - Guards et lifecycle hooks
// - Meilleure intégration avec l'écosystème Angular

import { Routes } from '@angular/router';
import { App } from './app';

/**
 * Configuration des routes de l'application
 *
 * Utilise une route principale unique avec navigation par fragments.
 * Les sections sont accessibles via des fragments (#home, #work, #about, #contact)
 *
 * La navigation se fait via router.navigate(['/'], { fragment: 'section-id' })
 * au lieu des ancres traditionnelles href="#section"
 *
 * @constant
 * @type {Routes}
 *
 * @example
 * ```typescript
 * // Dans un composant
 * constructor(private router: Router) {}
 *
 * navigateToWork() {
 *   this.router.navigate(['/'], { fragment: 'work' });
 * }
 * ```
 */
export const routes: Routes = [
  {
    path: '',
    component: App,
    // Pas de children car c'est une single-page app avec sections
  }
];
