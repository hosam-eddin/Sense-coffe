import { Request, Response } from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Memory and file-based store for genuine cumulative unique visitors
const DATA_FILE = path.join(process.cwd(), '.visitors_data.json');
const SALT = process.env.VISITOR_SALT || 'sense_coffee_damietta_salt_2026';

interface VisitorStore {
  totalUniqueVisitors: number;
  visitedHashes: string[];
  lastUpdated: string;
}

// In-memory cache for Vercel API queries
let vercelCache: { count: number; timestamp: number } | null = null;
const CACHE_TTL_MS = 60 * 1000; // 60 seconds cache

// Initialize store from disk or memory
function loadStore(): VisitorStore {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (typeof data.totalUniqueVisitors === 'number' && Array.isArray(data.visitedHashes)) {
        return data;
      }
    }
  } catch (err) {
    console.warn('Could not read visitors file, starting fresh store:', err);
  }
  return {
    totalUniqueVisitors: 1, // First real visitor (the current operator/tester)
    visitedHashes: [],
    lastUpdated: new Date().toISOString(),
  };
}

function saveStore(store: VisitorStore) {
  try {
    // Keep max 50,000 hashes in memory/disk to prevent uncontrolled file growth
    if (store.visitedHashes.length > 50000) {
      store.visitedHashes = store.visitedHashes.slice(-40000);
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not persist visitors file:', err);
  }
}

let store: VisitorStore = loadStore();

/**
 * Generates a privacy-preserving SHA-256 hash of client IP + User-Agent
 */
function getVisitorHash(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  const ip = typeof forwarded === 'string'
    ? forwarded.split(',')[0].trim()
    : req.socket?.remoteAddress || '127.0.0.1';
  
  const userAgent = req.headers['user-agent'] || 'unknown';
  return crypto.createHash('sha256').update(`${ip}-${userAgent}-${SALT}`).digest('hex');
}

/**
 * Attempts to fetch real Unique Visitors from official Vercel Web Analytics API
 */
async function fetchVercelAnalyticsVisitors(): Promise<number | null> {
  const token = process.env.VERCEL_API_TOKEN || process.env.VERCEL_AUTH_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  const teamId = process.env.VERCEL_TEAM_ID;

  if (!token || !projectId) {
    return null;
  }

  // Check in-memory cache
  const now = Date.now();
  if (vercelCache && (now - vercelCache.timestamp) < CACHE_TTL_MS) {
    return vercelCache.count;
  }

  try {
    // Query Vercel Web Analytics API visits count
    const teamParam = teamId ? `&teamId=${encodeURIComponent(teamId)}` : '';
    // Query lifetime / max since range
    const url = `https://api.vercel.com/v1/query/web-analytics/visits/count?projectId=${encodeURIComponent(projectId)}${teamParam}`;

    const res = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (res.ok) {
      const data = await res.json() as { count?: number; value?: number };
      const count = typeof data.count === 'number' ? data.count : typeof data.value === 'number' ? data.value : null;
      if (count !== null) {
        vercelCache = { count, timestamp: now };
        return count;
      }
    } else {
      // Also fallback to stats endpoint if visits/count returns different plan requirement
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
          return count;
        }
      }
    }
  } catch (error) {
    console.error('Error fetching Vercel Analytics:', error);
  }

  return null;
}

/**
 * Controller handling visitor tracking and counter queries
 */
export async function handleVisitorRequest(req: Request, res: Response) {
  try {
    const isPost = req.method === 'POST';
    const visitorHash = getVisitorHash(req);

    let isNewUnique = false;

    // Check if this hashed visitor has been registered before
    if (!store.visitedHashes.includes(visitorHash)) {
      store.visitedHashes.push(visitorHash);
      store.totalUniqueVisitors += 1;
      store.lastUpdated = new Date().toISOString();
      saveStore(store);
      isNewUnique = true;
    }

    // Try Vercel Web Analytics API if configured
    const vercelVisitors = await fetchVercelAnalyticsVisitors();

    const hasVercelConfig = Boolean(
      (process.env.VERCEL_API_TOKEN || process.env.VERCEL_AUTH_TOKEN) &&
      process.env.VERCEL_PROJECT_ID
    );

    const finalCount = vercelVisitors !== null ? vercelVisitors : store.totalUniqueVisitors;
    const source = vercelVisitors !== null ? 'vercel_web_analytics' : 'verified_cumulative';

    return res.status(200).json({
      status: 'success',
      count: finalCount,
      isUnique: isNewUnique,
      source,
      vercelConfigured: hasVercelConfig,
      lastUpdated: store.lastUpdated,
      metric: 'unique_visitors',
    });
  } catch (err: any) {
    console.error('Visitor counter error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve visitor count',
      count: store.totalUniqueVisitors || 0,
      metric: 'unique_visitors',
    });
  }
}
