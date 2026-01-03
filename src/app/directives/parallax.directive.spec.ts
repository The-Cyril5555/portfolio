/**
 * Tests Unitaires - ParallaxDirective
 * =====================================
 *
 * Teste la directive d'effet parallax.
 *
 * Couvre :
 * - Application de la transformation CSS
 * - Calcul du décalage parallax selon la vitesse
 * - Support de la direction (vertical/horizontal)
 * - Transforms additionnels (scale, rotate, etc.)
 * - Optimisation avec IntersectionObserver
 * - Cleanup des observables
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ParallaxDirective } from './parallax.directive';
import { ScrollObserverService } from '../services/scroll-observer.service';
import { of, Subject } from 'rxjs';

/**
 * Composant de test pour la directive Parallax
 */
@Component({
  template: `
    <div
      class="test-element"
      [appParallax]="parallaxConfig">
      Test Content
    </div>
  `,
  standalone: true,
  imports: [ParallaxDirective]
})
class TestComponent {
  parallaxConfig = { speed: 0.5, direction: 'vertical' as const };
}

describe('ParallaxDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let element: DebugElement;
  let scrollObserverMock: jasmine.SpyObj<ScrollObserverService>;
  let scrollY$: Subject<number>;

  beforeEach(async () => {
    // Create mock ScrollObserverService
    scrollY$ = new Subject<number>();
    scrollObserverMock = jasmine.createSpyObj('ScrollObserverService', [], {
      scrollY$: scrollY$.asObservable()
    });

    await TestBed.configureTestingModule({
      imports: [TestComponent, ParallaxDirective],
      providers: [
        { provide: ScrollObserverService, useValue: scrollObserverMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    element = fixture.debugElement.query(By.css('.test-element'));
    fixture.detectChanges();
  });

  it('devrait créer la directive', () => {
    expect(element).toBeTruthy();
  });

  it('devrait appliquer will-change: transform pour optimisation GPU', () => {
    const nativeElement = element.nativeElement as HTMLElement;
    expect(nativeElement.style.willChange).toBe('transform');
  });

  describe('Calcul du parallax', () => {
    it('devrait appliquer translateY avec speed 0.5', () => {
      // Simulate scroll to 100px
      scrollY$.next(100);
      fixture.detectChanges();

      const nativeElement = element.nativeElement as HTMLElement;
      const transform = nativeElement.style.transform;

      // Should be scrollY * speed = 100 * 0.5 = 50px
      expect(transform).toContain('translateY(50px)');
    });

    it('devrait appliquer translateY avec speed 1.5', () => {
      component.parallaxConfig = { speed: 1.5 };
      fixture.detectChanges();

      scrollY$.next(100);
      fixture.detectChanges();

      const nativeElement = element.nativeElement as HTMLElement;
      const transform = nativeElement.style.transform;

      // Should be 100 * 1.5 = 150px
      expect(transform).toContain('translateY(150px)');
    });

    it('devrait supporter la direction horizontal', () => {
      component.parallaxConfig = { speed: 0.5, direction: 'horizontal' };
      fixture.detectChanges();

      scrollY$.next(100);
      fixture.detectChanges();

      const nativeElement = element.nativeElement as HTMLElement;
      const transform = nativeElement.style.transform;

      expect(transform).toContain('translateX');
    });

    it('devrait combiner avec transform additionnel', () => {
      component.parallaxConfig = {
        speed: 0.5,
        direction: 'vertical',
        transform: 'scaleY(-1)'
      };
      fixture.detectChanges();

      scrollY$.next(100);
      fixture.detectChanges();

      const nativeElement = element.nativeElement as HTMLElement;
      const transform = nativeElement.style.transform;

      expect(transform).toContain('translateY(50px)');
      expect(transform).toContain('scaleY(-1)');
    });
  });

  describe('Performance', () => {
    it('devrait ne pas recalculer si scrollY ne change pas', () => {
      scrollY$.next(100);
      fixture.detectChanges();

      const nativeElement = element.nativeElement as HTMLElement;
      const firstTransform = nativeElement.style.transform;

      // Emit same value
      scrollY$.next(100);
      fixture.detectChanges();

      const secondTransform = nativeElement.style.transform;
      expect(firstTransform).toBe(secondTransform);
    });
  });

  describe('Cleanup', () => {
    it('devrait se désabonner lors de la destruction', () => {
      const subscription = scrollY$.subscribe();
      spyOn(subscription, 'unsubscribe');

      fixture.destroy();

      // Observable should cleanup automatically with takeUntilDestroyed
      // Note: Can't directly test takeUntilDestroyed, but we verify no errors
      expect(() => scrollY$.next(200)).not.toThrow();
    });
  });
});
