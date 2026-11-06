import { TestBed } from '@angular/core/testing';
import { SeoService } from './seo.service';
import { CONTACT_EMAIL, SOCIAL_LINKS } from '../data/contact.data';

describe('SeoService', () => {
  afterEach(() => {
    document.getElementById('person-schema')?.remove();
    document.getElementById('website-schema')?.remove();
  });

  it('reprend l’e-mail et les profils affichés dans Contact (source unique)', () => {
    const person = TestBed.inject(SeoService).createPersonSchema();

    expect(person['email']).toBe(CONTACT_EMAIL);
    expect(person['sameAs']).toEqual(SOCIAL_LINKS.map((l) => l.url));
    expect(person['knowsAbout']).toContain('React');
  });

  it('ne déclare pas de recherche interne (le site n’en a pas)', () => {
    const site = TestBed.inject(SeoService).createWebSiteSchema();
    expect(site['potentialAction']).toBeUndefined();
  });

  it('injecte chaque schéma une seule fois, même appelé deux fois', () => {
    const seo = TestBed.inject(SeoService);
    seo.addStructuredData();
    seo.addStructuredData();

    const scripts = document.head.querySelectorAll('script[type="application/ld+json"]');
    expect(scripts.length).toBe(2);
    expect(JSON.parse(document.getElementById('person-schema')!.textContent!).name).toBe('Cyril Bizouarn');
  });
});
