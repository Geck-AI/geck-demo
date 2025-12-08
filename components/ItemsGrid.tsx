import React, { useEffect, useState, useMemo } from "react";
import { useStylesStore } from "@/stores/stylesStore";
import { useStyleFiltersStore } from "@/stores/styleFiltersStore";
import StyleCard from "./ItemCard";
import {
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { SkeletonCard } from "./SkeletonCard";

const StyleCardContainer: React.FC = () => {
  const { data, loading, error, fetchStyles } = useStylesStore();
  const filters = useStyleFiltersStore();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    fetchStyles();
  }, [fetchStyles]);

  //  filtering
  const filtered = data?.filter((style) => {
    let ok = true;
    if (filters.gender.length) ok = ok && filters.gender.includes(style.gender);
    if (filters.masterCategory.length)
      ok = ok && filters.masterCategory.includes(style.masterCategory);
    if (filters.subCategory.length)
      ok = ok && filters.subCategory.includes(style.subCategory);
    if (filters.season.length) ok = ok && filters.season.includes(style.season);
    if (filters.usage.length) ok = ok && filters.usage.includes(style.usage);
    if (filters.maxPrice.length) {
      const max = parseInt(filters.maxPrice[0], 10);
      ok = ok && typeof style.priceUSD === "number" && style.priceUSD <= max;
    }
    if (filters.color.length)
      ok = ok && filters.color.includes(style.baseColour);
    return ok;
  });

  // pagination
  const { paginated, totalPages } = useMemo(() => {
    const totalPages =
      filtered?.length > 0 ? Math.ceil(filtered.length / itemsPerPage) || 1 : 1;
    const start = (currentPage - 1) * itemsPerPage;
    const paginated =
      filtered?.length > 0 ? filtered.slice(start, start + itemsPerPage) : [];
    return { paginated, totalPages };
  }, [filtered, currentPage]);

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
      return;
    }
  }, [loading, paginated, firstLoad]);

  // render
  if (loading)
    return (
      <section 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4"
        role="status"
        aria-live="polite"
        aria-label="Loading products"
        aria-busy="true"
      >
        {Array.from({ length: 16 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </section>
    );

  if (error) {
    return (
      <div role="alert" aria-live="assertive" className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600 font-medium">Error: {error}</p>
      </div>
    );
  }

  if (!paginated.length)
    return (
      <div 
        className="flex flex-col items-center justify-center py-10 gap-4"
        role="status"
        aria-live="polite"
        aria-label="No products found"
      >
        <figure>
          <img
            src="/notfound.webp"
            alt="No products found - Search or filter returned no matching results. Try adjusting your filters or search terms."
            className="w-48 h-48 object-cover"
          />
          <figcaption className="sr-only">
            No products found illustration
          </figcaption>
        </figure>
        <p className="text-xl font-semibold">
          We looked everywhere... Nothing here but echoes!
        </p>
      </div>
    );

  const pageNums = Array.from(
    { length: Math.min(5, totalPages) },
    (_, i) => i + 1
  );

  return (
    <>
      <section 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        role="list"
        aria-label={`Products, page ${currentPage} of ${totalPages}, showing ${paginated.length} items`}
      >
        {paginated.map((s) => (
          <div key={s.id} role="listitem">
            <StyleCard item={s} />
          </div>
        ))}
      </section>

      {totalPages > 1 && (
        <nav 
          className="flex justify-center mt-8"
          aria-label="Product pagination"
        >
          <div className="flex items-center space-x-2" role="group">
            <PaginationPrevious
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              aria-label={`Go to page ${Math.max(1, currentPage - 1)}`}
              aria-disabled={currentPage === 1}
            />
            <PaginationContent className="flex items-center space-x-2" aria-label="Page numbers">
              {pageNums.map((n) => (
                <PaginationItem key={n}>
                  <PaginationLink
                    isActive={n === currentPage}
                    onClick={() => setCurrentPage(n)}
                    aria-label={`Go to page ${n}${n === currentPage ? ', current page' : ''}`}
                    aria-current={n === currentPage ? 'page' : undefined}
                  >
                    {n}
                  </PaginationLink>
                </PaginationItem>
              ))}
              {totalPages > 5 && (
                <PaginationEllipsis className="px-2" aria-hidden="true">...</PaginationEllipsis>
              )}
            </PaginationContent>
            <PaginationNext
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              aria-label={`Go to page ${Math.min(totalPages, currentPage + 1)}`}
              aria-disabled={currentPage === totalPages}
            />
          </div>
        </nav>
      )}
    </>
  );
};

export default StyleCardContainer;
