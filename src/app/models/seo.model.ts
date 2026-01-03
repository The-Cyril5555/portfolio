// SEO Models
// ===========

/**
 * Configuration SEO pour une page ou section
 */
export interface SeoConfig {
  /**
   * Titre de la page (balise <title> et og:title)
   */
  title: string;

  /**
   * Description de la page (meta description et og:description)
   */
  description: string;

  /**
   * URL de l'image pour les partages sociaux (og:image, twitter:image)
   * @default 'https://cyril-bizouarn.com/logo.png'
   */
  image?: string;

  /**
   * URL canonique de la page
   * @default 'https://cyril-bizouarn.com/'
   */
  url?: string;

  /**
   * Type Open Graph (website, article, profile, etc.)
   * @default 'website'
   */
  type?: string;

  /**
   * Mots-clés pour le référencement
   */
  keywords: string[];

  /**
   * Instructions pour les robots d'indexation
   * @default 'index, follow'
   */
  robots?: string;

  /**
   * URL canonique alternative
   */
  canonical?: string;
}

/**
 * Schema JSON-LD pour structured data
 */
export interface JsonLdSchema {
  '@context': string;
  '@type': string;
  [key: string]: any;
}
