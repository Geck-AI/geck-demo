"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { useStylesStore, StyleItem } from "@/stores/stylesStore";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<StyleItem[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { data, fetchStyles } = useStylesStore();
  const router = useRouter();

  // Fetch styles if not loaded
  useEffect(() => {
    if (data.length === 0) {
      fetchStyles();
    }
  }, [data.length, fetchStyles]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim().length === 0) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const filtered = data.filter((item) => {
      const name = item.productDisplayName?.toLowerCase() || "";
      const category = item.masterCategory?.toLowerCase() || "";
      const subCategory = item.subCategory?.toLowerCase() || "";
      const articleType = item.articleType?.toLowerCase() || "";
      const color = item.baseColour?.toLowerCase() || "";

      return (
        name.includes(query) ||
        category.includes(query) ||
        subCategory.includes(query) ||
        articleType.includes(query) ||
        color.includes(query)
      );
    });

    setTotalResults(filtered.length);
    setResults(filtered.slice(0, 8)); // Show max 8 results
    setIsOpen(filtered.length > 0 && searchQuery.trim().length > 0);
  }, [searchQuery, data]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (searchQuery.trim()) {
      setIsOpen(false);
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const handleResultClick = () => {
    setIsOpen(false);
    setSearchQuery("");
  };

  const handleViewAllResults = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <div ref={searchRef} className="relative w-full" role="search" aria-label="Site search" data-agent-role="search-autocomplete" data-agent-hint="Type to search products. Results appear in dropdown below. Click result or press Enter to navigate.">
      <form onSubmit={handleSubmit} className="relative" aria-label="Search form">
        <label htmlFor="search-input-navbar" className="sr-only">Search for products, brands and more</label>
        <Input
          id="search-input-navbar"
          ref={inputRef}
          type="search"
          placeholder="Search for Products, Brands and More"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (searchQuery.trim() && results.length > 0) {
              setIsOpen(true);
            }
          }}
          className="w-full pl-10 pr-10 h-11 shadow-none"
          aria-label="Search for products, brands and more"
          aria-autocomplete="list"
          aria-expanded={isOpen}
          aria-controls="search-results"
          aria-describedby={isOpen && results.length > 0 ? "search-results-count" : undefined}
          data-testid="search-input"
          data-agent-role="search-input"
          data-agent-action="search-products"
          data-agent-hint="Type product name, category, or color. Autocomplete shows matching products as you type."
        />
        <Search 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" 
          aria-hidden="true"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
            aria-label="Clear search query"
            data-testid="search-clear-button"
          >
            <X className="w-4 h-4" aria-hidden="true" />
          </button>
        )}
      </form>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div 
          id="search-results"
          className="absolute z-50 w-full mt-2 bg-white border border-stone-200 rounded-md shadow-lg max-h-96 overflow-y-auto"
          role="listbox"
          aria-label="Search results"
          aria-live="polite"
          aria-atomic="false"
          data-agent-role="search-results-dropdown"
          data-agent-hint="Click any product to view details. Shows up to 8 results. Use 'View all' button for complete results."
        >
          <div className="p-2" role="status" aria-live="polite" aria-atomic="true">
            <span id="search-results-count" className="sr-only">
              {totalResults} result{totalResults !== 1 ? 's' : ''} found
            </span>
          </div>
          <div className="p-2">
            {results.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                onClick={handleResultClick}
                className="flex items-center gap-3 p-3 hover:bg-stone-50 rounded-md transition-colors"
                role="option"
                aria-label={`${item.productDisplayName || "Unnamed Product"}, ${item.articleType}, ${item.masterCategory}${item.priceUSD ? `, $${item.priceUSD.toFixed(2)}` : ""}`}
                data-testid={`search-result-${item.id}`}
                data-agent-role="search-result-item"
                data-agent-action="navigate-to-product"
                data-agent-expected="Navigates to product detail page"
              >
                <figure className="flex-shrink-0 w-16 h-16 bg-stone-100 rounded overflow-hidden">
                  {item.imageURL ? (
                    <>
                      <img
                        src={item.imageURL}
                        alt={`${item.productDisplayName || 'Product'}${item.articleType ? ` - ${item.articleType}` : ''}${item.baseColour ? ` in ${item.baseColour}` : ''} - Search result`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "/placeholder.png";
                        }}
                      />
                      <figcaption className="sr-only">
                        {item.productDisplayName || 'Product'} search result thumbnail
                      </figcaption>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs" aria-label="No product image available">
                      No Image
                    </div>
                  )}
                </figure>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-900 truncate">
                    {item.productDisplayName || "Unnamed Product"}
                  </p>
                  <p className="text-xs text-stone-500 truncate">
                    {item.articleType} • {item.masterCategory}
                  </p>
                  {item.priceUSD && (
                    <p className="text-sm font-semibold text-stone-900 mt-1">
                      ${item.priceUSD.toFixed(2)}
                    </p>
                  )}
                </div>
              </Link>
            ))}
            {totalResults > 8 && (
              <button
                type="button"
                onClick={handleViewAllResults}
                className="w-full mt-2 p-2 text-sm text-blue-600 hover:bg-blue-50 rounded-md font-medium"
                aria-label={`View all ${totalResults} results for ${searchQuery}`}
                data-testid="search-view-all-button"
              >
                View all {totalResults} results for &quot;{searchQuery}&quot;
              </button>
            )}
            <div id="search-results-count" className="sr-only">
              {totalResults} {totalResults === 1 ? "result" : "results"} found
            </div>
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && searchQuery.trim().length > 0 && results.length === 0 && (
        <div 
          className="absolute z-50 w-full mt-2 bg-white border border-stone-200 rounded-md shadow-lg p-4"
          role="status"
          aria-live="polite"
          aria-label="No search results"
        >
          <p className="text-sm text-stone-500 text-center">
            No products found for &quot;{searchQuery}&quot;
          </p>
        </div>
      )}
    </div>
  );
}

