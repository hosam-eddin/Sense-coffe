import React from 'react';
import { CategoryId, Language } from '../types';
import { CATEGORIES, MENU_ITEMS } from '../data/menuData';
import {
  Sparkles,
  Coffee,
  Flame,
  IceCream,
  Leaf,
  GlassWater,
  Citrus,
  Grape,
  Sandwich,
} from 'lucide-react';

interface CategoryNavProps {
  selectedCategoryId: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  lang: Language;
}

export const CategoryNav: React.FC<CategoryNavProps> = ({
  selectedCategoryId,
  onSelectCategory,
  lang,
}) => {
  const isAr = lang === 'ar';

  const getIcon = (iconName: string, active: boolean) => {
    const iconClass = `w-3.5 h-3.5 ${active ? 'text-[#FDFCFB]' : 'text-[#8C8279]'}`;
    switch (iconName) {
      case 'Sparkles':
        return <Sparkles className={iconClass} />;
      case 'Coffee':
        return <Coffee className={iconClass} />;
      case 'Flame':
        return <Flame className={iconClass} />;
      case 'IceCream':
        return <IceCream className={iconClass} />;
      case 'Leaf':
        return <Leaf className={iconClass} />;
      case 'GlassWater':
        return <GlassWater className={iconClass} />;
      case 'Citrus':
        return <Citrus className={iconClass} />;
      case 'Grape':
        return <Grape className={iconClass} />;
      case 'Sandwich':
        return <Sandwich className={iconClass} />;
      default:
        return <Coffee className={iconClass} />;
    }
  };

  const getItemCount = (catId: CategoryId) => {
    if (catId === 'all') return MENU_ITEMS.length;
    return MENU_ITEMS.filter((item) => item.categoryId === catId).length;
  };

  return (
    <div id="category-navigation-bar" className="sticky top-18 sm:top-20 z-30 bg-[#FDFCFB]/95 backdrop-blur-md py-3.5 border-b border-[#EAE7E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 scroll-smooth">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategoryId === cat.id;
            const count = getItemCount(cat.id);

            return (
              <button
                key={cat.id}
                id={`cat-nav-btn-${cat.id}`}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                  isSelected
                    ? 'bg-[#1A1A1A] text-[#FDFCFB] shadow-xs'
                    : 'bg-[#FAF9F7] border border-[#EAE7E2] text-[#4A4540] hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
                }`}
              >
                {getIcon(cat.iconName, isSelected)}
                <span>{isAr ? cat.nameAr : cat.nameEn}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-mono ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#EAE7E2] text-[#4A4540]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

