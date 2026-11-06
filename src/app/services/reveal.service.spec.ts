import { TestBed } from '@angular/core/testing';
import { RevealService } from './reveal.service';

/** IntersectionObserver minimal pilotable depuis le test. */
class FakeIntersectionObserver {
  static last?: FakeIntersectionObserver;
  readonly observed = new Set<Element>();
  constructor(public readonly callback: IntersectionObserverCallback) {
    FakeIntersectionObserver.last = this;
  }
  observe(el: Element) {
    this.observed.add(el);
  }
  unobserve(el: Element) {
    this.observed.delete(el);
  }
  disconnect() {
    this.observed.clear();
  }
  /** Simule l'entrée d'un élément dans le viewport. */
  enter(el: Element) {
    this.callback([{ target: el, isIntersecting: true } as unknown as IntersectionObserverEntry], this as never);
  }
}

function stubMatchMedia(reduce: boolean) {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: reduce && query.includes('reduce'),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
}

describe('RevealService', () => {
  beforeEach(() => {
    vi.stubGlobal('IntersectionObserver', FakeIntersectionObserver);
    FakeIntersectionObserver.last = undefined;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    TestBed.resetTestingModule();
  });

  it('révèle un élément quand il entre dans le viewport', () => {
    stubMatchMedia(false);
    const service = TestBed.inject(RevealService);
    const el = document.createElement('div');

    service.observe(el);
    expect(service.motionAllowed).toBe(true);
    expect(el.classList.contains('is-visible')).toBe(false);

    FakeIntersectionObserver.last!.enter(el);
    expect(el.classList.contains('is-visible')).toBe(true);
    expect(FakeIntersectionObserver.last!.observed.has(el)).toBe(false);
  });

  it('revealAll() affiche immédiatement tout ce qui attend encore', () => {
    stubMatchMedia(false);
    const service = TestBed.inject(RevealService);
    const a = document.createElement('div');
    const b = document.createElement('div');
    service.observe(a);
    service.observe(b);

    service.revealAll();

    for (const el of [a, b]) {
      expect(el.classList.contains('is-visible')).toBe(true);
      expect(el.classList.contains('is-instant')).toBe(true);
    }
  });

  it("n'observe rien quand l'utilisateur demande moins d'animations", () => {
    stubMatchMedia(true);
    const service = TestBed.inject(RevealService);
    service.observe(document.createElement('div'));

    expect(service.motionAllowed).toBe(false);
    expect(FakeIntersectionObserver.last).toBeUndefined();
  });
});
