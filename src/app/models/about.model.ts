// Modèles de la section « À propos »
// ===================================

/** Nature d'une étape du parcours : marqueur plein (formation) ou anneau (expérience). */
export type TimelineKind = 'formation' | 'experience';

/** Une étape du parcours (formation ou expérience), affichée par `app-timeline`. */
export interface TimelineItem {
  id: string;
  kind: TimelineKind;
  /** Année de début (ou année unique). */
  start: number;
  /** Année de fin, absente pour une étape d'une seule année. */
  end?: number;
  /** Diplôme ou poste. */
  title: string;
  /** Établissement ou employeur. */
  organization: string;
  location?: string;
  /** Une ligne de description. */
  description: string;
}
