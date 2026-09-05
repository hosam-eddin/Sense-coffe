import type { VercelRequest, VercelResponse } from '@vercel/node';
import { recordVisitor } from '../src/server/visitorTracker';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS support
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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
    console.error('Vercel serverless visitor counter error:', err);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to record visitor',
      totalVisitors: null,
    });
  }
}
