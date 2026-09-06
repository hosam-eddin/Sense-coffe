import React from 'react';
import { Language } from '../types';
import { CAFE_INFO } from '../data/menuData';
import { SenseLogo } from './SenseLogo';
import { VisitorCounter } from './VisitorCounter';
import { MapPin, Mail, Instagram, ExternalLink, Clock, ArrowUp } from 'lucide-react';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  const isAr = lang === 'ar';

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="sense-footer" className="bg-[#1A1A1A] text-[#FDFCFB] pt-14 pb-10 border-t border-[#262626]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-[#262626]">
          
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4 text-start">
            <SenseLogo size="lg" dark={true} />
            <p className="font-serif-artistic italic text-2xl text-amber-200/90">
              "Live it with all your senses"
            </p>
            <p className="text-xs sm:text-sm text-[#8C8279] max-w-sm leading-relaxed">
              {isAr
                ? 'كافيه ومخبوزات سينس في دمياط الجديدة. وجهتك الأولى للاستمتاع بالقهوة المختصة والماتشا اليابانية والمخبوزات الطازجة بأجواء مينيماليست راقية.'
                : 'Sense Specialty Coffee & Bakery House in New Damietta. Your destination for artisanal pour-overs, ceremonial matcha, and oven-fresh bakery.'}
            </p>
          </div>

          {/* Location & Hours */}
          <div className="md:col-span-4 space-y-3 text-start">
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8C8279]">
              {isAr ? 'الموقع وساعات العمل' : 'Location & Hours'}
            </h4>
            
            <div className="flex items-start gap-2.5 text-xs text-[#C5BBAE]">
              <MapPin className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>{isAr ? CAFE_INFO.addressAr : CAFE_INFO.addressEn}</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-[#C5BBAE]">
              <Clock className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{isAr ? CAFE_INFO.hoursAr : CAFE_INFO.hoursEn}</span>
            </div>

            <div className="flex items-center gap-2.5 text-xs text-[#C5BBAE]">
              <Mail className="w-4 h-4 text-amber-400 shrink-0" />
              <a href={`mailto:${CAFE_INFO.email}`} className="hover:underline">
                {CAFE_INFO.email}
              </a>
            </div>
          </div>

          {/* Social Links & QR */}
          <div className="md:col-span-3 space-y-3 text-start">
            <h4 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8C8279]">
              {isAr ? 'روابط التواصل' : 'Connect With Us'}
            </h4>

            <div className="flex flex-col gap-2 text-xs">
              <a
                id="footer-ig-link"
                href={CAFE_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#C5BBAE] hover:text-white transition-colors"
              >
                <Instagram className="w-4 h-4 text-pink-400" />
                <span>Instagram: @sensecafe.eg</span>
              </a>

              <a
                id="footer-fb-link"
                href={CAFE_INFO.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#C5BBAE] hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-blue-400" />
                <span>Facebook: Sense سينس</span>
              </a>

              <a
                id="footer-linktree-link"
                href={CAFE_INFO.linktree}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-[#C5BBAE] hover:text-white transition-colors"
              >
                <ExternalLink className="w-4 h-4 text-emerald-400" />
                <span>Linktree: linktr.ee/sensecafe.eg</span>
              </a>
            </div>
          </div>

        </div>

        {/* Real Visitor Telemetry Section */}
        <div className="py-8 border-b border-[#262626] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-start space-y-1">
            <h4 className="text-sm font-semibold text-[#FDFCFB]">
              {isAr ? 'إحصائيات زيارات الموقع' : 'Website Visits Telemetry'}
            </h4>
            <p className="text-xs text-[#8C8279] max-w-md leading-relaxed">
              {isAr
                ? 'تسجيل حقيقي وتراكمي لعدد مرات فتح وزيارة الموقع بدون أرقام وهمية أو تقريبية.'
                : 'Accurate and cumulative tracking of website visits without fake numbers.'}
            </p>
          </div>

          <div className="w-full md:w-auto md:min-w-[340px]">
            <VisitorCounter lang={lang} variant="footer" />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#8C8279] text-center sm:text-start">
          <p className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5">
            <span>© {new Date().getFullYear()}</span>
            <span>•</span>
            <span>{isAr ? 'جميع الحقوق محفوظة لدى :' : 'All rights reserved to:'}</span>
            <a
              id="copyright-author-link"
              href="https://www.facebook.com/hosam1205"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#FDFCFB] hover:text-amber-400 underline underline-offset-4 decoration-amber-400/50 hover:decoration-amber-400 transition-colors inline-flex items-center gap-1"
              title="Hosam-Eddin Facebook Profile"
            >
              Hosam-Eddin
            </a>
          </p>

          <p className="flex items-center gap-1.5 text-xs text-[#8C8279]">
            <span>{isAr ? 'مينيو رسمي للعرض والتصفح' : 'Official Display Menu'}</span>
            <span>•</span>
            <span>{isAr ? 'دمياط الجديدة' : 'New Damietta, Egypt'}</span>
          </p>

          <button
            id="scroll-to-top-btn"
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-[#262626] text-[#FDFCFB] hover:bg-[#333333] transition-colors flex items-center gap-1 text-xs font-semibold"
            title={isAr ? 'العودة للأعلى' : 'Scroll to Top'}
          >
            <ArrowUp className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isAr ? 'للأعلى' : 'Top'}</span>
          </button>
        </div>

      </div>
    </footer>
  );
};

