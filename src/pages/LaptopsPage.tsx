import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Filter,
  X,
  Search,
  SlidersHorizontal,
  RotateCcw,
  Laptop,
} from 'lucide-react';
import { Product } from '../types';
import { StorageService, subscribeToStoreChanges } from '../services/storageService';
import { ProductCard } from '../components/common/ProductCard';


export const LaptopsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter States
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get('brand') ? [searchParams.get('brand')!] : []
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'All'
  );
  const [maxPrice, setMaxPrice] = useState<number>(350000);
  const [selectedRAMs, setSelectedRAMs] = useState<string[]>([]);
  const [selectedProcessors, setSelectedProcessors] = useState<string[]>([]);
  const [selectedStorage, setSelectedStorage] = useState<string[]>([]);
  const [selectedGraphics, setSelectedGraphics] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'popularity' | 'price-asc' | 'price-desc' | 'newest'>(
    'popularity'
  );

  const loadData = () => {
    StorageService.getProducts().then(setProducts);
  };

  useEffect(() => {
    loadData();
    const unsubscribe = subscribeToStoreChanges(loadData);
    return () => unsubscribe();
  }, []);

  // Sync url params if changed externally
  useEffect(() => {
    const urlBrand = searchParams.get('brand');
    if (urlBrand) setSelectedBrands([urlBrand]);

    const urlCat = searchParams.get('category');
    if (urlCat) setSelectedCategory(urlCat);

    const urlSearch = searchParams.get('search');
    if (urlSearch) setSearchQuery(urlSearch);
  }, [searchParams]);

  // Derived list of filter options from active products
  const brandsList = useMemo(() => Array.from(new Set(products.map((p) => p.brand))).sort(), [products]);
  const categoriesList = useMemo(
    () => ['All', ...Array.from(new Set(products.map((p) => p.category))).sort()],
    [products]
  );
  const ramOptions = ['8GB', '16GB', '32GB', '36GB'];
  const processorOptions = ['Intel Core i3', 'Intel Core i5', 'Intel Core i7', 'Intel Core i9', 'Intel Core Ultra', 'AMD Ryzen', 'Apple M', 'Snapdragon'];
  const storageOptions = ['256GB', '512GB', '1TB', '2TB'];
  const graphicsOptions = ['NVIDIA GeForce RTX', 'Intel Arc', 'Intel UHD', 'Apple', 'AMD Radeon', 'Adreno'];

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const toggleRAM = (ram: string) => {
    setSelectedRAMs((prev) =>
      prev.includes(ram) ? prev.filter((r) => r !== ram) : [...prev, ram]
    );
  };

  const toggleProcessor = (cpu: string) => {
    setSelectedProcessors((prev) =>
      prev.includes(cpu) ? prev.filter((c) => c !== cpu) : [...prev, cpu]
    );
  };

  const toggleStorage = (st: string) => {
    setSelectedStorage((prev) =>
      prev.includes(st) ? prev.filter((s) => s !== st) : [...prev, st]
    );
  };

  const toggleGraphics = (gpu: string) => {
    setSelectedGraphics((prev) =>
      prev.includes(gpu) ? prev.filter((g) => g !== gpu) : [...prev, gpu]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedBrands([]);
    setSelectedCategory('All');
    setMaxPrice(350000);
    setSelectedRAMs([]);
    setSelectedProcessors([]);
    setSelectedStorage([]);
    setSelectedGraphics([]);
    setSortBy('popularity');
    setSearchParams({});
  };

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.processor.toLowerCase().includes(q) ||
          p.ram.toLowerCase().includes(q) ||
          p.storage.toLowerCase().includes(q) ||
          p.graphics.toLowerCase().includes(q);
        if (!matches) return false;
      }

      // Brand
      if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) {
        return false;
      }

      // Category
      if (selectedCategory !== 'All' && !p.category.toLowerCase().includes(selectedCategory.toLowerCase())) {
        return false;
      }

      // Max Price
      if (p.price > maxPrice) {
        return false;
      }

      // RAM
      if (selectedRAMs.length > 0) {
        const matchesRam = selectedRAMs.some((r) => p.ram.includes(r));
        if (!matchesRam) return false;
      }

      // Processor
      if (selectedProcessors.length > 0) {
        const matchesCpu = selectedProcessors.some((cpu) =>
          p.processor.toLowerCase().includes(cpu.toLowerCase())
        );
        if (!matchesCpu) return false;
      }

      // Storage
      if (selectedStorage.length > 0) {
        const matchesStorage = selectedStorage.some((st) => p.storage.includes(st));
        if (!matchesStorage) return false;
      }

      // Graphics
      if (selectedGraphics.length > 0) {
        const matchesGpu = selectedGraphics.some((gpu) =>
          p.graphics.toLowerCase().includes(gpu.toLowerCase())
        );
        if (!matchesGpu) return false;
      }

      return true;
    });

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popularity':
      default:
        result.sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount);
        break;
    }

    return result;
  }, [
    products,
    searchQuery,
    selectedBrands,
    selectedCategory,
    maxPrice,
    selectedRAMs,
    selectedProcessors,
    selectedStorage,
    selectedGraphics,
    sortBy,
  ]);

  const activeFiltersCount =
    (selectedBrands.length ? 1 : 0) +
    (selectedCategory !== 'All' ? 1 : 0) +
    (maxPrice < 350000 ? 1 : 0) +
    (selectedRAMs.length ? 1 : 0) +
    (selectedProcessors.length ? 1 : 0) +
    (selectedStorage.length ? 1 : 0) +
    (selectedGraphics.length ? 1 : 0) +
    (searchQuery ? 1 : 0);

  const FilterPanelContent = () => (
    <div className="space-y-6 text-sm">
      {/* Category Filter */}
      <div>
        <h4 className="font-semibold text-white mb-2.5 text-xs uppercase tracking-wider text-purple-400">
          Category
        </h4>
        <div className="space-y-1">
          {categoriesList.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
                selectedCategory === cat
                  ? 'bg-purple-900/60 text-purple-200 font-semibold border border-purple-500/30'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <h4 className="font-semibold text-white mb-2.5 text-xs uppercase tracking-wider text-purple-400">
          Brand
        </h4>
        <div className="space-y-1.5">
          {brandsList.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2.5 text-xs text-zinc-300 hover:text-white cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-purple-600 focus:ring-purple-500 rounded accent-purple-600"
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-white text-xs uppercase tracking-wider text-purple-400">
            Max Price
          </h4>
          <span className="text-xs font-bold text-zinc-200">
            ₹{maxPrice.toLocaleString('en-IN')}
          </span>
        </div>
        <input
          type="range"
          min="30000"
          max="350000"
          step="5000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-purple-500 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
          <span>₹30,000</span>
          <span>₹3,50,000</span>
        </div>
      </div>

      {/* RAM Filter */}
      <div>
        <h4 className="font-semibold text-white mb-2.5 text-xs uppercase tracking-wider text-purple-400">
          Memory (RAM)
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {ramOptions.map((ram) => {
            const isSelected = selectedRAMs.includes(ram);
            return (
              <button
                key={ram}
                type="button"
                onClick={() => toggleRAM(ram)}
                className={`py-1 px-2 rounded-lg text-xs font-medium border text-center transition ${
                  isSelected
                    ? 'bg-purple-900/60 text-purple-200 border-purple-500/50'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                {ram}
              </button>
            );
          })}
        </div>
      </div>

      {/* Processor Filter */}
      <div>
        <h4 className="font-semibold text-white mb-2.5 text-xs uppercase tracking-wider text-purple-400">
          Processor Family
        </h4>
        <div className="space-y-1.5">
          {processorOptions.map((cpu) => (
            <label
              key={cpu}
              className="flex items-center gap-2.5 text-xs text-zinc-300 hover:text-white cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={selectedProcessors.includes(cpu)}
                onChange={() => toggleProcessor(cpu)}
                className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-purple-600 accent-purple-600"
              />
              <span>{cpu}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Storage Filter */}
      <div>
        <h4 className="font-semibold text-white mb-2.5 text-xs uppercase tracking-wider text-purple-400">
          Storage Capacity
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {storageOptions.map((st) => {
            const isSelected = selectedStorage.includes(st);
            return (
              <button
                key={st}
                type="button"
                onClick={() => toggleStorage(st)}
                className={`py-1 px-2 rounded-lg text-xs font-medium border text-center transition ${
                  isSelected
                    ? 'bg-purple-900/60 text-purple-200 border-purple-500/50'
                    : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-white'
                }`}
              >
                {st}
              </button>
            );
          })}
        </div>
      </div>

      {/* Graphics Filter */}
      <div>
        <h4 className="font-semibold text-white mb-2.5 text-xs uppercase tracking-wider text-purple-400">
          Graphics Card
        </h4>
        <div className="space-y-1.5">
          {graphicsOptions.map((gpu) => (
            <label
              key={gpu}
              className="flex items-center gap-2.5 text-xs text-zinc-300 hover:text-white cursor-pointer select-none"
            >
              <input
                type="checkbox"
                checked={selectedGraphics.includes(gpu)}
                onChange={() => toggleGraphics(gpu)}
                className="w-4 h-4 rounded bg-zinc-800 border-zinc-700 text-purple-600 accent-purple-600"
              />
              <span>{gpu}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Clear Filters Button */}
      {activeFiltersCount > 0 && (
        <button
          onClick={clearAllFilters}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset All Filters</span>
        </button>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* HEADER & SEARCH BAR */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              All Laptops & Ultrabooks
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Showing {filteredProducts.length} high-performance laptops
            </p>
          </div>

          {/* SEARCH INPUT */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, specs, brand..."
              className="w-full bg-[#131520] border border-zinc-700/80 focus:border-purple-500 rounded-xl pl-10 pr-9 py-2.5 text-xs sm:text-sm text-white placeholder-zinc-500 focus:outline-none transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* CONTROLS ROW */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#11131c] border border-zinc-800">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-950/60 border border-purple-500/30 text-xs font-semibold text-purple-200"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
            </button>

            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs text-purple-400 hover:text-purple-300 hover:bg-purple-950/30 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Clear ({activeFiltersCount})</span>
              </button>
            )}
          </div>

          {/* SORT DROPDOWN */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-zinc-400 hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#181a26] border border-zinc-700/80 text-zinc-200 text-xs rounded-xl px-3 py-1.5 focus:outline-none focus:border-purple-500"
            >
              <option value="popularity">Most Popular & Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest Releases</option>
            </select>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT: SIDEBAR + GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* DESKTOP FILTER SIDEBAR */}
        <div className="hidden lg:block lg:col-span-1 bg-[#11131d] border border-zinc-800/80 rounded-2xl p-6 sticky top-28 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
            <div className="flex items-center gap-2 font-bold text-white text-sm">
              <Filter className="w-4 h-4 text-purple-400" />
              <span>Filter Specifications</span>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="text-[11px] text-purple-400 hover:text-purple-300"
              >
                Clear
              </button>
            )}
          </div>

          <FilterPanelContent />
        </div>

        {/* PRODUCTS GRID */}
        <div className="lg:col-span-3">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="bg-[#11131c] border border-zinc-800 rounded-3xl p-12 text-center">
              <Laptop className="w-16 h-16 text-zinc-600 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-white mb-2">No Laptops Found</h3>
              <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto mb-6">
                We couldn't find any laptops matching your active filter criteria. Try resetting your price slider or clearing filters.
              </p>
              <button
                onClick={clearAllFilters}
                className="purple-gradient-btn px-6 py-2.5 rounded-xl text-xs font-semibold text-white shadow-lg shadow-purple-900/50"
              >
                Reset All Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE FILTER MODAL DRAWER */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-xs bg-[#0f111a] h-full p-6 overflow-y-auto border-r border-purple-500/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800 mb-6">
                <div className="flex items-center gap-2 font-bold text-white text-sm">
                  <Filter className="w-4 h-4 text-purple-400" />
                  <span>Filter Laptops</span>
                </div>
                <button
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <FilterPanelContent />
            </div>

            <div className="pt-6 border-t border-zinc-800 mt-6">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-500 shadow-md shadow-purple-900/40"
              >
                Apply Filters ({filteredProducts.length} Results)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
