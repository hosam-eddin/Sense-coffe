import type { VercelRequest, VercelResponse } from '@vercel/node';
import { recordVisit, getVisitsCount } from '../src/server/visitCounter';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );
  // Prevent aggressive edge caching of counter mutations
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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
  } catch (err: any) {
    console.error('[Vercel Serverless] Visit counter error:', err);
    // Never expose technical error messages such as "Current limit exceeded"
    return res.status(200).json({
      status: 'error',
      totalVisits: null,
      message: 'Visits unavailable',
    });
  }
}
