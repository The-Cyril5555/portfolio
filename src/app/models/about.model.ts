// About Models
// =============

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startYear: number;
  endYear: number;
  type: 'formation' | 'certification';
  description?: string;
}

export interface Experience {
  id: string;
  title: string;
  company: string;
  location: string;
  startYear: number;
  endYear?: number;  // undefined for current position
  type: 'dev' | 'it' | 'internship';
  technologies?: string[];
  description?: string;
}

export interface TimelineItem {
  id: string;
  title: string;
  subtitle: string;
  year: string;
  type: 'education' | 'experience';
  category?: string;
  description?: string;
}

export interface Quality {
  id: string;
  name: string;
  icon: string;
  description: string;
}
