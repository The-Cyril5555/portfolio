// Contact Component
// ==================

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../../ui/icon/icon.component';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, IconComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss'
})
export class ContactComponent {
  email = 'cyril.bizouarn@gmail.com';
  cvLink = 'https://www.linkedin.com/in/cyril-bizouarn/';

  socials = [
    {
      name: 'GitHub',
      url: 'https://github.com/The-Cyril5555',
      icon: 'github' as const
    },
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/cyril-bizouarn/',
      icon: 'linkedin' as const
    }
  ];
}
