import type { NextApiRequest, NextApiResponse } from 'next';
import { prismaErrorToResponse } from 'lib/authApiGuards';
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
    const rawLimit = typeof req.query.limit === 'string' ? req.query.limit : undefined;
    const take =
      rawLimit === 'all'
        ? 500
        : Math.min(500, Math.max(1, Number.parseInt(rawLimit || '20', 10) || 20));

    const orders = await prisma.demoOrder.findMany({
      orderBy: { createdAt: 'desc' },
      take,
      select: {
        id: true,
        totalCents: true,
        status: true,
        notes: true,
        createdAt: true,
        user: {
          select: {
            email: true,
          },
        },
        items: {
          select: {
            quantity: true,
            unitCents: true,
            useCase: {
              select: { title: true },
            },
          },
        },
      },
    });

    return res.status(200).json({
      orders: orders.map((order) => ({
        id: order.id,
        clientEmail: order.user.email,
        createdAt: order.createdAt,
        status: order.status,
        notes: order.notes,
        totalCents: order.totalCents,
        items: order.items.map((item) => ({
          title: item.useCase.title,
          quantity: item.quantity,
          unitCents: item.unitCents,
        })),
      })),
    });
  } catch (e) {
    console.error(e);
    const mapped = prismaErrorToResponse(e);
    if (mapped) {
      return res.status(mapped.status).json(mapped.body);
    }
    return res.status(500).json({ error: 'server_error' });
  }
}
