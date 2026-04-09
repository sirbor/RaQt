import type { NextApiRequest, NextApiResponse } from 'next';
import { UserRole } from '@prisma/client';
import { getAdminFromRequest } from 'lib/getAdminFromRequest';
import { prisma } from 'lib/prisma';
import { assertPasswordValid, hashPassword } from 'lib/password';

function normalizeEmail(raw: string): string {
  return raw.trim().toLowerCase();
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
        select: { id: true, email: true, role: true, createdAt: true },
      });
      return res.status(200).json({ users });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'server_error' });
    }
  }

  const adminUser = await prisma.user.findUnique({
    where: { email: admin.email },
    select: { id: true },
  });
  if (!adminUser) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  if (req.method === 'PATCH') {
    const userId = typeof req.body?.userId === 'string' ? req.body.userId : '';
    const roleRaw = req.body?.role;
    const role = roleRaw === 'ADMIN' || roleRaw === 'CLIENT' ? (roleRaw as UserRole) : null;
    if (!userId || !role) {
      return res.status(400).json({ error: 'invalid_body' });
    }
    if (userId === adminUser.id) {
      return res.status(400).json({ error: 'cannot_update_self_role' });
    }
    try {
      const user = await prisma.user.update({
        where: { id: userId },
        data: { role },
        select: { id: true, email: true, role: true, createdAt: true },
      });
      return res.status(200).json({ user });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'server_error' });
    }
  }

  if (req.method === 'DELETE') {
    const userId = typeof req.body?.userId === 'string' ? req.body.userId : '';
    if (!userId) {
      return res.status(400).json({ error: 'invalid_body' });
    }
    if (userId === adminUser.id) {
      return res.status(400).json({ error: 'cannot_delete_self' });
    }
    try {
      await prisma.user.delete({ where: { id: userId } });
      return res.status(200).json({ ok: true });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'server_error' });
    }
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST, PATCH, DELETE');
    return res.status(405).end();
  }

  const email = typeof req.body?.email === 'string' ? normalizeEmail(req.body.email) : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const roleRaw = req.body?.role;
  const role =
    roleRaw === 'ADMIN' || roleRaw === 'CLIENT' ? (roleRaw as UserRole) : null;

  if (!email || !password || !role) {
    return res.status(400).json({ error: 'invalid_body' });
  }

  try {
    assertPasswordValid(password);
  } catch {
    return res.status(400).json({ error: 'password_too_short' });
  }

  try {
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'email_taken' });
    }

    const passwordHash = await hashPassword(password);
    const user = await prisma.user.create({
      data: { email, passwordHash, role },
      select: { id: true, email: true, role: true, createdAt: true },
    });
    return res.status(201).json({ user });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'server_error' });
  }
}
