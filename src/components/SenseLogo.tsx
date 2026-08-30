import React from 'react';

interface SenseLogoProps {
  className?: string;
  showMonogram?: boolean;
  monogramOnly?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  dark?: boolean;
}

export const SenseLogo: React.FC<SenseLogoProps> = ({
  className = '',
  showMonogram = true,
  monogramOnly = false,
  size = 'md',
  dark = false,
}) => {
  const sizeMap = {
    sm: { text: 'text-2xl', circle: 'w-7 h-7', sText: 'text-sm' },
    md: { text: 'text-3xl sm:text-4xl', circle: 'w-9 h-9', sText: 'text-lg' },
    lg: { text: 'text-5xl sm:text-6xl', circle: 'w-13 h-13', sText: 'text-2xl' },
    xl: { text: 'text-6xl sm:text-7xl', circle: 'w-18 h-18', sText: 'text-3xl' },
  };

  const currentSize = sizeMap[size];
  const textColor = dark ? 'text-[#FDFCFB]' : 'text-[#1A1A1A]';
  const circleBg = dark
    ? 'bg-[#FDFCFB] text-[#1A1A1A] border border-[#EAE7E2]'
    : 'bg-[#1A1A1A] text-[#FDFCFB] border border-[#1A1A1A]';

  if (monogramOnly) {
    return (
      <div
        id="sense-monogram"
        className={`rounded-full flex items-center justify-center font-serif-artistic italic font-semibold shadow-xs transition-transform hover:scale-105 ${circleBg} ${currentSize.circle} ${className}`}
      >
        <span className={`leading-none ${currentSize.sText}`}>S</span>
      </div>
    );
  }

  return (
    <div id="sense-brand-logo" className={`flex items-center gap-3 select-none ${className}`}>
      {showMonogram && (
        <div
          className={`rounded-full flex items-center justify-center font-serif-artistic italic font-semibold transition-transform hover:scale-105 ${circleBg} ${currentSize.circle}`}
        >
          <span className={`leading-none ${currentSize.sText}`}>S</span>
        </div>
      )}
      <div className="flex flex-col items-start">
        <span
          className={`font-serif-artistic font-medium tracking-tight lowercase leading-none ${textColor} ${currentSize.text}`}
          style={{ letterSpacing: '-0.02em' }}
        >
          sense
        </span>
      </div>
    </div>
  );
};

