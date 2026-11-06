// Modèle Projet
// =============
// Un projet est présenté comme une œuvre accrochée : la peinture remplit la
// carte, le cartel (artiste, titre, année) est affiché dessous.

/** Peinture d'illustration, déclinée en plusieurs largeurs WebP. */
export interface ProjectImage {
  /** Chemin RELATIF sans suffixe ni extension : `assets/images/paintings/<slug>`. */
  base: string;
  /** Largeurs disponibles (px) : chaque fichier est `<base>-<largeur>.webp`. */
  widths: number[];
  /** Cadrage dans la carte (valeur CSS `object-position`). */
  position?: string;
}

/** Cartel de la peinture. */
export interface Painting {
  artist: string;
  title: string;
  year: number;
}

export interface ProjectLinks {
  live?: string;
  github?: string;
}

export interface Project {
  id: string;
  title: string;
  /** Catégorie affichée en sur-titre (en français). */
  category: string;
  year: number;
  /** Résumé court (≤ 220 caractères). */
  description: string;
  /** Technologies, sans doublon. */
  tags: string[];
  image: ProjectImage;
  painting: Painting;
  links: ProjectLinks;
  featured: boolean;
}
