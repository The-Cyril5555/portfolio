/**
 * Header Navigation Component - Fluid Glass (Three.js Custom Shader)
 * ===================================================================
 *
 * Navbar avec effet fluid glass via un shader custom de réfraction.
 *
 * **Pourquoi un custom shader ?**
 * MeshPhysicalMaterial transmission ne fonctionne pas sur une géométrie
 * plate face à la caméra (normales uniformes = zéro réfraction visible).
 * Le custom shader simule la courbure d'un verre et applique :
 * - Réfraction (distorsion du contenu derrière le verre)
 * - Aberration chromatique (séparation RGB aux bords)
 * - Fresnel (reflets lumineux aux bords)
 * - Highlight spéculaire subtil
 *
 * **Pipeline :**
 * 1. html2canvas capture la page complète → texture
 * 2. Le shader échantillonne cette texture avec offset UV basé sur le scroll
 * 3. La réfraction déforme les UV → contenu visible distordu à travers le verre
 * 4. Avant la capture : CSS backdrop-filter sert de fallback
 *
 * @author Cyril Bizouarn
 */

import {
  Component,
  inject,
  signal,
  OnInit,
  OnDestroy,
  AfterViewInit,
  DestroyRef,
  Renderer2,
  ElementRef,
  ViewChild,
  NgZone,
  ChangeDetectionStrategy
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import * as THREE from 'three';
import { ScrollService } from '../../services/scroll.service';
import { ScrollObserverService } from '../../services/scroll-observer.service';
import { NAV_LINKS } from '../../data/navigation.data';
import { NavLink } from '../../models/contact.model';
import { MobileMenuComponent } from './mobile-menu/mobile-menu.component';

const DESKTOP_BREAKPOINT = 1024;
const NAVBAR_HEIGHT = 56;

// ========================================
// GLSL Shaders
// ========================================

const VERTEX_SHADER = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAGMENT_SHADER = /* glsl */ `
uniform sampler2D uBgTexture;
uniform float uHasTexture;
uniform float uScrollNorm;
uniform float uNavNorm;
uniform float uIor;
uniform float uThickness;
uniform float uChromaticAberration;
uniform float uTime;

varying vec2 vUv;

// Map glass bar UV → page texture UV
vec2 mapToPageUV(vec2 barUV) {
  float texY = 1.0 - uScrollNorm - uNavNorm + barUV.y * uNavNorm;
  return vec2(barUV.x, texY);
}

void main() {
  if (uHasTexture < 0.5) {
    gl_FragColor = vec4(0.0, 0.0, 0.0, 0.0);
    return;
  }

  vec2 center = vec2(0.5, 0.5);
  vec2 fromCenter = vUv - center;

  // ---- Simulate curved glass surface (SDF-based for rounded rect) ----
  // Distance from edges, normalized
  float dx = abs(fromCenter.x);  // 0 at center, 0.5 at edge
  float dy = abs(fromCenter.y);

  // Rounded-rect SDF for edge detection (matches border-radius)
  float rx = 0.46;  // slightly inset from 0.5
  float ry = 0.36;
  float cornerR = 0.12;
  vec2 q = vec2(max(dx - rx + cornerR, 0.0), max(dy - ry + cornerR, 0.0));
  float sdf = length(q) - cornerR;
  float edgeDist = clamp(-sdf * 8.0, 0.0, 1.0); // 1 inside, 0 at edge

  // ---- Refraction (edge-only, no recentering) ----
  // Only displace at the very edges, proportional to edge proximity
  // Direction: outward push (away from center) at borders = magnification at rim
  float edgeFalloff = pow(1.0 - edgeDist, 2.0); // strong only near borders
  vec2 edgeDir = normalize(fromCenter + vec2(0.0001));
  vec2 refractOffset = edgeDir * edgeFalloff * uThickness * 0.008;
  vec2 refractedUV = vUv + refractOffset;

  // ---- Chromatic Aberration (at edges, like real glass dispersion) ----
  float caAmount = uChromaticAberration * (1.0 - edgeDist);
  vec2 caDir = normalize(fromCenter + vec2(0.0001));

  vec2 uvR = mapToPageUV(refractedUV + caDir * caAmount);
  vec2 uvG = mapToPageUV(refractedUV);
  vec2 uvB = mapToPageUV(refractedUV - caDir * caAmount);

  float r = texture2D(uBgTexture, uvR).r;
  float g = texture2D(uBgTexture, uvG).g;
  float b = texture2D(uBgTexture, uvB).b;
  vec3 color = vec3(r, g, b);

  // ---- Glass thickness (edge darkening like real thick glass) ----
  // Thicker at edges = absorbs more light
  float thicknessFactor = (1.0 - edgeDist);
  vec3 attenuationColor = vec3(0.92, 0.94, 0.98);
  color *= mix(vec3(1.0), attenuationColor, thicknessFactor * uThickness * 0.15);

  // ---- Fresnel reflection (bright rim at glass edges) ----
  float fresnel = pow(thicknessFactor, 2.5) * 0.15;
  color += vec3(fresnel) * vec3(0.95, 0.97, 1.0);

  // ---- Specular highlights (top rim = light source above) ----
  float specTop = smoothstep(0.15, 0.0, vUv.y) * smoothstep(0.0, 0.05, min(vUv.x, 1.0 - vUv.x)) * 0.08;
  color += vec3(specTop);

  // ---- Inner shadow at bottom edge (glass resting on surface) ----
  float shadowBot = smoothstep(0.85, 1.0, vUv.y) * 0.06;
  color -= vec3(shadowBot);

  gl_FragColor = vec4(color, 1.0);
}
`;

@Component({
  selector: 'app-header-nav',
  standalone: true,
  imports: [CommonModule, MobileMenuComponent],
  templateUrl: './header-nav.component.html',
  styleUrl: './header-nav.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderNavComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('glassCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('navContainer') containerRef!: ElementRef<HTMLDivElement>;

  scrollService = inject(ScrollService);
  private scrollObserver = inject(ScrollObserverService);
  private destroyRef = inject(DestroyRef);
  private renderer2 = inject(Renderer2);
  private ngZone = inject(NgZone);

  isScrolled = signal(false);
  mobileMenuOpen = signal(false);
  threeReady = signal(false);
  readonly navLinks: NavLink[] = NAV_LINKS;

  // Three.js
  private scene!: THREE.Scene;
  private camera!: THREE.OrthographicCamera;
  private threeRenderer!: THREE.WebGLRenderer;
  private glassPlane!: THREE.Mesh<THREE.PlaneGeometry, THREE.ShaderMaterial>;
  private animationId = 0;
  private isDesktop = false;

  // Page capture
  private pageTexture?: THREE.CanvasTexture;
  private pageContentHeight = 0;
  private captureReady = false;

  // Mobile scroll lock
  private scrollPosition = 0;
  private resizeTimeout?: ReturnType<typeof setTimeout>;
  private recaptureTimeout?: ReturnType<typeof setTimeout>;

  // ========================================
  // Lifecycle
  // ========================================

  ngOnInit(): void {
    this.isDesktop = window.innerWidth >= DESKTOP_BREAKPOINT;
    this.scrollObserver.isScrolled$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(scrolled => this.isScrolled.set(scrolled));
  }

  ngAfterViewInit(): void {
    if (this.isDesktop && this.canvasRef) {
      this.ngZone.runOutsideAngular(() => {
        this.initThreeJS();
        window.addEventListener('resize', this.onResize);
      });
    }
  }

  ngOnDestroy(): void {
    if (this.mobileMenuOpen()) this.unlockBodyScroll();
    this.destroyThreeJS();
    window.removeEventListener('resize', this.onResize);
    clearTimeout(this.resizeTimeout);
    clearTimeout(this.recaptureTimeout);
  }

  // ========================================
  // Three.js Setup (minimal — shader does everything)
  // ========================================

  private initThreeJS(): void {
    const canvas = this.canvasRef.nativeElement;
    const container = this.containerRef.nativeElement;
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (width === 0 || height === 0) return;

    // Renderer
    this.threeRenderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
      powerPreference: 'high-performance'
    });
    this.threeRenderer.setSize(width, height);
    this.threeRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Scene
    this.scene = new THREE.Scene();

    // Orthographic camera — 1:1 mapping, plane fills the view
    this.camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10);
    this.camera.position.z = 1;

    // Glass plane — fills entire camera view
    this.createGlassPlane();

    // Start render loop
    this.animate();

    // Capture page content — first pass early, re-capture once fully loaded
    setTimeout(() => this.capturePageContent(), 800);
    // Re-capture after lazy-loaded content (images, animations) has rendered
    setTimeout(() => this.capturePageContent(), 3000);
  }

  // ========================================
  // Glass Plane (custom shader)
  // ========================================

  private createGlassPlane(): void {
    const geometry = new THREE.PlaneGeometry(1, 1);

    const material = new THREE.ShaderMaterial({
      uniforms: {
        uBgTexture: { value: null },
        uHasTexture: { value: 0 },
        uScrollNorm: { value: 0 },
        uNavNorm: { value: 0.01 },
        uIor: { value: 1.15 },
        uThickness: { value: 1.0 },
        uChromaticAberration: { value: 0.01 },
        uTime: { value: 0 },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthTest: false,
    });

    this.glassPlane = new THREE.Mesh(geometry, material);
    this.scene.add(this.glassPlane);
  }

  // ========================================
  // Page Content Capture
  // ========================================

  private async capturePageContent(): Promise<void> {
    try {
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;

      const mainEl = document.querySelector('main') as HTMLElement;
      if (!mainEl) return;

      // Hide navbar during capture
      const container = this.containerRef?.nativeElement;
      if (container) container.style.visibility = 'hidden';

      // Force all scroll-reveal elements visible for capture
      const hiddenEls = mainEl.querySelectorAll<HTMLElement>('[style*="opacity: 0"], [style*="opacity:0"]');
      const savedStyles: { el: HTMLElement; style: string }[] = [];
      hiddenEls.forEach(el => {
        savedStyles.push({ el, style: el.getAttribute('style') || '' });
        el.style.opacity = '1';
        el.style.transform = 'none';
      });

      const capturedCanvas = await html2canvas(mainEl, {
        scale: 0.5,
        useCORS: true,
        logging: false,
        backgroundColor: null,
        height: mainEl.scrollHeight,
        windowHeight: mainEl.scrollHeight,
      });

      // Restore original styles
      savedStyles.forEach(({ el, style }) => el.setAttribute('style', style));

      if (container) container.style.visibility = '';

      this.pageContentHeight = mainEl.scrollHeight;

      this.pageTexture = new THREE.CanvasTexture(capturedCanvas);
      this.pageTexture.wrapS = THREE.ClampToEdgeWrapping;
      this.pageTexture.wrapT = THREE.ClampToEdgeWrapping;
      this.pageTexture.minFilter = THREE.LinearFilter;
      this.pageTexture.magFilter = THREE.LinearFilter;

      // Update shader uniforms
      const mat = this.glassPlane.material;
      mat.uniforms['uBgTexture'].value = this.pageTexture;
      mat.uniforms['uHasTexture'].value = 1;
      mat.uniforms['uNavNorm'].value = NAVBAR_HEIGHT / this.pageContentHeight;

      this.captureReady = true;
      this.ngZone.run(() => this.threeReady.set(true));
    } catch (e) {
      console.warn('html2canvas capture failed:', e);
    }
  }

  // ========================================
  // Render Loop
  // ========================================

  private animate = (): void => {
    this.animationId = requestAnimationFrame(this.animate);

    if (this.captureReady && this.pageContentHeight > 0) {
      const mat = this.glassPlane.material;
      mat.uniforms['uScrollNorm'].value = window.scrollY / this.pageContentHeight;
      mat.uniforms['uTime'].value = performance.now() * 0.001;
    }

    this.threeRenderer.render(this.scene, this.camera);
  };

  // ========================================
  // Events
  // ========================================

  private onResize = (): void => {
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      const wasDesktop = this.isDesktop;
      this.isDesktop = window.innerWidth >= DESKTOP_BREAKPOINT;

      if (this.isDesktop && !wasDesktop) {
        this.initThreeJS();
      } else if (!this.isDesktop && wasDesktop) {
        this.destroyThreeJS();
      } else if (this.isDesktop && this.threeRenderer) {
        this.resizeThreeJS();
      }
    }, 200);
  };

  private resizeThreeJS(): void {
    const container = this.containerRef?.nativeElement;
    if (!container || !this.threeRenderer) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;

    this.threeRenderer.setSize(w, h);

    // Re-capture
    this.captureReady = false;
    this.glassPlane.material.uniforms['uHasTexture'].value = 0;
    clearTimeout(this.recaptureTimeout);
    this.recaptureTimeout = setTimeout(() => this.capturePageContent(), 800);
  }

  private destroyThreeJS(): void {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = 0;
    }
    this.glassPlane?.geometry.dispose();
    this.glassPlane?.material.dispose();
    this.pageTexture?.dispose();
    this.pageTexture = undefined;
    this.threeRenderer?.dispose();
  }

  // ========================================
  // Mobile Menu
  // ========================================

  toggleMobileMenu(): void {
    const newState = !this.mobileMenuOpen();
    this.mobileMenuOpen.set(newState);
    newState ? this.lockBodyScroll() : this.unlockBodyScroll();
  }

  closeMenu(): void {
    this.mobileMenuOpen.set(false);
    this.unlockBodyScroll();
  }

  private lockBodyScroll(): void {
    this.scrollPosition = window.scrollY;
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${this.scrollPosition}px`;
    document.body.style.width = '100%';
    this.renderer2.addClass(document.body, 'mobile-menu-active');
  }

  private unlockBodyScroll(): void {
    document.body.style.overflow = '';
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.width = '';
    this.renderer2.removeClass(document.body, 'mobile-menu-active');
    window.scrollTo(0, this.scrollPosition);
  }
}
