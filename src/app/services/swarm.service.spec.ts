import { ApplicationRef } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import type { Mock } from 'vitest';
import { SWARM_CONFIG, SwarmService } from './swarm.service';
import { RevealService } from './reveal.service';

/** matchMedia simulé : `matching` liste les requêtes qui doivent répondre vrai. */
function stubMatchMedia(...matching: string[]): void {
  vi.stubGlobal('matchMedia', (query: string) => ({
    matches: matching.includes(query),
    media: query,
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
}

const FINE_POINTER = '(hover: hover) and (pointer: fine)';
const REDUCED = '(prefers-reduced-motion: reduce)';

describe('SwarmService', () => {
  let revealAll: ReturnType<typeof vi.fn>;
  let appendSpy: Mock<(node: Node) => Node>;
  /** false : le chargement du script échoue (onerror). */
  let scriptLoads: boolean;
  let api: {
    start: Mock<() => void>;
    stop: Mock<(reveal?: boolean) => void>;
    toggle: Mock<() => void>;
    isRunning: Mock<() => boolean>;
  };

  const scriptCalls = () =>
    appendSpy.mock.calls.map((c: [Node]) => c[0]).filter((n: Node): n is HTMLScriptElement => n instanceof HTMLScriptElement);

  beforeEach(() => {
    revealAll = vi.fn();
    scriptLoads = true;
    api = {
      start: vi.fn<() => void>(),
      stop: vi.fn<(reveal?: boolean) => void>(),
      toggle: vi.fn<() => void>(),
      isRunning: vi.fn(() => false),
    };
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => setTimeout(() => cb(0), 0));

    // Simule le chargement du script : l'API apparaît puis onload est appelé.
    // Les autres nœuds (région « status ») sont ajoutés normalement.
    const append = document.body.appendChild.bind(document.body);
    appendSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(<T extends Node>(node: T): T => {
      if (!(node instanceof HTMLScriptElement)) return append(node);
      if (scriptLoads) {
        window.SwarmCursors = api;
        setTimeout(() => node.onload?.(new Event('load')), 0);
      } else {
        setTimeout(() => node.onerror?.(new Event('error')), 0);
      }
      return node;
    });

    TestBed.configureTestingModule({
      providers: [{ provide: RevealService, useValue: { revealAll } }],
    });
  });

  afterEach(() => {
    appendSpy.mockRestore();
    vi.unstubAllGlobals();
    vi.useRealTimers();
    delete window.SwarmCursors;
    delete window.SwarmCursorsConfig;
    document.body.querySelectorAll('[role="status"]').forEach((n) => n.remove());
    TestBed.resetTestingModule();
  });

  it('charge le script à la demande, révèle la page puis lance l’effet', async () => {
    const service = TestBed.inject(SwarmService);

    await service.start();

    const [script] = scriptCalls();
    expect(script.getAttribute('src')).toBe('swarm-cursors.js'); // relatif : suit le base href
    expect(window.SwarmCursorsConfig).toEqual({ ...SWARM_CONFIG });
    expect(SWARM_CONFIG).toMatchObject({ trigger: 'none', hotkey: '', sound: false, tour: true });
    expect(revealAll).toHaveBeenCalled();
    expect(api.start).toHaveBeenCalledTimes(1);
    expect(service.loading()).toBe(false);
  });

  it('ne recharge pas le script une seconde fois (préchargement compris)', async () => {
    const service = TestBed.inject(SwarmService);
    service.preload();
    await service.start();
    await service.start();

    expect(scriptCalls().length).toBe(1);
    expect(api.start).toHaveBeenCalledTimes(2);
  });

  it('signale un échec de chargement puis permet de réessayer', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
    const service = TestBed.inject(SwarmService);
    scriptLoads = false;

    await service.start();
    expect(service.failed()).toBe(true);
    expect(api.start).not.toHaveBeenCalled();
    expect(document.body.querySelector('[role="status"]')?.textContent).toContain('Impossible');

    scriptLoads = true;
    await service.start();
    expect(service.failed()).toBe(false);
    expect(api.start).toHaveBeenCalledTimes(1);
  });

  it('suit swarm:start / swarm:exit : page inerte pendant l’effet, focus rendu au bouton', async () => {
    const root = document.createElement('app-root');
    const button = document.createElement('button');
    root.appendChild(button);
    document.body.appendChild(root);
    const service = TestBed.inject(SwarmService);

    button.focus();
    await service.start();
    window.dispatchEvent(new CustomEvent('swarm:start'));
    expect(service.running()).toBe(true);
    expect(root.inert).toBe(true);

    window.dispatchEvent(new CustomEvent('swarm:exit'));
    expect(service.running()).toBe(false);
    expect(root.inert).toBe(false);
    TestBed.inject(ApplicationRef).tick(); // le focus attend le rendu (bouton réactivé)
    expect(document.activeElement).toBe(button);
    root.remove();
  });

  it('retire ?swarm de l’URL pour éviter un double lancement', () => {
    stubMatchMedia(FINE_POINTER);
    history.replaceState(null, '', '/?swarm&x=1#work');
    const service = TestBed.inject(SwarmService);
    vi.spyOn(service, 'start').mockResolvedValue();

    service.startFromUrlIfRequested();

    expect(location.search).toBe('?x=1');
    expect(location.hash).toBe('#work');
    history.replaceState(null, '', '/');
  });

  describe('?swarm : lancement automatique', () => {
    const run = (...matching: string[]) => {
      vi.useFakeTimers();
      stubMatchMedia(...matching);
      history.replaceState(null, '', '/?swarm');
      const service = TestBed.inject(SwarmService);
      const start = vi.spyOn(service, 'start').mockResolvedValue();
      service.startFromUrlIfRequested();
      window.dispatchEvent(new Event('load'));
      vi.advanceTimersByTime(1000);
      history.replaceState(null, '', '/');
      return start;
    };

    it('démarre avec une souris', () => {
      expect(run(FINE_POINTER)).toHaveBeenCalledTimes(1);
    });

    it('ne démarre pas en « moins d’animations »', () => {
      expect(run(FINE_POINTER, REDUCED)).not.toHaveBeenCalled();
    });

    it('ne démarre pas sur écran tactile (HUD inaccessible au doigt)', () => {
      expect(run()).not.toHaveBeenCalled();
    });
  });
});
