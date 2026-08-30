import React, { useState } from 'react';
import { MenuItem, Language } from '../types';
import { X, Sparkles, Flame, Snowflake, Coffee, Heart, Share2, Check, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ItemDetailModalProps {
  item: MenuItem | null;
  onClose: () => void;
  lang: Language;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  lang,
  isFavorite,
  onToggleFavorite,
}) => {
  const isAr = lang === 'ar';
  const [copied, setCopied] = useState(false);
  const [selectedMilk, setSelectedMilk] = useState<'whole' | 'oat' | 'almond'>('whole');
  const [selectedSweetness, setSelectedSweetness] = useState<'normal' | 'less' | 'sugar-free'>('normal');
  const [hasBoba, setHasBoba] = useState(false);

  if (!item) return null;

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `${item.nameEn} - Sense Cafe`,
          text: isAr
            ? `جرب ${item.nameAr} من كافيه سينس في دمياط الجديدة!`
            : `Check out ${item.nameEn} at Sense Cafe New Damietta!`,
          url: window.location.href,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const calculatedPrice = item.price + (hasBoba ? 25 : 0);

  return (
    <AnimatePresence>
      <div
        id="item-detail-backdrop"
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      >
        <motion.div
          id="item-detail-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg bg-[#FFFFFF] rounded-2xl border border-[#EAE7E2] overflow-hidden shadow-2xl my-auto text-start"
        >
          {/* Close Button */}
          <button
            id="close-item-modal-btn"
            onClick={onClose}
            className={`absolute top-4 ${
              isAr ? 'left-4' : 'right-4'
            } z-20 w-8 h-8 rounded-full bg-[#1A1A1A]/70 text-white hover:bg-[#1A1A1A] backdrop-blur-md flex items-center justify-center transition-colors`}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Media Header */}
          <div className="relative aspect-16/10 w-full bg-[#FAF9F7] overflow-hidden">
            {item.image ? (
              <img
                src={item.image}
                alt={isAr ? item.nameAr : item.nameEn}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-[#8C8279]">
                <Coffee className="w-16 h-16 opacity-30" />
              </div>
            )}
            
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

            {/* Badges in Image */}
            <div className="absolute bottom-4 inset-x-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {item.isSignature && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-[#1A1A1A] text-[#FDFCFB] border border-white/20 flex items-center gap-1 shadow-sm">
                    <Sparkles className="w-3 h-3 text-amber-300" />
                    <span>{isAr ? 'توقيع سينس' : 'Signature Item'}</span>
                  </span>
                )}
                {item.isPopular && !item.isSignature && (
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-semibold bg-[#8C2C2C] text-white flex items-center gap-1 shadow-sm">
                    <Flame className="w-3 h-3 text-amber-200" />
                    <span>{isAr ? 'الأكثر طلباً' : 'Best Seller'}</span>
                  </span>
                )}
              </div>

              {/* Price */}
              <div className="px-3 py-1 rounded-lg bg-[#FAF9F7]/95 text-[#1A1A1A] font-serif-artistic italic font-semibold text-base shadow-sm border border-[#EAE7E2]">
                {calculatedPrice} <span className="text-[10px] font-sans uppercase text-[#8C8279]">{isAr ? 'ج.م' : 'EGP'}</span>
              </div>
            </div>
          </div>

          {/* Modal Content */}
          <div className="p-6 sm:p-7 space-y-5 max-h-[60vh] overflow-y-auto">
            {/* Title & Subtitle */}
            <div>
              <h2 className="font-serif-artistic font-semibold text-2xl sm:text-3xl text-[#1A1A1A]">
                {isAr ? item.nameAr : item.nameEn}
              </h2>
              <p className="text-xs uppercase tracking-wider font-semibold text-[#8C8279] mt-0.5">
                {isAr ? item.nameEn : item.nameAr}
              </p>
            </div>

            {/* Description */}
            {(item.descriptionAr || item.descriptionEn) && (
              <p className="text-xs sm:text-sm text-[#4A4540] leading-relaxed">
                {isAr ? item.descriptionAr : item.descriptionEn}
              </p>
            )}

            {/* Notes if available */}
            {(item.notesAr || item.notesEn) && (
              <div className="p-3 rounded-xl bg-[#FAF9F7] border border-[#EAE7E2] text-xs text-[#8C8279] flex items-start gap-2.5">
                <Info className="w-4 h-4 text-[#8C8279] shrink-0 mt-0.5" />
                <span>{isAr ? item.notesAr : item.notesEn}</span>
              </div>
            )}

            {/* Boba Option Switch if Frappe */}
            {item.categoryId === 'frappe' && (
              <div className="p-3.5 rounded-xl bg-[#FAF9F7] border border-[#EAE7E2]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🧋</span>
                    <div>
                      <p className="text-xs font-semibold text-[#1A1A1A]">
                        {isAr ? 'إضافة حبيبات البوبا' : 'Add Boba Bubbles'}
                      </p>
                      <p className="text-[10px] text-[#8C8279]">
                        {isAr ? 'حبيبات التابيوكا اللذيذة' : 'Sweet chewy tapioca pearls'}
                      </p>
                    </div>
                  </div>
                  <button
                    id="boba-toggle-btn"
                    onClick={() => setHasBoba(!hasBoba)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      hasBoba
                        ? 'bg-[#1A1A1A] text-[#FDFCFB]'
                        : 'bg-white text-[#1A1A1A] border border-[#EAE7E2]'
                    }`}
                  >
                    {hasBoba ? (isAr ? 'مضافة (+25 ج.م)' : 'Added (+25 EGP)') : (isAr ? '+ إضافة (25 ج.م)' : '+ Add (25 EGP)')}
                  </button>
                </div>
              </div>
            )}

            {/* Customization Options for drinks */}
            {['coffee', 'ice-coffee', 'matcha'].includes(item.categoryId) && (
              <div className="space-y-4 pt-2 border-t border-[#EAE7E2]">
                {/* Milk Preference */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#8C8279] mb-2">
                    {isAr ? 'نوع الحليب المفضل:' : 'Milk Preference:'}
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { id: 'whole', labelAr: 'كامل الدسم', labelEn: 'Whole Milk' },
                      { id: 'oat', labelAr: 'شوفان', labelEn: 'Oat Milk' },
                      { id: 'almond', labelAr: 'لوز', labelEn: 'Almond Milk' },
                    ].map((milk) => (
                      <button
                        key={milk.id}
                        onClick={() => setSelectedMilk(milk.id as any)}
                        className={`p-2 rounded-lg text-xs font-medium text-center border transition-all ${
                          selectedMilk === milk.id
                            ? 'bg-[#1A1A1A] text-[#FDFCFB] border-[#1A1A1A]'
                            : 'bg-white text-[#4A4540] border-[#EAE7E2] hover:border-[#1A1A1A]'
                        }`}
                      >
                        {isAr ? milk.labelAr : milk.labelEn}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sweetness */}
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-semibold text-[#8C8279] mb-2">
                    {isAr ? 'مستوى الحلاوة:' : 'Sweetness Level:'}
                  </label>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {[
                      { id: 'normal', labelAr: 'معياري', labelEn: 'Standard' },
                      { id: 'less', labelAr: 'حلاوة أقل', labelEn: 'Less Sweet' },
                      { id: 'sugar-free', labelAr: 'بدون سكر', labelEn: 'Sugar Free' },
                    ].map((sw) => (
                      <button
                        key={sw.id}
                        onClick={() => setSelectedSweetness(sw.id as any)}
                        className={`p-2 rounded-lg text-xs font-medium text-center border transition-all ${
                          selectedSweetness === sw.id
                            ? 'bg-[#1A1A1A] text-[#FDFCFB] border-[#1A1A1A]'
                            : 'bg-white text-[#4A4540] border-[#EAE7E2] hover:border-[#1A1A1A]'
                        }`}
                      >
                        {isAr ? sw.labelAr : sw.labelEn}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Tags list */}
            {(item.tagsAr || item.tagsEn) && (
              <div className="flex flex-wrap gap-1.5 pt-2">
                {(isAr ? item.tagsAr : item.tagsEn)?.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] uppercase tracking-wider font-medium px-2.5 py-0.5 rounded bg-[#FAF9F7] text-[#8C8279] border border-[#EAE7E2]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 sm:p-5 bg-[#FAF9F7] border-t border-[#EAE7E2] flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                id="modal-fav-btn"
                onClick={() => onToggleFavorite(item.id)}
                className={`p-2.5 rounded-xl border transition-all flex items-center gap-1.5 text-xs font-medium ${
                  isFavorite
                    ? 'bg-[#1A1A1A] border-[#1A1A1A] text-rose-400'
                    : 'bg-white border-[#EAE7E2] text-[#1A1A1A] hover:border-[#1A1A1A]'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-current' : ''}`} />
                <span>{isFavorite ? (isAr ? 'في مفضلتي' : 'Favorited') : (isAr ? 'إضافة للمفضلة' : 'Favorite')}</span>
              </button>

              <button
                id="modal-share-btn"
                onClick={handleShare}
                className="p-2.5 rounded-xl border border-[#EAE7E2] bg-white text-[#1A1A1A] hover:border-[#1A1A1A] transition-all flex items-center gap-1.5 text-xs font-medium"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'مشاركة' : 'Share')}</span>
              </button>
            </div>

            <button
              id="modal-done-btn"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#1A1A1A] text-[#FDFCFB] text-xs font-semibold hover:bg-[#333333] transition-all shadow-xs"
            >
              {isAr ? 'إغلاق' : 'Close'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

