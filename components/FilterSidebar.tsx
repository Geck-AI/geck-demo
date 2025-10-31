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
    <aside className="w-full bg-white p-6 border-y border-stone-200 sticky top-16 max-h-[80vh] overflow-y-auto">
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
                className="flex items-center gap-2 focus:outline-none bg-transparent border-0 p-0 m-0 cursor-pointer"
                style={{ flex: 1, textAlign: "left" }}
              >
                <span className="font-medium text-stone-900">{group.title}</span>
                <span className="text-stone-500 hover:text-stone-700 ml-2">
                  {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                </span>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  clearGroup();
                }}
                className="text-xs text-stone-600 hover:text-stone-900 transition-colors duration-200 cursor-pointer ml-2"
              >
                Clear
              </button>
            </div>
            {isOpen && (
              <div className="space-y-2">
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
                            onClick={() => setColorPickerOpen((o) => !o)}
                            className="w-full flex items-center justify-between border border-stone-300 rounded-md px-3 py-2 text-sm hover:border-stone-400"
                          >
                            <span className="text-stone-700 truncate">{label}</span>
                            <span className="text-stone-400">{colorPickerOpen ? "▲" : "▼"}</span>
                          </button>
                          {colorPickerOpen && (
                            <div className="absolute z-10 mt-2 w-full bg-white border border-stone-200 rounded-md shadow-lg max-h-64 overflow-y-auto">
                              <ul className="p-2 space-y-1">
                                {group.items.map((item) => {
                                  const isSelected = selected.includes(item.filterValue);
                                  return (
                                    <li key={`color-option-${item.title}`}>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          toggleFilter({ key, value: item.filterValue });
                                        }}
                                        className={`w-full flex items-center gap-3 px-2 py-1.5 rounded hover:bg-stone-50 text-left ${
                                          isSelected ? "bg-stone-50" : ""
                                        }`}
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
                                >
                                  Done
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    useStyleFiltersStore.setState({ color: [] });
                                  }}
                                  className="text-sm text-stone-600 hover:text-stone-900"
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
                      className="flex items-center cursor-pointer gap-2"
                    >
                      <Checkbox
                        className="mr-2"
                        checked={!!checked}
                        onCheckedChange={() =>
                          group.filterKey &&
                          toggleFilter({
                            key: group.filterKey as keyof StyleFilters,
                            value: item.filterValue,
                          })
                        }
                      />
                      <span
                        className={
                          checked ? "text-stone-900" : "text-stone-700"
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
                    <input
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
                      className="w-full"
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
