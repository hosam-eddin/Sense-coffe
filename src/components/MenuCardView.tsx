import React from 'react';
import { MenuItem, Language } from '../types';
import { Sparkles, Flame, Snowflake, Coffee, Heart, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface MenuCardViewProps {
  items: MenuItem[];
  lang: Language;
  onSelectItem: (item: MenuItem) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export const MenuCardView: React.FC<MenuCardViewProps> = ({
  items,
  lang,
  onSelectItem,
  favorites,
  onToggleFavorite,
}) => {
  const isAr = lang === 'ar';

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-base text-[#8C8279] font-serif-artistic italic">
          {isAr ? 'لم نتمكن من العثور على أي عنصر يطابق بحثك.' : 'No menu items match your filter.'}
        </p>
        <p className="text-xs text-[#8C8279] mt-1">
          {isAr ? 'جرب البحث عن شيء آخر مثل "لاتيه" أو "ماتشا" أو "كرواسون"' : 'Try searching for "Latte", "Matcha", or "Croissant"'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {items.map((item, idx) => {
        const isFav = favorites.includes(item.id);
        const tags = isAr ? item.tagsAr : item.tagsEn;

        return (
          <motion.article
            key={item.id}
            id={`menu-card-${item.id}`}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: Math.min(idx * 0.04, 0.3) }}
            className="group relative flex flex-col bg-[#FFFFFF] rounded-2xl border border-[#EAE7E2] overflow-hidden hover:border-[#1A1A1A] transition-all hover:shadow-sm cursor-pointer"
            onClick={() => onSelectItem(item)}
          >
            {/* Top Image & Badges */}
            <div className="relative aspect-16/10 w-full overflow-hidden bg-[#FAF9F7]">
              {item.image ? (
                <img
                  src={item.image}
                  alt={isAr ? item.nameAr : item.nameEn}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#8C8279]">
                  <Coffee className="w-10 h-10 opacity-30" />
                </div>
              )}

              {/* Subtle Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent pointer-events-none" />

              {/* Top Badges */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {item.isSignature && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-[#1A1A1A]/90 text-[#FDFCFB] backdrop-blur-xs border border-white/20">
                      <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                      <span>{isAr ? 'توقيع سينس' : 'Signature'}</span>
                    </span>
                  )}
                  {item.isPopular && !item.isSignature && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-[#8C2C2C]/90 text-white backdrop-blur-xs">
                      <Flame className="w-2.5 h-2.5 text-amber-200" />
                      <span>{isAr ? 'الأكثر طلباً' : 'Popular'}</span>
                    </span>
                  )}
                  {item.temp === 'ice' && (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#1A1A1A]/60 text-cyan-200 backdrop-blur-xs">
                      <Snowflake className="w-2.5 h-2.5" />
                      <span>{isAr ? 'بارد' : 'Ice'}</span>
                    </span>
                  )}
                  {item.temp === 'hot' && (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#1A1A1A]/60 text-amber-200 backdrop-blur-xs">
                      <Coffee className="w-2.5 h-2.5" />
                      <span>{isAr ? 'ساخن' : 'Hot'}</span>
                    </span>
                  )}
                  {item.temp === 'both' && (
                    <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#1A1A1A]/60 text-[#FDFCFB] backdrop-blur-xs">
                      <span>{isAr ? 'ساخن / بارد' : 'Hot or Ice'}</span>
                    </span>
                  )}
                </div>

                {/* Favorite Heart Button */}
                <button
                  id={`fav-btn-${item.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(item.id);
                  }}
                  className={`p-2 rounded-full backdrop-blur-md transition-all ${
                    isFav
                      ? 'bg-[#1A1A1A] text-rose-400 shadow-xs'
                      : 'bg-black/30 text-white/90 hover:bg-black/60'
                  }`}
                  title={isAr ? 'إضافة للمفضلة' : 'Favorite'}
                >
                  <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                </button>
              </div>

              {/* Price Badge on Image */}
              <div className={`absolute bottom-3 ${isAr ? 'left-3' : 'right-3'} z-10`}>
                <span className="inline-flex items-baseline gap-1 px-2.5 py-1 rounded-lg bg-[#FAF9F7]/95 text-[#1A1A1A] font-serif-artistic italic font-semibold text-sm shadow-xs border border-[#EAE7E2]">
                  <span>{item.price}</span>
                  <span className="text-[9px] font-sans uppercase tracking-wider text-[#8C8279]">
                    {isAr ? 'ج.م' : 'EGP'}
                  </span>
                </span>
              </div>
            </div>

            {/* Card Content Body */}
            <div className="flex flex-col flex-grow p-4 sm:p-5 justify-between bg-[#FFFFFF]">
              <div>
                {/* Title */}
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-serif-artistic font-semibold text-lg text-[#1A1A1A] leading-snug group-hover:text-[#8C6D46] transition-colors">
                    {isAr ? item.nameAr : item.nameEn}
                  </h3>
                </div>

                <p className="text-[11px] font-medium text-[#8C8279] uppercase tracking-wider mb-2">
                  {isAr ? item.nameEn : item.nameAr}
                </p>

                {/* Description */}
                {(item.descriptionAr || item.descriptionEn) && (
                  <p className="text-xs text-[#4A4540] leading-relaxed line-clamp-2 mb-3">
                    {isAr ? item.descriptionAr : item.descriptionEn}
                  </p>
                )}

                {/* Addon Note */}
                {item.addonNoteAr && (
                  <div className="mb-3 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#FAF9F7] border border-[#EAE7E2] text-[#8C6D46] text-[10px] font-medium">
                    <span>🧋</span>
                    <span>{isAr ? item.addonNoteAr : item.addonNoteEn}</span>
                  </div>
                )}
              </div>

              {/* Tags & Action Button */}
              <div className="pt-3 border-t border-[#EAE7E2] flex items-center justify-between gap-2">
                <div className="flex items-center gap-1 overflow-hidden flex-wrap max-h-6">
                  {tags &&
                    tags.slice(0, 2).map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[10px] uppercase tracking-wider font-medium px-2 py-0.5 rounded bg-[#FAF9F7] text-[#8C8279]"
                      >
                        {tag}
                      </span>
                    ))}
                </div>

                <span className="text-xs font-semibold text-[#1A1A1A] flex items-center gap-1 group-hover:underline">
                  <Info className="w-3.5 h-3.5 text-[#8C8279]" />
                  <span>{isAr ? 'التفاصيل' : 'Details'}</span>
                </span>
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
};

