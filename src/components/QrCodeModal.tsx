import React, { useState } from 'react';
import { Language } from '../types';
import { SenseLogo } from './SenseLogo';
import { X, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface QrCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
}

export const QrCodeModal: React.FC<QrCodeModalProps> = ({
  isOpen,
  onClose,
  lang,
}) => {
  const isAr = lang === 'ar';
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : 'https://sensecafe.eg';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <AnimatePresence>
      <div
        id="qr-modal-backdrop"
        onClick={onClose}
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4"
      >
        <motion.div
          id="qr-modal-card"
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-sm bg-[#FFFFFF] rounded-2xl border border-[#EAE7E2] p-6 sm:p-8 text-center shadow-2xl overflow-hidden"
        >
          {/* Close button */}
          <button
            id="close-qr-modal-btn"
            onClick={onClose}
            className={`absolute top-4 ${
              isAr ? 'left-4' : 'right-4'
            } w-8 h-8 rounded-full bg-[#FAF9F7] text-[#1A1A1A] border border-[#EAE7E2] hover:bg-[#EAE7E2] flex items-center justify-center transition-colors`}
          >
            <X className="w-4 h-4" />
          </button>

          {/* Logo */}
          <div className="flex justify-center mb-3">
            <SenseLogo size="md" />
          </div>

          <h3 className="font-serif-artistic font-semibold text-2xl text-[#1A1A1A] mb-1">
            {isAr ? 'قائمة سينس الرقمية' : 'Sense Digital Menu'}
          </h3>
          <p className="text-xs text-[#8C8279] mb-6">
            {isAr ? 'امسح الرمز بكاميرا هاتفك لعرض المينيو وتصفحه بسهولة' : 'Scan with your smartphone camera to browse the live menu'}
          </p>

          {/* QR Code Container */}
          <div className="bg-[#FAF9F7] p-5 rounded-2xl border border-[#EAE7E2] inline-block shadow-xs mb-6">
            {/* Minimalist stylized SVG QR Code with Sense Monogram in center */}
            <svg
              viewBox="0 0 200 200"
              className="w-44 h-44 mx-auto"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Corner Position Targets */}
              <rect x="10" y="10" width="50" height="50" rx="6" stroke="#1A1A1A" strokeWidth="7" />
              <rect x="24" y="24" width="22" height="22" rx="3" fill="#1A1A1A" />

              <rect x="140" y="10" width="50" height="50" rx="6" stroke="#1A1A1A" strokeWidth="7" />
              <rect x="154" y="24" width="22" height="22" rx="3" fill="#1A1A1A" />

              <rect x="10" y="140" width="50" height="50" rx="6" stroke="#1A1A1A" strokeWidth="7" />
              <rect x="24" y="154" width="22" height="22" rx="3" fill="#1A1A1A" />

              {/* Data Blocks Pattern Matrix */}
              <rect x="75" y="15" width="12" height="12" rx="2" fill="#1A1A1A" />
              <rect x="95" y="15" width="12" height="12" rx="2" fill="#1A1A1A" />
              <rect x="115" y="15" width="12" height="12" rx="2" fill="#1A1A1A" />

              <rect x="75" y="35" width="12" height="12" rx="2" fill="#1A1A1A" />
              <rect x="115" y="35" width="12" height="12" rx="2" fill="#1A1A1A" />

              <rect x="75" y="55" width="12" height="12" rx="2" fill="#1A1A1A" />
              <rect x="95" y="55" width="12" height="12" rx="2" fill="#1A1A1A" />

              {/* Middle Section */}
              <rect x="15" y="75" width="12" height="12" rx="2" fill="#1A1A1A" />
              <rect x="35" y="75" width="12" height="12" rx="2" fill="#1A1A1A" />
              <rect x="55" y="75" width="12" height="12" rx="2" fill="#1A1A1A" />

              <rect x="135" y="75" width="12" height="12" rx="2" fill="#1A1A1A" />
              <rect x="155" y="75" width="12" height="12" rx="2" fill="#1A1A1A" />
              <rect x="175" y="75" width="12" height="12" rx="2" fill="#1A1A1A" />

              <rect x="15" y="95" width="12" height="12" rx="2" fill="#1A1A1A" />
              <rect x="55" y="95" width="12" height="12" rx="2" fill="#1A1A1A" />

              <rect x="135" y="95" width="12" height="12" rx="2" fill="#1A1A1A" />
              <rect x="175" y="95" width="12" height="12" rx="2" fill="#1A1A1A" />

              <rect x="15" y="115" width="12" height="12" rx="2" fill="#1A1A1A" />
              <rect x="35" y="115" width="12" height="12" rx="2" fill="#1A1A1A" />

              <rect x="135" y="115" width="12" height="12" rx="2" fill="#1A1A1A" />
              <rect x="155" y="115" width="12" height="12" rx="2" fill="#1A1A1A" />

              {/* Bottom Section */}
              <rect x="75" y="135" width="12" height="12" rx="2" fill="#1A1A1A" />
              <rect x="95" y="135" width="12" height="12" rx="2" fill="#1A1A1A" />
              <rect x="115" y="135" width="12" height="12" rx="2" fill="#1A1A1A" />
              <rect x="135" y="135" width="12" height="12" rx="2" fill="#1A1A1A" />
              <rect x="175" y="135" width="12" height="12" rx="2" fill="#1A1A1A" />

              <rect x="75" y="155" width="12" height="12" rx="2" fill="#1A1A1A" />
              <rect x="115" y="155" width="12" height="12" rx="2" fill="#1A1A1A" />
              <rect x="155" y="155" width="12" height="12" rx="2" fill="#1A1A1A" />

              <rect x="75" y="175" width="12" height="12" rx="2" fill="#1A1A1A" />
              <rect x="95" y="175" width="12" height="12" rx="2" fill="#1A1A1A" />
              <rect x="135" y="175" width="12" height="12" rx="2" fill="#1A1A1A" />
              <rect x="175" y="175" width="12" height="12" rx="2" fill="#1A1A1A" />

              {/* Center Emblem */}
              <circle cx="100" cy="100" r="22" fill="#FAF9F7" stroke="#1A1A1A" strokeWidth="3" />
              <text
                x="100"
                y="107"
                textAnchor="middle"
                fontSize="18"
                fontFamily="Newsreader, serif"
                fontStyle="italic"
                fontWeight="600"
                fill="#1A1A1A"
              >
                S
              </text>
            </svg>
          </div>

          {/* Copy link button */}
          <button
            id="copy-menu-url-btn"
            onClick={handleCopy}
            className="w-full py-3 px-4 rounded-xl bg-[#1A1A1A] text-[#FDFCFB] text-xs font-semibold hover:bg-[#333333] transition-all flex items-center justify-center gap-2 shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{isAr ? 'تم نسخ رابط المينيو!' : 'Menu Link Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>{isAr ? 'نسخ رابط المينيو' : 'Copy Menu Link'}</span>
              </>
            )}
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

