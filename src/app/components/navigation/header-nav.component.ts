/**
 * Header Navigation Component - Style Article
 * ============================================
 *
 * Composant de navbar simplifié avec style article (95% width, border-radius, static glass).
 *
 * **Responsabilités :**
 * - Gestion du scroll detection (isScrolled > 50px)
 * - Navigation desktop inline (pas de composant)
 * - Hamburger button inline (pas de composant)
 * - Body scroll lock quand menu mobile ouvert
 *
 * **Style :**
 * - 95% width centrée avec border-radius 24px
 * - Effet glass statique (blur 8px constant)
 * - Shadow au scroll
 *
 * **Child Component :**
 * - MobileMenuComponent : Menu mobile latéral (seul composant enfant)
 *
 * @component
 * @standalone
 * @author Cyril Bizouarn
 */

import {
  Component,
  inject,
  signal,
  OnInit,
  OnDestroy,
  DestroyRef,
  Renderer2,
  ElementRef,
  ChangeDetectionStrategy
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { ScrollService } from '../../services/scroll.service';
import { ScrollObserverService } from '../../services/scroll-observer.service';
import { NAV_LINKS } from '../../data/navigation.data';
import { NavLink } from '../../models/contact.model';

// Import du composant mobile menu (seul composant enfant)
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';

@Component({
  selector: 'app-header-nav',
  standalone: true,
  imports: [
    CommonModule,
    MobileMenuComponent  // Seul composant enfant restant
  ],
  templateUrl: './header-nav.component.html',
  styleUrl: './header-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderNavComponent implements OnInit, OnDestroy {
  // ========================================
  // Services
  // ========================================

  scrollService = inject(ScrollService); // Public pour le template
  private scrollObserver = inject(ScrollObserverService);
  private destroyRef = inject(DestroyRef);
  private renderer = inject(Renderer2);

  // ========================================
  // État
  // ========================================

  /**
   * Indique si l'utilisateur a scrollé (> 50px)
   * Contrôle l'activation de l'effet liquid glass
   */
  isScrolled = signal(false);

  /**
   * État du menu mobile (ouvert/fermé)
   * Converti en signal pour meilleure réactivité
   */
  mobileMenuOpen = signal(false);

  // ========================================
  // Données
  // ========================================

  /**
   * Liens de navigation
   * Source unique partagée avec le footer
   */
  readonly navLinks: NavLink[] = NAV_LINKS;

  // ========================================
  // Propriétés privées
  // ========================================

  /**
   * Position de scroll sauvegardée quand le menu mobile s'ouvre
   * Nécessaire pour restaurer la position exacte après fermeture
   */
  private scrollPosition = 0;

  // ========================================
  // Lifecycle Hooks
  // ========================================

  ngOnInit(): void {
    // Utilise le ScrollObserverService partagé (un seul listener pour toute l'app)
    this.scrollObserver.isScrolled$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(scrolled => this.isScrolled.set(scrolled));
  }

  ngOnDestroy(): void {
    // Restaurer le body si menu était ouvert
    if (this.mobileMenuOpen()) {
      this.unlockBodyScroll();
    }
  }

  // ========================================
  // Mobile Menu Handlers
  // ========================================

  /**
   * Toggle l'ouverture/fermeture du menu mobile
   *
   * **Body Scroll Lock Strategy :**
   * - Fixe le body (pattern standard) pour empêcher le scroll visuel
   * - Préserve window.scrollY pour que les scroll events continuent
   * - Sauvegarde/restaure la position de scroll
   * - Permet au parallax de continuer à fonctionner
   */
  toggleMobileMenu(): void {
    const newState = !this.mobileMenuOpen();
    this.mobileMenuOpen.set(newState);

    if (newState) {
      this.lockBodyScroll();
    } else {
      this.unlockBodyScroll();
    }
  }

  /**
   * Ferme le menu mobile
   * Appelé par l'événement (close) du MobileMenuComponent
   */
  closeMenu(): void {
    this.mobileMenuOpen.set(false);
    this.unlockBodyScroll();
  }

  /**
   * Verrouille le scroll du body et sauvegarde la position actuelle
   *
   * **Body Scroll Lock Strategy :**
   * - Fixe le body (pattern standard) pour empêcher le scroll visuel
   * - Préserve window.scrollY pour que les scroll events continuent
   * - Sauvegarde la position de scroll pour restauration ultérieure
   * - Permet au parallax de continuer à fonctionner
   *
   * @private
   */
  private lockBodyScroll(): void {
    this.scrollPosition = window.scrollY;

    // Verrouiller le body (pattern standard - préserve scroll events!)
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.scrollPosition}px`;
    document.body.style.width = '100%';
    this.renderer.addClass(document.body, 'mobile-menu-active');
  }

  /**
   * Déverrouille le scroll du body et restaure la position sauvegardée
   *
   * @private
   */
  private unlockBodyScroll(): void {
    // Déverrouiller le body
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    this.renderer.removeClass(document.body, 'mobile-menu-active');

    // Restaurer la position de scroll
    window.scrollTo(0, this.scrollPosition);
  }
}
