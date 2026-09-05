import { Request, Response } from 'express';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// Store path: safe for standard Node environments and Vercel Serverless (/tmp is writable on Vercel)
const DATA_FILE = process.env.VERCEL
  ? path.join('/tmp', '.visitors_data.json')
  : path.join(process.cwd(), '.visitors_data.json');

// Fixed internal application pepper for one-way SHA-256 hash (no secret env required)
const APP_PEPPER = 'sense_coffee_damietta_privacy_pepper_2026';

export interface VisitorStore {
  totalVisitors: number;
  visitedHashes: string[];
  lastUpdated: string;
}

// In-memory cache for fast repeated reads
let memoryStore: VisitorStore | null = null;

export function loadStore(): VisitorStore {
  if (memoryStore) {
    return memoryStore;
  }

  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, 'utf-8');
      const data = JSON.parse(raw);
      if (typeof data.totalVisitors === 'number' && Array.isArray(data.visitedHashes)) {
        memoryStore = data;
        return data;
      }
    }
  } catch (err) {
    console.warn('Could not read visitors file, initializing clean store:', err);
  }

  const initialStore: VisitorStore = {
    totalVisitors: 0,
    visitedHashes: [],
    lastUpdated: new Date().toISOString(),
  };
  memoryStore = initialStore;
  return initialStore;
}

export function saveStore(store: VisitorStore): void {
  memoryStore = store;
  try {
    // Keep max 50,000 hashes in storage to prevent memory unbounded growth
    if (store.visitedHashes.length > 50000) {
      store.visitedHashes = store.visitedHashes.slice(-40000);
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.warn('Could not persist visitors store to disk:', err);
  }
}

/**
 * Generates an anonymous, privacy-preserving SHA-256 hash from client network fingerprint.
 * The raw IP is NEVER stored or logged.
 */
export function getVisitorHash(ip: string, userAgent: string): string {
  const sanitizedIp = ip.trim().toLowerCase();
  const sanitizedAgent = (userAgent || 'unknown').trim().toLowerCase();
  return crypto
    .createHash('sha256')
    .update(`${sanitizedIp}::${sanitizedAgent}::${APP_PEPPER}`)
    .digest('hex');
}

/**
 * Core business logic: records a visitor if new, returns cumulative Total Visitors count.
 * Calling this multiple times from the same visitor will NOT increment the counter.
 */
export function recordVisitor(ip: string, userAgent: string): {
  totalVisitors: number;
  isNew: boolean;
  lastUpdated: string;
} {
  const store = loadStore();
  const visitorHash = getVisitorHash(ip, userAgent);

  let isNew = false;
  if (!store.visitedHashes.includes(visitorHash)) {
    store.visitedHashes.push(visitorHash);
    store.totalVisitors += 1;
    store.lastUpdated = new Date().toISOString();
    saveStore(store);
    isNew = true;
  }

  return {
    totalVisitors: store.totalVisitors,
    isNew,
    lastUpdated: store.lastUpdated,
  };
}

/**
 * Express Route Handler for /api/visitors (used in local development and container server)
 */
export function handleVisitorRequest(req: Request, res: Response) {
  try {
    const forwarded = req.headers['x-forwarded-for'];
    const ip = typeof forwarded === 'string'
      ? forwarded.split(',')[0].trim()
      : req.socket?.remoteAddress || '127.0.0.1';
    
    const userAgent = (req.headers['user-agent'] as string) || 'unknown';

    const result = recordVisitor(ip, userAgent);

    return res.status(200).json({
      status: 'success',
      totalVisitors: result.totalVisitors,
      isNew: result.isNew,
      metric: 'total_visitors',
      lastUpdated: result.lastUpdated,
    });
  } catch (err: any) {
    console.error('Visitor tracking error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to process visitor count',
      totalVisitors: null,
    });
  }
}
