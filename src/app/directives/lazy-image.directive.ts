import {
  Directive,
  ElementRef,
  Input,
  OnInit,
  OnDestroy,
  Renderer2,
  inject
} from '@angular/core';

/**
 * Directive pour lazy loading des images avec support WebP
 * Utilise IntersectionObserver pour charger les images au scroll
 *
 * @example
 * ```html
 * <!-- Pour une image <img> -->
 * <img [appLazyImage]="'/assets/image.jpg'" alt="Description">
 *
 * <!-- Pour un background-image -->
 * <div [appLazyImage]="'/assets/bg.jpg'" lazyType="background"></div>
 *
 * <!-- Avec placeholder -->
 * <img [appLazyImage]="'/assets/image.jpg'"
 *      lazyPlaceholder="/assets/placeholder.jpg">
 * ```
 */
@Directive({
  selector: '[appLazyImage]',
  standalone: true
})
export class LazyImageDirective implements OnInit, OnDestroy {
  private elementRef = inject(ElementRef);
  private renderer = inject(Renderer2);

  /**
   * Chemin de l'image à charger (JPEG/PNG)
   * Le directive détectera automatiquement si une variante WebP existe
   */
  @Input() appLazyImage!: string;

  /**
   * Type de lazy loading
   * - 'img': Pour les balises <img>
   * - 'background': Pour les background-image CSS
   */
  @Input() lazyType: 'img' | 'background' = 'img';

  /**
   * Image placeholder optionnelle (affichée pendant le chargement)
   */
  @Input() lazyPlaceholder?: string;

  /**
   * Marge avant d'observer l'élément (en pixels)
   * Par défaut 50px, l'image commencera à charger 50px avant d'être visible
   */
  @Input() lazyRootMargin: string = '50px';

  private intersectionObserver?: IntersectionObserver;
  private supportsWebP: boolean = false;

  ngOnInit(): void {
    // Détecter le support WebP
    this.detectWebPSupport();

    // Appliquer le placeholder si fourni
    if (this.lazyPlaceholder) {
      this.applyImage(this.lazyPlaceholder);
    }

    // Ajouter une classe pour le style de chargement
    this.renderer.addClass(this.elementRef.nativeElement, 'lazy-loading');

    // Configurer l'IntersectionObserver
    this.setupIntersectionObserver();
  }

  ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
  }

  /**
   * Détecte si le navigateur supporte le format WebP
   * @private
   */
  private detectWebPSupport(): void {
    // Méthode synchrone simple: vérifier le userAgent
    // Pour une détection plus robuste, on pourrait utiliser une promesse
    const canvas = document.createElement('canvas');
    if (canvas.getContext && canvas.getContext('2d')) {
      // Très basique: la plupart des navigateurs modernes supportent WebP
      this.supportsWebP = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
    }
  }

  /**
   * Configure l'IntersectionObserver pour détecter la visibilité
   * @private
   */
  private setupIntersectionObserver(): void {
    const options: IntersectionObserverInit = {
      root: null, // viewport
      rootMargin: this.lazyRootMargin,
      threshold: 0.01 // Trigger dès que 1% est visible
    };

    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.loadImage();
          // Une fois chargée, arrêter d'observer
          this.intersectionObserver?.unobserve(this.elementRef.nativeElement);
        }
      });
    }, options);

    // Commencer à observer l'élément
    this.intersectionObserver.observe(this.elementRef.nativeElement);
  }

  /**
   * Charge l'image (WebP si supporté, sinon fallback)
   * @private
   */
  private loadImage(): void {
    const imagePath = this.getOptimalImagePath();

    if (this.lazyType === 'img') {
      this.loadImageElement(imagePath);
    } else {
      this.loadBackgroundImage(imagePath);
    }
  }

  /**
   * Retourne le chemin optimal de l'image (WebP ou original)
   * @private
   */
  private getOptimalImagePath(): string {
    if (!this.supportsWebP) {
      return this.appLazyImage;
    }

    // Convertir .jpg/.jpeg/.png en .webp
    const webpPath = this.appLazyImage.replace(/\.(jpe?g|png)$/i, '.webp');

    // Si le path ne contient pas d'extension image, retourner l'original
    if (webpPath === this.appLazyImage) {
      return this.appLazyImage;
    }

    return webpPath;
  }

  /**
   * Charge une image dans un élément <img>
   * @private
   */
  private loadImageElement(imagePath: string): void {
    const img = new Image();

    img.onload = () => {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'src', imagePath);
      this.renderer.removeClass(this.elementRef.nativeElement, 'lazy-loading');
      this.renderer.addClass(this.elementRef.nativeElement, 'lazy-loaded');
    };

    img.onerror = () => {
      // Fallback vers l'image originale si WebP échoue
      if (imagePath !== this.appLazyImage) {
        this.loadImageElement(this.appLazyImage);
      } else {
        console.warn(`Failed to load image: ${imagePath}`);
        this.renderer.removeClass(this.elementRef.nativeElement, 'lazy-loading');
      }
    };

    img.src = imagePath;
  }

  /**
   * Charge une image en background-image
   * @private
   */
  private loadBackgroundImage(imagePath: string): void {
    const img = new Image();

    img.onload = () => {
      this.applyBackgroundImage(imagePath);
      this.renderer.removeClass(this.elementRef.nativeElement, 'lazy-loading');
      this.renderer.addClass(this.elementRef.nativeElement, 'lazy-loaded');
    };

    img.onerror = () => {
      // Fallback vers l'image originale si WebP échoue
      if (imagePath !== this.appLazyImage) {
        this.loadBackgroundImage(this.appLazyImage);
      } else {
        console.warn(`Failed to load background image: ${imagePath}`);
        this.renderer.removeClass(this.elementRef.nativeElement, 'lazy-loading');
      }
    };

    img.src = imagePath;
  }

  /**
   * Applique une image (utile pour placeholder et background)
   * @private
   */
  private applyImage(imagePath: string): void {
    if (this.lazyType === 'img') {
      this.renderer.setAttribute(this.elementRef.nativeElement, 'src', imagePath);
    } else {
      this.applyBackgroundImage(imagePath);
    }
  }

  /**
   * Applique un background-image CSS
   * @private
   */
  private applyBackgroundImage(imagePath: string): void {
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'background-image',
      `url('${imagePath}')`
    );
  }
}
