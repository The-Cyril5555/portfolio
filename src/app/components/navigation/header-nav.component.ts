// Header Navigation Component
// ============================
// Barre de navigation principale du portfolio avec effet liquid glass au scroll

import { Component, Input, inject, signal, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollService } from '../../services/scroll.service';
import { NAV_LINKS } from '../../data/navigation.data';
import { NavLink } from '../../models/contact.model';

/**
 * Composant de navigation principal (navbar)
 *
 * Affiche la barre de navigation en haut de page avec :
 * - Logo et nom
 * - Liens de navigation vers les sections
 * - Effet liquid glass au scroll
 * - Changement de couleur du texte au scroll
 *
 * @component
 * @standalone
 */
@Component({
  selector: 'app-header-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-nav.component.html',
  styleUrl: './header-nav.component.scss'
})
export class HeaderNavComponent implements OnInit, OnDestroy {
  @Input() activeSection = '';

  private scrollService = inject(ScrollService);
  private renderer = inject(Renderer2);

  // ========================================
  // Propriétés d'état
  // ========================================

  /**
   * Indique si l'utilisateur a scrollé (> 50px)
   * Utilisé pour appliquer l'effet liquid glass et changer les couleurs
   */
  isScrolled = signal(false);

  /**
   * État du menu mobile (ouvert/fermé)
   */
  mobileMenuOpen = false;

  // ========================================
  // Données de navigation
  // ========================================

  /**
   * Liens de navigation affichés dans la navbar
   *
   * Importés depuis navigation.data.ts pour garantir la cohérence avec le footer.
   * Toute modification des liens doit être faite dans navigation.data.ts.
   *
   * @readonly
   * @see {@link navigation.data.ts}
   */
  readonly navLinks: NavLink[] = NAV_LINKS;

  // ========================================
  // Lifecycle Hooks
  // ========================================

  /**
   * Initialisation du composant
   * Ajoute l'écouteur d'événement de scroll pour gérer l'effet liquid glass
   */
  ngOnInit(): void {
    // Add scroll listener
    window.addEventListener('scroll', this.handleScroll);
  }

  /**
   * Nettoyage lors de la destruction du composant
   * Retire l'écouteur d'événement de scroll pour éviter les fuites mémoire
   */
  ngOnDestroy(): void {
    // Remove scroll listener
    window.removeEventListener('scroll', this.handleScroll);
    // Ensure body scroll is restored on component destroy
    this.renderer.removeClass(document.body, 'mobile-menu-active');
  }

  // ========================================
  // Gestionnaires d'événements
  // ========================================

  /**
   * Gère le scroll de la page pour appliquer l'effet liquid glass
   *
   * Lorsque l'utilisateur scroll de plus de 50px :
   * - Active l'effet liquid glass (backdrop-filter avec SVG)
   * - Change la couleur du texte
   *
   * @private
   */
  private handleScroll = (): void => {
    // Update scrolled state when user scrolls more than 50px
    this.isScrolled.set(window.scrollY > 50);
  };

  /**
   * Gère le clic sur un lien de navigation
   *
   * @param event - Événement de clic
   * @param sectionId - Identifiant de la section vers laquelle scroller
   */
  onNavClick(event: Event, sectionId: string): void {
    event.preventDefault();
    this.scrollService.scrollToSection(sectionId);
    this.mobileMenuOpen = false;
    // Remove body scroll lock when navigating
    this.renderer.removeClass(document.body, 'mobile-menu-active');
  }

  /**
   * Toggle l'ouverture/fermeture du menu mobile
   */
  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;

    // Prevent body scroll when mobile menu is open
    // This improves UX by preventing background scroll
    if (this.mobileMenuOpen) {
      this.renderer.addClass(document.body, 'mobile-menu-active');
    } else {
      this.renderer.removeClass(document.body, 'mobile-menu-active');
    }
  }

  /**
   * Ferme le menu mobile
   */
  closeMenu(): void {
    this.mobileMenuOpen = false;
    this.renderer.removeClass(document.body, 'mobile-menu-active');
  }
}
