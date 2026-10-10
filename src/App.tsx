/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Product,
  Category,
  Promotion,
  StoreSettings,
  FAQ,
  CartItem,
  BootstrapResponse,
} from './types';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { CategoryVisuals } from './components/CategoryVisuals';
import { CoupleSection } from './components/CoupleSection';
import { OccasionsSection } from './components/OccasionsSection';
import { CatalogSection } from './components/CatalogSection';
import { ProductDetailModal } from './components/ProductDetailModal';
import { GiftFinderModal } from './components/GiftFinderModal';
import { CartDrawer } from './components/CartDrawer';
import { FaqSection } from './components/FaqSection';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { SearchModal } from './components/SearchModal';
import { AdminPanel } from './components/AdminPanel';
import { StickyCartBar } from './components/StickyCartBar';
import { Sparkles, Loader2 } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  // Cart state persisted in localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('inspomood_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('inspomood_cart', JSON.stringify(cart));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [cart]);

  // Modal states
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isGiftFinderOpen, setIsGiftFinderOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Filter & Search states
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch bootstrap data
  const loadBootstrapData = async () => {
    try {
      const res = await fetch('/api/bootstrap');
      const data: BootstrapResponse = await res.json();
      setProducts(data.products || []);
      setCategories(data.categories || []);
      setPromotions(data.promotions || []);
      setSettings(data.settings);
      setFaqs(data.faqs || []);
    } catch (err) {
      console.error('Error fetching bootstrap data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBootstrapData();
  }, []);

  // Cart Operations
  const handleAddToCart = (item: CartItem) => {
    setCart((prev) => {
      // Find matching item by composite key
      const existingIdx = prev.findIndex(
        (it) =>
          it.productId === item.productId &&
          it.selectedVariantId === item.selectedVariantId &&
          JSON.stringify(it.coupleSizes) === JSON.stringify(item.coupleSizes) &&
          it.singleSize === item.singleSize &&
          JSON.stringify(it.bouquetConfig) === JSON.stringify(item.bouquetConfig) &&
          JSON.stringify(it.personalizedValues) === JSON.stringify(item.personalizedValues)
      );

      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx].quantity += item.quantity;
        return copy;
      }
      return [...prev, item];
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((it) => {
          if (it.id === id) {
            const newQty = it.quantity + delta;
            return newQty > 0 ? { ...it, quantity: newQty } : null;
          }
          return it;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveItem = (id: string) => {
    setCart((prev) => prev.filter((it) => it.id !== id));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Quick Add handler for rapid multi-product addition directly from cards
  const handleQuickAdd = (product: Product) => {
    // If it's a couple item, open modal so user can choose both person sizes
    if (product.isCoupleItem) {
      setSelectedProduct(product);
      return;
    }

    const newItem: CartItem = {
      id: `${product.id}-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      productId: product.id,
      name: product.name,
      category: product.category,
      unitBasePrice: product.price,
      extraCharges: 0,
      finalUnitPrice: product.price,
      quantity: 1,
      image: product.images?.[0] || '',
    };
    handleAddToCart(newItem);
  };

  const handleUpdateProductQuantity = (product: Product, delta: number) => {
    const existing = cart.find((it) => it.productId === product.id);
    if (existing) {
      handleUpdateQuantity(existing.id, delta);
    } else if (delta > 0) {
      handleQuickAdd(product);
    }
  };

  // Scroll to section helper
  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const totalCartItemsCount = cart.reduce((acc, it) => acc + it.quantity, 0);

  if (loading || !settings) {
    return (
      <div className="min-h-screen bg-[#FAFAF7] flex flex-col items-center justify-center space-y-4">
        <div className="w-14 h-14 rounded-3xl bg-rose-50 flex items-center justify-center text-[#D94E34] animate-pulse border border-rose-100 shadow-sm">
          <Sparkles className="w-7 h-7 text-[#D94E34]" />
        </div>
        <p className="text-xs font-bold text-stone-600 tracking-wider uppercase">
          Cargando InspoMood...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col font-sans selection:bg-rose-500/20 selection:text-stone-900">
      
      {/* 1. Header (Top Bar Contract) */}
      <Header
        settings={settings}
        promotions={promotions}
        cartCount={totalCartItemsCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenGiftFinder={() => setIsGiftFinderOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onSelectCategory={(catId) => {
          setSelectedCategoryId(catId);
          scrollToSection('catalogo');
        }}
        onScrollToSection={scrollToSection}
      />

      {/* Main Content */}
      <main className="flex-1">
        
        {/* 2. Hero Section */}
        <Hero
          settings={settings}
          onExplore={() => scrollToSection('catalogo')}
          onOpenGiftFinder={() => setIsGiftFinderOpen(true)}
        />

        {/* 3. Category Visuals Grid */}
        <CategoryVisuals
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={(id) => {
            setSelectedCategoryId(id);
            scrollToSection('catalogo');
          }}
        />

        {/* 4. Section: Para Disfrutar de a Dos (Couple spotlight) */}
        <CoupleSection
          products={products}
          onOpenProductModal={setSelectedProduct}
          onExploreCategory={(slug) => {
            setSelectedCategoryId(slug);
            scrollToSection('catalogo');
          }}
          onQuickAdd={handleQuickAdd}
          cart={cart}
          onUpdateCartQuantity={handleUpdateProductQuantity}
        />

        {/* 5. Section: Ideas por Ocasión */}
        <OccasionsSection
          products={products}
          onOpenProductModal={setSelectedProduct}
          onQuickAdd={handleQuickAdd}
          cart={cart}
          onUpdateCartQuantity={handleUpdateProductQuantity}
        />

        {/* 6. Section: Full Catalog & Search */}
        <CatalogSection
          products={products}
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
          onOpenProductModal={setSelectedProduct}
          onQuickAdd={handleQuickAdd}
          cart={cart}
          onUpdateCartQuantity={handleUpdateProductQuantity}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />

        {/* 7. Section: Preguntas Frecuentes (FAQs) */}
        {faqs.length > 0 && <FaqSection faqs={faqs} />}

      </main>

      {/* 8. Footer */}
      <Footer
        settings={settings}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onScrollToCatalog={() => scrollToSection('catalogo')}
      />

      {/* 9. Floating WhatsApp button (adjusts position when sticky bar is active) */}
      <FloatingWhatsApp settings={settings} hasStickyCart={cart.length > 0} />

      {/* 10. Sticky Cart Bar (Multi-item order launcher) */}
      <StickyCartBar
        cart={cart}
        settings={settings}
        onOpenCart={() => setIsCartOpen(true)}
      />

      {/* Modals & Overlays */}
      {/* Product Detail PDP Modal */}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          settings={settings}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onSelectProduct={setSelectedProduct}
          allProducts={products}
        />
      )}

      {/* Cart & Checkout Slide-Over */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        settings={settings}
        promotions={promotions}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        products={products}
        onSelectProduct={setSelectedProduct}
        onViewAllCatalog={(term) => {
          setSearchQuery(term);
          scrollToSection('catalogo');
        }}
      />

      {/* Gift Finder Modal */}
      <GiftFinderModal
        isOpen={isGiftFinderOpen}
        onClose={() => setIsGiftFinderOpen(false)}
        products={products}
        onOpenProductModal={setSelectedProduct}
      />

      {/* Admin Panel */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        categories={categories}
        settings={settings}
        onRefreshData={loadBootstrapData}
      />

    </div>
  );
}
