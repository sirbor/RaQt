import type { NextApiRequest, NextApiResponse } from 'next';
import { createSessionToken } from 'lib/authJwt';
import { adminCookieSerialize } from 'lib/cookieAdmin';
import { respondIfMissingAuthEnv, prismaErrorToResponse } from 'lib/authApiGuards';
import { prisma } from 'lib/prisma';
import { verifyPassword } from 'lib/password';

function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  const email = typeof req.body?.email === 'string' ? normalizeEmail(req.body.email) : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';

  if (!email || !password) {
    return res.status(400).json({ error: 'email_password_required' });
  }

  if (respondIfMissingAuthEnv(res)) {
    return;
  }

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'invalid_credentials' });
    }

    const ok = await verifyPassword(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: 'invalid_credentials' });
    }

    const token = await createSessionToken({ email: user.email, role: user.role });
    res.setHeader('Set-Cookie', adminCookieSerialize(token));
    return res.status(200).json({ ok: true, role: user.role, email: user.email });
  } catch (e) {
    console.error(e);
    const mapped = prismaErrorToResponse(e);
    if (mapped) {
      return res.status(mapped.status).json(mapped.body);
    }
    return res.status(500).json({
      error: 'server_misconfigured',
      message: process.env.NODE_ENV === 'development' ? String(e) : undefined,
    });
  }
}
