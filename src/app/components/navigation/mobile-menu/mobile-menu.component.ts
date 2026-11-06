/**
 * Menu mobile plein écran (< 1024px)
 * ==================================
 *
 * Panneau papier, liens en gothique numérotés, email en bas.
 * Ouverture / fermeture en CSS (opacity, transform, visibility) ; fermé, l'hôte
 * est `inert` + `aria-hidden`. Le focus, Échap et le piège de Tab sont gérés par
 * la barre (HeaderNavComponent), qui garde le bouton de fermeture au-dessus.
 */

import { ChangeDetectionStrategy, Component, ElementRef, inject, input, output } from '@angular/core';
import { NavLink } from '../../../models/contact.model';
import { NAV_EMAIL } from '../../../data/navigation.data';

export interface MenuNavigation {
  event: Event;
  id: string;
}

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styleUrl: './mobile-menu.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.is-open]': 'open()',
    '[attr.inert]': 'open() ? null : ""',
    '[attr.aria-hidden]': 'open() ? null : "true"',
  },
})
export class MobileMenuComponent {
  readonly open = input.required<boolean>();
  readonly links = input.required<readonly NavLink[]>();
  /** Id de la section visible (scroll-spy). */
  readonly active = input<string>('');

  /** Clic sur un lien : la barre ferme le menu puis fait défiler. */
  readonly navigate = output<MenuNavigation>();

  protected readonly email = NAV_EMAIL;
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);

  /** Éléments focusables du panneau, dans l'ordre du DOM. */
  focusables(): HTMLElement[] {
    return Array.from(this.host.nativeElement.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'));
  }

  focusFirst(): void {
    this.focusables()[0]?.focus();
  }
}
