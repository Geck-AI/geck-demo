"use client";

import React, { useEffect } from "react";
import FilterSidebar from "@/components/FilterSidebar";
import StyleCardContainer from "@/components/ItemsGrid";
import { useStyleFiltersStore } from "@/stores/styleFiltersStore";
import { categoryFilter } from "@/lib/shopConfig";

interface ShopPageContentProps {
  category: string;
}

export default function ShopPageContent({ category }: ShopPageContentProps) {
  const { clearFilters, toggleFilter } = useStyleFiltersStore();

  useEffect(() => {
    // Reset any existing filters on mount
    clearFilters();
    // Apply default category filter if configured
    const cfg = categoryFilter[category];
    if (cfg) toggleFilter(cfg);
  }, [category, clearFilters, toggleFilter]);

  // Capitalize title
  const title = category
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <main className="min-h-screen p-8 bg-white" role="main" aria-label={`Shop ${title} page`}>
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <div className="flex gap-8">
        <aside className="w-1/4" role="complementary" aria-label="Product filters">
          <FilterSidebar />
        </aside>
        <div className="flex-1" role="region" aria-label="Product listings">
          <StyleCardContainer />
        </div>
      </div>
    </main>
  );
}
