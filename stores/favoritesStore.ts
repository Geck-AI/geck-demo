import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { getSafeStorage } from "@/lib/safeStorage";

interface FavoritesState {
  items: number[]; // Array of product IDs

  /**
   * Add an item to favorites.
   * @param id Product ID
   */
  addItem: (id: number) => void;

  /**
   * Remove an item from favorites.
   * @param id Product ID
   */
  removeItem: (id: number) => void;

  /**
   * Toggle an item in favorites (add if not present, remove if present).
   * @param id Product ID
   */
  toggleItem: (id: number) => void;

  /**
   * Check if an item is in favorites.
   * @param id Product ID
   */
  isFavorite: (id: number) => boolean;

  /** Clear all favorites */
  clear: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (id) =>
        set((state) => {
          if (state.items.includes(id)) {
            return state; // Already in favorites
          }
          return { items: [...state.items, id] };
        }),

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((itemId) => itemId !== id),
        })),

      toggleItem: (id) =>
        set((state) => {
          if (state.items.includes(id)) {
            return {
              items: state.items.filter((itemId) => itemId !== id),
            };
          }
          return { items: [...state.items, id] };
        }),

      isFavorite: (id) => {
        return get().items.includes(id);
      },

      clear: () => set({ items: [] }),
    }),
    {
      name: "favorites-storage",
      storage: createJSONStorage(getSafeStorage),
    }
  )
);

