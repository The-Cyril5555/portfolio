import { Directive, ElementRef, OnDestroy, OnInit, inject, input } from '@angular/core';
import { RevealService } from '../services/reveal.service';

/**
 * Apparition douce au scroll (fondu + léger glissement vers le haut).
 *
 * Usage :
 *   <h2 appReveal>…</h2>
 *   <article [appReveal]="$index * 90">…</article>   (délai en ms, pour un effet cascade)
 *
 * La classe `.reveal` est posée dès le premier rendu (pas de flash de contenu),
 * l'animation elle-même est en CSS (styles/_ui.scss) et désactivée sous
 * `prefers-reduced-motion`.
 */
@Directive({
  selector: '[appReveal]',
  host: {
    '[class.reveal]': 'enabled',
    '[style.--reveal-delay]': 'delayCss()',
  },
})
export class RevealDirective implements OnInit, OnDestroy {
  /** Délai avant l'animation, en millisecondes. */
  readonly appReveal = input<number | '' | undefined>(0);

  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly reveal = inject(RevealService);
  protected readonly enabled = this.reveal.motionAllowed;

  protected delayCss(): string | null {
    const ms = Number(this.appReveal()) || 0;
    return ms > 0 ? `${ms}ms` : null;
  }

  ngOnInit(): void {
    this.reveal.observe(this.el.nativeElement);
  }

  ngOnDestroy(): void {
    this.reveal.unobserve(this.el.nativeElement);
  }
}
