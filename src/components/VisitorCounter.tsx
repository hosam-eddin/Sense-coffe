import React, { useEffect, useState, useCallback } from 'react';
import { Language } from '../types';
import { Users, ShieldCheck, RefreshCw, Activity, AlertCircle, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface VisitorCounterProps {
  lang: Language;
  variant?: 'footer' | 'compact' | 'badge';
}

interface VisitorResponse {
  status: string;
  totalVisitors: number | null;
  isNew?: boolean;
  metric?: string;
  lastUpdated?: string;
}

export const VisitorCounter: React.FC<VisitorCounterProps> = ({
  lang,
  variant = 'footer',
}) => {
  const isAr = lang === 'ar';
  const [data, setData] = useState<VisitorResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

  const fetchVisitors = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/visitors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          clientTimestamp: new Date().toISOString(),
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const result = (await res.json()) as VisitorResponse;
      setData(result);
    } catch (err: any) {
      console.warn('Visitor counter fetch failed:', err);
      setError(err?.message || 'Failed to connect');
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchVisitors();
  }, [fetchVisitors]);

  // Format real number with locale formatting
  const formattedCount =
    data?.totalVisitors != null
      ? new Intl.NumberFormat(isAr ? 'ar-EG' : 'en-US').format(data.totalVisitors)
      : null;

  if (variant === 'badge') {
    return (
      <div
        id="visitor-counter-badge"
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FAF9F7] border border-[#EAE7E2] text-xs text-[#8C8279]"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        <span className="font-serif-artistic italic text-sm text-[#1A1A1A] font-semibold">
          {loading ? '...' : formattedCount ?? '0'}
        </span>
        <span className="text-[10px] uppercase tracking-wider">
          {isAr ? 'إجمالي الزوار' : 'Total Visitors'}
        </span>
      </div>
    );
  }

  return (
    <div
      id="verified-visitor-counter-card"
      className="relative rounded-2xl bg-[#202020] border border-[#2D2D2D] p-5 text-start shadow-xs overflow-hidden"
    >
      {/* Decorative subtle background gradient */}
      <div className="absolute top-0 end-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Top bar: title, live dot & actions */}
        <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-[#2A2A2A]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[11px] uppercase tracking-[0.15em] font-semibold text-[#A0988D]">
              {isAr ? 'إجمالي زوار الموقع' : 'Total Visitors'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="visitor-info-toggle-btn"
              onClick={() => setShowInfoModal(!showInfoModal)}
              title={isAr ? 'كيف يعمل العداد' : 'How the counter works'}
              className="p-1 rounded-md text-[#8C8279] hover:text-[#FDFCFB] hover:bg-[#2A2A2A] transition-colors text-xs"
            >
              <Info className="w-3.5 h-3.5" />
            </button>

            <button
              id="refresh-visitor-counter-btn"
              onClick={() => fetchVisitors(true)}
              disabled={isRefreshing || loading}
              title={isAr ? 'تحديث العداد' : 'Refresh Count'}
              className={`p-1 rounded-md text-[#8C8279] hover:text-[#FDFCFB] hover:bg-[#2A2A2A] transition-colors ${
                isRefreshing ? 'animate-spin text-amber-300' : ''
              }`}
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Counter Display Area */}
        <div className="my-1">
          {loading ? (
            <div className="space-y-2 py-1">
              <div className="h-8 w-28 bg-[#2A2A2A] rounded-lg animate-pulse"></div>
              <div className="h-3 w-40 bg-[#2A2A2A] rounded-sm animate-pulse"></div>
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-rose-400 text-xs py-1">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{isAr ? 'تعذر تحميل العداد حالياً' : 'Counter temporarily unavailable'}</span>
            </div>
          ) : data?.totalVisitors != null ? (
            <div>
              <div className="flex items-baseline gap-2">
                <motion.span
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="font-serif-artistic font-semibold text-3xl sm:text-4xl text-[#FDFCFB] tracking-tight"
                >
                  {formattedCount}
                </motion.span>
                <span className="text-xs text-[#A0988D] font-medium">
                  {isAr ? 'زائر' : 'visitors'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#8C8279]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  {isAr
                    ? 'عداد حقيقي موحد • تشفير SHA-256 يحافظ على الخصوصية'
                    : 'Real cumulative counter • Privacy-conscious SHA-256'}
                </span>
              </div>
            </div>
          ) : (
            <div className="py-1">
              <div className="flex items-center gap-2 text-[#A0988D] text-xs">
                <Users className="w-4 h-4 text-amber-300" />
                <span>{isAr ? 'جاري تهيئة العداد...' : 'Initializing counter...'}</span>
              </div>
            </div>
          )}
        </div>

        {/* Informational popover explaining architecture transparently */}
        {showInfoModal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-[#2A2A2A] text-[11px] text-[#A0988D] space-y-1.5 leading-relaxed"
          >
            <p className="font-semibold text-[#FDFCFB] flex items-center gap-1">
              <Activity className="w-3 h-3 text-amber-400" />
              <span>{isAr ? 'معايير حساب الزوار الحقيقيين' : 'Visitor Counting Criteria'}</span>
            </p>
            <p>
              {isAr
                ? '• يُحسب الزائر مرة واحدة فقط عند زيارة الموقع عبر بصمة مشفرة أحادية الاتجاه (SHA-256).'
                : '• A visitor is counted once using a one-way SHA-256 cryptographic fingerprint.'}
            </p>
            <p>
              {isAr
                ? '• لا يزيد الرقم عند عمل Refresh للصفحة لنفس الزائر.'
                : '• Does not increment when the same visitor refreshes the page.'}
            </p>
            <p>
              {isAr
                ? '• لا يتم حفظ عنوان الـ IP الخام أبداً حفاظاً على الخصوصية.'
                : '• Raw IP addresses are never saved to protect user privacy.'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
