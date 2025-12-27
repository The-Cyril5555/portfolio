// Contact Component
// ==================

import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../ui/icon/icon.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent implements OnInit, OnDestroy {
  // Parallax offsets with transforms
  backgroundTransform = signal('translateY(0px) scaleY(-1)');
  contentOffset = signal(0);

  // Current year for footer
  currentYear = new Date().getFullYear();

  // Social links
  socialLinks = [
    { name: 'GitHub', url: 'https://github.com/The-Cyril5555', icon: 'github' as const },
    { name: 'LinkedIn', url: 'https://linkedin.com/in/cyril-bizouarn', icon: 'linkedin' as const }
  ];

  // Tech stack for footer
  techStack = [
    { name: 'Angular', icon: 'devicon-angularjs-plain' },
    { name: 'TypeScript', icon: 'devicon-typescript-plain' },
    { name: 'SCSS', icon: 'devicon-sass-original' }
  ];

  ngOnInit(): void {
    window.addEventListener('scroll', this.handleScroll);
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.handleScroll);
  }

  private handleScroll = (): void => {
    const contactSection = document.querySelector('.contact');

    if (contactSection) {
      const rect = contactSection.getBoundingClientRect();
      const offset = window.innerHeight - rect.top;

      // Apply parallax only when section is in view
      if (offset > 0 && rect.bottom > 0) {
        // Background scrolls slower (0.3x speed) + flipped vertically
        this.backgroundTransform.set(`translateY(${offset * 0.3}px) scaleY(-1)`);
        // Content scrolls even slower (0.15x speed)
        this.contentOffset.set(offset * 0.15);
      }
    }
  };
}
