import React from 'react';
import { Language } from '../types';
import { Sparkles, Flame, Snowflake, Coffee } from 'lucide-react';

export type FilterType = 'all' | 'signature' | 'popular' | 'ice' | 'hot' | 'matcha' | 'boba';

interface QuickFiltersProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  lang: Language;
}

export const QuickFilters: React.FC<QuickFiltersProps> = ({
  activeFilter,
  onFilterChange,
  lang,
}) => {
  const isAr = lang === 'ar';

  const filterOptions: { id: FilterType; labelAr: string; labelEn: string; icon?: React.ReactNode }[] = [
    { id: 'all', labelAr: 'الكل', labelEn: 'All' },
    {
      id: 'signature',
      labelAr: 'توقيع سينس ✨',
      labelEn: 'Sense Signatures ✨',
      icon: <Sparkles className="w-3.5 h-3.5 text-amber-500" />,
    },
    {
      id: 'popular',
      labelAr: 'الأكثر طلباً 🔥',
      labelEn: 'Best Sellers 🔥',
      icon: <Flame className="w-3.5 h-3.5 text-rose-500" />,
    },
    {
      id: 'ice',
      labelAr: 'مثلج فقط ❄️',
      labelEn: 'Iced Only ❄️',
      icon: <Snowflake className="w-3.5 h-3.5 text-cyan-500" />,
    },
    {
      id: 'hot',
      labelAr: 'ساخن ☕',
      labelEn: 'Hot ☕',
      icon: <Coffee className="w-3.5 h-3.5 text-amber-700" />,
    },
    {
      id: 'matcha',
      labelAr: 'ماتشا وكلاود 🍃',
      labelEn: 'Matcha & Cloud 🍃',
    },
    {
      id: 'boba',
      labelAr: 'مع بوبا 🧋',
      labelEn: 'Boba Options 🧋',
    },
  ];

  return (
    <div id="quick-filters-bar" className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-2">
      {filterOptions.map((opt) => {
        const isActive = activeFilter === opt.id;
        return (
          <button
            key={opt.id}
            id={`filter-pill-${opt.id}`}
            onClick={() => onFilterChange(opt.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              isActive
                ? 'bg-[#1A1A1A] text-[#FDFCFB] shadow-xs'
                : 'bg-[#FAF9F7] border border-[#EAE7E2] text-[#8C8279] hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
            }`}
          >
            {opt.icon}
            <span>{isAr ? opt.labelAr : opt.labelEn}</span>
          </button>
        );
      })}
    </div>
  );
};

