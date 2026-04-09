import type { NextApiRequest } from 'next';
import { parse } from 'cookie';
import { ADMIN_COOKIE_NAME } from 'lib/cookieAdmin';
import { verifySessionToken, type SessionPayload } from 'lib/authJwt';

export async function getSessionFromRequest(req: NextApiRequest): Promise<SessionPayload | null> {
  const raw = req.headers.cookie;
  const cookies = parse(raw || '');
  const token = cookies[ADMIN_COOKIE_NAME];
  if (!token) return null;
  return verifySessionToken(token);
}
