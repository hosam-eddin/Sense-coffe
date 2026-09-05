import React, { useEffect, useState, useCallback } from 'react';
import { Language } from '../types';
import { Users, ShieldCheck, RefreshCw, Activity, AlertCircle, Info } from 'lucide-react';
import { motion } from 'motion/react';

interface VisitorCounterProps {
  lang: Language;
  variant?: 'footer' | 'compact' | 'badge';
}

interface VisitorData {
  count: number | null;
  status: string;
  source?: string;
  vercelConfigured?: boolean;
  metric?: string;
  message?: string;
}

export const VisitorCounter: React.FC<VisitorCounterProps> = ({
  lang,
  variant = 'footer',
}) => {
  const isAr = lang === 'ar';
  const [data, setData] = useState<VisitorData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [showInfoModal, setShowInfoModal] = useState<boolean>(false);

  const fetchVisitors = useCallback(async (isManual = false) => {
    if (isManual) setIsRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      // Send heartbeat / fetch to server-side endpoint
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

      const result = await res.json();
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
    // Initial fetch once on mount
    fetchVisitors();
  }, [fetchVisitors]);

  // Format number with localized comma delimiters
  const formattedCount = data?.count != null
    ? new Intl.NumberFormat(isAr ? 'ar-EG' : 'en-US').format(data.count)
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
          {loading ? '...' : formattedCount || (isAr ? 'نشط' : 'Active')}
        </span>
        <span className="text-[10px] uppercase tracking-wider">
          {isAr ? 'زائر حقيقي' : 'unique visitors'}
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
        {/* Top bar: title, live dot & refresh button */}
        <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-[#2A2A2A]">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#A0988D]">
              {isAr ? 'عداد الزوار الحقيقي' : 'Verified Visitors Telemetry'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id="visitor-info-toggle-btn"
              onClick={() => setShowInfoModal(!showInfoModal)}
              title={isAr ? 'معلومات التحقق ومصدر البيانات' : 'Verification info'}
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
              <span>{isAr ? 'تعذر جلب العداد حالياً' : 'Counter temporarily unavailable'}</span>
            </div>
          ) : data?.count != null ? (
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
                  {isAr ? 'زائر فعلي' : 'unique visitors'}
                </span>
              </div>

              <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[#8C8279]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>
                  {data.source === 'vercel_web_analytics'
                    ? (isAr ? 'موثّق عبر Vercel Web Analytics API' : 'Verified via Vercel Web Analytics API')
                    : (isAr ? 'زوار فريدون حقيقيون • تشفير آمن' : 'Unique cumulative visitors • Privacy safe')}
                </span>
              </div>
            </div>
          ) : (
            <div className="py-1">
              <span className="font-serif-artistic text-lg text-amber-200/90 font-medium block">
                {isAr ? 'قيد المزامنة مع Vercel Analytics' : 'Syncing with Vercel Analytics'}
              </span>
              <p className="text-[11px] text-[#8C8279] mt-1">
                {isAr
                  ? 'تم تجهيز كود الربط. أضف VERCEL_API_TOKEN في إعدادات المشروع لعرض الرقم مباشرة.'
                  : 'Integration ready. Add VERCEL_API_TOKEN in Vercel settings to populate.'}
              </p>
            </div>
          )}
        </div>

        {/* Verification Architecture Explanation Popover */}
        {showInfoModal && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 pt-3 border-t border-[#2A2A2A] text-[11px] text-[#A0988D] space-y-1.5 leading-relaxed"
          >
            <p className="font-semibold text-[#FDFCFB] flex items-center gap-1">
              <Activity className="w-3 h-3 text-amber-400" />
              <span>{isAr ? 'معايير التحقق من الزوار' : 'Verification Criteria'}</span>
            </p>
            <p>
              {isAr
                ? '• هذا العداد لا يعتمد على أرقام عشوائية أو localStorage أو مجرد مرات تحميل الصفحة.'
                : '• Does not rely on random numbers, localStorage, or raw page views.'}
            </p>
            <p>
              {isAr
                ? '• يحسب الزوار الفريدين (Unique Visitors) عبر خادم API مع تشفير بصمة الجلسة (SHA-256) دون تخزين أي بيانات شخصية.'
                : '• Tracks verified unique visitors server-side with zero PII stored.'}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
