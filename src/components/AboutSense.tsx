import React from 'react';
import { Language } from '../types';
import { CAFE_INFO } from '../data/menuData';
import { SenseLogo } from './SenseLogo';
import { WaveGraphic } from './WaveGraphic';
import { Sparkles, MapPin, Clock, Compass } from 'lucide-react';

interface AboutSenseProps {
  lang: Language;
}

export const AboutSense: React.FC<AboutSenseProps> = ({ lang }) => {
  const isAr = lang === 'ar';

  return (
    <section id="about-sense-section" className="py-16 sm:py-24 border-t border-[#EAE7E2] bg-[#FAF9F7]/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-start">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F7] border border-[#EAE7E2] text-[#8C8279] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#8C6D46]" />
              <span>{isAr ? 'عن سينس كافيه' : 'About Sense Cafe'}</span>
            </div>

            <h2 className="font-serif-artistic font-semibold text-3xl sm:text-4xl lg:text-5xl text-[#1A1A1A] leading-tight">
              {isAr ? 'مساحة صُممت لتوقظ جميع حواسك' : 'A space crafted to awaken all your senses'}
            </h2>

            <p className="font-serif-artistic italic text-2xl sm:text-3xl text-[#8C6D46]">
              "Live it with all your senses"
            </p>

            <p className="text-sm sm:text-base text-[#4A4540] leading-relaxed">
              {isAr
                ? 'في سينس، نؤمن أن فنجان القهوة ليس مجرد روتين صباحي، بل تجربة حسية متكاملة. نختار حبوب البن بعناية من أفضل المزارع حول العالم، ونقدم بار ماتشا ياباني أصيل، إلى جانب مخبوزات وسندوتشات طازجة يومياً من خبز الفوكاشيا والتشاباتا المقرمش.'
                : 'At Sense, coffee is more than a daily routine—it is a complete sensory journey. We curate specialty beans from world-renowned micro-lots, whisk authentic ceremonial Japanese matcha, and bake daily artisanal croissants and toasted focaccia.'}
            </p>

            {/* Feature points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#EAE7E2]">
                <h4 className="font-semibold text-sm text-[#1A1A1A] mb-1">
                  {isAr ? '☕ جودة استخلاص لا تهاون فيها' : '☕ Uncompromised Pour-Over'}
                </h4>
                <p className="text-xs text-[#8C8279]">
                  {isAr ? 'استخلاص يدوي دقيق بموازين متخصصة وتوزيع حراري مثالي.' : 'Calibrated manual extraction bringing out every floral note.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FFFFFF] border border-[#EAE7E2]">
                <h4 className="font-semibold text-sm text-[#1A1A1A] mb-1">
                  {isAr ? '🥐 مخبوزات وسندوتشات ساخنة' : '🥐 Fresh Artisanal Kitchen'}
                </h4>
                <p className="text-xs text-[#8C8279]">
                  {isAr ? 'تحميص فوري للكرواسون والفوكاشيا مع أجود الأجبان وصوصات الرانش.' : 'Oven-toasted gourmet sandwiches with house ranch and melted cheese.'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Visual Column */}
          <div className="lg:col-span-5">
            <div className="relative bg-[#FFFFFF] rounded-2xl border border-[#EAE7E2] p-8 shadow-xs overflow-hidden text-center">
              
              <div className="flex justify-center mb-4">
                <SenseLogo size="lg" />
              </div>

              <p className="font-serif-artistic font-semibold text-xl text-[#1A1A1A] mb-1">
                {isAr ? 'سينس كافيه - دمياط الجديدة' : 'Sense Cafe - New Damietta'}
              </p>
              
              <div className="flex items-center justify-center gap-1 text-xs text-[#8C8279] mb-6">
                <MapPin className="w-3.5 h-3.5 text-[#8C6D46]" />
                <span>{isAr ? CAFE_INFO.addressAr : CAFE_INFO.addressEn}</span>
              </div>

              {/* Working Hours box */}
              <div className="p-4 rounded-xl bg-[#FAF9F7] border border-[#EAE7E2] text-xs space-y-2 mb-6">
                <div className="flex items-center justify-between font-semibold text-[#1A1A1A]">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#8C6D46]" />
                    <span>{isAr ? 'ساعات العمل' : 'Opening Hours'}</span>
                  </span>
                  <span className="text-emerald-700 font-semibold">{isAr ? 'مفتوح يومياً' : 'Open Daily'}</span>
                </div>
                <div className="flex items-center justify-between text-[#8C8279] pt-2 border-t border-[#EAE7E2]">
                  <span>{isAr ? 'طوال أيام الأسبوع' : 'Everyday'}</span>
                  <span className="font-mono font-medium text-[#1A1A1A]">8:00 AM - 1:00 AM</span>
                </div>
              </div>

              {/* Get Directions Button */}
              <a
                id="get-directions-btn"
                href={CAFE_INFO.locationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl bg-[#1A1A1A] text-[#FDFCFB] text-xs font-semibold hover:bg-[#333333] transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <Compass className="w-4 h-4 text-amber-300" />
                <span>{isAr ? 'الاتجاهات على خرائط جوجل' : 'Directions on Google Maps'}</span>
              </a>

              {/* Wave line */}
              <div className="mt-6">
                <WaveGraphic withTagline={false} />
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};

