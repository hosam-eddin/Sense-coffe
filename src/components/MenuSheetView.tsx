import React, { useState, useEffect } from 'react';
import { MenuItem, Language } from '../types';
import { SenseLogo } from './SenseLogo';
import { WaveGraphic } from './WaveGraphic';
import { QrCode, ChevronLeft, ChevronRight, BookOpen, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MenuSheetViewProps {
  items: MenuItem[];
  lang: Language;
  onSelectItem: (item: MenuItem) => void;
  onOpenQr: () => void;
}

export const MenuSheetView: React.FC<MenuSheetViewProps> = ({
  items,
  lang,
  onSelectItem,
  onOpenQr,
}) => {
  const isAr = lang === 'ar';
  const [currentPage, setCurrentPage] = useState<1 | 2>(1);
  const [direction, setDirection] = useState<number>(0);
  const [viewAllTogether, setViewAllTogether] = useState<boolean>(false);

  // Group items by category to render classic menu sections
  const dripItems = items.filter((i) => i.categoryId === 'drip');
  const hotCoffeeItems = items.filter((i) => i.categoryId === 'coffee');
  const matchaItems = items.filter((i) => i.categoryId === 'matcha');
  const iceCoffeeItems = items.filter((i) => i.categoryId === 'ice-coffee');
  const frappeItems = items.filter((i) => i.categoryId === 'frappe');
  const mojitoItems = items.filter((i) => i.categoryId === 'mojito');
  const smoothieItems = items.filter((i) => i.categoryId === 'smoothies');
  const bakeryItems = items.filter((i) => i.categoryId === 'bakery');

  const goToPage = (page: 1 | 2) => {
    if (page === currentPage) return;
    setDirection(page > currentPage ? 1 : -1);
    setCurrentPage(page);
  };

  const nextPage = () => {
    if (currentPage < 2) {
      setDirection(1);
      setCurrentPage(2);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setDirection(-1);
      setCurrentPage(1);
    }
  };

  // Keyboard navigation for flipping pages
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        if (isAr) prevPage();
        else nextPage();
      } else if (e.key === 'ArrowLeft') {
        if (isAr) nextPage();
        else prevPage();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isAr]);

  const renderItemList = (sectionTitleEn: string, sectionTitleAr: string, list: MenuItem[], sublabel?: string) => {
    if (list.length === 0) return null;

    return (
      <div className="mb-8 sm:mb-10">
        <div className="flex items-baseline justify-between border-b border-[#1A1A1A] pb-2 mb-4 sm:mb-5">
          <div>
            <h3 className="font-serif-artistic text-lg sm:text-xl md:text-2xl text-[#1A1A1A] tracking-tight font-semibold">
              {isAr ? sectionTitleAr : sectionTitleEn}
            </h3>
            {sublabel && (
              <span className="text-[10px] uppercase tracking-widest font-medium text-[#8C8279] block mt-0.5">
                {sublabel}
              </span>
            )}
          </div>
          <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-[#8C8279]">
            {isAr ? 'السعر (ج.م)' : 'EGP'}
          </span>
        </div>

        <ul className="space-y-3 sm:space-y-3.5">
          {list.map((item) => (
            <li
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="group flex items-baseline justify-between gap-2 sm:gap-3 p-1.5 rounded-lg hover:bg-[#FAF9F7] cursor-pointer transition-colors"
            >
              <div className="flex flex-col flex-grow min-w-0">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <span className="font-medium text-xs sm:text-sm text-[#1A1A1A] group-hover:text-[#8C6D46] transition-colors truncate">
                    {isAr ? item.nameAr : item.nameEn}
                  </span>

                  {item.isSignature && (
                    <span className="shrink-0 inline-flex items-center text-[9px] px-1.5 py-0.2 rounded bg-[#1A1A1A] text-[#FDFCFB] font-medium uppercase tracking-wider">
                      ★ Signature
                    </span>
                  )}

                  {item.temp === 'both' && (
                    <span className="shrink-0 text-[10px] text-[#8C8279] hidden sm:inline">
                      ({isAr ? 'ساخن / بارد' : 'Hot or Ice'})
                    </span>
                  )}
                </div>

                {/* Subtitle / notes */}
                {(item.descriptionEn || item.descriptionAr) && (
                  <span className="text-[10px] text-[#8C8279] truncate mt-0.5">
                    {isAr ? item.nameEn : item.descriptionEn || item.descriptionAr}
                  </span>
                )}
              </div>

              {/* Dotted Leader Line */}
              <div className="flex-grow border-b border-dotted border-[#D4CEC6] mx-1 min-w-[15px] opacity-70"></div>

              {/* Price */}
              <div className="flex items-baseline gap-1 shrink-0">
                <span className="font-serif-artistic italic text-base sm:text-lg text-[#1A1A1A] font-semibold">
                  {item.price}
                </span>
                <span className="text-[9px] font-sans text-[#8C8279]">
                  {isAr ? 'ج.م' : 'EGP'}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  // Render Page 1 Content: Specialty Drip, Hot Coffee, Matcha Bar, Ice Coffee
  const renderPage1Content = () => (
    <div className="relative bg-[#FFFFFF] rounded-2xl border border-[#EAE7E2] p-4 sm:p-8 md:p-12 shadow-xs overflow-hidden">
      {/* Editorial Decorative Spine Border */}
      <div className={`absolute top-0 bottom-0 ${isAr ? 'right-0 border-r-4' : 'left-0 border-l-4'} border-[#1A1A1A]/20 pointer-events-none`}></div>

      {/* Header Branding */}
      <div className="flex flex-col items-center text-center pb-6 sm:pb-8 border-b border-[#EAE7E2] mb-6 sm:mb-8">
        <div className="flex items-center justify-between w-full text-[10px] uppercase tracking-[0.25em] text-[#8C8279] mb-4">
          <span className="font-bold text-[#1A1A1A]">Vol. 01</span>
          <span>Sense Specialty House</span>
          <span>Daily Roast</span>
        </div>

        <SenseLogo size="lg" showMonogram={false} />
        
        <div className="h-[1px] w-16 bg-[#1A1A1A] mx-auto my-3"></div>

        <p className="text-xs uppercase tracking-[0.25em] font-semibold text-[#1A1A1A]">
          {isAr ? 'قائمة القهوة المختصة والماتشا' : 'Specialty Coffee & Matcha Bar'}
        </p>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        {/* Left Column */}
        <div>
          {renderItemList('Drip Coffee', 'القهوة المقطرة V60', dripItems, isAr ? 'محاصيل مختصة واستخلاص يدوي' : 'Manual Artisanal Pour-Over')}
          {renderItemList('Coffee Classics', 'القهوة الكلاسيكية والساخنة', hotCoffeeItems)}
        </div>

        {/* Right Column */}
        <div>
          {renderItemList('Matcha Bar', 'بار الماتشا والكلاود', matchaItems, isAr ? 'ماتشا يابانية فاخرة' : 'Ceremonial Japanese Grade')}
          {renderItemList('Ice Coffee', 'القهوة المثلجة', iceCoffeeItems, isAr ? 'إسبريسو منعش مع حليب بارد ونكهات' : 'Chilled Signature Espressos')}
        </div>
      </div>

      {/* Bottom Wave with Tagline */}
      <div className="mt-6 sm:mt-8 pt-4 border-t border-[#EAE7E2]">
        <WaveGraphic withTagline={true} lang={lang} />
      </div>

      {/* Page Footer Note */}
      <div className="mt-4 flex items-center justify-between text-[10px] text-[#8C8279] uppercase tracking-widest pt-2">
        <span>{isAr ? 'صفحة 1 من 2' : 'Page 1 of 2'}</span>
        <span>Sense — New Damietta</span>
      </div>
    </div>
  );

  // Render Page 2 Content: Frappes, Mojitos, Smoothies & Artisanal Bakery
  const renderPage2Content = () => (
    <div className="relative bg-[#FFFFFF] rounded-2xl border border-[#EAE7E2] p-4 sm:p-8 md:p-12 shadow-xs overflow-hidden">
      {/* Editorial Decorative Spine Border */}
      <div className={`absolute top-0 bottom-0 ${isAr ? 'right-0 border-r-4' : 'left-0 border-l-4'} border-[#1A1A1A]/20 pointer-events-none`}></div>

      {/* Header Branding */}
      <div className="flex flex-col items-center text-center pb-6 sm:pb-8 border-b border-[#EAE7E2] mb-6 sm:mb-8">
        <div className="flex items-center justify-between w-full text-[10px] uppercase tracking-[0.25em] text-[#8C8279] mb-4">
          <span className="font-bold text-[#1A1A1A]">Vol. 02</span>
          <span>Artisanal Kitchen</span>
          <span>Stone Oven</span>
        </div>

        <SenseLogo size="lg" showMonogram={false} />
        
        <div className="h-[1px] w-16 bg-[#1A1A1A] mx-auto my-3"></div>

        <p className="text-xs uppercase tracking-[0.25em] font-semibold text-[#1A1A1A]">
          {isAr ? 'الفرابيه، المنعشات، والمخبوزات' : 'Frappes, Refreshers & Bakery House'}
        </p>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12">
        {/* Left Column: Frappes */}
        <div>
          {renderItemList('Frappe', 'الفرابيه المثلج', frappeItems)}
          
          {/* Boba Addon Highlight box */}
          <div className="p-3.5 rounded-xl bg-[#FAF9F7] border border-[#EAE7E2] flex items-center justify-between text-xs text-[#1A1A1A] mb-6">
            <span className="flex items-center gap-1.5">
              <span>🧋</span>
              <span className="font-medium">{isAr ? 'إمكانية إضافة حبوب البوبا (Boba Bubbles)' : 'Add Boba Bubbles to any Frappe'}</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-[#1A1A1A] text-[#FDFCFB] text-[11px] font-semibold">
              +25 {isAr ? 'ج.م' : 'EGP'}
            </span>
          </div>
        </div>

        {/* Right Column: Mojito, Smoothies & Bakery */}
        <div>
          {renderItemList('Mojito & Energy', 'الموهيتو الفوار والمنعشات', mojitoItems)}
          {renderItemList('Smoothies', 'السموذي الطبيعي', smoothieItems)}
          {renderItemList('Bakery & Savory', 'المخبوزات والسندوتشات الطازجة', bakeryItems, isAr ? 'كرواسون فرنسي وخبز فوكاشيا وتشاباتا' : 'Artisanal Croissants & Focaccia')}
        </div>
      </div>

      {/* Bottom Wave with QR Code matching physical menu */}
      <div className="mt-6 sm:mt-8 pt-4 border-t border-[#EAE7E2] flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="w-full sm:w-2/3">
          <WaveGraphic withTagline={true} lang={lang} />
        </div>

        {/* QR Code Action Box */}
        <div
          onClick={onOpenQr}
          className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF9F7] border border-[#EAE7E2] cursor-pointer hover:border-[#1A1A1A] transition-colors shrink-0"
        >
          <div className="w-12 h-12 bg-white rounded-lg p-1.5 flex items-center justify-center border border-[#EAE7E2]">
            <QrCode className="w-8 h-8 text-[#1A1A1A]" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#1A1A1A]">
              {isAr ? 'امسح رمز QR' : 'Scan Table QR'}
            </p>
            <p className="text-[10px] text-[#8C8279]">
              {isAr ? 'افتح المينيو على هاتفك' : 'Open digital menu on mobile'}
            </p>
          </div>
        </div>
      </div>

      {/* Page Footer Note */}
      <div className="mt-4 flex items-center justify-between text-[10px] text-[#8C8279] uppercase tracking-widest pt-2">
        <span>{isAr ? 'صفحة 2 من 2' : 'Page 2 of 2'}</span>
        <span>Sense — New Damietta</span>
      </div>
    </div>
  );

  return (
    <div id="paper-menu-book-container" className="max-w-5xl mx-auto space-y-6">
      
      {/* Top Menu Folder Control Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 bg-[#FAF9F7] p-2 sm:p-3 rounded-2xl border border-[#EAE7E2] shadow-2xs">
        
        {/* Page Switcher Tabs (Volume 1 / Volume 2) */}
        <div className="flex items-center gap-1.5 sm:gap-2 w-full sm:w-auto">
          <button
            id="menu-page-1-tab-btn"
            onClick={() => goToPage(1)}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl text-[11px] sm:text-xs font-semibold transition-all ${
              currentPage === 1 && !viewAllTogether
                ? 'bg-[#1A1A1A] text-[#FDFCFB] shadow-xs'
                : 'text-[#4A4540] hover:text-[#1A1A1A] hover:bg-[#EAE7E2]/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden min-[420px]:inline">{isAr ? 'Vol. 01 — القهوة والماتشا' : 'Vol. 01 — Coffee & Matcha'}</span>
            <span className="min-[420px]:hidden">{isAr ? 'Vol. 01 (قهوة)' : 'Vol. 01 (Coffee)'}</span>
          </button>

          <button
            id="menu-page-2-tab-btn"
            onClick={() => goToPage(2)}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl text-[11px] sm:text-xs font-semibold transition-all ${
              currentPage === 2 && !viewAllTogether
                ? 'bg-[#1A1A1A] text-[#FDFCFB] shadow-xs'
                : 'text-[#4A4540] hover:text-[#1A1A1A] hover:bg-[#EAE7E2]/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 shrink-0" />
            <span className="hidden min-[420px]:inline">{isAr ? 'Vol. 02 — المنعشات والمخبوزات' : 'Vol. 02 — Bakery & Drinks'}</span>
            <span className="min-[420px]:hidden">{isAr ? 'Vol. 02 (منعشات)' : 'Vol. 02 (Bakery)'}</span>
          </button>
        </div>

        {/* View mode toggle & quick pagination */}
        <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
          {/* Continuous Scroll Toggle */}
          <button
            id="toggle-all-sheets-btn"
            onClick={() => setViewAllTogether(!viewAllTogether)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs transition-colors ${
              viewAllTogether
                ? 'bg-[#1A1A1A] border-[#1A1A1A] text-[#FDFCFB]'
                : 'bg-transparent border-[#EAE7E2] text-[#8C8279] hover:text-[#1A1A1A]'
            }`}
            title={isAr ? 'عرض كل الصفحات معاً' : 'View all pages together'}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{isAr ? (viewAllTogether ? 'تقليب الصفحات' : 'عرض الكل') : (viewAllTogether ? 'Page Flip' : 'View All')}</span>
          </button>

          {!viewAllTogether && (
            <div className="flex items-center gap-1">
              <button
                id="paper-menu-prev-btn"
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`p-2 rounded-xl border border-[#EAE7E2] transition-colors flex items-center justify-center ${
                  currentPage === 1
                    ? 'opacity-30 cursor-not-allowed bg-transparent'
                    : 'bg-[#FFFFFF] hover:bg-[#EAE7E2] text-[#1A1A1A]'
                }`}
                title={isAr ? 'الصفحة السابقة' : 'Previous page'}
              >
                {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              </button>

              <span className="font-serif-artistic italic text-sm text-[#8C8279] px-2 min-w-[65px] text-center">
                {isAr ? `صفحة ${currentPage} من 2` : `Page ${currentPage} of 2`}
              </span>

              <button
                id="paper-menu-next-btn"
                onClick={nextPage}
                disabled={currentPage === 2}
                className={`p-2 rounded-xl border border-[#EAE7E2] transition-colors flex items-center justify-center ${
                  currentPage === 2
                    ? 'opacity-30 cursor-not-allowed bg-transparent'
                    : 'bg-[#FFFFFF] hover:bg-[#EAE7E2] text-[#1A1A1A]'
                }`}
                title={isAr ? 'الصفحة التالية' : 'Next page'}
              >
                {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Book Folder Frame & Realistic Page Flip Stage */}
      {viewAllTogether ? (
        <div className="space-y-8">
          {renderPage1Content()}
          {renderPage2Content()}
        </div>
      ) : (
        <div className="relative [perspective:1400px] overflow-hidden">
          
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={currentPage}
              custom={direction}
              initial={{
                opacity: 0,
                rotateY: direction > 0 ? (isAr ? -14 : 14) : (isAr ? 14 : -14),
                scale: 0.98,
                x: direction > 0 ? (isAr ? -25 : 25) : (isAr ? 25 : -25),
              }}
              animate={{
                opacity: 1,
                rotateY: 0,
                scale: 1,
                x: 0,
              }}
              exit={{
                opacity: 0,
                rotateY: direction > 0 ? (isAr ? 14 : -14) : (isAr ? -14 : 14),
                scale: 0.98,
                x: direction > 0 ? (isAr ? 25 : -25) : (isAr ? -25 : 25),
              }}
              transition={{
                duration: 0.35,
                ease: [0.25, 1, 0.5, 1],
              }}
              className="origin-top"
            >
              {currentPage === 1 ? renderPage1Content() : renderPage2Content()}
            </motion.div>
          </AnimatePresence>

          {/* Bottom Flip Navigation Bar */}
          <div className="flex items-center justify-between mt-6 p-3 sm:p-4 rounded-2xl bg-[#FAF9F7] border border-[#EAE7E2]">
            <button
              id="bottom-prev-page-btn"
              onClick={prevPage}
              disabled={currentPage === 1}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentPage === 1
                  ? 'opacity-30 cursor-not-allowed text-[#8C8279]'
                  : 'bg-[#1A1A1A] text-[#FDFCFB] hover:bg-[#333333] shadow-xs'
              }`}
            >
              {isAr ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              <span className="hidden sm:inline">{isAr ? 'الصفحة السابقة (Vol. 01)' : 'Previous Page (Vol. 01)'}</span>
              <span className="sm:hidden">{isAr ? 'السابقة' : 'Prev'}</span>
            </button>

            {/* Page indicator dots */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => goToPage(1)}
                className={`h-2.5 rounded-full transition-all ${
                  currentPage === 1 ? 'w-6 sm:w-8 bg-[#1A1A1A]' : 'w-2 sm:w-2.5 bg-[#D4CEC6] hover:bg-[#8C8279]'
                }`}
                title="Page 1"
              />
              <button
                onClick={() => goToPage(2)}
                className={`h-2.5 rounded-full transition-all ${
                  currentPage === 2 ? 'w-6 sm:w-8 bg-[#1A1A1A]' : 'w-2 sm:w-2.5 bg-[#D4CEC6] hover:bg-[#8C8279]'
                }`}
                title="Page 2"
              />
            </div>

            <button
              id="bottom-next-page-btn"
              onClick={nextPage}
              disabled={currentPage === 2}
              className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentPage === 2
                  ? 'opacity-30 cursor-not-allowed text-[#8C8279]'
                  : 'bg-[#1A1A1A] text-[#FDFCFB] hover:bg-[#333333] shadow-xs'
              }`}
            >
              <span className="hidden sm:inline">{isAr ? 'الصفحة التالية (Vol. 02)' : 'Next Page (Vol. 02)'}</span>
              <span className="sm:hidden">{isAr ? 'التالية' : 'Next'}</span>
              {isAr ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
