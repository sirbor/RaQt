import type { NextApiRequest, NextApiResponse } from 'next';
import { UserRole } from '@prisma/client';
import { createSessionToken } from 'lib/authJwt';
import { adminCookieSerialize } from 'lib/cookieAdmin';
import { respondIfMissingAuthEnv, prismaErrorToResponse } from 'lib/authApiGuards';
import { prisma } from 'lib/prisma';
import { assertPasswordValid, hashPassword, verifyPassword } from 'lib/password';

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
  const adminSetupKey =
    typeof req.body?.adminSetupKey === 'string' ? req.body.adminSetupKey : '';

  if (!email || !password) {
    return res.status(400).json({ error: 'email_password_required' });
  }

  if (respondIfMissingAuthEnv(res)) {
    return;
  }

  try {
    assertPasswordValid(password);
  } catch {
    return res.status(400).json({ error: 'password_too_short' });
  }

  const submittedAdminCode = adminSetupKey.trim();
  let matchedSetupCodeId: string | null = null;

  if (submittedAdminCode) {
    const candidates = await prisma.adminSetupCode.findMany({
      where: {
        usedAt: null,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
      select: { id: true, codeHash: true },
    });

    for (const candidate of candidates) {
      const ok = await verifyPassword(submittedAdminCode, candidate.codeHash);
      if (ok) {
        matchedSetupCodeId = candidate.id;
        break;
      }
    }

    if (!matchedSetupCodeId) {
      return res.status(403).json({ error: 'invalid_admin_setup_key' });
    }
  }

  const role: UserRole = matchedSetupCodeId ? UserRole.ADMIN : UserRole.CLIENT;

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'email_taken' });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, passwordHash, role },
    });

    if (matchedSetupCodeId) {
      await prisma.adminSetupCode.update({
        where: { id: matchedSetupCodeId },
        data: {
          usedAt: new Date(),
          usedByUserId: user.id,
        },
      });
    }

    const token = await createSessionToken({ email: user.email, role: user.role });
    res.setHeader('Set-Cookie', adminCookieSerialize(token));
    return res.status(201).json({ ok: true, role: user.role, email: user.email });
  } catch (e) {
    console.error(e);
    const mapped = prismaErrorToResponse(e);
    if (mapped) {
      return res.status(mapped.status).json(mapped.body);
    }
    return res.status(500).json({
      error: 'server_error',
      message: process.env.NODE_ENV === 'development' ? String(e) : undefined,
    });
  }
}
