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
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <Input
          ref={inputRef}
          type="text"
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
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-stone-400" />
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setIsOpen(false);
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </form>

      {/* Dropdown Results */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-stone-200 rounded-md shadow-lg max-h-96 overflow-y-auto">
          <div className="p-2">
            {results.map((item) => (
              <Link
                key={item.id}
                href={`/product/${item.id}`}
                onClick={handleResultClick}
                className="flex items-center gap-3 p-3 hover:bg-stone-50 rounded-md transition-colors"
              >
                <div className="flex-shrink-0 w-16 h-16 bg-stone-100 rounded overflow-hidden">
                  {item.imageURL ? (
                    <img
                      src={item.imageURL}
                      alt={item.productDisplayName || "Product"}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "/placeholder.png";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
                      No Image
                    </div>
                  )}
                </div>
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
              >
                View all {totalResults} results for &quot;{searchQuery}&quot;
              </button>
            )}
          </div>
        </div>
      )}

      {/* No Results */}
      {isOpen && searchQuery.trim().length > 0 && results.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-stone-200 rounded-md shadow-lg p-4">
          <p className="text-sm text-stone-500 text-center">
            No products found for &quot;{searchQuery}&quot;
          </p>
        </div>
      )}
    </div>
  );
}

