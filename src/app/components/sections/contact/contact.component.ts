// Composant Contact
// ==================
// Ce composant affiche la section de contact du portfolio avec :
// - Un effet parallax sur le fond et le contenu
// - Les informations de contact (email)
// - Les liens vers les réseaux sociaux
// - Un footer avec navigation et stack technique

import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../ui/icon/icon.component';
import {
  CONTACT_EMAIL,
  SOCIAL_LINKS,
  TECH_STACK,
  PARALLAX_CONFIG
} from '../../../data/contact.data';
import { NAV_LINKS } from '../../../data/navigation.data';
import { SocialLink, TechStackItem, NavLink, ParallaxConfig } from '../../../models/contact.model';

/**
 * Composant de la section Contact
 *
 * Affiche les informations de contact avec un effet parallax artistique.
 * Le fond (image paint.png) et le contenu défilent à des vitesses différentes
 * pour créer une sensation de profondeur lors du scroll.
 *
 * @component
 * @standalone
 */
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit, OnDestroy {
  // ========================================
  // Propriétés de données
  // ========================================

  /**
   * Adresse email de contact affichée dans la section
   * @readonly
   */
  readonly contactEmail = CONTACT_EMAIL;

  /**
   * Liste des liens vers les réseaux sociaux (GitHub, LinkedIn, etc.)
   * Chaque lien contient l'URL, le nom et l'icône à afficher
   * @readonly
   */
  readonly socialLinks: SocialLink[] = SOCIAL_LINKS;

  /**
   * Liste des technologies utilisées pour construire ce portfolio
   * Affichées dans le footer avec leurs icônes Devicon
   * @readonly
   */
  readonly techStack: TechStackItem[] = TECH_STACK;

  /**
   * Liens de navigation du footer vers les différentes sections du portfolio
   * Partagés avec la navbar pour garantir la cohérence des labels
   * Source unique : navigation.data.ts
   * @readonly
   */
  readonly footerNavLinks: NavLink[] = NAV_LINKS;

  // ========================================
  // Propriétés d'état (effet parallax)
  // ========================================

  /**
   * Transformation CSS appliquée au fond (background)
   * Combine une translation verticale (parallax) et un retournement vertical (scaleY(-1))
   * Le signal permet une réactivité optimale lors du scroll
   */
  backgroundTransform = signal('translateY(0px) scaleY(-1)');

  /**
   * Décalage vertical du contenu en pixels
   * Utilisé pour créer l'effet parallax sur le contenu de la section
   * Valeur calculée dynamiquement lors du scroll
   */
  contentOffset = signal(0);

  // ========================================
  // Propriétés de configuration
  // ========================================

  /**
   * Configuration de l'effet parallax
   * Définit les multiplicateurs de vitesse pour le fond et le contenu
   * @private
   * @readonly
   */
  private readonly parallaxConfig: ParallaxConfig = PARALLAX_CONFIG;

  /**
   * Année actuelle pour l'affichage du copyright dans le footer
   * Calculée automatiquement à l'initialisation du composant
   * @readonly
   */
  readonly currentYear = new Date().getFullYear();

  // ========================================
  // Lifecycle Hooks
  // ========================================

  /**
   * Initialisation du composant
   * Ajoute l'écouteur d'événement de scroll pour gérer l'effet parallax
   */
  ngOnInit(): void {
    window.addEventListener('scroll', this.handleScroll);
  }

  /**
   * Nettoyage lors de la destruction du composant
   * Retire l'écouteur d'événement de scroll pour éviter les fuites mémoire
   */
  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.handleScroll);
  }

  // ========================================
  // Méthodes privées
  // ========================================

  /**
   * Gère l'effet parallax lors du scroll de la page
   *
   * Algorithme :
   * 1. Récupère la position de la section contact dans la viewport
   * 2. Calcule la distance entre le haut de la fenêtre et le haut de la section
   * 3. Applique des multiplicateurs différents pour créer l'effet de profondeur :
   *    - Fond : défile à 30% de la vitesse de scroll (plus lent = plus loin)
   *    - Contenu : défile à 15% de la vitesse de scroll (encore plus lent)
   *
   * L'effet est uniquement actif quand la section est visible dans la viewport
   * pour optimiser les performances.
   *
   * @private
   */
  private handleScroll = (): void => {
    const contactSection = document.querySelector('.contact');

    if (contactSection) {
      const rect = contactSection.getBoundingClientRect();
      // Distance entre le haut de la fenêtre et le haut de la section
      const offset = window.innerHeight - rect.top;

      // Applique le parallax uniquement si la section est visible
      if (offset > 0 && rect.bottom > 0) {
        // Fond : défile plus lentement + retourné verticalement pour effet artistique
        const backgroundOffset = this.calculateParallaxOffset(
          offset,
          this.parallaxConfig.backgroundSpeed
        );
        this.backgroundTransform.set(`translateY(${backgroundOffset}px) scaleY(-1)`);

        // Contenu : défile encore plus lentement pour accentuer la profondeur
        const contentParallaxOffset = this.calculateParallaxOffset(
          offset,
          this.parallaxConfig.contentSpeed
        );
        this.contentOffset.set(contentParallaxOffset);
      }
    }
  };

  /**
   * Calcule le décalage parallax en fonction de la position de scroll
   *
   * @param offset - Distance entre le haut de la fenêtre et le haut de la section (en pixels)
   * @param speed - Multiplicateur de vitesse (0.3 = 30% de la vitesse de scroll)
   * @returns Le décalage en pixels à appliquer
   *
   * @example
   * // Pour un scroll de 100px avec une vitesse de 0.3 :
   * calculateParallaxOffset(100, 0.3) // retourne 30
   *
   * @private
   */
  private calculateParallaxOffset(offset: number, speed: number): number {
    return offset * speed;
  }
}
