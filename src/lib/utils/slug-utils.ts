/**
 * Utility functions for handling slugs
 */

/**
 * Normalizes a string to create a URL-friendly slug
 * - Converts to lowercase
 * - Replaces spaces with dashes
 * - Removes special characters
 * - Removes duplicate dashes
 * - Trims dashes from start and end
 */
export function normalizeSlug(text: string): string {
  if (!text) return '';
  
  return text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')     // Replace spaces with dashes
    .replace(/[^\w\-]+/g, '') // Remove non-word chars except dashes
    .replace(/\-\-+/g, '-')   // Replace multiple dashes with single dash
    .replace(/^-+/, '')       // Trim dashes from start
    .replace(/-+$/, '');      // Trim dashes from end
}
