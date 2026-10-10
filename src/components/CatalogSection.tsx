import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, ArrowUpDown, X, Sparkles, Filter } from 'lucide-react';
import { Product, Category, CartItem } from '../types';
import { ProductCard } from './ProductCard';

interface CatalogSectionProps {
  products: Product[];
  categories: Category[];
  selectedCategoryId: string | null;
  onSelectCategory: (id: string | null) => void;
  onOpenProductModal: (product: Product) => void;
  onQuickAdd?: (product: Product) => void;
  cart?: CartItem[];
  onUpdateCartQuantity?: (product: Product, delta: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const CatalogSection: React.FC<CatalogSectionProps> = ({
  products,
  categories,
  selectedCategoryId,
  onSelectCategory,
  onOpenProductModal,
  onQuickAdd,
  cart = [],
  onUpdateCartQuantity,
  searchQuery,
  setSearchQuery,
}) => {
  const [selectedOccasion, setSelectedOccasion] = useState<string>('all');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyCouples, setOnlyCouples] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'newest'>('featured');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 350]);
  const [showMobileFilters, setShowMobileFilters] = useState<boolean>(false);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => p.active);

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.shortDescription.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategoryId) {
      result = result.filter((p) => p.category === selectedCategoryId);
    }

    // Occasion
    if (selectedOccasion !== 'all') {
      result = result.filter((p) => p.occasions?.includes(selectedOccasion));
    }

    // Couple filter
    if (onlyCouples) {
      result = result.filter((p) => p.isCoupleItem || p.isCoupleSection);
    }

    // In Stock
    if (onlyInStock) {
      result = result.filter((p) => p.stock > 0);
    }

    // Price range
    result = result.filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1]);

    // Sorting
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'newest') {
      result.sort((a, b) => b.id.localeCompare(a.id));
    } else {
      // featured
      result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
    }

    return result;
  }, [products, searchQuery, selectedCategoryId, selectedOccasion, onlyCouples, onlyInStock, priceRange, sortBy]);

  const resetAllFilters = () => {
    setSearchQuery('');
    onSelectCategory(null);
    setSelectedOccasion('all');
    setOnlyInStock(false);
    setOnlyCouples(false);
    setPriceRange([0, 350]);
    setSortBy('featured');
  };

  const hasActiveFilters =
    Boolean(searchQuery) ||
    Boolean(selectedCategoryId) ||
    selectedOccasion !== 'all' ||
    onlyInStock ||
    onlyCouples ||
    priceRange[0] > 0 ||
    priceRange[1] < 350;

  return (
    <section id="catalogo" className="py-16 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 text-stone-800 rounded-full text-xs font-semibold mb-2 border border-stone-200/70">
            <Sparkles className="w-3.5 h-3.5 text-[#D94E34]" />
            <span>Catálogo Completo</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight font-display">
            Todos nuestros productos
          </h2>
          <p className="text-sm text-stone-600 mt-1">
            Explora todos nuestros ramos, perfumes, disfraces y detalles con precios reales en soles peruanos
          </p>
        </div>

        {/* Search & Top Action Bar */}
        <div className="bg-white rounded-3xl border border-stone-200/80 p-3 sm:p-5 mb-8 shadow-xs space-y-3.5 animate-fade-in-up animation-delay-150">
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            
            {/* Search Input Field */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por ramo, Hot Wheels, disfraz, perfume o dedicatoria..."
                className="w-full pl-11 pr-10 py-3 text-xs sm:text-sm rounded-2xl border border-stone-200 bg-stone-50/50 text-stone-900 placeholder-stone-400 focus:outline-hidden focus:ring-2 focus:ring-[#D94E34]/30 focus:border-[#D94E34] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-900 p-0.5 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Controls: Sort and Mobile Filter Toggle */}
            <div className="flex items-center gap-2">
              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 bg-[#F6EFE5] rounded-xl px-3 py-2 border border-[#E6D7C2]">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#7A6455]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  aria-label="Ordenar productos"
                  className="bg-transparent text-xs font-semibold text-[#473429] focus:outline-hidden cursor-pointer"
                >
                  <option value="featured">Destacados</option>
                  <option value="price-asc">Precio: Menor a Mayor</option>
                  <option value="price-desc">Precio: Mayor a Menor</option>
                  <option value="newest">Novedades</option>
                </select>
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="sm:hidden p-2.5 bg-[#F6EFE5] rounded-xl border border-[#E6D7C2] text-[#473429] flex items-center gap-1 text-xs font-semibold cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filtros</span>
              </button>
            </div>

          </div>

          {/* Desktop Filter Row */}
          <div className="hidden sm:flex flex-wrap items-center gap-3 pt-2 border-t border-[#F0E6D8] text-xs">
            {/* Category Filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[#654E40]">Categoría:</span>
              <select
                value={selectedCategoryId || 'all'}
                onChange={(e) => onSelectCategory(e.target.value === 'all' ? null : e.target.value)}
                aria-label="Filtrar por categoría"
                className="p-1.5 rounded-lg border border-[#DACAB6] bg-white text-[#473429] font-medium cursor-pointer"
              >
                <option value="all">Todas</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Occasion Filter */}
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-[#654E40]">Ocasión:</span>
              <select
                value={selectedOccasion}
                onChange={(e) => setSelectedOccasion(e.target.value)}
                aria-label="Filtrar por ocasión"
                className="p-1.5 rounded-lg border border-[#DACAB6] bg-white text-[#473429] font-medium cursor-pointer"
              >
                <option value="all">Todas las ocasiones</option>
                <option value="aniversario">Aniversario</option>
                <option value="cumpleanos">Cumpleaños</option>
                <option value="san-valentin">San Valentín</option>
                <option value="halloween">Halloween</option>
                <option value="porque-si">Porque sí</option>
              </select>
            </div>

            {/* Couple Item Quick Toggle */}
            <label className="flex items-center gap-1.5 cursor-pointer select-none text-[#523E32] font-medium">
              <input
                type="checkbox"
                checked={onlyCouples}
                onChange={(e) => setOnlyCouples(e.target.checked)}
                className="rounded text-[#9A5B36] focus:ring-[#9A5B36]"
              />
              <span>Dúos para Parejas</span>
            </label>

            {/* In Stock Only */}
            <label className="flex items-center gap-1.5 cursor-pointer select-none text-[#523E32] font-medium">
              <input
                type="checkbox"
                checked={onlyInStock}
                onChange={(e) => setOnlyInStock(e.target.checked)}
                className="rounded text-[#9A5B36] focus:ring-[#9A5B36]"
              />
              <span>Solo en Stock</span>
            </label>

            {/* Reset button */}
            {hasActiveFilters && (
              <button
                onClick={resetAllFilters}
                className="ml-auto text-xs text-[#A84A22] hover:text-[#7C3517] font-semibold underline cursor-pointer"
              >
                Limpiar filtros
              </button>
            )}
          </div>

          {/* Mobile Filter Panel Dropdown */}
          {showMobileFilters && (
            <div className="sm:hidden pt-3 border-t border-[#F0E6D8] space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#473429] mb-1">Categoría:</label>
                <select
                  value={selectedCategoryId || 'all'}
                  onChange={(e) => onSelectCategory(e.target.value === 'all' ? null : e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#DACAB6] bg-white text-[#473429]"
                >
                  <option value="all">Todas las categorías</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-[#473429] mb-1">Ocasión:</label>
                <select
                  value={selectedOccasion}
                  onChange={(e) => setSelectedOccasion(e.target.value)}
                  className="w-full p-2 rounded-lg border border-[#DACAB6] bg-white text-[#473429]"
                >
                  <option value="all">Todas las ocasiones</option>
                  <option value="aniversario">Aniversario</option>
                  <option value="cumpleanos">Cumpleaños</option>
                  <option value="san-valentin">San Valentín</option>
                  <option value="halloween">Halloween</option>
                  <option value="porque-si">Porque sí</option>
                </select>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer text-[#473429]">
                  <input
                    type="checkbox"
                    checked={onlyCouples}
                    onChange={(e) => setOnlyCouples(e.target.checked)}
                    className="rounded text-[#9A5B36]"
                  />
                  <span>Dúos Parejas</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer text-[#473429]">
                  <input
                    type="checkbox"
                    checked={onlyInStock}
                    onChange={(e) => setOnlyInStock(e.target.checked)}
                    className="rounded text-[#9A5B36]"
                  />
                  <span>Solo en Stock</span>
                </label>
              </div>

              {hasActiveFilters && (
                <button
                  onClick={resetAllFilters}
                  className="w-full py-2 bg-[#F0E6D8] text-[#5A4538] font-semibold rounded-lg"
                >
                  Restablecer todos los filtros
                </button>
              )}
            </div>
          )}

        </div>

        {/* Results Count & Grid */}
        <div className="mb-4 flex items-center justify-between text-xs text-[#7A6455]">
          <span>
            Mostrando <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'producto' : 'productos'}
          </span>
          {selectedCategoryId && (
            <span className="font-medium text-[#9A5B36]">
              {categories.find(c => c.id === selectedCategoryId)?.name}
            </span>
          )}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 animate-fade-in-up animation-delay-200">
            {filteredProducts.map((product) => {
              const productCartCount = cart
                .filter((it) => it.productId === product.id)
                .reduce((s, it) => s + it.quantity, 0);

              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  categoryName={categories.find((c) => c.id === product.category)?.name}
                  onOpenProductModal={onOpenProductModal}
                  onQuickAdd={onQuickAdd}
                  cartCount={productCartCount}
                  onUpdateQuantity={onUpdateCartQuantity}
                />
              );
            })}
          </div>
        ) : (
          <div className="py-16 text-center bg-white rounded-3xl border border-stone-200/80 p-8 max-w-md mx-auto shadow-xs animate-fade-in">
            <div className="w-14 h-14 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-3.5 text-[#D94E34]">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-stone-900 font-display">
              No encontramos coincidencias
            </h3>
            <p className="text-xs text-stone-500 mt-1 mb-5 leading-relaxed">
              Prueba cambiando las palabras clave o restableciendo los filtros de búsqueda para ver más opciones.
            </p>
            <button
              onClick={resetAllFilters}
              className="px-5 py-2.5 bg-stone-900 text-white text-xs font-bold rounded-xl hover:bg-stone-800 transition-colors cursor-pointer shadow-xs"
            >
              Ver todos los productos
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
