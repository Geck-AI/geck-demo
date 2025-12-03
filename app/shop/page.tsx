"use client";
import StyleCardContainer from "@/components/ItemsGrid";
import FilterSidebar from "@/components/FilterSidebar";

/**
 * Shop landing – shows all products with filters.
 */
export default function ShopHomePage() {
  return (
    <main className="min-h-screen p-8 bg-white" role="main" aria-label="Shop all products page">
      <h1 className="text-3xl font-bold mb-6">Shop All</h1>
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
