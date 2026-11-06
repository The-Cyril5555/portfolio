import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SwarmService } from '../../../services/swarm.service';
import { HeroComponent } from './hero.component';

describe('HeroComponent', () => {
  const loading = signal(false);
  const running = signal(false);
  let start: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    loading.set(false);
    running.set(false);
    // comme le vrai service : le focus est retiré, puis l'effet démarre
    start = vi.fn(async () => {
      (document.activeElement as HTMLElement | null)?.blur();
      running.set(true);
    });
    await TestBed.configureTestingModule({
      imports: [HeroComponent],
      providers: [{ provide: SwarmService, useValue: { loading, running, start } }],
    }).compileComponents();
  });

  it('affiche le premier écran sans apparition différée (LCP, focus clavier)', async () => {
    const fixture = TestBed.createComponent(HeroComponent);
    await fixture.whenStable();
    const el: HTMLElement = fixture.nativeElement;

    expect(el.querySelector('.reveal')).toBeNull();
    expect(el.querySelector('h1')?.textContent).toContain('Developer');
  });

  it('affiche le lettrage quand la police ne peut pas être attendue', async () => {
    const fixture = TestBed.createComponent(HeroComponent);
    await fixture.whenStable();

    // jsdom n'a pas document.fonts : rien à attendre
    expect((fixture.nativeElement as HTMLElement).classList).toContain('is-font-ready');
  });

  it('rend le focus au bouton Swarm à la sortie de l’effet', async () => {
    const fixture = TestBed.createComponent(HeroComponent);
    document.body.appendChild(fixture.nativeElement);
    await fixture.whenStable();
    const host: HTMLElement = fixture.nativeElement;
    const button = host.querySelector<HTMLButtonElement>('.hero__swarm')!;

    button.focus();
    button.click();
    await fixture.whenStable();
    expect(start).toHaveBeenCalledOnce();
    expect(document.activeElement).not.toBe(button);

    running.set(false);
    window.dispatchEvent(new CustomEvent('swarm:exit'));
    await fixture.whenStable();

    expect(document.activeElement).toBe(button);
    host.remove();
  });
});
