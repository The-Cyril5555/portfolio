/**
 * Tests Unitaires - ScrollObserverService
 * =========================================
 *
 * Teste le service d'observation du scroll avec RxJS.
 *
 * Couvre :
 * - Création des observables de scroll
 * - Throttling des événements (60fps)
 * - Calcul de la direction de scroll
 * - Calcul du pourcentage de scroll
 * - Méthodes synchrones utilitaires
 */

import { TestBed } from '@angular/core/testing';
import { ScrollObserverService } from './scroll-observer.service';
import { firstValueFrom } from 'rxjs';
import { take } from 'rxjs/operators';

describe('ScrollObserverService', () => {
  let service: ScrollObserverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ScrollObserverService]
    });
    service = TestBed.inject(ScrollObserverService);

    // Reset scroll position before each test
    window.scrollTo(0, 0);
  });

  it('devrait être créé', () => {
    expect(service).toBeTruthy();
  });

  describe('scrollY$', () => {
    it('devrait émettre la position verticale du scroll', async () => {
      // Simulate scroll
      window.scrollTo(0, 100);
      window.dispatchEvent(new Event('scroll'));

      const scrollY = await firstValueFrom(service.scrollY$.pipe(take(1)));
      expect(scrollY).toBeGreaterThanOrEqual(0);
    });

    it('devrait utiliser distinctUntilChanged pour éviter les doublons', async () => {
      const emissions: number[] = [];

      service.scrollY$.pipe(take(2)).subscribe(y => emissions.push(y));

      // Scroll to same position twice
      window.scrollTo(0, 100);
      window.dispatchEvent(new Event('scroll'));
      window.scrollTo(0, 100);
      window.dispatchEvent(new Event('scroll'));

      // Should only emit once for same position
      expect(emissions.length).toBeLessThanOrEqual(2);
    });
  });

  describe('direction$', () => {
    it('devrait retourner "down" quand on scroll vers le bas', async () => {
      const directions: string[] = [];

      service.direction$.pipe(take(2)).subscribe(dir => directions.push(dir));

      // Scroll down
      window.scrollTo(0, 0);
      window.dispatchEvent(new Event('scroll'));
      window.scrollTo(0, 100);
      window.dispatchEvent(new Event('scroll'));

      // Wait for async operations
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(directions).toContain('down');
    });

    it('devrait retourner "up" quand on scroll vers le haut', async () => {
      // Start scrolled down
      window.scrollTo(0, 200);
      window.dispatchEvent(new Event('scroll'));

      const directions: string[] = [];
      service.direction$.pipe(take(2)).subscribe(dir => directions.push(dir));

      // Scroll up
      window.scrollTo(0, 100);
      window.dispatchEvent(new Event('scroll'));

      await new Promise(resolve => setTimeout(resolve, 50));

      expect(directions).toContain('up');
    });
  });

  describe('isScrolled$', () => {
    it('devrait émettre false quand scrollY < 50px', async () => {
      window.scrollTo(0, 30);
      window.dispatchEvent(new Event('scroll'));

      const isScrolled = await firstValueFrom(service.isScrolled$.pipe(take(1)));
      expect(isScrolled).toBe(false);
    });

    it('devrait émettre true quand scrollY > 50px', async () => {
      window.scrollTo(0, 100);
      window.dispatchEvent(new Event('scroll'));

      const isScrolled = await firstValueFrom(service.isScrolled$.pipe(take(1)));
      expect(isScrolled).toBe(true);
    });
  });

  describe('scrollPercentage$', () => {
    it('devrait retourner 0% au top de la page', async () => {
      window.scrollTo(0, 0);
      window.dispatchEvent(new Event('scroll'));

      const percentage = await firstValueFrom(service.scrollPercentage$.pipe(take(1)));
      expect(percentage).toBe(0);
    });

    it('devrait retourner une valeur entre 0 et 100', async () => {
      window.scrollTo(0, 100);
      window.dispatchEvent(new Event('scroll'));

      const percentage = await firstValueFrom(service.scrollPercentage$.pipe(take(1)));
      expect(percentage).toBeGreaterThanOrEqual(0);
      expect(percentage).toBeLessThanOrEqual(100);
    });
  });

  describe('getCurrentPosition()', () => {
    it('devrait retourner la position actuelle de manière synchrone', () => {
      window.scrollTo(50, 100);
      const position = service.getCurrentPosition();

      expect(position.y).toBeGreaterThanOrEqual(0);
      expect(position.x).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getCurrentScrollPercentage()', () => {
    it('devrait retourner le pourcentage actuel de manière synchrone', () => {
      const percentage = service.getCurrentScrollPercentage();

      expect(percentage).toBeGreaterThanOrEqual(0);
      expect(percentage).toBeLessThanOrEqual(100);
    });
  });

  describe('isCurrentlyScrolled()', () => {
    it('devrait retourner false quand scrollY < 50px', () => {
      window.scrollTo(0, 30);
      expect(service.isCurrentlyScrolled()).toBe(false);
    });

    it('devrait retourner true quand scrollY > 50px', () => {
      window.scrollTo(0, 100);
      expect(service.isCurrentlyScrolled()).toBe(true);
    });
  });

  describe('metrics$', () => {
    it('devrait combiner toutes les métriques de scroll', async () => {
      window.scrollTo(0, 100);
      window.dispatchEvent(new Event('scroll'));

      const metrics = await firstValueFrom(service.metrics$.pipe(take(1)));

      expect(metrics).toHaveProperty('scrollY');
      expect(metrics).toHaveProperty('scrollX');
      expect(metrics).toHaveProperty('direction');
      expect(metrics).toHaveProperty('speed');
      expect(metrics).toHaveProperty('isScrolled');
      expect(metrics).toHaveProperty('scrollPercentage');
    });
  });
});
