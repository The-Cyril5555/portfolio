<div align="center">

# 🎨 Portfolio Personnel - Développeur Full Stack

### Application Web Moderne | Angular 21 · TypeScript · GSAP

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Portfolio-00D9FF?style=for-the-badge)](https://the-cyril5555.github.io/portfolio/)
[![Angular](https://img.shields.io/badge/Angular-21.0-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![GSAP](https://img.shields.io/badge/GSAP-3.14-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://gsap.com)

**[🚀 Voir le Portfolio](https://the-cyril5555.github.io/portfolio/)** • **[📧 Me Contacter](https://the-cyril5555.github.io/portfolio/#contact)**

</div>

---

## 📋 Table des Matières

- [Aperçu du Projet](#-aperçu-du-projet)
- [Démonstration](#-démonstration)
- [Technologies Utilisées](#-technologies-utilisées)
- [Fonctionnalités Principales](#-fonctionnalités-principales)
- [Architecture Technique](#-architecture-technique)
- [Performance & Optimisation](#-performance--optimisation)
- [Installation & Développement](#-installation--développement)
- [Choix Techniques](#-choix-techniques)
- [À Propos](#-à-propos)

---

## 🎯 Aperçu du Projet

Portfolio web professionnel développé avec **Angular 21** et **TypeScript**, démontrant mes compétences en développement frontend moderne. Ce projet met en avant une **architecture scalable**, des **animations performantes** et une **expérience utilisateur soignée**.

### 🌟 Points Clés pour les Recruteurs

| Aspect | Description |
|--------|-------------|
| **Architecture** | Architecture modulaire avec services injectables, directives custom et système de state management |
| **Performance** | Lazy loading des images, optimisation du bundle, animations GPU-accelerated |
| **Code Quality** | TypeScript strict, typage fort, patterns Angular best practices |
| **Responsive** | Design adaptatif mobile-first avec breakpoints optimisés |
| **Animations** | Intégration GSAP et Motion One pour des animations fluides et performantes |
| **Accessibilité** | Respect des normes WCAG 2.1, navigation au clavier, ARIA labels |

---

## 🎬 Démonstration

<div align="center">

### 🌐 **[Voir le Portfolio en Direct](https://the-cyril5555.github.io/portfolio/)**

![Portfolio Screenshot](https://img.shields.io/badge/Status-Production-success?style=for-the-badge)

</div>

Le portfolio présente :
- ✨ **Hero Section** avec animations de texte dynamiques
- 💼 **Galerie de Projets** interactive avec filtres
- 🛠️ **Grille de Technologies** avec plus de 15 compétences techniques
- 📬 **Formulaire de Contact** fonctionnel
- 🌓 **Thème Clair/Sombre** avec persistance des préférences

---

## 🛠️ Technologies Utilisées

### Frontend Stack

```typescript
// Core Framework
Angular 21.0         // Framework frontend moderne
TypeScript 5.9       // Typage statique fort
RxJS 7.8            // Programmation réactive

// Animation Libraries
GSAP 3.14           // Animations performantes
Motion One 10.18    // Animations web modernes
```

### Architecture & Outils

<table>
<tr>
<td width="33%">

**🎨 UI/UX**
- SCSS Modules
- CSS Variables
- Glassmorphism
- Brutalist Design
- Mobile-First

</td>
<td width="33%">

**⚡ Performance**
- Lazy Loading
- Image Optimization
- Bundle Splitting
- Tree Shaking
- Sharp CLI

</td>
<td width="33%">

**🔧 DevOps**
- Angular CLI 21
- Vitest (Testing)
- Prettier (Formatting)
- Git Workflow
- GitHub Pages

</td>
</tr>
</table>

---

## ✨ Fonctionnalités Principales

### 🎨 Design & UI

- **Interface Moderne** - Design brutalist avec effets de glassmorphisme
- **Thème Dynamique** - Switch entre mode clair et sombre avec transitions fluides
- **Responsive Design** - Adaptation parfaite sur mobile, tablette et desktop
- **Galerie Artistique** - Intégration de peintures classiques en haute résolution

### ⚡ Animations & Interactions

```typescript
// Exemples d'animations implémentées
- Scroll-triggered animations (Intersection Observer API)
- Parallax effects sur les backgrounds
- Smooth transitions entre les sections
- Micro-interactions sur les boutons et cards
- Animation de chargement progressive
```

### 🏗️ Architecture Technique

- **Services Réutilisables** - Animation, Scroll, SEO services
- **Directives Custom** - ScrollReveal, Parallax, LazyImage
- **Repository Pattern** - Séparation de la logique de données
- **Reactive Programming** - Utilisation de RxJS pour la gestion d'état
- **Type Safety** - Interfaces TypeScript pour tous les modèles

### 📱 Sections du Portfolio

| Section | Technologie | Description |
|---------|------------|-------------|
| **Hero** | GSAP + TypeAnimation | Introduction avec animation de texte type "machine à écrire" |
| **About** | Angular Components | Présentation avec timeline interactive |
| **Skills** | Custom Directives | Grille animée de compétences techniques |
| **Portfolio** | Filtering System | Galerie de projets avec système de filtres dynamiques |
| **Technologies** | Devicon Integration | Visualisation des technologies maîtrisées |
| **Contact** | Reactive Forms | Formulaire de contact avec validation |

---

## 🏗️ Architecture Technique

### Structure du Projet

```
src/app/
├── components/
│   ├── navigation/          # Header & Navigation mobile
│   │   ├── header-nav.component.ts
│   │   └── mobile-menu.component.ts
│   ├── sections/            # Sections principales du portfolio
│   │   ├── hero/           # Section d'introduction
│   │   ├── about/          # Présentation et compétences
│   │   ├── portfolio/      # Galerie de projets
│   │   └── contact/        # Formulaire de contact
│   ├── shared/             # Composants réutilisables
│   │   ├── badge.component.ts
│   │   ├── button.component.ts
│   │   └── timeline.component.ts
│   ├── theme/              # Gestion des thèmes
│   │   └── theme-toggle.component.ts
│   └── ui/                 # Composants UI de base
│       └── icon.component.ts
│
├── directives/             # Directives personnalisées
│   ├── scroll-reveal.directive.ts    # Animations au scroll
│   ├── motion-parallax.directive.ts  # Effets parallax
│   └── lazy-image.directive.ts       # Chargement lazy des images
│
├── services/               # Services Angular
│   ├── data/              # Couche d'accès aux données
│   │   ├── base.repository.ts
│   │   ├── portfolio.repository.ts
│   │   └── contact.repository.ts
│   ├── animation.service.ts          # Gestion des animations
│   ├── scroll.service.ts             # Gestion du scroll
│   ├── scroll-observer.service.ts    # Observer pour animations
│   ├── motion-one.service.ts         # Intégration Motion One
│   └── seo.service.ts                # Optimisation SEO
│
├── models/                 # Interfaces TypeScript
│   ├── project.model.ts
│   ├── skill.model.ts
│   ├── technology.model.ts
│   ├── animation.model.ts
│   └── seo.model.ts
│
├── data/                   # Données statiques typées
│   ├── projects.data.ts    # 6+ projets professionnels
│   ├── technologies.data.ts # 15+ technologies
│   ├── skills.data.ts
│   └── contact.data.ts
│
└── app.routes.ts          # Configuration du routing
```

### Patterns & Principes

✅ **Dependency Injection** - Services injectables pour la modularité
✅ **Repository Pattern** - Abstraction de la couche de données
✅ **Observer Pattern** - RxJS pour la programmation réactive
✅ **Directive Pattern** - Comportements réutilisables
✅ **Single Responsibility** - Composants focalisés sur une tâche
✅ **Type Safety** - TypeScript strict mode activé

---

## 🚀 Performance & Optimisation

### Métriques de Performance

```diff
+ Lazy Loading des images        → -40% temps de chargement initial
+ Bundle optimization             → Bundle < 500KB gzipped
+ GPU-accelerated animations      → 60 FPS constant
+ Code splitting                  → Chargement progressif
+ Tree shaking                    → Élimination du code mort
```

### Optimisations Implémentées

1. **Images** - Lazy loading avec directive custom + Sharp pour l'optimisation
2. **Animations** - Utilisation de `transform` et `opacity` (GPU-accelerated)
3. **Bundle** - Splitting automatique avec Angular build optimizer
4. **Scroll** - Debouncing et throttling pour les événements de scroll
5. **SEO** - Service dédié pour meta tags et structured data

---

## 💻 Installation & Développement

### Prérequis

```bash
Node.js >= 18.x
npm >= 10.9.2
Git
```

### Installation Locale

```bash
# 1. Cloner le repository
git clone https://github.com/The-Cyril5555/portfolio.git
cd portfolio-angular

# 2. Installer les dépendances
npm install

# 3. Lancer le serveur de développement
npm start

# ✅ Accéder à http://localhost:4200
```

### Scripts Disponibles

| Commande | Description | Usage |
|----------|-------------|-------|
| `npm start` | Démarre le serveur de développement | Développement local |
| `npm run build` | Build de production optimisé | Déploiement |
| `npm run watch` | Build en mode watch | Développement |
| `npm test` | Lance les tests unitaires (Vitest) | Tests |

### Build de Production

```bash
# Build optimisé pour la production
npm run build

# Les fichiers compilés seront dans /dist/
# Prêts pour le déploiement sur GitHub Pages
```

---

## 💡 Choix Techniques

### Pourquoi Angular 21 ?

- ✅ **Framework Mature** - Utilisé par Google et des milliers d'entreprises
- ✅ **TypeScript Native** - Type safety et meilleur DX
- ✅ **Architecture Solide** - Dependency injection, modules, services
- ✅ **Performance** - Ivy compiler, optimisations automatiques
- ✅ **Écosystème Complet** - Router, Forms, HTTP client intégrés

### Pourquoi GSAP ?

- ✅ **Performance** - Animations GPU-accelerated
- ✅ **Contrôle Précis** - Timeline et séquences complexes
- ✅ **Cross-browser** - Compatibilité maximale
- ✅ **Professionnel** - Standard de l'industrie pour les animations web

### Architecture Modulaire

```typescript
// Exemple de service avec injection de dépendances
@Injectable({ providedIn: 'root' })
export class AnimationService {
  constructor(private scrollService: ScrollService) {}

  animateElement(element: HTMLElement, config: AnimationConfig): void {
    // Logique d'animation réutilisable
  }
}
```

Cette architecture permet :
- 🔄 **Réutilisabilité** du code
- 🧪 **Testabilité** facilitée
- 📦 **Maintenance** simplifiée
- 🚀 **Scalabilité** pour de futures fonctionnalités

---

## 📊 Projets Présentés

Le portfolio présente **6 projets professionnels** couvrant différentes technologies :

### 🎯 Projets Techniques

| Projet | Stack | Type | Année |
|--------|-------|------|-------|
| **Portfolio Angular** | Angular 19, GSAP, TypeScript | Frontend | 2025 |
| **Proflex Platform** | React, Node.js, Express | Full Stack | 2025 |
| **SQWK E-commerce** | WordPress, WooCommerce, PHP | CMS | 2023 |
| **Wiki App** | React, API REST, Hooks | Frontend | 2023 |

### 💼 Expériences Professionnelles

| Organisation | Rôle | Compétences | Année |
|--------------|------|-------------|-------|
| **SDIS 29** | Technicien Informatique | Réseaux, Windows, Support | 2021 |
| **CMA29** | Technicien Support | GLPI, Helpdesk | 2020 |

---

## 🎓 Compétences Techniques

### Frontend Development

![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Angular](https://img.shields.io/badge/-Angular-DD0031?style=flat-square&logo=angular&logoColor=white)
![Vue.js](https://img.shields.io/badge/-Vue.js-4FC08D?style=flat-square&logo=vue.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/-TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![JavaScript](https://img.shields.io/badge/-JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

### Backend & Database

![Node.js](https://img.shields.io/badge/-Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![PHP](https://img.shields.io/badge/-PHP-777BB4?style=flat-square&logo=php&logoColor=white)
![Laravel](https://img.shields.io/badge/-Laravel-FF2D20?style=flat-square&logo=laravel&logoColor=white)
![MySQL](https://img.shields.io/badge/-MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)
![Python](https://img.shields.io/badge/-Python-3776AB?style=flat-square&logo=python&logoColor=white)

### Tools & DevOps

![Git](https://img.shields.io/badge/-Git-F05032?style=flat-square&logo=git&logoColor=white)
![Docker](https://img.shields.io/badge/-Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Figma](https://img.shields.io/badge/-Figma-F24E1E?style=flat-square&logo=figma&logoColor=white)
![Linux](https://img.shields.io/badge/-Linux-FCC624?style=flat-square&logo=linux&logoColor=black)

---

## 🎨 Captures d'Écran

<div align="center">

### Desktop View
*Interface principale avec animations et effets glassmorphisme*

### Mobile View
*Design responsive optimisé pour mobile*

### Dark Mode
*Thème sombre avec transitions fluides*

</div>

> 💡 **Note** : Visitez [le portfolio en ligne](https://the-cyril5555.github.io/portfolio/) pour voir toutes les animations et interactions en action !

---

## 📈 Évolutions Futures

- [ ] Ajout d'un blog technique avec articles
- [ ] Intégration d'analytics pour suivre les visites
- [ ] Section "Témoignages" avec recommandations
- [ ] Mode "Gaming" avec animations 3D (Three.js)
- [ ] Internationalisation (FR/EN)
- [ ] PWA pour fonctionnement offline

---

## 📞 À Propos

### Cyril - Développeur Full Stack

Je suis un développeur passionné spécialisé dans le **développement web moderne** avec une expertise en **React**, **Angular** et **Node.js**. Ce portfolio démontre mes compétences techniques et mon attention aux détails.

### 🌐 Me Contacter

<div align="center">

[![Portfolio](https://img.shields.io/badge/Portfolio-00D9FF?style=for-the-badge&logo=google-chrome&logoColor=white)](https://the-cyril5555.github.io/portfolio/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/The-Cyril5555)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/votre-profil)
[![Email](https://img.shields.io/badge/Email-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](https://the-cyril5555.github.io/portfolio/#contact)

</div>

---

## 🤝 Contributions

Ce projet est principalement un portfolio personnel, mais les suggestions et feedbacks sont les bienvenus !

Si vous trouvez un bug ou avez une suggestion :
1. Ouvrez une [issue](https://github.com/The-Cyril5555/portfolio/issues)
2. Ou contactez-moi directement via le [formulaire de contact](https://the-cyril5555.github.io/portfolio/#contact)

---

## 📝 License

Ce projet est sous licence **MIT**. Vous êtes libre de vous en inspirer pour votre propre portfolio !

Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

<div align="center">

### ⭐ Si ce projet vous plaît, n'hésitez pas à lui donner une étoile !

**Développé avec ❤️ et Angular**

[![Made with Angular](https://img.shields.io/badge/Made%20with-Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev)
[![Built with TypeScript](https://img.shields.io/badge/Built%20with-TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

**[🚀 Retour en haut](#-portfolio-personnel---développeur-full-stack)**

</div>
