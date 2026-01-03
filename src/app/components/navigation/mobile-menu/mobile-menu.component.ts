/**
 * Mobile Menu Component - Menu Latéral Mobile
 * ============================================
 *
 * Menu mobile qui slide depuis la droite avec animations stagger.
 *
 * **Fonctionnalités :**
 * - Panel latéral avec effet liquid glass
 * - Slide-in depuis la droite (Motion One)
 * - Stagger animation sur les liens (apparition en cascade)
 * - Backdrop overlay semi-transparent
 * - Fermeture au clic sur overlay ou lien
 * - Lock du scroll body quand ouvert
 *
 * **Responsabilité :**
 * - Render le menu mobile uniquement
 * - Gérer l'animation d'ouverture/fermeture
 * - Émettre l'événement de fermeture au parent
 * - Navigation vers sections (via ScrollService)
 *
 * @component
 * @standalone
 * @author Cyril Bizouarn
 */

import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  ElementRef,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavLink } from '../../../models/contact.model';
import { ScrollService } from '../../../services/scroll.service';
import { MotionOneService } from '../../../services/motion-one.service';

@Component({
  selector: 'app-mobile-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MobileMenuComponent implements OnChanges {
  // ========================================
  // Inputs / Outputs
  // ========================================

  /**
   * État d'ouverture du menu
   */
  @Input({ required: true }) isOpen!: boolean;

  /**
   * Liste des liens de navigation
   */
  @Input({ required: true }) links!: NavLink[];

  /**
   * Événement de fermeture du menu
   * Émis quand l'utilisateur clique sur overlay ou lien
   */
  @Output() close = new EventEmitter<void>();

  // ========================================
  // Services
  // ========================================

  private scrollService = inject(ScrollService);
  private motionService = inject(MotionOneService);
  private elementRef = inject(ElementRef);

  // ========================================
  // Lifecycle Hooks
  // ========================================

  /**
   * Détecte les changements d'état isOpen pour animer
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && !changes['isOpen'].isFirstChange()) {
      const isOpening = changes['isOpen'].currentValue;
      this.animateMenu(isOpening);
    }
  }

  // ========================================
  // Animations
  // ========================================

  /**
   * Anime l'ouverture/fermeture du menu
   *
   * **Ouverture :**
   * 1. Panel slide depuis droite (translateX: 100% → 0%)
   * 2. Links apparaissent en cascade (stagger)
   *
   * **Fermeture :**
   * - Panel slide vers droite (translateX: 0% → 100%)
   *
   * @param open - true pour ouverture, false pour fermeture
   * @private
   */
  private animateMenu(open: boolean): void {
    // Skip animations si l'utilisateur préfère reduced-motion
    if (this.motionService.prefersReducedMotion()) {
      return;
    }

    const menu = this.elementRef.nativeElement.querySelector('.mobile-menu-panel') as HTMLElement;
    const links = this.elementRef.nativeElement.querySelectorAll('.mobile-nav-link');

    if (!menu) return;

    if (open) {
      // Animation d'ouverture avec stagger
      this.motionService.animateMobileMenuOpen(menu, links);
    } else {
      // Animation de fermeture
      this.motionService.animateMobileMenuClose(menu);
    }
  }

  // ========================================
  // Event Handlers
  // ========================================

  /**
   * Gère le clic sur un lien de navigation
   *
   * - Navigue vers la section
   * - Ferme le menu
   * - Émet l'événement close au parent
   *
   * @param event - Event de clic
   * @param sectionId - ID de la section cible
   */
  onLinkClick(event: Event, sectionId: string): void {
    event.preventDefault();
    this.scrollService.scrollToSection(sectionId);
    this.close.emit();
  }

  /**
   * Gère le clic sur l'overlay
   *
   * Ferme le menu quand l'utilisateur clique en dehors.
   */
  onOverlayClick(): void {
    this.close.emit();
  }

  /**
   * Gère les touches clavier
   *
   * Ferme le menu quand Escape est pressé.
   *
   * @param event - Keyboard event
   */
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.isOpen) {
      this.close.emit();
    }
  }
}
