"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useStylesStore, StyleItem } from "@/stores/stylesStore";
import StyleCard from "@/components/ItemCard";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SearchResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const query = searchParams.get("q") || "";
  const { data, loading, fetchStyles } = useStylesStore();
  const [results, setResults] = useState<StyleItem[]>([]);
  const [searchInput, setSearchInput] = useState(query);

  useEffect(() => {
    if (data.length === 0) {
      fetchStyles();
    }
  }, [data.length, fetchStyles]);

  // Sync search input with URL query
  useEffect(() => {
    setSearchInput(query);
  }, [query]);

  useEffect(() => {
    if (!query.trim() || data.length === 0) {
      setResults([]);
      return;
    }

    const searchQuery = query.toLowerCase().trim();
    const filtered = data.filter((item) => {
      const name = item.productDisplayName?.toLowerCase() || "";
      const category = item.masterCategory?.toLowerCase() || "";
      const subCategory = item.subCategory?.toLowerCase() || "";
      const articleType = item.articleType?.toLowerCase() || "";
      const color = item.baseColour?.toLowerCase() || "";
      const gender = item.gender?.toLowerCase() || "";

      return (
        name.includes(searchQuery) ||
        category.includes(searchQuery) ||
        subCategory.includes(searchQuery) ||
        articleType.includes(searchQuery) ||
        color.includes(searchQuery) ||
        gender.includes(searchQuery)
      );
    });

    setResults(filtered);
  }, [query, data]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-800 mx-auto"></div>
            <p className="text-stone-600 mt-4">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-6 h-6 text-stone-600" />
            <h1 className="text-3xl font-bold text-stone-900">
              Search Products
            </h1>
          </div>
          
          {/* Search Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (searchInput.trim()) {
                router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
              }
            }}
            className="mb-4"
          >
            <div className="flex gap-2">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" />
                <Input
                  type="text"
                  placeholder="Search products, categories, colors..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
            </div>
          </form>

          {query && (
            <p className="text-stone-600">
              {results.length === 0
                ? `No products found for "${query}"`
                : `Found ${results.length} ${results.length === 1 ? "product" : "products"} for "${query}"`}
            </p>
          )}
        </div>

        {/* Results Grid */}
        {results.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {results.map((item) => (
              <StyleCard key={item.id} item={item} />
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-12">
            <p className="text-stone-500 text-lg mb-4">
              No products match your search &quot;{query}&quot;
            </p>
            <p className="text-stone-400 text-sm">
              Try searching with different keywords or browse our categories
            </p>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-stone-500 text-lg">
              Enter a search query to find products
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

