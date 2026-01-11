<div align="center">

# Portfolio Angular 🎨

### Site Web Personnel - Modern & Minimalist

[![Angular](https://img.shields.io/badge/Angular-21.0-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![GSAP](https://img.shields.io/badge/GSAP-3.14-88CE02?style=for-the-badge&logo=greensock&logoColor=white)](https://gsap.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

[Demo en ligne](https://your-portfolio-url.com) • [Signaler un Bug](https://github.com/The-Cyril5555/portfolio/issues) • [Demander une Feature](https://github.com/The-Cyril5555/portfolio/issues)

</div>

---

## ✨ À propos

Portfolio web moderne développé avec **Angular 19**, présentant mes projets et compétences en développement web. Le design adopte une approche **brutalist** avec des effets de **glassmorphisme** et des **animations fluides** propulsées par GSAP.

### 🎯 Points Forts

- 🎨 **Design Moderne** - Interface brutalist avec effets glassmorphisme
- ⚡ **Animations Fluides** - Intégration GSAP et Motion One pour des transitions élégantes
- 🎭 **Galerie Artistique** - Intégration de peintures classiques comme arrière-plans
- 🌓 **Mode Sombre/Clair** - Système de thèmes dynamique
- 📱 **Responsive** - Design adaptatif pour tous les écrans
- 🚀 **Performance** - Optimisation SSR et lazy loading des images
- ♿ **Accessibilité** - Respect des standards WCAG

---

## 🛠️ Stack Technique

<table>
<tr>
<td>

**Frontend**
- Angular 21
- TypeScript 5.9
- SCSS Modules
- RxJS 7.8

</td>
<td>

**Animations**
- GSAP 3.14
- Motion One
- Scroll Reveal
- Parallax Effects

</td>
<td>

**Outils**
- Angular CLI
- Vitest
- Prettier
- Sharp (Images)

</td>
</tr>
</table>

---

## 🚀 Démarrage Rapide

### Prérequis

```bash
Node.js >= 18.x
npm >= 10.9.2
```

### Installation

```bash
# Cloner le repository
git clone https://github.com/The-Cyril5555/portfolio.git

# Accéder au dossier
cd portfolio-angular

# Installer les dépendances
npm install

# Lancer le serveur de développement
npm start
```

L'application sera accessible sur [http://localhost:4200](http://localhost:4200) 🎉

---

## 📦 Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `npm start` | Démarre le serveur de développement |
| `npm run build` | Compile le projet pour la production + fix des paths |
| `npm run watch` | Compilation en mode watch pour le développement |
| `npm test` | Lance les tests unitaires avec Vitest |

---

## 🏗️ Architecture du Projet

```
src/
├── app/
│   ├── components/         # Composants réutilisables
│   │   ├── navigation/    # Header, mobile menu
│   │   ├── sections/      # Hero, About, Portfolio, Contact
│   │   ├── shared/        # Buttons, badges, timeline
│   │   └── ui/           # Icon, theme toggle
│   ├── directives/        # Directives custom (parallax, scroll-reveal)
│   ├── services/          # Services Angular
│   │   ├── data/         # Repositories de données
│   │   ├── animation.service.ts
│   │   ├── scroll.service.ts
│   │   └── seo.service.ts
│   ├── models/           # Interfaces TypeScript
│   ├── data/            # Données statiques (projets, skills)
│   └── app.routes.ts    # Configuration des routes
├── assets/              # Images, fonts, etc.
└── styles/             # Styles globaux SCSS
```

---

## 🎨 Fonctionnalités

### ⚡ Animations Avancées

- **Scroll Reveal** - Les éléments apparaissent au défilement
- **Parallax** - Effets de profondeur sur les backgrounds
- **Transitions Fluides** - Navigation et interactions animées

### 📱 Sections du Portfolio

| Section | Description |
|---------|-------------|
| **Hero** | Introduction avec animation de texte dynamique |
| **About** | Présentation et compétences techniques |
| **Portfolio** | Galerie de projets avec filtres |
| **Technologies** | Grille des technologies maîtrisées |
| **Contact** | Formulaire de contact et réseaux sociaux |

### 🎭 Projets Présentés

- **Proflex** - Plateforme d'intérim logistique (React, Node.js)
- **SQWK** - Site e-commerce (WordPress, WooCommerce)
- **Wiki App** - Application de recherche (React, API REST)
- Et plus encore...

---

## 🎨 Personnalisation des Couleurs

> **Note sur les couleurs GitHub** : GitHub Markdown supporte plusieurs façons d'ajouter de la couleur à votre documentation :

### Méthodes disponibles :

1. **Badges** (shields.io) - Le plus populaire
```markdown
![Badge](https://img.shields.io/badge/texte-valeur-couleur?style=for-the-badge)
```

2. **Emojis** - Pour ajouter de la vie
```markdown
✅ Succès | ⚠️ Attention | ❌ Erreur | 🚀 Feature
```

3. **Blocs de code colorés** - Coloration syntaxique
```javascript
// Code JavaScript avec coloration
```

4. **HTML limité** - Alignement et structure
```html
<div align="center">Contenu centré</div>
```

5. **Diff blocks** - Pour montrer les changements
```diff
- Ancienne ligne (rouge)
+ Nouvelle ligne (vert)
```

> ⚠️ **Limitation** : GitHub ne supporte PAS le CSS inline ou les styles personnalisés pour des raisons de sécurité. Les couleurs sont limitées aux badges, emojis et coloration syntaxique.

---

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📝 License

Ce projet est sous licence **MIT**. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

## 👤 Auteur

**Cyril**

- GitHub: [@The-Cyril5555](https://github.com/The-Cyril5555)
- Portfolio: [votre-site.com](https://your-portfolio-url.com)

---

<div align="center">

### ⭐ Si ce projet vous plaît, n'hésitez pas à lui donner une étoile !

**Fait avec ❤️ et Angular**

</div>
