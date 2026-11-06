import { TestBed } from '@angular/core/testing';
import type { Mock } from 'vitest';
import { SwarmService } from './swarm.service';
import { RevealService } from './reveal.service';

describe('SwarmService', () => {
  let revealAll: ReturnType<typeof vi.fn>;
  let appendSpy: ReturnType<typeof vi.spyOn>;
  let api: {
    start: Mock<() => void>;
    stop: Mock<(reveal?: boolean) => void>;
    toggle: Mock<() => void>;
    isRunning: Mock<() => boolean>;
  };

  beforeEach(() => {
    revealAll = vi.fn();
    api = {
      start: vi.fn<() => void>(),
      stop: vi.fn<(reveal?: boolean) => void>(),
      toggle: vi.fn<() => void>(),
      isRunning: vi.fn(() => false),
    };
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => setTimeout(() => cb(0), 0));

    // Simule le chargement du script : l'API apparaît puis onload est appelé
    appendSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(<T extends Node>(node: T): T => {
      const script = node as unknown as HTMLScriptElement;
      window.SwarmCursors = api;
      setTimeout(() => script.onload?.(new Event('load')), 0);
      return node;
    });

    TestBed.configureTestingModule({
      providers: [{ provide: RevealService, useValue: { revealAll } }],
    });
  });

  afterEach(() => {
    appendSpy.mockRestore();
    vi.unstubAllGlobals();
    delete window.SwarmCursors;
    delete window.SwarmCursorsConfig;
    TestBed.resetTestingModule();
  });

  it('charge le script à la demande, révèle la page puis lance l’effet', async () => {
    const service = TestBed.inject(SwarmService);

    await service.start();

    const script = appendSpy.mock.calls[0][0] as HTMLScriptElement;
    expect(script.getAttribute('src')).toBe('swarm-cursors.js'); // relatif : suit le base href
    expect(window.SwarmCursorsConfig).toEqual({ trigger: 'none', hotkey: '' });
    expect(revealAll).toHaveBeenCalled();
    expect(api.start).toHaveBeenCalledTimes(1);
    expect(service.loading()).toBe(false);
  });

  it('ne recharge pas le script une seconde fois', async () => {
    const service = TestBed.inject(SwarmService);
    await service.start();
    await service.start();

    expect(appendSpy).toHaveBeenCalledTimes(1);
    expect(api.start).toHaveBeenCalledTimes(2);
  });

  it('suit les événements swarm:start / swarm:exit', () => {
    const service = TestBed.inject(SwarmService);
    window.dispatchEvent(new CustomEvent('swarm:start'));
    expect(service.running()).toBe(true);
    window.dispatchEvent(new CustomEvent('swarm:exit'));
    expect(service.running()).toBe(false);
  });

  it('retire ?swarm de l’URL pour éviter un double lancement', () => {
    history.replaceState(null, '', '/?swarm&x=1#work');
    const service = TestBed.inject(SwarmService);

    service.startFromUrlIfRequested();

    expect(location.search).toBe('?x=1');
    expect(location.hash).toBe('#work');
    history.replaceState(null, '', '/');
  });
});
