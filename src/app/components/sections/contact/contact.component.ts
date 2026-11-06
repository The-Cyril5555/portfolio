// Contact (#contact) — dernière planche du catalogue
// ==================================================
// Le plafond baroque du hero, renversé, sous un voile d'encre dense ; au
// premier plan, l'adresse e-mail en grand (lien mailto:), un bouton pour la
// copier et les profils GitHub / LinkedIn.
//
// La <section id="contact" aria-labelledby="contact-title"> est fournie par
// app.html : ce composant ne rend que son contenu (h2#contact-title compris).
// Parallaxe : CSS pur (scroll-driven), coupée en « moins d'animations ».

import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { RevealDirective } from '../../../directives/reveal.directive';
import { IconComponent } from '../../ui/icon/icon.component';
import { CONTACT_EMAIL, SOCIAL_LINKS } from '../../../data/contact.data';

/** Durée d'affichage du retour « Adresse copiée » (plus long en cas d'échec). */
const FEEDBACK_MS = 2000;
const ERROR_MS = 4000;

@Component({
  selector: 'app-contact',
  imports: [RevealDirective, IconComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  // Couleurs « zone sombre » partagées (styles/_ui.scss) : texte crème, focus clair
  host: { class: 'section--dark' },
})
export class ContactComponent {
  protected readonly email = CONTACT_EMAIL;
  /** Affichage sur deux lignes au besoin : la coupure se fait avant « @ ». */
  protected readonly emailUser = CONTACT_EMAIL.split('@')[0];
  protected readonly emailDomain = CONTACT_EMAIL.split('@')[1];
  protected readonly socialLinks = SOCIAL_LINKS;

  /** L'API Clipboard n'existe qu'en contexte sécurisé (https, localhost). */
  protected readonly canCopy =
    typeof navigator !== 'undefined' && typeof navigator.clipboard?.writeText === 'function';

  /** Message de la région aria-live (vide = rien à annoncer). */
  protected readonly copyStatus = signal('');
  protected readonly copied = signal(false);

  private timer?: ReturnType<typeof setTimeout>;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
  }

  protected async copyEmail(): Promise<void> {
    let ok = true;
    try {
      await navigator.clipboard.writeText(this.email);
    } catch {
      ok = false; // permission refusée : on invite à copier à la main
    }
    this.copied.set(ok);
    this.copyStatus.set(ok ? 'Adresse copiée' : 'Copie impossible, sélectionnez l’adresse');
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.copied.set(false);
      this.copyStatus.set('');
    }, ok ? FEEDBACK_MS : ERROR_MS);
  }
}
