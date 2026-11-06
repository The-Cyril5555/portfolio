import { Injectable, Injector, afterNextRender, inject, signal } from '@angular/core';
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
 * Réglages passés au script (cf. son en-tête) : pas de bouton flottant ni de
 * raccourci (on garde la main), son coupé par défaut (le visiteur l'active
 * dans le HUD, choix mémorisé pour la session), « Visite » activée : la page
 * défile seule pendant la construction, comme le promet le bouton du hero.
 */
export const SWARM_CONFIG = { trigger: 'none', hotkey: '', sound: false, tour: true } as const;

/** Durée d'affichage de l'état « échec du chargement » sur le bouton. */
const FAILED_MS = 4000;

/**
 * Effet « Swarm » : la page s'efface puis une nuée de curseurs la reconstruit.
 *
 * Moteur : public/swarm-cursors.js (github.com/harshit403-pixel/reveal-cursors,
 * d'après l'extension « Swarm Rebuild » et « Swarm » de Joel Califa — crédits
 * dans l'en-tête du fichier).
 *
 * Le script (≈157 Ko) n'est PAS chargé avec la page : `preload()` le récupère
 * au survol / focus du bouton du hero, `start()` au clic, ou `?swarm` dans
 * l'URL (lien partageable, ignoré en « moins d'animations »). Souris et doigt :
 * la « Visite » fait défiler la page seule, et le HUD a un bouton ✕ pour sortir.
 *
 * Pendant l'effet, la vraie page (app-root) est rendue `inert` : le clavier
 * reste dans le HUD du script (ajouté sous <html>, hors de app-root). À la
 * sortie, le focus revient à l'élément qui avait lancé l'effet.
 */
@Injectable({ providedIn: 'root' })
export class SwarmService {
  private readonly reveal = inject(RevealService);
  private readonly injector = inject(Injector);

  /** Script en cours de téléchargement. */
  readonly loading = signal(false);
  /** Effet en cours d'exécution. */
  readonly running = signal(false);
  /** Le script n'a pas pu être chargé : vrai pendant quelques secondes. */
  readonly failed = signal(false);

  private loadPromise?: Promise<SwarmCursorsApi>;
  /** Élément qui avait le focus au lancement (le bouton du hero). */
  private opener: HTMLElement | null = null;
  private failedTimer?: ReturnType<typeof setTimeout>;
  private liveRegion?: HTMLElement;

  constructor() {
    if (typeof window === 'undefined') return;
    window.addEventListener('swarm:start', () => this.onStart());
    window.addEventListener('swarm:exit', () => this.onExit());
  }

  /** Lance l'effet (charge le script au besoin). */
  async start(): Promise<void> {
    if (this.running() || this.loading()) return;
    clearTimeout(this.failedTimer);
    this.failed.set(false);
    this.ensureLiveRegion(); // créée AVANT le premier message, sinon il n'est pas lu
    try {
      this.loading.set(true);
      // Tout ce qui attend encore son animation d'apparition doit être visible,
      // sinon la photo de la page contiendrait des blocs transparents.
      this.reveal.revealAll();
      const active = document.activeElement;
      this.opener = active instanceof HTMLElement && active !== document.body ? active : null;
      this.opener?.blur(); // pas d'anneau de focus dans la photo de la page
      // Les peintures hors écran sont en loading="lazy" : on les charge avant
      // la photo, sinon les cartes seraient reconstruites sans leur image.
      const [api] = await Promise.all([this.load(), loadLazyImages()]);
      await nextFrame();
      await nextFrame();
      api.start();
    } catch (err) {
      console.error('[swarm] impossible de lancer l’effet', err);
      this.failed.set(true);
      this.failedTimer = setTimeout(() => this.failed.set(false), FAILED_MS);
      this.announce('Impossible de charger l’effet. Réessayez.');
      this.restoreFocus();
    } finally {
      this.loading.set(false);
    }
  }

  /** Télécharge et prépare le script sans lancer l'effet (survol du bouton). */
  preload(): void {
    if (typeof window === 'undefined') return;
    this.load().catch(() => undefined); // un échec sera retenté (et signalé) au clic
  }

  /**
   * `?swarm` dans l'URL : lance l'effet une fois la page affichée.
   * Pas de lancement automatique pour qui demande moins d'animations (le bouton
   * du hero est alors masqué lui aussi).
   */
  startFromUrlIfRequested(): void {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('swarm') || params.get('swarm') === '0') return;
    // On retire le paramètre : le script le lirait aussi et relancerait l'effet.
    params.delete('swarm');
    const query = params.toString();
    history.replaceState(history.state, '', `${location.pathname}${query ? `?${query}` : ''}${location.hash}`);
    if (!autoStartAllowed()) return;
    // laisse le temps aux polices et à la peinture du hero de s'afficher
    const go = () => setTimeout(() => this.start(), 600);
    if (document.readyState === 'complete') go();
    else window.addEventListener('load', go, { once: true });
  }

  private onStart(): void {
    this.running.set(true);
    setPageInert(true);
    this.announce('La page se reconstruit sous vos yeux. Échap pour revenir au site.');
    // Le HUD est créé juste après l'événement (même tâche) : focus sur son
    // premier bouton, pour que Tab circule dans le HUD et non dans la page.
    queueMicrotask(() => hudButtons()[0]?.focus({ preventScroll: true }));
  }

  private onExit(): void {
    this.running.set(false);
    setPageInert(false);
    this.announce('Retour au site.');
    this.restoreFocus();
  }

  /** Rend le focus au bouton de lancement, une fois réactivé par le rendu. */
  private restoreFocus(): void {
    const opener = this.opener;
    this.opener = null;
    if (!opener) return;
    afterNextRender(
      () => {
        if (opener.isConnected) opener.focus({ preventScroll: true });
      },
      { injector: this.injector },
    );
  }

  /** Message pour les lecteurs d'écran. */
  private announce(message: string): void {
    this.ensureLiveRegion().textContent = message;
  }

  /** Région « status » sous <body>, hors de app-root (qui devient inert). */
  private ensureLiveRegion(): HTMLElement {
    if (!this.liveRegion?.isConnected) {
      const region = document.createElement('div');
      region.className = 'sr-only';
      region.setAttribute('role', 'status');
      region.setAttribute('data-swarm-ignore', '');
      document.body.appendChild(region);
      this.liveRegion = region;
    }
    return this.liveRegion;
  }

  private load(): Promise<SwarmCursorsApi> {
    if (window.SwarmCursors) return Promise.resolve(window.SwarmCursors);
    this.loadPromise ??= new Promise<SwarmCursorsApi>((resolve, reject) => {
      window.SwarmCursorsConfig = { ...SWARM_CONFIG };
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

/** `?swarm` démarre seul (souris ou doigt), sauf en « moins d'animations ». */
function autoStartAllowed(): boolean {
  if (typeof window.matchMedia !== 'function') return false;
  return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/** La vraie page, sous l'effet, ne doit être ni focalisable ni lue. */
function setPageInert(inert: boolean): void {
  const root = document.querySelector<HTMLElement>('app-root');
  if (root) root.inert = inert;
}

function hudButtons(): HTMLButtonElement[] {
  const root = document.querySelector('swarm-rebuild')?.shadowRoot;
  return root ? Array.from(root.querySelectorAll<HTMLButtonElement>('.hud button:not([hidden])')) : [];
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
