/**
 * Composant Contact
 * ==================
 *
 * Affiche la section de contact du portfolio avec :
 * - Effet parallax artistique (directive appParallax)
 * - Informations de contact (email)
 * - Liens vers les réseaux sociaux
 * - Footer avec navigation et stack technique
 *
 * **Architecture :**
 * - Utilise ContactRepository pour l'accès aux données de contact
 * - Convertit les Observables en Signals avec toSignal()
 * - Réactivité automatique si les données changent
 *
 * **Pattern Repository :**
 * Au lieu d'importer directement les données locales (CONTACT_EMAIL, SOCIAL_LINKS, etc.),
 * le composant utilise le ContactRepository qui abstrait la source de données.
 * Cela permet de migrer facilement vers une API REST sans modifier le composant.
 *
 * **Optimisations (refactoring) :**
 * - Directive appParallax au lieu de gestion manuelle du scroll
 * - Fond : speed 0.3 (30% vitesse scroll) + scaleY(-1) pour effet miroir
 * - Contenu : speed 0.15 (15% vitesse scroll) pour accentuer la profondeur
 * - Élimine 27 lignes de code dupliqué (handleScroll, calculateParallaxOffset)
 *
 * @component
 * @selector app-contact
 * @standalone
 *
 * @example
 * ```html
 * <app-contact></app-contact>
 * ```
 *
 * @author Cyril Bizouarn
 */

import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { IconComponent } from '../../ui/icon/icon.component';
import { MotionParallaxDirective } from '../../../directives/motion-parallax.directive';
import { NAV_LINKS } from '../../../data/navigation.data';
import { SocialLink, TechStackItem, NavLink } from '../../../models/contact.model';
import { ContactRepository } from '../../../services/data/contact.repository';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, IconComponent, MotionParallaxDirective],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContactComponent {
  // ========================================
  // Propriétés privées - Services injectés
  // ========================================

  /**
   * Repository pour accéder aux données de contact
   *
   * Injecté via la fonction `inject()` d'Angular (approche moderne).
   * Permet d'utiliser le repository dans les initialisations de propriétés.
   *
   * @private
   * @readonly
   */
  private readonly contactRepo = inject(ContactRepository);

  // ========================================
  // Propriétés publiques - Données de contact
  // ========================================

  /**
   * Signal de l'adresse email de contact
   *
   * Converti depuis l'Observable du repository avec toSignal().
   * Initialisé avec une chaîne vide par défaut.
   *
   * **Source :** ContactRepository.getContactEmail()
   *
   * @public
   * @readonly
   */
  contactEmail = toSignal(this.contactRepo.getContactEmail(), {
    initialValue: ''
  });

  /**
   * Signal des liens vers les réseaux sociaux
   *
   * Converti depuis l'Observable du repository avec toSignal().
   * Initialisé avec un tableau vide par défaut.
   *
   * Chaque lien contient :
   * - id : Identifiant unique ('github', 'linkedin')
   * - name : Nom affiché du réseau
   * - url : URL du profil
   * - icon : Nom de l'icône à utiliser
   *
   * **Source :** ContactRepository.getSocialLinks()
   *
   * @public
   * @readonly
   */
  socialLinks = toSignal(this.contactRepo.getSocialLinks(), {
    initialValue: [] as SocialLink[]
  });

  /**
   * Signal de la stack technique du portfolio
   *
   * Converti depuis l'Observable du repository avec toSignal().
   * Initialisé avec un tableau vide par défaut.
   *
   * Chaque technologie contient :
   * - id : Identifiant unique ('angular', 'typescript')
   * - name : Nom affiché de la technologie
   * - icon : Classe CSS de l'icône Devicon
   *
   * Affichées dans le footer pour montrer les technologies utilisées.
   *
   * **Source :** ContactRepository.getTechStack()
   *
   * @public
   * @readonly
   */
  techStack = toSignal(this.contactRepo.getTechStack(), {
    initialValue: [] as TechStackItem[]
  });

  // ========================================
  // Propriétés publiques - Navigation
  // ========================================

  /**
   * Liens de navigation du footer
   *
   * Partagés avec la navbar pour garantir la cohérence des labels.
   * Source unique : navigation.data.ts
   *
   * **Note :** Ces liens ne proviennent pas du ContactRepository car ils
   * sont partagés entre plusieurs composants (HeaderNav, Contact).
   * Idéalement, un NavigationRepository pourrait être créé dans le futur.
   *
   * @public
   * @readonly
   */
  readonly footerNavLinks: NavLink[] = NAV_LINKS;

  /**
   * Année actuelle pour le copyright
   *
   * Calculée automatiquement à l'initialisation du composant.
   * Affichée dans le footer : "© 2025 Cyril Bizouarn"
   *
   * @public
   * @readonly
   */
  readonly currentYear = new Date().getFullYear();
}
