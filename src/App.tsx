/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Language, CategoryId, MenuItem } from './types';
import { MENU_ITEMS, CATEGORIES, CAFE_INFO } from './data/menuData';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CategoryNav } from './components/CategoryNav';
import { QuickFilters, FilterType } from './components/QuickFilters';
import { MenuCardView } from './components/MenuCardView';
import { MenuSheetView } from './components/MenuSheetView';
import { ItemDetailModal } from './components/ItemDetailModal';
import { QrCodeModal } from './components/QrCodeModal';
import { AboutSense } from './components/AboutSense';
import { Footer } from './components/Footer';
import { Heart, Sparkles, Filter, X, ArrowDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [activeFilterTag, setActiveFilterTag] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'cards' | 'sheet'>('cards');
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isQrOpen, setIsQrOpen] = useState<boolean>(false);
  const [showOnlyFavorites, setShowOnlyFavorites] = useState<boolean>(false);
  
  // LocalStorage for liked items
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('sense_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sense_favorites', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  // Update HTML direction and language
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = () => {
    setLang((prev) => (prev === 'ar' ? 'en' : 'ar'));
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Filtered menu items
  const filteredItems = useMemo(() => {
    return MENU_ITEMS.filter((item) => {
      // 1. Favorites filter
      if (showOnlyFavorites && !favorites.includes(item.id)) {
        return false;
      }

      // 2. Category filter
      if (selectedCategory !== 'all' && item.categoryId !== selectedCategory) {
        return false;
      }

      // 3. Sub-filter pills (signature, popular, ice, hot, matcha, boba)
      if (activeFilter === 'signature' && !item.isSignature) {
        return false;
      }
      if (activeFilter === 'popular' && !item.isPopular) {
        return false;
      }
      if (activeFilter === 'ice' && item.temp !== 'ice' && item.temp !== 'both') {
        return false;
      }
      if (activeFilter === 'hot' && item.temp !== 'hot' && item.temp !== 'both') {
        return false;
      }
      if (activeFilter === 'matcha' && item.categoryId !== 'matcha') {
        return false;
      }
      if (activeFilter === 'boba' && item.categoryId !== 'frappe') {
        return false;
      }

      // 4. Trending tag filter
      if (activeFilterTag) {
        const itemTagsEn = item.tagsEn || [];
        const itemTagsAr = item.tagsAr || [];
        const combined = [...itemTagsEn, ...itemTagsAr, item.nameAr, item.nameEn];
        const matchTag = combined.some((t) =>
          t.toLowerCase().includes(activeFilterTag.toLowerCase())
        );
        if (!matchTag) return false;
      }

      // 5. Search query matching
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inNameAr = item.nameAr.toLowerCase().includes(q);
        const inNameEn = item.nameEn.toLowerCase().includes(q);
        const inDescAr = (item.descriptionAr || '').toLowerCase().includes(q);
        const inDescEn = (item.descriptionEn || '').toLowerCase().includes(q);
        const inTagsAr = (item.tagsAr || []).some((t) => t.toLowerCase().includes(q));
        const inTagsEn = (item.tagsEn || []).some((t) => t.toLowerCase().includes(q));

        if (!inNameAr && !inNameEn && !inDescAr && !inDescEn && !inTagsAr && !inTagsEn) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCategory, searchQuery, activeFilter, activeFilterTag, showOnlyFavorites, favorites]);

  const isAr = lang === 'ar';

  const resetAllFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    setActiveFilter('all');
    setActiveFilterTag(null);
    setShowOnlyFavorites(false);
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    searchQuery !== '' ||
    activeFilter !== 'all' ||
    activeFilterTag !== null ||
    showOnlyFavorites;

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFCFB] text-[#1A1A1A]">
      {/* Top Sticky Navbar */}
      <Navbar
        lang={lang}
        onToggleLang={toggleLang}
        viewMode={viewMode}
        onChangeViewMode={setViewMode}
        onOpenQr={() => setIsQrOpen(true)}
      />

      <main className="flex-grow">
        {/* Minimalist Hero Section */}
        <HeroSection
          lang={lang}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilterTag={activeFilterTag}
          onSelectTag={setActiveFilterTag}
          totalItemsCount={MENU_ITEMS.length}
        />

        {/* Category Navigation Bar (Sticky) */}
        <CategoryNav
          selectedCategoryId={selectedCategory}
          onSelectCategory={(id) => {
            setSelectedCategory(id);
            if (showOnlyFavorites) setShowOnlyFavorites(false);
          }}
          lang={lang}
        />

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Sub Filters & Active Status Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#EAE7E2]">
            {/* Quick Filters */}
            <QuickFilters
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              lang={lang}
            />

            {/* Results count & Clear button */}
            <div className="flex items-center gap-3 shrink-0 text-xs text-[#8C8279]">
              {/* Favorites Only Toggle */}
              <button
                id="toggle-favorites-filter-btn"
                onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all ${
                  showOnlyFavorites
                    ? 'bg-[#1A1A1A] border-[#1A1A1A] text-rose-400 font-semibold shadow-xs'
                    : 'bg-[#FAF9F7] border-[#EAE7E2] text-[#1A1A1A] hover:border-[#1A1A1A]'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${showOnlyFavorites ? 'fill-current' : ''}`} />
                <span>
                  {isAr ? 'المفضلة' : 'Favorites'} ({favorites.length})
                </span>
              </button>

              <span className="font-serif-artistic italic text-sm text-[#8C8279]">
                {isAr
                  ? `عرض ${filteredItems.length} عنصر`
                  : `Showing ${filteredItems.length} items`}
              </span>

              {hasActiveFilters && (
                <button
                  id="reset-filters-btn"
                  onClick={resetAllFilters}
                  className="flex items-center gap-1 text-rose-700 hover:text-rose-900 font-semibold underline underline-offset-2"
                >
                  <X className="w-3 h-3" />
                  <span>{isAr ? 'إعادة ضبط' : 'Reset'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Active Category Title & Description */}
          <div className="py-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <h2 className="font-serif-artistic font-semibold text-2xl sm:text-3xl text-[#1A1A1A]">
                {showOnlyFavorites
                  ? (isAr ? 'العناصر المفضلة لديك' : 'Your Saved Favorites')
                  : isAr
                  ? CATEGORIES.find((c) => c.id === selectedCategory)?.nameAr
                  : CATEGORIES.find((c) => c.id === selectedCategory)?.nameEn}
              </h2>
              <p className="text-xs sm:text-sm text-[#8C8279] mt-1">
                {isAr
                  ? CATEGORIES.find((c) => c.id === selectedCategory)?.descriptionAr
                  : CATEGORIES.find((c) => c.id === selectedCategory)?.descriptionEn}
              </p>
            </div>

            {/* View Mode indicator badge */}
            <div className="text-xs uppercase tracking-widest text-[#8C8279] font-medium hidden sm:block">
              {viewMode === 'cards'
                ? (isAr ? 'نمط العرض: بطاقات مصورة' : 'View: Visual Cards')
                : (isAr ? 'نمط العرض: قائمة ورقية كلاسيكية' : 'View: Classic Paper Sheet')}
            </div>
          </div>

          {/* Menu Presentation: Cards vs Classic Sheet */}
          {viewMode === 'cards' ? (
            <MenuCardView
              items={filteredItems}
              lang={lang}
              onSelectItem={setSelectedItem}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
            />
          ) : (
            <MenuSheetView
              items={filteredItems}
              lang={lang}
              onSelectItem={setSelectedItem}
              onOpenQr={() => setIsQrOpen(true)}
            />
          )}

        </div>

        {/* About Sense Section */}
        <AboutSense lang={lang} />
      </main>

      {/* Item Detail Modal */}
      <ItemDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        lang={lang}
        isFavorite={selectedItem ? favorites.includes(selectedItem.id) : false}
        onToggleFavorite={toggleFavorite}
      />

      {/* QR Code Sharing Modal */}
      <QrCodeModal
        isOpen={isQrOpen}
        onClose={() => setIsQrOpen(false)}
        lang={lang}
      />

      {/* Footer */}
      <Footer lang={lang} />
    </div>
  );
}
