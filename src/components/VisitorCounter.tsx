import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Language } from '../types';
import { Eye, RefreshCw, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface VisitorCounterProps {
  lang: Language;
  variant?: 'footer' | 'compact' | 'badge';
}

interface VisitApiResponse {
  status: 'success' | 'error';
  totalVisits: number | null;
  isNewVisit?: boolean;
  message?: string;
}

// Generate a unique identifier once per browser page load
function getPageLoadId(): string {
  if (typeof window === 'undefined') return 'server_load';
  const win = window as unknown as { __sense_page_load_id?: string };
  if (!win.__sense_page_load_id) {
    win.__sense_page_load_id = `pl_${Math.random().toString(36).substring(2, 9)}_${Date.now().toString(36)}`;
  }
  return win.__sense_page_load_id;
}

export const VisitorCounter: React.FC<VisitorCounterProps> = ({
  lang,
  variant = 'footer',
}) => {
  const isAr = lang === 'ar';
  const [totalVisits, setTotalVisits] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Prevent multiple records during the same page load caused by React StrictMode or re-renders
  const hasRecordedRef = useRef<boolean>(false);

  const fetchVisits = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setIsRefreshing(true);
    } else {
      setLoading(true);
    }
    setHasError(false);

    try {
      const loadId = getPageLoadId();
      // If we already recorded this page load, only read current total count without incrementing
      const action = hasRecordedRef.current && !isManualRefresh ? 'read' : 'record';

      const url = `/api/visitors?loadId=${encodeURIComponent(loadId)}&action=${encodeURIComponent(action)}`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = (await res.json()) as VisitApiResponse;

      if (data.status === 'success' && typeof data.totalVisits === 'number') {
        setTotalVisits(data.totalVisits);
        hasRecordedRef.current = true;
      } else {
        // Safe backend response indicating unavailable
        setHasError(true);
        setTotalVisits(null);
      }
    } catch (err) {
      // Silently catch and show friendly clean UI without exposing technical strings
      console.warn('[VisitCounter] Fetch error:', err);
      setHasError(true);
      setTotalVisits(null);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchVisits();
  }, [fetchVisits]);

  // Format number gracefully with Arabic or English numerals
  const formattedCount =
    totalVisits !== null
      ? new Intl.NumberFormat(isAr ? 'ar-EG' : 'en-US').format(totalVisits)
      : null;

  if (variant === 'badge') {
    return (
      <div
        id="visitor-counter-badge"
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1F1D1A] border border-[#2D2925] text-xs text-[#C5BBAE]"
      >
        <Eye className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="font-serif-artistic italic text-sm text-[#FDFCFB] font-semibold">
          {loading ? '...' : (hasError ? (isAr ? 'غير متوفر' : 'Unavailable') : formattedCount)}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-[#8C8279]">
          {isAr ? 'إجمالي الزيارات' : 'Total Visits'}
        </span>
      </div>
    );
  }

  return (
    <div
      id="verified-visitor-counter-card"
      className="relative rounded-2xl bg-[#1C1B19] border border-[#2D2A26] p-5 text-start shadow-sm overflow-hidden"
    >
      {/* Decorative ambient lighting */}
      <div className="absolute top-0 end-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="relative z-10 flex flex-col justify-between h-full">
        {/* Header with Eye icon and Total Visits label */}
        <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-[#2A2723]">
          <div className="flex items-center gap-2 text-amber-400/90">
            <Eye className="w-4 h-4 shrink-0 text-amber-400" />
            <span className="text-xs uppercase tracking-[0.18em] font-semibold text-[#D4C8B8]">
              {isAr ? 'إجمالي الزيارات' : 'Total Visits'}
            </span>
          </div>

          <button
            id="refresh-visitor-counter-btn"
            onClick={() => fetchVisits(true)}
            disabled={isRefreshing || loading}
            title={isAr ? 'تحديث' : 'Refresh'}
            className={`p-1 rounded-md text-[#8C8279] hover:text-[#FDFCFB] hover:bg-[#2A2723] transition-colors ${
              isRefreshing ? 'animate-spin text-amber-300' : ''
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Counter Display Body */}
        <div className="py-1">
          {loading ? (
            <div className="space-y-2 py-1">
              <div className="h-8 w-24 bg-[#2A2723] rounded-lg animate-pulse"></div>
              <div className="h-3 w-36 bg-[#2A2723] rounded-sm animate-pulse"></div>
            </div>
          ) : hasError || totalVisits === null ? (
            <div className="flex items-center gap-2 text-[#A0988D] text-xs py-1">
              <AlertCircle className="w-4 h-4 text-amber-500/80 shrink-0" />
              <span className="font-medium">
                {isAr ? 'الزيارات غير متوفرة حالياً' : 'Visits unavailable'}
              </span>
            </div>
          ) : (
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
                  {isAr ? 'زيارة فعلية' : 'visits'}
                </span>
              </div>
              <p className="text-[11px] text-[#8C8279] mt-1.5">
                {isAr
                  ? 'تسجيل تراكمي فعلي لكل زيارة للموقع'
                  : 'Real-time cumulative counter of every website visit'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
