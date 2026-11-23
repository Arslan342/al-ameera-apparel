"use client";

import { useState, useMemo } from "react";
import { Search, SlidersHorizontal, X, AlertCircle } from "lucide-react";
import ProductCard, { ProductCardProps } from "./ProductCard";
import Reveal from "@/components/motion/Reveal";

interface CategoryOption {
  id: string;
  name: string;
  slug: string;
  count?: number;
}

interface ProductCatalogClientProps {
  initialProducts: ProductCardProps[];
  categories: CategoryOption[];
  selectedCategorySlug?: string;
}

export default function ProductCatalogClient({
  initialProducts,
  categories,
  selectedCategorySlug = "",
}: ProductCatalogClientProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(selectedCategorySlug);
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    initialProducts.forEach((p) => {
      if (p.category?.slug) {
        counts[p.category.slug] = (counts[p.category.slug] || 0) + 1;
      }
    });
    return counts;
  }, [initialProducts]);

  const filteredProducts = useMemo(() => {
    return initialProducts.filter((product) => {
      if (selectedCategory && product.category?.slug !== selectedCategory) {
        return false;
      }

      if (selectedAvailability && product.availability !== selectedAvailability) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDesc = product.description.toLowerCase().includes(query);
        const matchesSku = product.sku ? product.sku.toLowerCase().includes(query) : false;
        const matchesFabric = product.fabricDetails
          ? product.fabricDetails.toLowerCase().includes(query)
          : false;

        if (!matchesName && !matchesDesc && !matchesSku && !matchesFabric) {
          return false;
        }
      }

      return true;
    });
  }, [initialProducts, selectedCategory, selectedAvailability, searchQuery]);

  const sortedProducts = useMemo(() => {
    const list = [...filteredProducts];
    if (sortBy === "name_asc") {
      list.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "name_desc") {
      list.sort((a, b) => b.name.localeCompare(a.name));
    }
    return list;
  }, [filteredProducts, sortBy]);

  const hasActiveFilters = Boolean(searchQuery || selectedCategory || selectedAvailability);

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedAvailability("");
    setSortBy("newest");
  };

  return (
    <div className="space-y-8">
      {/* Floating Frosted Glass Search & Filter Toolbar */}
      <div className="glass-panel-strong p-5 sm:p-6 rounded-[24px] space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-[#64748b] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by garment name, GSM, fabric, or SKU..."
              className="glass-input w-full pl-10 pr-9 py-2.5 rounded-xl text-sm text-[#0d1626] placeholder:text-[#748299]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-[#0d1626]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Availability Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              aria-label="Filter by production availability"
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm text-[#334155]"
            >
              <option value="">All Availability</option>
              <option value="IN_PRODUCTION">In Production</option>
              <option value="MADE_TO_ORDER">Made to Order (OEM)</option>
              <option value="SAMPLE_AVAILABLE">Sample Ready</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="md:col-span-3">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort products"
              className="glass-input w-full px-3.5 py-2.5 rounded-xl text-sm text-[#334155]"
            >
              <option value="newest">Featured First</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="pt-3 border-t border-slate-900/[0.07] flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748b] mr-1 flex items-center gap-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Divisions</span>
          </span>

          <button
            type="button"
            onClick={() => setSelectedCategory("")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
              !selectedCategory
                ? "bg-[#0f1a2e] text-white shadow-sm"
                : "bg-white/55 hover:bg-white/90 text-[#334155] border border-white/80"
            }`}
          >
            All ({initialProducts.length})
          </button>

          {categories.map((cat) => {
            const count = categoryCounts[cat.slug] || 0;
            const isSelected = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(isSelected ? "" : cat.slug)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#0f1a2e] text-white shadow-sm"
                    : "bg-white/55 hover:bg-white/90 text-[#334155] border border-white/80"
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="ml-auto inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-800 font-semibold py-1 px-2 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-[#526075] px-1">
        <div>
          Showing <span className="font-semibold text-[#0d1626]">{sortedProducts.length}</span> of{" "}
          <span className="font-semibold text-[#0d1626]">{initialProducts.length}</span> garment
          specifications
        </div>
        {selectedCategory && (
          <div>
            Division:{" "}
            <span className="font-semibold text-[#1d3a63]">
              {categories.find((c) => c.slug === selectedCategory)?.name || selectedCategory}
            </span>
          </div>
        )}
      </div>

      {/* Products Grid */}
      {sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product, idx) => (
            <Reveal key={product.id} delay={(idx % 4) * 60} direction="up" className="h-full">
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="glass-panel-strong rounded-[26px] p-12 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#0f1a2e]/[0.06] text-[#526075] mx-auto flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="font-display text-lg font-bold text-[#0d1626]">
            No garments match your filter criteria
          </h3>
          <p className="text-sm text-[#526075] max-w-md mx-auto">
            Try clearing your search terms or selecting another garment division.
          </p>
          <button
            type="button"
            onClick={clearAllFilters}
            className="glass-btn-primary px-5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
