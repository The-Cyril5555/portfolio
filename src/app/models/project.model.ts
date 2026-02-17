// Project Model
// ==============

export interface Project {
  id: string;
  title: string;
  description: string;
  client?: string;
  year: number;
  services: string[];  // e.g., ['UX/UI Design', 'Frontend Development']
  tags: string[];      // Technology tags
  images: {
    thumbnail: string;
    featured: string;
    gallery?: string[];
  };
  links: {
    live?: string;
    github?: string;
    behance?: string;
    caseStudy?: string;
  };
  featured: boolean;
  color?: string;      // Accent color for the card
  status?: 'sortie' | 'en-cours' | 'a-venir';
}

export interface Award {
  name: string;        // e.g., 'Awwwards SOTD'
  date: string;
  url?: string;
}
