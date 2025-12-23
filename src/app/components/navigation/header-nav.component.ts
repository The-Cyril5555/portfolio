// Header Navigation Component
// ============================

import { Component, Input, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-header-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-nav.component.html',
  styleUrl: './header-nav.component.scss'
})
export class HeaderNavComponent implements OnInit, OnDestroy {
  @Input() activeSection = '';

  private scrollService = inject(ScrollService);

  // Track scroll state
  isScrolled = signal(false);

  navLinks = [
    { id: 'home', label: 'Accueil' },
    { id: 'work', label: 'Projets' },
    { id: 'about', label: 'À Propos' },
    { id: 'contact', label: 'Contact' }
  ];

  mobileMenuOpen = false;

  ngOnInit(): void {
    // Add scroll listener
    window.addEventListener('scroll', this.handleScroll);
  }

  ngOnDestroy(): void {
    // Remove scroll listener
    window.removeEventListener('scroll', this.handleScroll);
  }

  private handleScroll = (): void => {
    // Update scrolled state when user scrolls more than 50px
    this.isScrolled.set(window.scrollY > 50);
  };

  onNavClick(event: Event, sectionId: string): void {
    event.preventDefault();
    this.scrollService.scrollToSection(sectionId);
    this.mobileMenuOpen = false;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
  }
}
