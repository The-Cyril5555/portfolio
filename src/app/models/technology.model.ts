// Technology Model
// =================

/** Famille de compétences : une colonne de la section « Compétences ». */
export type TechnologyGroup = 'front' | 'back' | 'tools';

export interface Technology {
  /** Identifiant stable (sert aussi de nom de fichier pour l'icône). */
  id: string;
  /** Libellé affiché. */
  name: string;
  /** Chemin RELATIF de l'icône SVG (le site est servi sous /portfolio/). */
  icon: string;
  group: TechnologyGroup;
}

export interface TechnologyGroupInfo {
  id: TechnologyGroup;
  title: string;
}
