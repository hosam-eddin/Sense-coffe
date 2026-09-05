import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';

const SALT = process.env.VISITOR_SALT || 'sense_coffee_damietta_salt_2026';

// In-memory cache for serverless instance
let vercelCache: { count: number; timestamp: number } | null = null;
const CACHE_TTL_MS = 60 * 1000;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS if accessed externally
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const token = process.env.VERCEL_API_TOKEN || process.env.VERCEL_AUTH_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;

  const hasVercelConfig = Boolean(token && projectId);

  // 1. If Vercel Analytics API Token is provided, query Vercel Web Analytics
  if (token && projectId) {
    const now = Date.now();
    if (vercelCache && (now - vercelCache.timestamp) < CACHE_TTL_MS) {
      return res.status(200).json({
        status: 'success',
        count: vercelCache.count,
        source: 'vercel_web_analytics',
        vercelConfigured: true,
        metric: 'unique_visitors',
      });
    }

    try {
      const teamParam = teamId ? `&teamId=${encodeURIComponent(teamId)}` : '';
      const url = `https://api.vercel.com/v1/query/web-analytics/visits/count?projectId=${encodeURIComponent(projectId)}${teamParam}`;

      const apiRes = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (apiRes.ok) {
        const data = await apiRes.json() as { count?: number; value?: number };
        const count = typeof data.count === 'number' ? data.count : typeof data.value === 'number' ? data.value : null;
        if (count !== null) {
          vercelCache = { count, timestamp: now };
          return res.status(200).json({
            status: 'success',
            count,
            source: 'vercel_web_analytics',
            vercelConfigured: true,
            metric: 'unique_visitors',
          });
        }
      } else {
        // Fallback to stats endpoint
        const statsUrl = `https://api.vercel.com/v1/web-analytics/stats?projectId=${encodeURIComponent(projectId)}${teamParam}&type=visitors`;
        const statsRes = await fetch(statsUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (statsRes.ok) {
          const statsData = await statsRes.json() as { visitors?: number; uniques?: number };
          const count = typeof statsData.visitors === 'number' ? statsData.visitors : typeof statsData.uniques === 'number' ? statsData.uniques : null;
          if (count !== null) {
            vercelCache = { count, timestamp: now };
            return res.status(200).json({
              status: 'success',
              count,
              source: 'vercel_web_analytics',
              vercelConfigured: true,
              metric: 'unique_visitors',
            });
          }
        }
      }
    } catch (err) {
      console.error('Error fetching Vercel Web Analytics API:', err);
    }
  }

  // 2. Return the telemetry state
  // When running on Vercel before token injection, provide transparent verified status
  return res.status(200).json({
    status: 'success',
    count: null,
    source: 'vercel_web_analytics_pending_keys',
    vercelConfigured: hasVercelConfig,
    metric: 'unique_visitors',
    message: hasVercelConfig
      ? 'Vercel Analytics syncing'
      : 'Vercel Analytics API Token not configured in environment variables',
  });
}
