import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

// Storage file location: handles both local/container server and serverless /tmp
const DATA_FILE = process.env.VERCEL
  ? path.join('/tmp', '.visits_store.json')
  : path.join(process.cwd(), '.visits_store.json');

export interface VisitStoreData {
  totalVisits: number;
  lastUpdated: string;
}

// In-memory cache
let cachedStore: VisitStoreData | null = null;

// Track recently seen page load IDs to prevent duplicate increments from React StrictMode or re-renders
const recentPageLoads = new Map<string, number>();
const DEDUPLICATION_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function cleanupRecentPageLoads() {
  const now = Date.now();
  for (const [id, timestamp] of recentPageLoads.entries()) {
    if (now - timestamp > DEDUPLICATION_WINDOW_MS) {
      recentPageLoads.delete(id);
    }
  }
}

/**
 * Load store from disk or return in-memory cached state
 */
export function loadVisitStore(): VisitStoreData {
  if (cachedStore) {
    return cachedStore;
  }

  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (typeof data.totalVisits === 'number' && data.totalVisits >= 0) {
        cachedStore = {
          totalVisits: data.totalVisits,
          lastUpdated: data.lastUpdated || new Date().toISOString(),
        };
        return cachedStore;
      }
    }
  } catch (err) {
    console.warn('[VisitCounter] Unable to read visits file, starting clean:', err);
  }

  const initial: VisitStoreData = {
    totalVisits: 0,
    lastUpdated: new Date().toISOString(),
  };
  cachedStore = initial;
  return initial;
}

/**
 * Save store to disk atomically
 */
export function saveVisitStore(store: VisitStoreData): void {
  cachedStore = store;
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.warn('[VisitCounter] Unable to persist visits file:', err);
  }
}

/**
 * Optional Upstash Redis / Vercel KV synchronization if configured in environment
 */
async function syncWithRemoteKV(action: 'incr' | 'get'): Promise<number | null> {
  const kvUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const kvToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!kvUrl || !kvToken) {
    return null;
  }

  try {
    const endpoint = action === 'incr'
      ? `${kvUrl.replace(/\/$/, '')}/incr/sense_total_visits`
      : `${kvUrl.replace(/\/$/, '')}/get/sense_total_visits`;

    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${kvToken}`,
      },
    });

    if (res.ok) {
      const data = await res.json() as { result?: number | string };
      const count = Number(data.result);
      if (!Number.isNaN(count) && count >= 0) {
        return count;
      }
    }
  } catch (err) {
    console.warn('[VisitCounter] Remote KV sync error:', err);
  }

  return null;
}

/**
 * Records a page visit:
 * Increments the counter by +1 unless this exact page load ID has already been recorded.
 */
export async function recordVisit(loadId?: string): Promise<{
  totalVisits: number;
  isNewVisit: boolean;
}> {
  cleanupRecentPageLoads();

  // If a loadId is provided and already recorded in this window, return current total without incrementing
  if (loadId && recentPageLoads.has(loadId)) {
    const current = loadVisitStore();
    return {
      totalVisits: current.totalVisits,
      isNewVisit: false,
    };
  }

  // Check if remote KV is enabled
  const remoteCount = await syncWithRemoteKV('incr');
  if (remoteCount !== null) {
    if (loadId) {
      recentPageLoads.set(loadId, Date.now());
    }
    const updated: VisitStoreData = {
      totalVisits: remoteCount,
      lastUpdated: new Date().toISOString(),
    };
    saveVisitStore(updated);
    return {
      totalVisits: remoteCount,
      isNewVisit: true,
    };
  }

  // Fallback to local persistent store
  const store = loadVisitStore();
  store.totalVisits += 1;
  store.lastUpdated = new Date().toISOString();
  saveVisitStore(store);

  if (loadId) {
    recentPageLoads.set(loadId, Date.now());
  }

  return {
    totalVisits: store.totalVisits,
    isNewVisit: true,
  };
}

/**
 * Gets the current visit count without incrementing
 */
export async function getVisitsCount(): Promise<number> {
  const remoteCount = await syncWithRemoteKV('get');
  if (remoteCount !== null) {
    return remoteCount;
  }
  const store = loadVisitStore();
  return store.totalVisits;
}

/**
 * Express Request Handler for /api/visitors and /api/visits
 */
export async function handleVisitRequest(req: Request, res: Response) {
  // Prevent browser caching of the API call itself
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');

  try {
    const action = (req.query.action as string) || (req.body?.action as string);
    const loadId = (req.query.loadId as string) || (req.body?.loadId as string) || undefined;

    if (action === 'read') {
      const count = await getVisitsCount();
      return res.status(200).json({
        status: 'success',
        totalVisits: count,
        isNewVisit: false,
      });
    }

    const result = await recordVisit(loadId);

    return res.status(200).json({
      status: 'success',
      totalVisits: result.totalVisits,
      isNewVisit: result.isNewVisit,
    });
  } catch (error) {
    console.error('[VisitCounter] Unexpected error processing visit:', error);
    // Never expose raw technical error messages to visitors
    return res.status(200).json({
      status: 'error',
      totalVisits: null,
      message: 'Visits unavailable',
    });
  }
}
