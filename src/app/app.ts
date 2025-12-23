import { Component, OnInit, OnDestroy, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderNavComponent } from './components/navigation/header-nav.component';
import { FooterComponent } from './components/navigation/footer.component';
import { HeroComponent } from './components/sections/hero/hero.component';
import { PortfolioComponent } from './components/sections/portfolio/portfolio.component';
import { AboutComponent } from './components/sections/about/about.component';
import { ContactComponent } from './components/sections/contact/contact.component';
import { ScrollService } from './services/scroll.service';
import { AnimationService } from './services/animation.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    HeaderNavComponent,
    FooterComponent,
    HeroComponent,
    PortfolioComponent,
    AboutComponent,
    ContactComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy {
  private scrollService = inject(ScrollService);
  private animationService = inject(AnimationService);

  activeSection = this.scrollService.activeSection;

  constructor() {
    // React to active section changes
    effect(() => {
      console.log('Active section:', this.activeSection());
    });
  }

  ngOnInit(): void {
    // Initialize scroll spy and animations
    setTimeout(() => {
      this.scrollService.initScrollSpy();
      this.animationService.initScrollAnimations();
    }, 100);
  }

  ngOnDestroy(): void {
    this.scrollService.destroy();
    this.animationService.destroyAll();
  }
}
