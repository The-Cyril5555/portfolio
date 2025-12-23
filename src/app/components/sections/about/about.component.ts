// About Component
// ================

import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SKILL_GROUPS } from '../../../data/skills.data';
import { SkillGroup } from '../../../models/skill.model';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  skillGroups = signal<SkillGroup[]>(SKILL_GROUPS);

  // About content
  aboutText = {
    intro: "Développeur web full-stack passionné par la création d'expériences numériques exceptionnelles.",
    description: "Avec une expertise en développement frontend et backend, je conçois et développe des applications web modernes, performantes et accessibles. Mon approche combine créativité, rigueur technique et sens du détail.",
    experience: "Fort de plusieurs années d'expérience en développement web, j'ai travaillé sur divers projets allant des sites e-commerce aux plateformes métiers complexes."
  };

  stats = [
    { label: 'Années d\'expérience', value: '3+' },
    { label: 'Projets réalisés', value: '15+' },
    { label: 'Technologies maîtrisées', value: '25+' }
  ];
}
