import { Injectable, inject, signal } from '@angular/core';
import { RevealService } from './reveal.service';

/** API exposée par public/swarm-cursors.js une fois chargé. */
interface SwarmCursorsApi {
  start(): void;
  stop(reveal?: boolean): void;
  toggle(): void;
  isRunning(): boolean;
}

declare global {
  interface Window {
    SwarmCursors?: SwarmCursorsApi;
    SwarmCursorsConfig?: Record<string, unknown>;
  }
}

/**
 * Effet « Swarm » : la page s'efface puis une nuée de curseurs la reconstruit.
 *
 * Moteur : public/swarm-cursors.js (github.com/harshit403-pixel/reveal-cursors,
 * d'après « Swarm » de Joel Califa — crédit conservé dans l'en-tête du fichier).
 *
 * Le script (≈157 Ko) n'est PAS chargé avec la page : il est injecté au premier
 * clic sur le bouton du hero, ou quand l'URL contient `?swarm` (lien partageable).
 * Son bouton flottant et son raccourci clavier sont désactivés : on garde la main.
 */
@Injectable({ providedIn: 'root' })
export class SwarmService {
  private readonly reveal = inject(RevealService);

  /** Script en cours de téléchargement. */
  readonly loading = signal(false);
  /** Effet en cours d'exécution. */
  readonly running = signal(false);

  private loadPromise?: Promise<SwarmCursorsApi>;

  constructor() {
    if (typeof window === 'undefined') return;
    window.addEventListener('swarm:start', () => this.running.set(true));
    window.addEventListener('swarm:exit', () => this.running.set(false));
  }

  /** Lance l'effet (charge le script au besoin). */
  async start(): Promise<void> {
    if (this.running() || this.loading()) return;
    try {
      this.loading.set(true);
      // Tout ce qui attend encore son animation d'apparition doit être visible,
      // sinon la photo de la page contiendrait des blocs transparents.
      this.reveal.revealAll();
      (document.activeElement as HTMLElement | null)?.blur();
      // Les peintures hors écran sont en loading="lazy" : on les charge avant
      // la photo, sinon les cartes seraient reconstruites sans leur image.
      const [api] = await Promise.all([this.load(), loadLazyImages()]);
      await nextFrame();
      await nextFrame();
      api.start();
    } catch (err) {
      console.error('[swarm] impossible de lancer l’effet', err);
    } finally {
      this.loading.set(false);
    }
  }

  /** `?swarm` dans l'URL : lance l'effet une fois la page affichée. */
  startFromUrlIfRequested(): void {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('swarm') || params.get('swarm') === '0') return;
    // On retire le paramètre : le script le lirait aussi et relancerait l'effet.
    params.delete('swarm');
    const query = params.toString();
    history.replaceState(history.state, '', `${location.pathname}${query ? `?${query}` : ''}${location.hash}`);
    // laisse le temps aux polices et à la peinture du hero de s'afficher
    const go = () => setTimeout(() => this.start(), 600);
    if (document.readyState === 'complete') go();
    else window.addEventListener('load', go, { once: true });
  }

  private load(): Promise<SwarmCursorsApi> {
    if (window.SwarmCursors) return Promise.resolve(window.SwarmCursors);
    this.loadPromise ??= new Promise<SwarmCursorsApi>((resolve, reject) => {
      window.SwarmCursorsConfig = { trigger: 'none', hotkey: '' };
      const script = document.createElement('script');
      script.src = 'swarm-cursors.js'; // relatif : suit le <base href> (/portfolio/ en prod)
      script.async = true;
      script.onload = () =>
        window.SwarmCursors ? resolve(window.SwarmCursors) : reject(new Error('API absente'));
      script.onerror = () => {
        this.loadPromise = undefined;
        script.remove();
        reject(new Error('échec du chargement de swarm-cursors.js'));
      };
      document.body.appendChild(script);
    });
    return this.loadPromise;
  }
}

/** Passe les images différées en chargement immédiat et attend leur décodage (3 s max). */
function loadLazyImages(timeoutMs = 3000): Promise<void> {
  const images = Array.from(document.querySelectorAll<HTMLImageElement>('img[loading="lazy"]'));
  const decoded = images.map((img) => {
    img.loading = 'eager';
    return img.decode().catch(() => undefined);
  });
  const timeout = new Promise<void>((resolve) => setTimeout(resolve, timeoutMs));
  return Promise.race([Promise.all(decoded).then(() => undefined), timeout]);
}

function nextFrame(): Promise<void> {
  return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}
