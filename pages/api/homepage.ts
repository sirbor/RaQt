import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from 'lib/prisma';
import {
  getDefaultHomepageContent,
  normalizeHomepageContent,
  type HomepageContent,
} from 'lib/homepageContent';
import { getAdminFromRequest } from 'lib/getAdminFromRequest';

const HOMEPAGE_SLUG = 'homepage_marketing';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const row = await prisma.siteContent.findUnique({
        where: { slug: HOMEPAGE_SLUG },
      });
      const patch = (row?.content as Partial<HomepageContent> | null) ?? {};
      const content = normalizeHomepageContent(patch);
      return res.status(200).json({
        content,
        source: row ? 'database' : 'defaults',
      });
    } catch (e) {
      console.error(e);
      return res.status(200).json({
        content: getDefaultHomepageContent(),
        source: 'defaults',
        warning: 'database_unavailable',
      });
    }
  }

  if (req.method === 'PUT') {
    const admin = await getAdminFromRequest(req);
    if (!admin) {
      return res.status(401).json({ error: 'unauthorized' });
    }

    const body = req.body as HomepageContent | undefined;
    if (!body || typeof body !== 'object' || !body.hero || typeof body.hero.title !== 'string') {
      return res.status(400).json({ error: 'invalid_body' });
    }

    try {
      const normalized = normalizeHomepageContent(body);
      await prisma.siteContent.upsert({
        where: { slug: HOMEPAGE_SLUG },
        create: {
          slug: HOMEPAGE_SLUG,
          content: normalized as object,
        },
        update: {
          content: normalized as object,
        },
      });
      return res.status(200).json({ ok: true });
    } catch (e) {
      console.error(e);
      return res.status(500).json({ error: 'save_failed', message: String(e) });
    }
  }

  res.setHeader('Allow', ['GET', 'PUT']);
  return res.status(405).end();
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '512kb',
    },
  },
};
