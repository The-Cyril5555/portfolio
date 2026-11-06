/**
 * Barre de navigation — pilule en verre (CSS pur)
 * ===============================================
 *
 * - Verre : fond papier translucide + backdrop-filter (voir le SCSS).
 * - Thème automatique : quand le centre de la barre passe au-dessus d'un élément
 *   [data-nav-theme="dark"] (hero, contact, pied de page), la barre bascule en
 *   variante sombre. Calcul sur scroll/resize, limité à une fois par frame.
 * - ≥ 1024px : liens en ligne ; en dessous : burger + menu plein écran
 *   (focus piégé, Échap, verrouillage du défilement via body.menu-open).
 */

import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ScrollService } from '../../services/scroll.service';
import { NAV_LINKS } from '../../data/navigation.data';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';

/** Bascule barre complète / burger (= mixin up(lg) de styles/_bp.scss). */
const DESKTOP_QUERY = '(min-width: 1024px)';
const FOCUSABLE = 'a[href], button:not([disabled])';

@Component({
  selector: 'app-header-nav',
  imports: [MobileMenuComponent],
  templateUrl: './header-nav.component.html',
  styleUrl: './header-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown)': 'onDocumentKeydown($event)',
  },
})
export class HeaderNavComponent {
  protected readonly scroll = inject(ScrollService);
  private readonly doc = inject(DOCUMENT);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly links = NAV_LINKS;
  /** Menu mobile ouvert. */
  protected readonly menuOpen = signal(false);
  /** La barre survole une zone sombre (hero, contact, pied de page). */
  protected readonly onDark = signal(false);

  private readonly bar = viewChild.required<ElementRef<HTMLElement>>('bar');
  private readonly burger = viewChild.required<ElementRef<HTMLButtonElement>>('burger');
  private readonly menu = viewChild.required(MobileMenuComponent);

  private frame = 0;

  constructor() {
    afterNextRender(() => this.listen());
    this.destroyRef.onDestroy(() => this.doc.body.classList.remove('menu-open'));
  }

  // --- Thème clair / sombre --------------------------------------------------

  private listen(): void {
    const win = this.doc.defaultView;
    if (!win) return;

    const schedule = () => {
      if (!this.frame) this.frame = win.requestAnimationFrame(() => this.updateTheme());
    };
    win.addEventListener('scroll', schedule, { passive: true });
    win.addEventListener('resize', schedule, { passive: true });
    // La page peut changer de hauteur sans défiler (images chargées, contenu révélé)
    const resized = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(schedule);
    resized?.observe(this.doc.body);

    // Retour en largeur desktop : le menu n'a plus de raison d'être ouvert.
    // Si le focus y était, il revient sur la marque (le burger disparaît).
    const desktop = win.matchMedia(DESKTOP_QUERY);
    const onBreakpoint = (e: MediaQueryListEvent) => {
      if (!e.matches || !this.menuOpen()) return;
      const hadFocus = this.menu().focusables().includes(this.doc.activeElement as HTMLElement);
      this.setMenu(false);
      if (hadFocus) this.bar().nativeElement.querySelector<HTMLElement>('.brand')?.focus();
    };
    desktop.addEventListener('change', onBreakpoint);

    this.destroyRef.onDestroy(() => {
      win.removeEventListener('scroll', schedule);
      win.removeEventListener('resize', schedule);
      resized?.disconnect();
      desktop.removeEventListener('change', onBreakpoint);
      if (this.frame) win.cancelAnimationFrame(this.frame);
    });

    this.updateTheme();
  }

  private updateTheme(): void {
    this.frame = 0;
    const box = this.bar().nativeElement.getBoundingClientRect();
    const y = box.top + box.height / 2;
    let dark = false;
    for (const zone of Array.from(this.doc.querySelectorAll('[data-nav-theme="dark"]'))) {
      const r = zone.getBoundingClientRect();
      if (r.top <= y && r.bottom >= y) {
        dark = true;
        break;
      }
    }
    this.onDark.set(dark);
  }

  // --- Navigation ---------------------------------------------------------------

  protected go(event: Event, id: string): void {
    event.preventDefault();
    this.setMenu(false);
    this.scroll.scrollToSection(id);
  }

  // --- Menu mobile ----------------------------------------------------------------

  protected toggleMenu(): void {
    this.setMenu(!this.menuOpen());
  }

  private setMenu(open: boolean): void {
    if (open === this.menuOpen()) return;
    this.menuOpen.set(open);
    // Classe posée tout de suite : un scrollToSection juste après doit pouvoir défiler
    this.doc.body.classList.toggle('menu-open', open);
    if (open) {
      // Le panneau n'est focusable qu'une fois `inert` retiré (rendu suivant)
      afterNextRender({ write: () => this.menu().focusFirst() }, { injector: this.injector });
    }
  }

  protected onDocumentKeydown(event: KeyboardEvent): void {
    if (!this.menuOpen()) return;

    if (event.key === 'Escape') {
      event.preventDefault();
      this.setMenu(false);
      this.burger().nativeElement.focus();
      return;
    }

    if (event.key !== 'Tab') return;

    // Tab reste dans [barre (marque, bouton fermer) + menu], dans l'ordre du DOM
    const items = [
      ...Array.from(this.bar().nativeElement.querySelectorAll<HTMLElement>(FOCUSABLE)),
      ...this.menu().focusables(),
    ].filter((el) => el.getClientRects().length > 0);
    if (!items.length) return;

    const first = items[0];
    const last = items[items.length - 1];
    const current = this.doc.activeElement as HTMLElement | null;
    const inside = current ? items.includes(current) : false;

    if (event.shiftKey && (current === first || !inside)) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && (current === last || !inside)) {
      event.preventDefault();
      first.focus();
    }
  }
}
