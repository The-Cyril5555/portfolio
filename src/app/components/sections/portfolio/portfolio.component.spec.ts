import { TestBed } from '@angular/core/testing';
import { PortfolioComponent } from './portfolio.component';
import { PROJECTS } from '../../../data/projects.data';

class NoopObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
}

describe('PortfolioComponent', () => {
  let el: HTMLElement;

  beforeEach(async () => {
    vi.stubGlobal('IntersectionObserver', NoopObserver);
    vi.stubGlobal('matchMedia', (query: string) => ({
      matches: false,
      media: query,
      addEventListener: () => {},
      removeEventListener: () => {},
    }));
    await TestBed.configureTestingModule({ imports: [PortfolioComponent] }).compileComponents();
    const fixture = TestBed.createComponent(PortfolioComponent);
    await fixture.whenStable();
    el = fixture.nativeElement;
  });

  afterEach(() => vi.unstubAllGlobals());

  it('accroche chaque projet avec 4 technologies au plus', () => {
    const cards = el.querySelectorAll('.work-card');
    expect(cards.length).toBe(PROJECTS.length);
    cards.forEach((card) => expect(card.querySelectorAll('.chip').length).toBeLessThanOrEqual(4));
  });

  it("garde l'appel GitHub plus étroit que l'œuvre voisine", () => {
    const spans = Array.from(el.querySelectorAll<HTMLElement>('.work-card')).map((c) =>
      Number(c.style.getPropertyValue('--span')),
    );
    expect(spans.at(-1)).toBe(7);
    // seule la première carte prend toute la ligne dans la grille à deux colonnes
    expect(el.querySelectorAll('.work-card--wide').length).toBe(1);
    expect(el.querySelector('.work-card')!.classList).toContain('work-card--wide');
  });

  it("tient compte du recadrage cover d'une peinture paysage dans sizes", () => {
    const sizes = (id: string) =>
      el.querySelector(`[aria-labelledby="work-${id}"] img`)!.getAttribute('sizes')!;
    // Pandémonium (ratio 1,517) dans une boîte mobile de 320px de haut : 485px de rendu
    expect(sizes('sqwk')).toMatch(/max\(94vw, 485px\)$/);
    // une peinture portrait garde la largeur de la carte comme borne
    expect(sizes('shadow-hunters')).toContain('min(58vw, 780px)');
  });

  it("garde le titre de l'œuvre insécable dans le cartel", () => {
    const work = el.querySelector('.work-card__cartel .work-card__work');
    expect(work?.querySelector('cite')?.textContent).toBe(
      'Autoportrait avec la Mort jouant du violon',
    );
    expect(work?.textContent).toContain(', 1872');
  });
});
