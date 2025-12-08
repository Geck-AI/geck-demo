"use client";

import React, { useEffect } from "react";
import FilterSidebar from "@/components/FilterSidebar";
import StyleCardContainer from "@/components/ItemsGrid";
import { useStyleFiltersStore } from "@/stores/styleFiltersStore";
import { categoryFilter } from "@/lib/shopConfig";
import { generateStructuredData } from "@/lib/seo";
import StructuredData from "@/components/StructuredData";

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

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3005';
  
  // Breadcrumb structured data
  const breadcrumbSchema = generateStructuredData('BreadcrumbList', {
    items: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: baseUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shop',
        item: `${baseUrl}/shop`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: title,
        item: `${baseUrl}/shop/${category}`,
      },
    ],
  });

  return (
    <main className="min-h-screen p-8 bg-white" role="main" aria-label={`Shop ${title} page`}>
      <StructuredData data={breadcrumbSchema} id="breadcrumb-schema" />
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
      <div className="flex gap-8">
        <aside className="w-1/4" role="complementary" aria-label="Product filters sidebar">
          <FilterSidebar />
        </aside>
        <div className="flex-1" role="region" aria-label="Product listings" aria-live="polite" aria-atomic="false">
          <StyleCardContainer />
        </div>
      </div>
    </main>
  );
}
