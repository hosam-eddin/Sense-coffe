import React from 'react';
import { MenuItem, Language } from '../types';
import { SenseLogo } from './SenseLogo';
import { WaveGraphic } from './WaveGraphic';
import { QrCode, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

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

  // Group items by category to render classic menu sections
  const dripItems = items.filter((i) => i.categoryId === 'drip');
  const hotCoffeeItems = items.filter((i) => i.categoryId === 'coffee');
  const matchaItems = items.filter((i) => i.categoryId === 'matcha');
  const iceCoffeeItems = items.filter((i) => i.categoryId === 'ice-coffee');
  const frappeItems = items.filter((i) => i.categoryId === 'frappe');
  const mojitoItems = items.filter((i) => i.categoryId === 'mojito');
  const smoothieItems = items.filter((i) => i.categoryId === 'smoothies');
  const bakeryItems = items.filter((i) => i.categoryId === 'bakery');

  const renderItemList = (sectionTitleEn: string, sectionTitleAr: string, list: MenuItem[], sublabel?: string) => {
    if (list.length === 0) return null;

    return (
      <div className="mb-10">
        <div className="flex items-baseline justify-between border-b border-[#1A1A1A] pb-2 mb-5">
          <div>
            <h3 className="font-serif-artistic text-xl sm:text-2xl text-[#1A1A1A] tracking-tight">
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

        <ul className="space-y-3.5">
          {list.map((item) => (
            <li
              key={item.id}
              onClick={() => onSelectItem(item)}
              className="group flex items-baseline justify-between gap-3 p-1.5 rounded-lg hover:bg-[#FAF9F7] cursor-pointer transition-colors"
            >
              <div className="flex flex-col flex-grow min-w-0">
                <div className="flex items-center gap-2">
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
              <div className="flex-grow border-b border-dotted border-[#D4CEC6] mx-1 min-w-[20px] opacity-70"></div>

              {/* Price */}
              <div className="flex items-baseline gap-1 shrink-0">
                <span className="font-serif-artistic italic text-base sm:text-lg text-[#1A1A1A]">
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

  return (
    <div className="space-y-12 max-w-5xl mx-auto">
      
      {/* --- SHEET 1: Specialty Drip, Hot Coffee, Matcha Bar, Ice Coffee --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative bg-[#FFFFFF] rounded-2xl border border-[#EAE7E2] p-6 sm:p-10 md:p-14 shadow-xs overflow-hidden"
      >
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center pb-8 border-b border-[#EAE7E2] mb-8">
          <div className="flex items-center justify-between w-full text-[10px] uppercase tracking-[0.3em] text-[#8C8279] mb-4">
            <span>Vol. 01</span>
            <span>Sense Specialty House</span>
            <span>Daily Roast</span>
          </div>

          <SenseLogo size="lg" showMonogram={false} />
          
          <div className="h-[1px] w-16 bg-[#1A1A1A] mx-auto my-3"></div>

          <p className="text-xs uppercase tracking-[0.25em] font-semibold text-[#1A1A1A]">
            {isAr ? 'قائمة القهوة المختصة والماـتشا' : 'Specialty Coffee & Matcha Bar'}
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
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
        <div className="mt-8 pt-4 border-t border-[#EAE7E2]">
          <WaveGraphic withTagline={true} lang={lang} />
        </div>
      </motion.div>

      {/* --- SHEET 2: Frappes, Mojitos, Smoothies & Artisanal Bakery --- */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.15 }}
        className="relative bg-[#FFFFFF] rounded-2xl border border-[#EAE7E2] p-6 sm:p-10 md:p-14 shadow-xs overflow-hidden"
      >
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center pb-8 border-b border-[#EAE7E2] mb-8">
          <div className="flex items-center justify-between w-full text-[10px] uppercase tracking-[0.3em] text-[#8C8279] mb-4">
            <span>Vol. 02</span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
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
        <div className="mt-8 pt-4 border-t border-[#EAE7E2] flex flex-col sm:flex-row items-center justify-between gap-6">
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
      </motion.div>

    </div>
  );
};

