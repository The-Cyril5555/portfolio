import { DOCUMENT, Injectable, inject } from '@angular/core';
import { CONTACT_EMAIL, SOCIAL_LINKS } from '../data/contact.data';
import { TECHNOLOGIES } from '../data/technologies.data';
import { JsonLdSchema } from '../models/seo.model';

/** Adresse publique du site (identique au canonical de src/index.html). */
export const SITE_URL = 'https://the-cyril5555.github.io/portfolio/';

/** Signature unique du site (titre, og:title, jobTitle…). */
export const SITE_ROLE = 'Développeur web full-stack';

/**
 * Données structurées (JSON-LD) de la page unique.
 *
 * Titre, description, canonical et balises Open Graph / Twitter sont STATIQUES
 * dans src/index.html : il n'y a qu'une URL, et les robots de partage
 * n'exécutent pas le JavaScript. On ne les réécrit donc jamais au défilement.
 *
 * Seul le JSON-LD est produit ici, à partir des mêmes constantes que les
 * sections Contact et Compétences : e-mail, profils et technologies ne peuvent
 * plus diverger de ce que la page affiche.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly document = inject(DOCUMENT);

  /** Ajoute (ou remplace) les schémas Person et WebSite dans <head>. */
  addStructuredData(): void {
    this.inject('person-schema', this.createPersonSchema());
    this.inject('website-schema', this.createWebSiteSchema());
  }

  createPersonSchema(): JsonLdSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: 'Cyril Bizouarn',
      jobTitle: SITE_ROLE,
      url: SITE_URL,
      email: CONTACT_EMAIL,
      sameAs: SOCIAL_LINKS.map((link) => link.url),
      knowsAbout: TECHNOLOGIES.filter((t) => t.group !== 'tools').map((t) => t.name),
      alumniOf: { '@type': 'EducationalOrganization', name: 'MyDigitalSchool' },
    };
  }

  createWebSiteSchema(): JsonLdSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Cyril Bizouarn',
      url: SITE_URL,
      inLanguage: 'fr',
      author: { '@type': 'Person', name: 'Cyril Bizouarn' },
    };
  }

  private inject(id: string, schema: JsonLdSchema): void {
    const doc = this.document;
    doc.getElementById(id)?.remove();
    const script = doc.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.text = JSON.stringify(schema);
    doc.head.appendChild(script);
  }
}
