// SEO Service
// ============

import { Injectable, inject, Inject, PLATFORM_ID } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SeoConfig, JsonLdSchema } from '../models/seo.model';

/**
 * Service de gestion SEO
 *
 * Gère les meta tags dynamiques, structured data JSON-LD,
 * et configurations SEO par section du portfolio.
 *
 * Fonctionnalités :
 * - Mise à jour dynamique du titre de page
 * - Gestion des meta tags (description, keywords, og:*, twitter:*)
 * - Injection de structured data (JSON-LD)
 * - Configurations SEO optimisées par section
 *
 * Utilisation :
 * ```typescript
 * constructor(private seoService: SeoService) {}
 *
 * ngOnInit() {
 *   const config = this.seoService.getSectionSeoConfig('home');
 *   this.seoService.updateTags(config);
 *   this.seoService.addStructuredData(this.seoService.createPersonSchema());
 * }
 * ```
 */
@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);
  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Met à jour tous les meta tags SEO selon la configuration
   *
   * @param config Configuration SEO à appliquer
   */
  updateTags(config: SeoConfig): void {
    const {
      title,
      description,
      image = 'https://the-cyril5555.github.io/PortFolio/logo.png',
      url = 'https://the-cyril5555.github.io/PortFolio/',
      type = 'website',
      keywords,
      robots = 'index, follow',
      canonical
    } = config;

    // Update page title
    this.title.setTitle(title);

    // Update standard meta tags
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ name: 'keywords', content: keywords.join(', ') });
    this.meta.updateTag({ name: 'robots', content: robots });

    // Update Open Graph tags
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: type });

    // Update Twitter Card tags
    this.meta.updateTag({ name: 'twitter:title', content: title });
    this.meta.updateTag({ name: 'twitter:description', content: description });
    this.meta.updateTag({ name: 'twitter:image', content: image });

    // Update canonical URL if provided
    if (canonical) {
      this.updateCanonicalUrl(canonical);
    }
  }

  /**
   * Met à jour l'URL canonique de la page
   *
   * @param url URL canonique
   */
  updateCanonicalUrl(url: string): void {
    if (!this.isBrowser) return;

    // Find existing canonical link or create new one
    let link: HTMLLinkElement | null = this.document.querySelector('link[rel="canonical"]');

    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }

    link.setAttribute('href', url);
  }

  /**
   * Ajoute un script de structured data JSON-LD au DOM
   *
   * @param schema Schéma JSON-LD à injecter
   * @param id Identifiant unique pour le script
   */
  addStructuredData(schema: JsonLdSchema, id: string = 'structured-data'): void {
    if (!this.isBrowser) return;

    // Remove existing script with same ID
    this.removeStructuredData(id);

    // Create new script element
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.text = JSON.stringify(schema);

    this.document.head.appendChild(script);
  }

  /**
   * Supprime un script de structured data du DOM
   *
   * @param id Identifiant du script à supprimer
   */
  removeStructuredData(id: string): void {
    if (!this.isBrowser) return;

    const existingScript = this.document.getElementById(id);
    if (existingScript) {
      existingScript.remove();
    }
  }

  /**
   * Crée le schema Person pour le propriétaire du portfolio
   *
   * @returns Schema JSON-LD de type Person
   */
  createPersonSchema(): JsonLdSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      'name': 'Cyril Bizouarn',
      'jobTitle': 'Développeur Web Full-Stack',
      'url': 'https://the-cyril5555.github.io/PortFolio/',
      'sameAs': [
        'https://github.com/The-Cyril5555',
        'https://linkedin.com/in/cyrilbizouarn'
      ],
      'knowsAbout': [
        'React',
        'Node.js',
        'TypeScript',
        'Angular',
        'SQL',
        'JavaScript',
        'HTML',
        'CSS',
        'Express',
        'MongoDB'
      ],
      'email': 'contact@cyril-bizouarn.com',
      'alumniOf': {
        '@type': 'EducationalOrganization',
        'name': 'MyDigitalSchool'
      }
    };
  }

  /**
   * Crée le schema WebSite pour le portfolio
   *
   * @returns Schema JSON-LD de type WebSite
   */
  createWebSiteSchema(): JsonLdSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'Cyril Bizouarn - Portfolio',
      'url': 'https://the-cyril5555.github.io/PortFolio/',
      'description': 'Portfolio de Cyril Bizouarn, développeur web full-stack spécialisé en React, Node.js et SQL. Découvrez mes projets d\'applications web, sites e-commerce et plateformes métiers.',
      'author': {
        '@type': 'Person',
        'name': 'Cyril Bizouarn'
      },
      'potentialAction': {
        '@type': 'SearchAction',
        'target': {
          '@type': 'EntryPoint',
          'urlTemplate': 'https://the-cyril5555.github.io/PortFolio/#work'
        }
      }
    };
  }

  /**
   * Obtient la configuration SEO pour une section donnée
   *
   * @param sectionId Identifiant de la section (home, work, skills, about, contact)
   * @returns Configuration SEO de la section
   */
  getSectionSeoConfig(sectionId: string): SeoConfig {
    const configs: Record<string, SeoConfig> = {
      home: {
        title: 'Cyril Bizouarn - Développeur Web Full-Stack',
        description: 'Portfolio de Cyril Bizouarn, développeur web full-stack spécialisé en React, Node.js et SQL. Découvrez mes projets d\'applications web, sites e-commerce et plateformes métiers.',
        keywords: [
          'Cyril Bizouarn',
          'développeur web',
          'full-stack',
          'React',
          'Node.js',
          'SQL',
          'Angular',
          'TypeScript',
          'portfolio',
          'développeur junior'
        ],
        canonical: 'https://the-cyril5555.github.io/PortFolio/'
      },
      work: {
        title: 'Projets - Cyril Bizouarn',
        description: 'Découvrez mes projets web : applications React, sites e-commerce WordPress, plateformes de recrutement et applications métiers. Expertise en développement front-end et back-end.',
        keywords: [
          'projets web',
          'portfolio développeur',
          'applications React',
          'sites e-commerce',
          'WordPress',
          'WooCommerce',
          'applications métiers'
        ],
        canonical: 'https://the-cyril5555.github.io/PortFolio/#work'
      },
      skills: {
        title: 'Compétences - Cyril Bizouarn',
        description: 'Technologies maîtrisées : React, Angular, Node.js, Express, SQL, MongoDB, TypeScript, JavaScript, HTML, CSS. Stack technique complète pour développement web full-stack.',
        keywords: [
          'compétences développeur',
          'React',
          'Angular',
          'Node.js',
          'TypeScript',
          'SQL',
          'MongoDB',
          'stack technique',
          'technologies web'
        ],
        canonical: 'https://the-cyril5555.github.io/PortFolio/#skills'
      },
      about: {
        title: 'À propos - Cyril Bizouarn',
        description: 'Développeur web full-stack avec 7+ années d\'expérience. Parcours de formation en développement web (Bachelor CDA, BTS SIO) et expériences professionnelles variées.',
        keywords: [
          'à propos',
          'parcours développeur',
          'formation développement web',
          'expérience professionnelle',
          'Bachelor CDA',
          'BTS SIO',
          'MyDigitalSchool'
        ],
        canonical: 'https://the-cyril5555.github.io/PortFolio/#about'
      },
      contact: {
        title: 'Contact - Cyril Bizouarn',
        description: 'Contactez-moi pour discuter de vos projets web. Disponible pour collaborations, missions freelance et opportunités d\'emploi en développement web full-stack.',
        keywords: [
          'contact développeur',
          'recrutement développeur',
          'freelance web',
          'collaboration projet',
          'mission développeur',
          'emploi développeur web'
        ],
        canonical: 'https://the-cyril5555.github.io/PortFolio/#contact'
      }
    };

    return configs[sectionId] || configs['home'];
  }
}
