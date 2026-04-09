import type { NextApiRequest, NextApiResponse } from 'next';
import { getAdminFromRequest } from 'lib/getAdminFromRequest';
import { prisma } from 'lib/prisma';

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-'); // Replace multiple - with single -
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = await getAdminFromRequest(req);
  if (!admin) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const useCases = await prisma.useCase.findMany({
        orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
      });
      return res.status(200).json({ useCases });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'server_error' });
    }
  }

  if (req.method === 'POST') {
    const { title, summary, priceCents, category, isActive, sortOrder } = req.body;

    if (!title || !summary || typeof priceCents !== 'number' || !category) {
      return res.status(400).json({ error: 'invalid_body' });
    }

    try {
      const slug = slugify(title);
      const useCase = await prisma.useCase.create({
        data: {
          slug,
          title,
          summary,
          priceCents,
          category,
          isActive: typeof isActive === 'boolean' ? isActive : true,
          sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
        },
      });
      return res.status(201).json({ useCase });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'server_error' });
    }
  }

  if (req.method === 'PUT') {
    const { id, title, summary, priceCents, category, isActive, sortOrder } = req.body;

    if (!id || !title || !summary || typeof priceCents !== 'number' || !category) {
      return res.status(400).json({ error: 'invalid_body' });
    }

    try {
      const useCase = await prisma.useCase.update({
        where: { id },
        data: {
          title,
          summary,
          priceCents,
          category,
          isActive: typeof isActive === 'boolean' ? isActive : true,
          sortOrder: typeof sortOrder === 'number' ? sortOrder : 0,
        },
      });
      return res.status(200).json({ useCase });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'server_error' });
    }
  }

  if (req.method === 'DELETE') {
    const { id } = req.query;
    if (typeof id !== 'string') {
      return res.status(400).json({ error: 'invalid_query' });
    }

    try {
      await prisma.useCase.delete({ where: { id } });
      return res.status(204).end();
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'server_error' });
    }
  }

  res.setHeader('Allow', 'GET, POST, PUT, DELETE');
  return res.status(405).end();
}
