import React from 'react';

interface WaveGraphicProps {
  className?: string;
  withTagline?: boolean;
  taglinePosition?: 'top' | 'bottom';
  lang?: 'ar' | 'en';
}

export const WaveGraphic: React.FC<WaveGraphicProps> = ({
  className = '',
  withTagline = true,
  taglinePosition = 'bottom',
  lang = 'ar',
}) => {
  return (
    <div className={`relative overflow-hidden w-full select-none ${className}`}>
      <svg
        viewBox="0 0 1200 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        preserveAspectRatio="none"
      >
        {/* Subtle background secondary stroke */}
        <path
          d="M-50 200 C 150 180, 280 230, 480 170 C 680 110, 850 160, 1050 90 C 1150 50, 1220 30, 1250 10"
          stroke="#121212"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeOpacity="0.45"
        />

        {/* Primary bold sweeping fluid organic wave identical to Sense brand identity */}
        <path
          d="M-50 220 C 120 220, 240 180, 420 210 C 600 240, 720 180, 880 120 C 1020 70, 1140 30, 1250 5"
          stroke="#121212"
          strokeWidth="10"
          strokeLinecap="round"
        />

        {/* Accent thick swell */}
        <path
          d="M 680 185 C 750 160, 840 135, 960 90"
          stroke="#121212"
          strokeWidth="18"
          strokeLinecap="round"
        />
      </svg>

      {withTagline && (
        <div
          className={`absolute ${
            taglinePosition === 'bottom' ? 'bottom-2 right-4 sm:right-12' : 'top-2 right-4 sm:right-12'
          } text-right`}
        >
          <p
            className="font-script text-2xl sm:text-3xl md:text-4xl text-[#121212] leading-tight transform -rotate-3 select-none"
            style={{ fontFamily: "'Caveat', cursive, sans-serif" }}
          >
            {lang === 'ar' ? 'live it with all your senses' : 'live it with all your senses'}
          </p>
          {lang === 'ar' && (
            <p className="text-[11px] sm:text-xs tracking-wider text-[#6B655D] font-medium font-sans-clean mt-0.5">
              عِش التجربة بكل حواسك
            </p>
          )}
        </div>
      )}
    </div>
  );
};
