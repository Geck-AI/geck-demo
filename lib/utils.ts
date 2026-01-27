import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a semantic, URL-friendly ID from text
 * Converts text to lowercase, replaces spaces with hyphens, removes special characters
 * Example: "Hypoallergenic Formula" -> "hypoallergenic-formula"
 */
export function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters except word chars, spaces, and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate a unique ID by appending a number if the ID already exists
 */
export function generateUniqueHeadingId(text: string, existingIds: Set<string>): string {
  const baseId = generateHeadingId(text);
  let id = baseId;
  let counter = 1;
  
  while (existingIds.has(id)) {
    id = `${baseId}-${counter}`;
    counter++;
  }
  
  existingIds.add(id);
  return id;
}

/**
 * Get catalog swatch color for a given color name
 * Maps color names to hex color values for display
 */
export function getCatalogSwatch(name: string): string {
  const swatches: Record<string, string> = {
    'Black': '#000000',
    'White': '#FFFFFF',
    'Red': '#FF0000',
    'Blue': '#0000FF',
    'Green': '#008000',
    'Yellow': '#FFFF00',
    'Orange': '#FFA500',
    'Purple': '#800080',
    'Pink': '#FFC0CB',
    'Brown': '#A52A2A',
    'Grey': '#808080',
    'Gray': '#808080',
    'Navy': '#000080',
    'Beige': '#F5F5DC',
    'Khaki': '#C3B091',
    'Olive': '#808000',
    'Maroon': '#800000',
    'Teal': '#008080',
    'Cyan': '#00FFFF',
    'Magenta': '#FF00FF',
    'Silver': '#C0C0C0',
    'Gold': '#FFD700',
    'Tan': '#D2B48C',
    'Burgundy': '#800020',
    'Coral': '#FF7F50',
    'Lavender': '#E6E6FA',
    'Mint': '#98FF98',
    'Peach': '#FFDAB9',
    'Turquoise': '#40E0D0',
    'Indigo': '#4B0082',
  };

  // Return the swatch if found, otherwise return a default gray
  return swatches[name] || '#808080';
}
