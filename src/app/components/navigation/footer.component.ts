// Footer Component
// ================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  techStack = [
    { name: 'Angular 19', icon: '⚡' },
    { name: 'TypeScript', icon: '</>' },
    { name: 'SCSS', icon: '🎨' },
    { name: 'GSAP', icon: '🎭' },
    { name: 'Standalone Components', icon: '🧩' }
  ];

  socialLinks = [
    { name: 'GitHub', url: '#', icon: '📦' },
    { name: 'LinkedIn', url: '#', icon: '💼' },
    { name: 'Email', url: '#contact', icon: '✉️' }
  ];
}
