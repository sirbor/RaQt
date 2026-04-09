import type { NextApiRequest } from 'next';
import { prisma } from 'lib/prisma';
import { getSessionFromRequest } from 'lib/getSessionFromRequest';

export async function getClientFromRequest(
  req: NextApiRequest,
): Promise<{ id: string; email: string } | null> {
  const session = await getSessionFromRequest(req);
  if (!session || session.role !== 'CLIENT') return null;

  const user = await prisma.user.findUnique({
    where: { email: session.email },
    select: { id: true, email: true },
  });
  if (!user) return null;

  return user;
}
