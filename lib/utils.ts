import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Centralized mapping of catalog color names to swatch colors
export const catalogColorMap: Record<string, string> = {
  "Mauve": "#E0B0FF",
  "Multi": "linear-gradient(135deg, #ff6b6b, #f7d794)",
  "Copper": "#B87333",
  "Brown": "#8B4513",
  "Orange": "#FF8C00",
  "Rose": "#FF66CC",
  "Purple": "#8A2BE2",
  "Grey": "#808080",
  "Navy Blue": "#001F54",
  "Tan": "#D2B48C",
  "Taupe": "#8B8589",
  "Yellow": "#FFD000",
  "Off White": "#F8F8F2",
  "Olive": "#808000",
  "Bronze": "#CD7F32",
  "Metallic": "#A9A9A9",
  "Lavender": "#B57EDC",
  "Sea Green": "#2E8B57",
  "Coffee Brown": "#4B3621",
  "Skin": "#FFD7C2",
  "Grey Melange": "#A0A0A0",
  "Mushroom Brown": "#C4B095",
  "Red": "#FF2D2D",
  "Mustard": "#E1AD01",
  "Lime Green": "#32CD32",
  "Silver": "#C0C0C0",
  "Teal": "#008080",
  "White": "#FFFFFF",
  "Green": "#228B22",
  "Rust": "#B7410E",
  "Gold": "#D4AF37",
  "Black": "#000000",
  "Peach": "#FFDAB9",
  "Blue": "#1E90FF",
  "Beige": "#F5F5DC",
  "Cream": "#FFFDD0",
  "Burgundy": "#800020",
  "Maroon": "#800000",
  "Magenta": "#FF00FF",
  "Pink": "#FFC0CB",
  "Khaki": "#C3B091",
  "Steel": "#7A8B8B",
  "Nude": "#E3BC9A",
  "Turquoise Blue": "#00CED1",
  "Charcoal": "#36454F",
};

// Returns CSS color for given catalog color name
export function getCatalogSwatch(name: string): string {
  const exact = catalogColorMap[name];
  if (exact) return exact;
  // Fallback: deterministic HSL hash for unknown names
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
    hash |= 0;
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue} 65% 55%)`;
}
