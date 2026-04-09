import type { NextApiRequest, NextApiResponse } from 'next';
import { getAdminFromRequest } from 'lib/getAdminFromRequest';
import { prisma } from 'lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startRaw = typeof req.query.start === 'string' ? req.query.start : '';
    const endRaw = typeof req.query.end === 'string' ? req.query.end : '';
    const hasCustomRange = Boolean(startRaw && endRaw);

    const rangeStart = hasCustomRange ? new Date(`${startRaw}T00:00:00.000Z`) : new Date(now);
    if (!hasCustomRange) rangeStart.setDate(rangeStart.getDate() - 6);
    rangeStart.setHours(0, 0, 0, 0);

    const rangeEnd = hasCustomRange ? new Date(`${endRaw}T23:59:59.999Z`) : new Date(now);
    rangeEnd.setHours(23, 59, 59, 999);

    if (Number.isNaN(rangeStart.getTime()) || Number.isNaN(rangeEnd.getTime()) || rangeStart > rangeEnd) {
      return res.status(400).json({ error: 'invalid_date_range' });
    }

    const [totalOrders, todaysOrders, allOrders, totalUsers, clientUsers, adminUsers, activeUseCases, rangedOrders] =
      await Promise.all([
        prisma.demoOrder.count(),
        prisma.demoOrder.count({ where: { createdAt: { gte: startOfToday } } }),
        prisma.demoOrder.findMany({ select: { totalCents: true } }),
        prisma.user.count(),
        prisma.user.count({ where: { role: 'CLIENT' } }),
        prisma.user.count({ where: { role: 'ADMIN' } }),
        prisma.useCase.count({ where: { isActive: true } }),
        prisma.demoOrder.findMany({
          where: { createdAt: { gte: rangeStart, lte: rangeEnd } },
          select: { createdAt: true, totalCents: true },
          orderBy: { createdAt: 'asc' },
        }),
      ]);

    const totalRevenueCents = allOrders.reduce((sum, row) => sum + row.totalCents, 0);

    // Group orders by day across selected range
    const dailyTrend: Record<string, { count: number; totalCents: number }> = {};
    const cursor = new Date(rangeStart);
    while (cursor <= rangeEnd) {
      const key = cursor.toISOString().split('T')[0];
      dailyTrend[key] = { count: 0, totalCents: 0 };
      cursor.setDate(cursor.getDate() + 1);
    }

    rangedOrders.forEach((o) => {
      const key = o.createdAt.toISOString().split('T')[0];
      if (dailyTrend[key] !== undefined) {
        dailyTrend[key].count++;
        dailyTrend[key].totalCents += o.totalCents;
      }
    });

    const trend = Object.entries(dailyTrend)
      .map(([date, values]) => ({ date, count: values.count, totalCents: values.totalCents }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return res.status(200).json({
      totalOrders,
      todaysOrders,
      totalRevenueCents,
      totalUsers,
      clientUsers,
      adminUsers,
      activeUseCases,
      trend,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'server_error' });
  }
}
