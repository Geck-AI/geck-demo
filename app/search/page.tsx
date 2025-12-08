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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white p-8" role="main" aria-label="Search products page">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12" role="status" aria-live="polite" aria-label="Loading products" aria-busy="true">
            <div 
              className="animate-spin rounded-full h-12 w-12 border-b-2 border-stone-800 mx-auto"
              aria-hidden="true"
            ></div>
            <p className="text-stone-600 mt-4">Loading products...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white p-8" role="main" aria-label="Search products page">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8" aria-labelledby="search-heading">
          <div className="flex items-center gap-3 mb-4">
            <Search className="w-6 h-6 text-stone-600" aria-hidden="true" />
            <h1 id="search-heading" className="text-3xl font-bold text-stone-900">
              Search Products
            </h1>
          </div>
          
          {/* Search Input */}
          <form
            onSubmit={handleSearchSubmit}
            className="mb-4"
            role="search"
            aria-label="Product search"
          >
            <div className="flex gap-2">
              <div className="relative flex-1 max-w-md">
                <label htmlFor="search-input" className="sr-only">Search products</label>
                <Search 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-stone-400" 
                  aria-hidden="true"
                />
                <Input
                  id="search-input"
                  type="search"
                  placeholder="Search products, categories, colors..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10 focus:ring-2 focus:ring-blue-500"
                  aria-label="Search products, categories, and colors"
                  aria-describedby="search-results-count"
                />
              </div>
              <Button 
                type="submit" 
                className="focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                aria-label="Submit search query"
              >
                Search
              </Button>
            </div>
          </form>

          {query && (
            <p 
              id="search-results-count"
              className="text-stone-600"
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              {results.length === 0
                ? `No products found for "${query}"`
                : `Found ${results.length} ${results.length === 1 ? "product" : "products"} for "${query}"`}
            </p>
          )}
        </header>

        {/* Results Grid */}
        {results.length > 0 ? (
          <section aria-labelledby="search-results-heading">
            <h2 id="search-results-heading" className="sr-only">Search Results</h2>
            <div 
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              role="list"
              aria-label={`Search results for "${query}", ${results.length} items`}
            >
              {results.map((item) => (
                <div key={item.id} role="listitem">
                  <StyleCard item={item} />
                </div>
              ))}
            </div>
          </section>
        ) : query ? (
          <div className="text-center py-12" role="status" aria-live="polite">
            <p className="text-stone-500 text-lg mb-4">
              No products match your search &quot;{query}&quot;
            </p>
            <p className="text-stone-400 text-sm">
              Try searching with different keywords or browse our categories
            </p>
          </div>
        ) : (
          <div className="text-center py-12" role="status">
            <p className="text-stone-500 text-lg">
              Enter a search query to find products
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

