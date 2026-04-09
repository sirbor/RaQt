import crypto from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getAdminFromRequest } from 'lib/getAdminFromRequest';
import { prisma } from 'lib/prisma';
import { hashPassword } from 'lib/password';

function buildSetupCode(): string {
  const part = crypto.randomBytes(3).toString('hex').toUpperCase();
  const part2 = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `KD-ADMIN-${part}-${part2}`;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const active = await prisma.adminSetupCode.findFirst({
        where: {
          usedAt: null,
          revokedAt: null,
          expiresAt: { gt: new Date() },
        },
        orderBy: { createdAt: 'desc' },
        select: { id: true, createdAt: true, expiresAt: true },
      });
      return res.status(200).json({ active });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'server_error' });
    }
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).end();
  }

  try {
    const adminUser = await prisma.user.findUnique({
      where: { email: admin.email },
      select: { id: true },
    });
    if (!adminUser) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    const codePlain = buildSetupCode();
    const codeHash = await hashPassword(codePlain);
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    await prisma.$transaction([
      prisma.adminSetupCode.updateMany({
        where: {
          usedAt: null,
          revokedAt: null,
          expiresAt: { gt: new Date() },
        },
        data: { revokedAt: new Date() },
      }),
      prisma.adminSetupCode.create({
        data: {
          codeHash,
          createdById: adminUser.id,
          expiresAt,
        },
      }),
    ]);

    return res.status(201).json({
      code: codePlain,
      expiresAt,
      note: 'Store this code securely. It can be used once to register an admin account.',
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'server_error' });
  }
}
