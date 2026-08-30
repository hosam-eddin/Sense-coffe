import React from 'react';
import { Language } from '../types';
import { CAFE_INFO } from '../data/menuData';
import { SenseLogo } from './SenseLogo';
import { Search, MapPin, Clock, Sparkles, Coffee, Croissant } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroSectionProps {
  lang: Language;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilterTag: string | null;
  onSelectTag: (tag: string | null) => void;
  totalItemsCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  lang,
  searchQuery,
  onSearchChange,
  activeFilterTag,
  onSelectTag,
  totalItemsCount,
}) => {
  const isAr = lang === 'ar';

  const popularQuickTags = isAr
    ? ['ماتشا كلاود', 'سبانش لاتيه', 'V60', 'كرواسون تركي', 'فوكاشيا دجاج', 'موهيتو باشن']
    : ['Matcha Cloud', 'Spanish Latte', 'V60', 'Turkey Croissant', 'Tandoori Focaccia', 'Passion Mojito'];

  return (
    <section id="sense-hero-section" className="relative pt-8 pb-10 sm:pt-12 sm:pb-14 border-b border-[#EAE7E2] bg-[#FDFCFB]">
      {/* Background Subtle Organic Gallery Texture */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(#D4CEC6_1px,transparent_1px)] [background-size:28px_28px]"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          
          {/* Editorial Volume / Status Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-[#FAF9F7] border border-[#EAE7E2] text-xs text-[#8C8279] mb-6 shadow-2xs"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
            <span className="font-semibold text-[#1A1A1A] text-[11px] uppercase tracking-widest">{isAr ? CAFE_INFO.statusAr : CAFE_INFO.statusEn}</span>
            <span className="text-[#D4CEC6]">•</span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium">{isAr ? 'دمياط الجديدة — الحي الأول' : 'New Damietta — Egypt'}</span>
          </motion.div>

          {/* Minimalist Brand Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <SenseLogo size="xl" showMonogram={false} />
          </motion.div>

          {/* Editorial Headline with artistic serif typography */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 space-y-2"
          >
            <div className="h-[1px] w-20 bg-[#1A1A1A] mx-auto mb-4 opacity-80"></div>
            
            <h1 className="font-serif-artistic italic text-4xl sm:text-5xl md:text-6xl text-[#1A1A1A] tracking-tight leading-tight">
              {isAr ? 'Live it with all your senses' : 'Live it with all your senses'}
            </h1>
            
            <p className="text-[11px] uppercase tracking-[0.3em] font-semibold text-[#8C8279] mt-2">
              {isAr ? 'قائمة القهوة المختصة والمخبوزات العصرية' : 'Modern Specialty Coffee & Artisanal Bakehouse'}
            </p>

            <p className="text-xs sm:text-sm text-[#8C8279] font-serif-artistic italic max-w-lg mx-auto pt-1">
              {isAr
                ? '«تركيز دقيق على نقاء حبة البن وقوام المخبوزات الطازجة»'
                : '“Focusing on the purity of the bean and the texture of the grain.”'}
            </p>
          </motion.div>

          {/* Search Input Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="w-full max-w-xl mb-4"
          >
            <div className="relative flex items-center">
              <Search className={`absolute ${isAr ? 'right-4' : 'left-4'} w-4 h-4 text-[#8C8279]`} />
              <input
                id="menu-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={
                  isAr
                    ? 'ابحث في القائمة (V60، ماتشا، سبانش، كرواسون، فوكاشيا...)'
                    : 'Search menu (e.g. V60, Matcha, Spanish Latte, Croissant...)'
                }
                className={`w-full py-3.5 ${
                  isAr ? 'pr-12 pl-10' : 'pl-12 pr-10'
                } rounded-xl bg-[#FAF9F7] border border-[#EAE7E2] text-xs sm:text-sm text-[#1A1A1A] placeholder-[#8C8279] focus:outline-none focus:ring-1 focus:ring-[#1A1A1A] focus:border-[#1A1A1A] transition-all shadow-xs`}
              />
              {searchQuery && (
                <button
                  id="clear-search-btn"
                  onClick={() => onSearchChange('')}
                  className={`absolute ${
                    isAr ? 'left-3' : 'right-3'
                  } p-1 text-xs text-[#8C8279] hover:text-[#1A1A1A] bg-[#EAE7E2] rounded-full w-5 h-5 flex items-center justify-center`}
                >
                  ✕
                </button>
              )}
            </div>
          </motion.div>

          {/* Quick Filter Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-xs"
          >
            <span className="text-[10px] uppercase tracking-widest text-[#8C8279] font-medium hidden sm:inline">
              {isAr ? 'شائع الآن:' : 'Featured:'}
            </span>
            {popularQuickTags.map((tag) => {
              const isActive = activeFilterTag === tag;
              return (
                <button
                  key={tag}
                  id={`hero-tag-${tag.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => onSelectTag(isActive ? null : tag)}
                  className={`px-3 py-1 rounded-full transition-all text-[11px] ${
                    isActive
                      ? 'bg-[#1A1A1A] text-[#FDFCFB] font-medium shadow-2xs'
                      : 'bg-[#FAF9F7] border border-[#EAE7E2] text-[#4A4540] hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </motion.div>

          {/* Sensory Feature Highlights matching Artistic Flair */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 w-full mt-10 pt-6 border-t border-[#EAE7E2] text-left">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF9F7] border border-[#EAE7E2]">
              <div className="w-8 h-8 rounded-full bg-[#EAE7E2] text-[#1A1A1A] flex items-center justify-center shrink-0">
                <Coffee className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1A1A1A]">
                  {isAr ? 'قهوة مختصة' : 'Single Origin'}
                </p>
                <p className="text-[10px] text-[#8C8279]">
                  {isAr ? 'استخلاص يدوي دقيق V60' : 'Precision Pulled & V60'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAF9F7] border border-[#EAE7E2]">
              <div className="w-8 h-8 rounded-full bg-[#EAE7E2] text-[#1A1A1A] flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1A1A1A]">
                  {isAr ? 'بار ماتشا يابانية' : 'Matcha Bar'}
                </p>
                <p className="text-[10px] text-[#8C8279]">
                  {isAr ? 'درجة احتفالية وطبقات كلاود' : 'Ceremonial & Cloud Tops'}
                </p>
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 flex items-center gap-3 p-3 rounded-xl bg-[#FAF9F7] border border-[#EAE7E2]">
              <div className="w-8 h-8 rounded-full bg-[#EAE7E2] text-[#1A1A1A] flex items-center justify-center shrink-0">
                <Croissant className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-[#1A1A1A]">
                  {isAr ? 'مخبوزات يومية' : 'Daily Batch'}
                </p>
                <p className="text-[10px] text-[#8C8279]">
                  {isAr ? 'كرواسون، فوكاشيا وتشاباتا' : '72h Laminated Bakery'}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

