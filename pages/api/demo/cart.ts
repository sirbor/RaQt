import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'lib/prisma';
import { getClientFromRequest } from 'lib/getClientFromRequest';

type CartLine = {
  id: string;
  quantity: number;
  useCase: {
    id: string;
    slug: string;
    title: string;
    priceCents: number;
  };
};

function parseQuantity(value: unknown): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return 1;
  return Math.max(1, Math.min(99, Math.floor(value)));
}

function toCartResponse(lines: CartLine[]) {
  const subtotalCents = lines.reduce((sum, line) => sum + line.quantity * line.useCase.priceCents, 0);
  return {
    items: lines.map((line) => ({
      cartItemId: line.id,
      useCaseId: line.useCase.id,
      slug: line.useCase.slug,
      title: line.useCase.title,
      quantity: line.quantity,
      unitPriceCents: line.useCase.priceCents,
      lineTotalCents: line.quantity * line.useCase.priceCents,
    })),
    subtotalCents,
    totalItems: lines.reduce((sum, line) => sum + line.quantity, 0),
  };
}

async function getCartLines(userId: string): Promise<CartLine[]> {
  return prisma.cartItem.findMany({
    where: { userId },
    orderBy: { createdAt: 'asc' },
    select: {
      id: true,
      quantity: true,
      useCase: {
        select: {
          id: true,
          slug: true,
          title: true,
          priceCents: true,
        },
      },
    },
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await getClientFromRequest(req);
  if (!client) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  try {
    if (req.method === 'GET') {
      const lines = await getCartLines(client.id);
      return res.status(200).json(toCartResponse(lines));
    }

    if (req.method === 'POST') {
      const useCaseId = typeof req.body?.useCaseId === 'string' ? req.body.useCaseId : '';
      const quantity = parseQuantity(req.body?.quantity);
      if (!useCaseId) {
        return res.status(400).json({ error: 'use_case_required' });
      }

      const useCase = await prisma.useCase.findUnique({
        where: { id: useCaseId },
        select: { id: true, isActive: true },
      });
      if (!useCase || !useCase.isActive) {
        return res.status(404).json({ error: 'use_case_not_found' });
      }

      await prisma.cartItem.upsert({
        where: {
          userId_useCaseId: { userId: client.id, useCaseId },
        },
        create: {
          userId: client.id,
          useCaseId,
          quantity,
        },
        update: {
          quantity,
        },
      });

      const lines = await getCartLines(client.id);
      return res.status(200).json(toCartResponse(lines));
    }

    if (req.method === 'DELETE') {
      const useCaseId = typeof req.body?.useCaseId === 'string' ? req.body.useCaseId : '';
      if (!useCaseId) {
        return res.status(400).json({ error: 'use_case_required' });
      }

      await prisma.cartItem.deleteMany({
        where: { userId: client.id, useCaseId },
      });

      const lines = await getCartLines(client.id);
      return res.status(200).json(toCartResponse(lines));
    }

    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).end();
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'server_error' });
  }
}
