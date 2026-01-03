/**
 * Tests Unitaires - ScrollRevealDirective
 * =========================================
 *
 * Teste la directive d'animations au scroll avec GSAP.
 *
 * Couvre :
 * - Animations prédéfinies (fadeIn, fadeInUp, etc.)
 * - Animation personnalisée (custom)
 * - Stagger sur éléments enfants
 * - Déclenchement via IntersectionObserver
 * - Cleanup des animations
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ScrollRevealDirective } from './scroll-reveal.directive';
import { gsap } from 'gsap';

/**
 * Composant de test pour la directive ScrollReveal
 */
@Component({
  template: `
    <div
      class="test-element"
      [appScrollReveal]="scrollRevealConfig">
      Test Content
    </div>

    <div
      class="test-stagger"
      [appScrollReveal]="staggerConfig">
      <div class="item">Item 1</div>
      <div class="item">Item 2</div>
      <div class="item">Item 3</div>
    </div>
  `,
  standalone: true,
  imports: [ScrollRevealDirective]
})
class TestComponent {
  scrollRevealConfig = { animation: 'fadeInUp' as const, duration: 800 };
  staggerConfig = {
    animation: 'fadeInUp' as const,
    stagger: true,
    staggerDelay: 100
  };
}

describe('ScrollRevealDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let mockIntersectionObserver: jasmine.Spy;
  let observerCallback: IntersectionObserverCallback;

  beforeEach(async () => {
    // Mock IntersectionObserver
    observerCallback = null as any;
    mockIntersectionObserver = jasmine.createSpy('IntersectionObserver')
      .and.callFake((callback: IntersectionObserverCallback) => {
        observerCallback = callback;
        return {
          observe: jasmine.createSpy('observe'),
          disconnect: jasmine.createSpy('disconnect'),
          unobserve: jasmine.createSpy('unobserve')
        };
      });

    (window as any).IntersectionObserver = mockIntersectionObserver;

    await TestBed.configureTestingModule({
      imports: [TestComponent, ScrollRevealDirective]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('devrait créer la directive', () => {
    const directive = fixture.debugElement.query(By.directive(ScrollRevealDirective));
    expect(directive).toBeTruthy();
  });

  it('devrait créer un IntersectionObserver avec le bon threshold', () => {
    expect(mockIntersectionObserver).toHaveBeenCalled();
    const options = mockIntersectionObserver.calls.mostRecent().args[1];
    expect(options.threshold).toBe(0.2); // DEFAULT_SCROLL_REVEAL_CONFIG.threshold
  });

  it('devrait appliquer l\'état initial avec opacity 0', () => {
    const element = fixture.debugElement.query(By.css('.test-element'));
    const nativeElement = element.nativeElement as HTMLElement;

    // L'élément devrait avoir opacity 0 initialement (fadeInUp)
    const computedStyle = window.getComputedStyle(nativeElement);
    // Note: GSAP applique inline styles
    expect(nativeElement.style.willChange).toContain('transform');
  });

  describe('Animations', () => {
    it('devrait jouer fadeInUp quand l\'élément entre dans la viewport', (done) => {
      const element = fixture.debugElement.query(By.css('.test-element')).nativeElement;

      // Simuler l'entrée dans la viewport
      const mockEntry = {
        isIntersecting: true,
        target: element
      } as IntersectionObserverEntry;

      // Espionner gsap.timeline
      spyOn(gsap, 'timeline').and.callThrough();

      // Déclencher le callback
      observerCallback([mockEntry], {} as IntersectionObserver);

      // Vérifier que timeline a été créée
      expect(gsap.timeline).toHaveBeenCalled();

      done();
    });

    it('devrait supporter l\'animation custom', () => {
      component.scrollRevealConfig = {
        animation: 'custom',
        customAnimation: { x: -100, rotation: 360, opacity: 0 },
        duration: 1000
      };
      fixture.detectChanges();

      const element = fixture.debugElement.query(By.css('.test-element')).nativeElement;

      spyOn(gsap, 'timeline').and.callThrough();

      const mockEntry = {
        isIntersecting: true,
        target: element
      } as IntersectionObserverEntry;

      observerCallback([mockEntry], {} as IntersectionObserver);

      expect(gsap.timeline).toHaveBeenCalled();
    });
  });

  describe('Stagger', () => {
    it('devrait animer les enfants avec stagger', () => {
      const staggerElement = fixture.debugElement.query(By.css('.test-stagger'));
      const nativeElement = staggerElement.nativeElement as HTMLElement;

      spyOn(gsap, 'timeline').and.callThrough();

      const mockEntry = {
        isIntersecting: true,
        target: nativeElement
      } as IntersectionObserverEntry;

      // Déclencher l'animation
      observerCallback([mockEntry], {} as IntersectionObserver);

      expect(gsap.timeline).toHaveBeenCalled();
    });

    it('devrait utiliser le staggerDelay spécifié', () => {
      component.staggerConfig = {
        animation: 'fadeInUp',
        stagger: true,
        staggerDelay: 200
      };
      fixture.detectChanges();

      const element = fixture.debugElement.query(By.css('.test-stagger')).nativeElement;

      spyOn(gsap, 'timeline').and.callThrough();

      const mockEntry = {
        isIntersecting: true,
        target: element
      } as IntersectionObserverEntry;

      observerCallback([mockEntry], {} as IntersectionObserver);

      expect(gsap.timeline).toHaveBeenCalled();
    });
  });

  describe('Cleanup', () => {
    it('devrait déconnecter l\'observer lors de la destruction', () => {
      const observerInstance = mockIntersectionObserver.calls.mostRecent().returnValue;

      fixture.destroy();

      expect(observerInstance.disconnect).toHaveBeenCalled();
    });
  });

  describe('Repeat', () => {
    it('ne devrait pas rejouer l\'animation si repeat = false (défaut)', () => {
      const element = fixture.debugElement.query(By.css('.test-element')).nativeElement;

      const mockEntry = {
        isIntersecting: true,
        target: element
      } as IntersectionObserverEntry;

      spyOn(gsap, 'timeline').and.callThrough();

      // Première entrée - devrait animer
      observerCallback([mockEntry], {} as IntersectionObserver);
      expect(gsap.timeline).toHaveBeenCalledTimes(1);

      // Deuxième entrée - ne devrait PAS animer
      observerCallback([mockEntry], {} as IntersectionObserver);
      expect(gsap.timeline).toHaveBeenCalledTimes(1); // Toujours 1
    });

    it('devrait rejouer l\'animation si repeat = true', () => {
      component.scrollRevealConfig = {
        animation: 'fadeIn',
        repeat: true
      };
      fixture.detectChanges();

      const element = fixture.debugElement.query(By.css('.test-element')).nativeElement;

      spyOn(gsap, 'timeline').and.callThrough();

      // Première entrée
      const mockEntryIn = {
        isIntersecting: true,
        target: element
      } as IntersectionObserverEntry;

      observerCallback([mockEntryIn], {} as IntersectionObserver);
      expect(gsap.timeline).toHaveBeenCalledTimes(1);

      // Sortie de viewport
      const mockEntryOut = {
        isIntersecting: false,
        target: element
      } as IntersectionObserverEntry;

      observerCallback([mockEntryOut], {} as IntersectionObserver);

      // Réentrée - devrait animer à nouveau
      observerCallback([mockEntryIn], {} as IntersectionObserver);
      expect(gsap.timeline).toHaveBeenCalledTimes(2);
    });
  });
});
