// Composant racine : assemble les sections de la page unique et démarre
// le scroll-spy (section active → nav + balises SEO) et l'effet Swarm via ?swarm.

import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, OnInit, effect, inject } from '@angular/core';
import { HeaderNavComponent } from './components/navigation/header-nav.component';
import { HeroComponent } from './components/sections/hero/hero.component';
import { PortfolioComponent } from './components/sections/portfolio/portfolio.component';
import { SkillsComponent } from './components/sections/skills/skills.component';
import { AboutComponent } from './components/sections/about/about.component';
import { ContactComponent } from './components/sections/contact/contact.component';
import { SiteFooterComponent } from './components/layout/site-footer.component';
import { ScrollService } from './services/scroll.service';
import { SeoService } from './services/seo.service';
import { SwarmService } from './services/swarm.service';

@Component({
  selector: 'app-root',
  imports: [
    HeaderNavComponent,
    HeroComponent,
    PortfolioComponent,
    SkillsComponent,
    AboutComponent,
    ContactComponent,
    SiteFooterComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  private readonly scroll = inject(ScrollService);
  private readonly seo = inject(SeoService);
  private readonly swarm = inject(SwarmService);

  constructor() {
    // Titre / description suivent la section visible
    effect(() => {
      const section = this.scroll.activeSection();
      if (section) this.seo.updateTags(this.seo.getSectionSeoConfig(section));
    });
  }

  ngOnInit(): void {
    this.seo.updateTags(this.seo.getSectionSeoConfig('home'));
    this.seo.addStructuredData(this.seo.createPersonSchema(), 'person-schema');
    this.seo.addStructuredData(this.seo.createWebSiteSchema(), 'website-schema');
  }

  ngAfterViewInit(): void {
    this.scroll.initScrollSpy();
    this.swarm.startFromUrlIfRequested();
  }

  ngOnDestroy(): void {
    this.scroll.destroy();
  }

  /** Lien d'évitement : focus sur <main> sans changer d'URL (base href /portfolio/). */
  protected skipToContent(event: Event): void {
    event.preventDefault();
    const main = document.getElementById('main');
    main?.focus();
    main?.scrollIntoView();
  }
}
