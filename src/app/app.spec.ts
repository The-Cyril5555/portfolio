import { TestBed } from '@angular/core/testing';
import { App } from './app';

// jsdom ne fournit pas ces API navigateur : versions minimales pour le rendu.
class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

describe('App', () => {
  beforeEach(async () => {
    vi.stubGlobal('IntersectionObserver', NoopObserver);
    vi.stubGlobal('ResizeObserver', NoopObserver);
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
    }));
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();
  });

  afterEach(() => vi.unstubAllGlobals());

  it('assemble toutes les sections de la page', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    const ids = Array.from(el.querySelectorAll('main > section[id]')).map((s) => s.id);
    expect(ids).toEqual(['home', 'work', 'skills', 'about', 'contact']);
    expect(el.querySelector('app-header-nav')).toBeTruthy();
    expect(el.querySelector('app-site-footer')).toBeTruthy();
  });

  it('a un seul h1 et un titre h2 par section', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelectorAll('h1').length).toBe(1);
    for (const id of ['work', 'skills', 'about', 'contact']) {
      const title = el.querySelector(`#${id}-title`);
      expect(title?.tagName, `#${id}-title`).toBe('H2');
    }
  });

  it('présente les six projets sans les postes de technicien', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const text = (fixture.nativeElement as HTMLElement).querySelector('#work')!.textContent!;

    expect(text).toContain('Shadow Hunters');
    expect(text).not.toContain('SDIS 29');
    expect((fixture.nativeElement as HTMLElement).querySelector('#about')!.textContent).toContain('SDIS 29');
  });
});
