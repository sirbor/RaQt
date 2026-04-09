import type { NextApiRequest, NextApiResponse } from 'next';
import { adminCookieClear } from 'lib/cookieAdmin';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  res.setHeader('Set-Cookie', adminCookieClear());
  return res.status(200).json({ ok: true });
}
