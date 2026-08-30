import React from 'react';
import { SenseLogo } from './SenseLogo';
import { Language } from '../types';
import { CAFE_INFO } from '../data/menuData';
import { Globe, QrCode, LayoutGrid, FileText, MapPin } from 'lucide-react';

interface NavbarProps {
  lang: Language;
  onToggleLang: () => void;
  viewMode: 'cards' | 'sheet';
  onChangeViewMode: (mode: 'cards' | 'sheet') => void;
  onOpenQr: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onToggleLang,
  viewMode,
  onChangeViewMode,
  onOpenQr,
}) => {
  const isAr = lang === 'ar';

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-40 w-full bg-[#FDFCFB]/95 backdrop-blur-md border-b border-[#EAE7E2] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Logo & Subtext */}
          <div className="flex items-center gap-4">
            <a href="#" className="group flex items-center gap-3">
              <SenseLogo size="md" />
            </a>
            
            <div className="hidden md:flex flex-col border-s border-[#EAE7E2] ps-4">
              <span className="text-[10px] uppercase tracking-[0.25em] font-semibold text-[#8C8279]">
                {isAr ? 'قهوة مختصة ومخبوزات' : 'Modern Coffee & Bakehouse'}
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-[#8C8279] mt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                <span>{isAr ? CAFE_INFO.hoursAr : CAFE_INFO.hoursEn}</span>
              </div>
            </div>
          </div>

          {/* Controls: View Switcher, QR, Language, Location */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center bg-[#FAF9F7] p-1 rounded-xl border border-[#EAE7E2]">
              <button
                id="view-mode-cards-btn"
                onClick={() => onChangeViewMode('cards')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'cards'
                    ? 'bg-[#1A1A1A] text-[#FDFCFB] shadow-xs'
                    : 'text-[#8C8279] hover:text-[#1A1A1A]'
                }`}
                title={isAr ? 'عرض البطاقات المصورة' : 'Visual Cards View'}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isAr ? 'بطاقات' : 'Cards'}</span>
              </button>
              <button
                id="view-mode-sheet-btn"
                onClick={() => onChangeViewMode('sheet')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'sheet'
                    ? 'bg-[#1A1A1A] text-[#FDFCFB] shadow-xs'
                    : 'text-[#8C8279] hover:text-[#1A1A1A]'
                }`}
                title={isAr ? 'عرض المينيو الورقي الكلاسيكي' : 'Classic Sheet View'}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{isAr ? 'مينيو ورقي' : 'Menu Sheet'}</span>
              </button>
            </div>

            {/* QR Code Button */}
            <button
              id="open-qr-btn"
              onClick={onOpenQr}
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-[#EAE7E2] bg-[#FAF9F7] text-[#1A1A1A] hover:bg-[#EAE7E2] transition-colors flex items-center gap-1.5 text-xs font-medium"
              title={isAr ? 'رمز QR للمنيو' : 'QR Code for Table'}
            >
              <QrCode className="w-4 h-4 text-[#1A1A1A]" />
              <span className="hidden md:inline">{isAr ? 'رمز QR' : 'Scan QR'}</span>
            </button>

            {/* Location Button */}
            <a
              id="nav-location-link"
              href={CAFE_INFO.locationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#EAE7E2] bg-[#FAF9F7] text-[#1A1A1A] hover:bg-[#EAE7E2] transition-colors text-xs font-medium"
            >
              <MapPin className="w-3.5 h-3.5 text-[#8C8279]" />
              <span>{isAr ? 'دمياط الجديدة' : 'New Damietta'}</span>
            </a>

            {/* Language Toggle */}
            <button
              id="lang-toggle-btn"
              onClick={onToggleLang}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#1A1A1A] text-[#FDFCFB] hover:bg-[#333333] transition-all text-xs font-semibold shadow-xs"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{isAr ? 'English' : 'عربي'}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

