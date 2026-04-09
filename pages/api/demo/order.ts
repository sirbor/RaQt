import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'lib/prisma';
import { getClientFromRequest } from 'lib/getClientFromRequest';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await getClientFromRequest(req);
  if (!client) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end();
  }

  const notes = typeof req.body?.notes === 'string' ? req.body.notes.trim().slice(0, 500) : '';

  try {
    const cartLines = await prisma.cartItem.findMany({
      where: { userId: client.id },
      include: {
        useCase: {
          select: {
            id: true,
            title: true,
            priceCents: true,
            isActive: true,
          },
        },
      },
    });

    if (!cartLines.length) {
      return res.status(400).json({ error: 'cart_empty' });
    }

    const activeLines = cartLines.filter((line) => line.useCase.isActive);
    if (!activeLines.length) {
      return res.status(400).json({ error: 'cart_invalid' });
    }

    const totalCents = activeLines.reduce((sum, line) => sum + line.quantity * line.useCase.priceCents, 0);

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.demoOrder.create({
        data: {
          userId: client.id,
          status: 'PLACED',
          totalCents,
          notes: notes || null,
          items: {
            create: activeLines.map((line) => ({
              useCaseId: line.useCaseId,
              quantity: line.quantity,
              unitCents: line.useCase.priceCents,
            })),
          },
        },
        select: {
          id: true,
          totalCents: true,
          createdAt: true,
          items: {
            select: {
              quantity: true,
              unitCents: true,
              useCase: { select: { title: true } },
            },
          },
        },
      });

      await tx.cartItem.deleteMany({ where: { userId: client.id } });
      return created;
    });

    return res.status(201).json({
      ok: true,
      order: {
        id: order.id,
        totalCents: order.totalCents,
        createdAt: order.createdAt,
        items: order.items.map((item) => ({
          title: item.useCase.title,
          quantity: item.quantity,
          unitCents: item.unitCents,
        })),
      },
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'server_error' });
  }
}
