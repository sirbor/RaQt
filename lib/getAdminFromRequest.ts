import type { NextApiRequest } from 'next';
import { getSessionFromRequest } from 'lib/getSessionFromRequest';

export async function getAdminFromRequest(
  req: NextApiRequest,
): Promise<{ email: string } | null> {
  const session = await getSessionFromRequest(req);
  if (!session || session.role !== 'ADMIN') return null;
  return { email: session.email };
}
