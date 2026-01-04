// Tech Grid Component
// ====================

import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Technology } from '../../../models/technology.model';
import { TECHNOLOGIES } from '../../../data/technologies.data';

@Component({
  selector: 'app-tech-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tech-grid.component.html',
  styleUrl: './tech-grid.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TechGridComponent {
  @Input() technologies: Technology[] = TECHNOLOGIES;
  @Input() title: string = 'Compétence';
}
