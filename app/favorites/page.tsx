"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useFavoritesStore } from "@/stores/favoritesStore";
import { useStylesStore } from "@/stores/stylesStore";
import StyleCard from "@/components/ItemCard";
import { Heart } from "lucide-react";

export default function FavoritesPage() {
  const favoriteIds = useFavoritesStore((s) => s.items);
  const { data, loading, fetchStyles } = useStylesStore();
  const [favoriteItems, setFavoriteItems] = useState(
    data.filter((item) => favoriteIds.includes(item.id))
  );

  useEffect(() => {
    if (data.length === 0) {
      fetchStyles();
    }
  }, [data.length, fetchStyles]);

  useEffect(() => {
    if (data.length > 0) {
      setFavoriteItems(data.filter((item) => favoriteIds.includes(item.id)));
    }
  }, [favoriteIds, data]);

  if (loading) {
    return (
      <main
        className="min-h-screen bg-white p-8"
        role="main"
        aria-label="Favorites page"
      >
        <div className="max-w-7xl mx-auto">
          <div
            className="text-center py-12"
            role="status"
            aria-live="polite"
            aria-label="Loading favorites"
          >
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-800 mx-auto"
              aria-hidden="true"
            ></div>
            <p className="text-stone-600 mt-4">Loading your favorites...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-white p-8"
      role="main"
      aria-label="Favorites page"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8" aria-labelledby="favorites-heading">
          <div className="flex items-center gap-3 mb-4">
            <Heart
              className="w-8 h-8 text-red-600"
              aria-hidden="true"
              fill="currentColor"
            />
            <h1 id="favorites-heading" className="text-3xl font-bold text-stone-900">
              My Favorites
            </h1>
          </div>
          {favoriteItems.length > 0 && (
            <p
              className="text-stone-600"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {favoriteItems.length}{" "}
              {favoriteItems.length === 1 ? "item" : "items"} in your favorites
            </p>
          )}
        </header>

        {/* Favorites Grid */}
        {favoriteItems.length > 0 ? (
          <section aria-labelledby="favorites-heading">
            <div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              role="list"
              aria-label="Favorite products"
            >
              {favoriteItems.map((item) => (
                <div key={item.id} role="listitem">
                  <StyleCard item={item} />
                </div>
              ))}
            </div>
          </section>
        ) : (
          <div
            className="text-center py-12"
            role="status"
            aria-live="polite"
          >
            <Heart
              className="w-16 h-16 text-stone-300 mx-auto mb-4"
              aria-hidden="true"
            />
            <h2 className="text-2xl font-semibold text-stone-800 mb-2">
              No favorites yet
            </h2>
            <p className="text-stone-600 mb-6">
              Start adding items to your favorites by clicking the heart icon on
              any product.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-black text-white px-6 py-3 rounded-sm hover:bg-stone-800 transition-colors"
              aria-label="Browse shop to add favorites"
            >
              Browse Shop
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

