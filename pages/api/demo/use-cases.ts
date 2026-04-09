import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'lib/prisma';
import { DEFAULT_DEMO_USE_CASES } from 'lib/demoCatalog';
import { getClientFromRequest } from 'lib/getClientFromRequest';

async function ensureDefaultUseCases(): Promise<void> {
  const count = await prisma.useCase.count();
  if (count > 0) return;

  await Promise.all(
    DEFAULT_DEMO_USE_CASES.map((item) =>
      prisma.useCase.create({
        data: {
          slug: item.slug,
          title: item.title,
          summary: item.summary,
          category: item.category,
          priceCents: item.priceCents,
          sortOrder: item.sortOrder,
          isActive: true,
        },
      }),
    ),
  );
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const client = await getClientFromRequest(req);
  if (!client) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  try {
    await ensureDefaultUseCases();

    const [useCases, cartRows] = await Promise.all([
      prisma.useCase.findMany({
        where: { isActive: true },
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
        select: {
          id: true,
          slug: true,
          title: true,
          summary: true,
          category: true,
          priceCents: true,
        },
      }),
      prisma.cartItem.findMany({
        where: { userId: client.id },
        select: { useCaseId: true, quantity: true },
      }),
    ]);

    const quantityByUseCaseId = new Map(cartRows.map((r) => [r.useCaseId, r.quantity]));

    return res.status(200).json({
      useCases: useCases.map((item) => ({
        ...item,
        inCartQuantity: quantityByUseCaseId.get(item.id) || 0,
      })),
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: 'server_error' });
  }
}
