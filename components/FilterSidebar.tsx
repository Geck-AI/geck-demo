"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { categoryFilter } from "@/lib/shopConfig";
import { ChevronDown, ChevronRight } from "lucide-react";
import { filterConfig } from "@/lib/filterConfig";
import { StyleFilters, useStyleFiltersStore } from "@/stores/styleFiltersStore";
import { getCatalogSwatch } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
export default function FilterSidebar() {
  const clearFilters = useStyleFiltersStore((s) => s.clearFilters);
  const toggleFilter = useStyleFiltersStore((s) => s.toggleFilter);
  const filters = useStyleFiltersStore();
  const maxPrice = useStyleFiltersStore((s) => s.maxPrice);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      filterConfig.map(
        (g) => [g.title, g.title === "Department"] as [string, boolean]
      )
    )
  );
  const [price, setPrice] = useState<number>(() => {
    const initial = maxPrice?.[0];
    const parsed = initial != null ? parseInt(initial, 10) : NaN;
    return Number.isFinite(parsed) ? parsed : 400;
  });
  useEffect(() => {
    const mp = maxPrice?.[0];
    if (mp == null) return;
    const parsed = parseInt(mp, 10);
    if (Number.isFinite(parsed)) setPrice(parsed);
  }, [maxPrice]);

  const nameToColor = (name: string) => getCatalogSwatch(name);
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!colorPickerOpen) return;
    const onDown = (e: MouseEvent) => {
      if (!colorPickerRef.current) return;
      if (!colorPickerRef.current.contains(e.target as Node)) {
        setColorPickerOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setColorPickerOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [colorPickerOpen]);

  const pathname = usePathname();
  useEffect(() => {
    // Reset filters on mount
    clearFilters();
    // If on a specific shop category with a default category filter, open the Categories group
    const segments = pathname?.split("/") || [];
    const cat = segments[2];
    if (cat && categoryFilter[cat] != null) {
      setOpenGroups((prev) => ({ ...prev, Categories: true }));
    }
  }, [clearFilters, pathname]);

  // Determine if current category should hide the "Categories" group
  const segments = pathname?.split("/") || [];
  const currentCat = segments[2];
  const hideCategories = ["shoes", "clothes", "accessories"].includes(
    currentCat
  );
  // Filter out the Categories group on specific category pages
  const visibleConfig = filterConfig.filter(
    (g) => !(g.title === "Categories" && hideCategories)
  );
  return (
    <aside className="w-full bg-white p-6 border-y border-stone-200 sticky top-16 max-h-[80vh] overflow-y-auto" data-agent-role="filter-sidebar" data-agent-hint="Use filters to narrow product results. Click group headers to expand/collapse. Select multiple options within each group.">
      {visibleConfig.map((group) => {
        const isOpen = openGroups[group.title];
        const clearGroup = () => {
          if (group.filterKey) {
            // clear only this group's selections
            useStyleFiltersStore.setState({
              [group.filterKey]: [] as string[],
            });
            if (group.title === "Max Price") setPrice(400);
          }
        };
        return (
          <div key={group.title} className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() =>
                  setOpenGroups((prev) => ({
                    ...prev,
                    [group.title]: !prev[group.title],
                  }))
                }
                className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 bg-transparent border-0 p-0 m-0 cursor-pointer rounded"
                style={{ flex: 1, textAlign: "left" }}
                aria-expanded={isOpen}
                aria-controls={`filter-group-${group.title.toLowerCase().replace(/\s+/g, '-')}`}
                aria-label={`${isOpen ? 'Collapse' : 'Expand'} ${group.title} filter group`}
                data-testid={`filter-group-toggle-${group.title.toLowerCase().replace(/\s+/g, '-')}`}
                data-agent-role="filter-group-toggle"
                data-agent-action="toggle-filter-group"
                data-agent-hint={`Click to ${isOpen ? 'collapse' : 'expand'} ${group.title} filter options`}
              >
                <span className="font-medium text-stone-900">{group.title}</span>
                <span className="text-stone-500 hover:text-stone-700 ml-2" aria-hidden="true">
                  {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </span>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearGroup();
                }}
                className="text-xs text-stone-600 hover:text-stone-900 transition-colors duration-200 cursor-pointer ml-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
                aria-label={`Clear ${group.title} filters`}
                data-testid={`filter-group-clear-${group.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                Clear
              </button>
            </div>
            {isOpen && (
              <div 
                id={`filter-group-${group.title.toLowerCase().replace(/\s+/g, '-')}`}
                className="space-y-2"
                role="group"
                aria-labelledby={`filter-group-${group.title.toLowerCase().replace(/\s+/g, '-')}-label`}
              >
                {group.title === "Color" && (
                  <div className="mb-2 relative" ref={colorPickerRef}>
                    {(() => {
                      const key = group.filterKey as keyof StyleFilters;
                      const selected = (filters as unknown as StyleFilters)[key] || [];
                      const label = selected.length
                        ? `${selected.slice(0, 2).join(", ")}${selected.length > 2 ? ` +${selected.length - 2}` : ""}`
                        : "Select colors";
                      return (
                        <div>
                          <button
                            type="button"
                            role="button"
                            aria-haspopup="listbox"
                            aria-expanded={colorPickerOpen}
                            aria-label="Color filter dropdown"
                            onClick={() => setColorPickerOpen((o) => !o)}
                            className="w-full flex items-center justify-between border border-stone-300 rounded-md px-3 py-2 text-sm hover:border-stone-400"
                            data-testid="filter-color-picker-button"
                          >
                            <span className="text-stone-700 truncate">{label}</span>
                            <span className="text-stone-400">{colorPickerOpen ? "▲" : "▼"}</span>
                          </button>
                          {colorPickerOpen && (
                            <div 
                              role="listbox"
                              aria-label="Color options"
                              className="absolute z-10 mt-2 w-full bg-white border border-stone-200 rounded-md shadow-lg max-h-64 overflow-y-auto"
                            >
                              <ul className="p-2 space-y-1" role="group">
                                {group.items.map((item) => {
                                  const isSelected = selected.includes(item.filterValue);
                                  return (
                                    <li key={`color-option-${item.title}`} role="option" aria-selected={isSelected}>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          toggleFilter({ key, value: item.filterValue });
                                        }}
                                        className={`w-full flex items-center gap-3 px-2 py-1.5 rounded hover:bg-stone-50 text-left ${
                                          isSelected ? "bg-stone-50" : ""
                                        }`}
                                        data-testid={`filter-color-option-${item.filterValue.toLowerCase().replace(/\s+/g, '-')}`}
                                      >
                                        <span
                                          className="inline-block h-4 w-4 rounded-full border border-stone-300"
                                          style={{ backgroundColor: nameToColor(item.filterValue) }}
                                        />
                                        <span className="text-sm text-stone-800 flex-1">{item.title}</span>
                                        {isSelected && (
                                          <span className="text-xs text-stone-600">Selected</span>
                                        )}
                                      </button>
                                    </li>
                                  );
                                })}
                              </ul>
                              <div className="flex items-center justify-between p-2 border-t border-stone-200">
                                <button
                                  type="button"
                                  onClick={() => setColorPickerOpen(false)}
                                  className="text-sm text-stone-700 hover:text-stone-900"
                                  data-testid="filter-color-picker-done"
                                >
                                  Done
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    useStyleFiltersStore.setState({ color: [] });
                                  }}
                                  className="text-sm text-stone-600 hover:text-stone-900"
                                  data-testid="filter-color-picker-clear"
                                >
                                  Clear
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </div>
                )}
                {/* Skip checkbox list for Color and Max Price groups since they have custom UI */}
                {group.title !== "Color" && group.title !== "Max Price" && group.items.map((item) => {
                  const key = group.filterKey as keyof StyleFilters;
                  const filterList = (filters as unknown as StyleFilters)[key];
                  const checked =
                    group.filterKey && filterList?.includes(item.filterValue);
                  return (
                    <label
                      key={item.title}
                      className="flex items-center cursor-pointer gap-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2 rounded p-1"
                    >
                      <Checkbox
                        className="mr-2"
                        checked={!!checked}
                        aria-label={item.title}
                        aria-checked={!!checked}
                        onCheckedChange={() =>
                          group.filterKey &&
                          toggleFilter({
                            key: group.filterKey as keyof StyleFilters,
                            value: item.filterValue,
                          })
                        }
                        data-testid={`filter-checkbox-${group.title.toLowerCase().replace(/\s+/g, '-')}-${item.filterValue.toLowerCase().replace(/\s+/g, '-')}`}
                        data-agent-role="filter-checkbox"
                        data-agent-action="toggle-filter"
                        data-agent-hint={`Click to ${checked ? 'remove' : 'apply'} ${item.title} filter. Multiple filters can be selected.`}
                      />
                      <span
                        className={
                          checked ? "text-stone-900 font-medium" : "text-stone-700"
                        }
                      >
                        {item.title}
                      </span>
                    </label>
                  );
                })}
                {group.title === "Max Price" && (
                  <div className="pt-2">
                    <div className="flex items-center justify-between text-sm text-stone-700 mb-2">
                      <span>$0</span>
                      <span className="font-medium">Up to ${price}</span>
                      <span>$400</span>
                    </div>
                    <label htmlFor="price-range" className="sr-only">Maximum price filter</label>
                    <input
                      id="price-range"
                      type="range"
                      min={0}
                      max={400}
                      step={5}
                      value={price}
                      onChange={(e) => {
                        const next = parseInt(e.target.value, 10);
                        setPrice(next);
                        useStyleFiltersStore.setState({ maxPrice: [String(next)] });
                      }}
                      className="w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Maximum price filter"
                      aria-valuemin={0}
                      aria-valuemax={400}
                      aria-valuenow={price}
                      aria-valuetext={`$${price}`}
                      data-testid="filter-price-range"
                      data-agent-role="price-range-slider"
                      data-agent-action="filter-by-price"
                      data-agent-hint="Drag slider to set maximum price. Range: $0-$400. Products above selected price will be hidden."
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </aside>
  );
}
